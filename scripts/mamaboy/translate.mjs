/**
 * 번역(§25–§28).
 *
 * 페이지를 열 때마다 번역하지 않는다. 새 글을 수집한 그 순간 한 번 번역하고
 * 결과를 캐시에 남긴다 — 비용과 응답 시간 둘 다 그렇게 해야 감당이 된다.
 *
 * 원칙은 세 가지다.
 *   1. 직역보다 자연스러운 한국어를 목표로 하되, 없는 의미를 만들지 않는다.
 *   2. 성분명·연구기관·제품명·고유명사는 원문 표기를 보존한다(glossary.mjs).
 *   3. 원문 데이터를 결과로 덮어쓰지 않는다. 번역은 새 필드로만 들어간다.
 *
 * 키가 없으면 번역하지 않고 'pending'으로 둔다. 번역이 없다고 해서 그 글이
 * 지면에서 사라지지는 않는다 — 원문 제목 그대로 걸리고, 배지가 그 사실을 밝힌다.
 */
import { createHash } from 'node:crypto'

import { glossaryFor, missingTerms } from './glossary.mjs'

const MODEL = 'claude-opus-5'

/**
 * 번역 규칙의 판(§26).
 *
 * 프롬프트나 용어집을 고치면 이 숫자를 올린다. 캐시 키에 들어 있어서, 올리는
 * 순간 예전 규칙으로 옮겨 둔 문장이 전부 다시 번역된다. 규칙을 바꿔 놓고
 * 옛 결과를 그대로 쓰면 지면에 두 세대의 번역이 섞인다.
 */
const TRANSLATION_VERSION = 2

/** 일시적인 실패에만 한 번 더 시도한다. 거절은 다시 물어도 거절이다. */
const RETRY_DELAY_MS = 1500

const SYSTEM = `당신은 스킨케어·건강·노화 연구·대중문화를 함께 다루는 한국어 매거진의 번역자다.

원칙:
- 직역이 아니라 자연스러운 한국어로 옮기되, 원문에 없는 의미를 더하지 않는다.
- 연구·성분·의학 용어는 임의로 쉬운 말로 바꾸지 않는다. 필요하면 원어를 괄호로 남긴다.
- 제품명·연구기관·인명 등 고유명사는 원문 표기를 보존한다.
- 과장하거나 단정하지 않는다. 원문이 "may"라고 쓴 것을 "한다"로 옮기지 않는다.
- 제목은 원문의 길이와 어조를 유지한다. 낚시성 표현을 만들지 않는다.
- 문단의 수와 순서를 바꾸지 않는다.`

function outputContract(hasBody) {
  const shape = hasBody ? ', "body": ["문단1", "문단2"]' : ''
  const bodyRule = hasBody ? '\nbody는 입력의 문단 수와 순서를 그대로 지킨다.' : ''

  return `출력은 다른 말 없이 JSON 하나만:
{"title": "번역한 제목", "summary": "번역한 요약"${shape}}
요약이 비어 있으면 summary는 빈 문자열로 둔다.${bodyRule}`
}

/**
 * 번역할 것만 꺼낸다.
 *
 * 본문은 글과 그림이 섞인 블록이지만 그림에는 옮길 것이 없다. 글 블록만 순서대로
 * 꺼내 보내고, 돌아온 것을 같은 순서로 다시 끼운다(화면의 present.body). 그래서
 * 번역이 일부만 되어도 그림의 자리는 흔들리지 않는다.
 */
function textBlocks(article) {
  return (article.bodyOriginal ?? [])
    .filter((block) => block?.kind === 'text')
    .map((block) => block.text)
}

/**
 * 캐시 키(§26).
 *
 * 같은 글인지 아닌지는 주소로 정하고, 그 글이 바뀌었는지는 내용의 해시로
 * 정한다. 거기에 규칙의 판을 더한다 — 셋 중 하나라도 달라지면 다시 번역한다.
 */
function cacheKey(article, version = TRANSLATION_VERSION) {
  const body = textBlocks(article).join('\n')
  const content = createHash('sha1')
    .update([article.titleOriginal, article.summaryOriginal ?? '', body].join(' '))
    .digest('hex')
    .slice(0, 16)
  const url = createHash('sha1').update(article.originalUrl).digest('hex').slice(0, 12)

  return `${version}:${url}:${content}`
}

function parseJson(text) {
  const trimmed = text
    .trim()
    .replace(/^```(?:json)?/i, '')
    .replace(/```$/, '')
    .trim()

  try {
    const parsed = JSON.parse(trimmed)

    return typeof parsed?.title === 'string' ? parsed : null
  } catch {
    return null
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 실제로 모델을 부르는 부분.
 *
 * 이 함수만 바깥에서 갈아 끼울 수 있게 해 둔다. 그래야 캐시·용어 검사·재시도
 * 같은 나머지 논리를 열쇠 없이도 시험할 수 있다.
 */
function createCaller(client) {
  return async function call({ system, payload, maxTokens, stream }) {
    const request = {
      model: MODEL,
      max_tokens: maxTokens,
      // 번역은 긴 추론이 필요한 작업이 아니다. 생각은 켜 두되 얕게 쓴다.
      output_config: { effort: 'low' },
      system,
      messages: [{ role: 'user', content: payload }],
    }

    /*
     * 전문 번역은 출력이 길어질 수 있어 스트리밍으로 받는다. 제목과 요약만
     * 옮기는 경우는 짧으므로 한 번에 받는다.
     */
    const response = stream
      ? await client.messages.stream(request).finalMessage()
      : await client.messages.create(request)

    if (response.stop_reason === 'refusal') {
      const error = new Error('거절됨')

      error.refused = true

      throw error
    }

    return response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('')
  }
}

/**
 * 번역기를 만든다.
 *
 * 캐시는 호출한 쪽이 들고 있다가 그대로 파일에 쓴다. 이 모듈이 파일 위치를
 * 알 필요는 없다.
 */
export async function createTranslator(cache, options = {}) {
  const apiKey = process.env['ANTHROPIC_API_KEY']
  let call = options.call

  if (!call) {
    if (!apiKey) {
      console.log('translate  ANTHROPIC_API_KEY 없음 — 원문 그대로 둔다')

      return async (article) => ({
        ...article,
        translationStatus: article.language === 'ko' ? 'none' : 'pending',
      })
    }

    const { default: Anthropic } = await import('@anthropic-ai/sdk')

    call = createCaller(new Anthropic({ apiKey }))
  }

  return async function translate(article) {
    if (article.language === 'ko') return { ...article, translationStatus: 'none' }

    const key = cacheKey(article)
    const cached = cache[key]

    if (cached) {
      return {
        ...article,
        titleKo: cached.title,
        summaryKo: cached.summary || undefined,
        bodyKo: cached.body?.length ? cached.body : undefined,
        translationStatus: 'done',
      }
    }

    // 전문을 실을 수 있는 글만 본문까지 옮긴다. 나머지는 제목과 요약이 전부다.
    const body = article.contentPolicy === 'full' ? textBlocks(article) : []
    const source = [article.titleOriginal, article.summaryOriginal ?? '', ...body].join('\n')
    const glossary = glossaryFor(source)
    const terms = glossary.length ? `\n\n반드시 살려야 하는 용어:\n${glossary.join('\n')}` : ''

    const system = `${SYSTEM}${terms}\n\n${outputContract(body.length > 0)}`

    const payload = JSON.stringify({
      title: article.titleOriginal,
      summary: article.summaryOriginal ?? '',
      ...(body.length ? { body } : {}),
    })

    const maxTokens = body.length ? 16000 : 4000

    for (const attempt of [0, 1]) {
      const stricter =
        attempt === 0
          ? ''
          : '\n\n앞선 번역에서 살려야 할 용어가 사라졌거나 형식이 어긋났다. 용어는 원어 또는 지정된 한국어 표기로 반드시 남기고, 형식을 정확히 지킨다.'

      try {
        const text = await call({
          system: system + stricter,
          payload,
          maxTokens,
          stream: body.length > 0,
        })

        const parsed = parseJson(text)

        if (!parsed) {
          console.warn(`translate  형식을 읽지 못했다: ${article.id}`)

          if (attempt === 0) continue

          return { ...article, translationStatus: 'failed' }
        }

        const translatedBody = Array.isArray(parsed.body) ? parsed.body.filter(Boolean) : []
        const whole = [parsed.title, parsed.summary ?? '', ...translatedBody].join('\n')
        const lost = missingTerms(source, whole)

        /*
         * 용어가 사라졌으면 한 번 더 부탁하고, 그래도 사라지면 번역을 쓰지
         * 않는다. 성분 이름이 빠진 문장을 «번역»이라고 부르며 올리는 것보다
         * 원문을 그대로 보여주는 편이 정직하다.
         */
        if (lost.length > 0) {
          console.warn(`translate  용어가 사라졌다(${lost.join(', ')}): ${article.id}`)

          if (attempt === 0) continue

          return { ...article, translationStatus: 'failed' }
        }

        if (body.length > 0 && translatedBody.length !== body.length) {
          console.warn(`translate  문단 수가 다르다: ${article.id}`)

          if (attempt === 0) continue

          return { ...article, translationStatus: 'failed' }
        }

        cache[key] = {
          title: parsed.title,
          summary: parsed.summary ?? '',
          ...(translatedBody.length ? { body: translatedBody } : {}),
          version: TRANSLATION_VERSION,
          at: new Date().toISOString(),
        }

        return {
          ...article,
          titleKo: parsed.title,
          summaryKo: parsed.summary || undefined,
          bodyKo: translatedBody.length ? translatedBody : undefined,
          translationStatus: 'done',
        }
      } catch (error) {
        if (error.refused) {
          console.warn(`translate  거절됨: ${article.id}`)

          return { ...article, translationStatus: 'failed' }
        }

        console.warn(`translate  실패: ${article.id} — ${error.message}`)

        if (attempt === 0) {
          await sleep(RETRY_DELAY_MS)
          continue
        }

        return { ...article, translationStatus: 'failed' }
      }
    }

    return { ...article, translationStatus: 'failed' }
  }
}

export { cacheKey, TRANSLATION_VERSION }
