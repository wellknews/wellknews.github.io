/**
 * 번역(§13, §14).
 *
 * 페이지를 열 때마다 번역하지 않는다. 새 글을 수집한 그 순간 한 번 번역하고
 * 결과를 캐시에 남긴다 — 비용과 응답 시간 둘 다 그렇게 해야 감당이 된다.
 *
 * 원칙은 세 가지다.
 *   1. 직역보다 자연스러운 한국어를 목표로 하되, 없는 의미를 만들지 않는다.
 *   2. 성분명·연구기관·제품명·고유명사는 원문을 함께 남긴다.
 *   3. 원문 데이터를 결과로 덮어쓰지 않는다. 번역은 새 필드로만 들어간다.
 *
 * 키가 없으면 번역하지 않고 'pending'으로 둔다. 번역이 없다고 해서 그 글이
 * 지면에서 사라지지는 않는다 — 원문 제목 그대로 걸리고, 배지가 그 사실을 밝힌다.
 */
import { createHash } from 'node:crypto'

const MODEL = 'claude-opus-5'

const SYSTEM = `당신은 스킨케어·건강·노화 연구·대중문화를 함께 다루는 한국어 매거진의 번역자다.

원칙:
- 직역이 아니라 자연스러운 한국어로 옮기되, 원문에 없는 의미를 더하지 않는다.
- 연구·성분·의학 용어는 임의로 쉬운 말로 바꾸지 않는다. 필요하면 원어를 괄호로 남긴다.
- 제품명·연구기관·인명 등 고유명사는 원문 표기를 보존한다.
- 과장하거나 단정하지 않는다. 원문이 "may"라고 쓴 것을 "한다"로 옮기지 않는다.
- 제목은 원문의 길이와 어조를 유지한다. 낚시성 표현을 만들지 않는다.

출력은 다른 말 없이 JSON 하나만:
{"title": "번역한 제목", "summary": "번역한 요약"}
요약이 비어 있으면 summary는 빈 문자열로 둔다.`

function keyOf(article) {
  return createHash('sha1')
    .update(`${article.id}|${article.titleOriginal}|${article.summaryOriginal ?? ''}`)
    .digest('hex')
    .slice(0, 16)
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

/**
 * 번역기를 만든다.
 *
 * 캐시는 호출한 쪽이 들고 있다가 그대로 파일에 쓴다. 이 모듈이 파일 위치를
 * 알 필요는 없다.
 */
export async function createTranslator(cache) {
  const apiKey = process.env['ANTHROPIC_API_KEY']

  if (!apiKey) {
    console.log('translate  ANTHROPIC_API_KEY 없음 — 원문 그대로 둔다')

    return async (article) => ({ ...article, translationStatus: 'pending' })
  }

  const { default: Anthropic } = await import('@anthropic-ai/sdk')
  const client = new Anthropic({ apiKey })

  return async function translate(article) {
    if (article.language === 'ko') return { ...article, translationStatus: 'none' }

    const key = keyOf(article)
    const cached = cache[key]

    if (cached) {
      return {
        ...article,
        titleKo: cached.title,
        summaryKo: cached.summary || undefined,
        translationStatus: 'done',
      }
    }

    const payload = JSON.stringify({
      title: article.titleOriginal,
      summary: article.summaryOriginal ?? '',
    })

    try {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 4000,
        // 번역은 긴 추론이 필요한 작업이 아니다. 생각은 켜 두되 얕게 쓴다.
        output_config: { effort: 'low' },
        system: SYSTEM,
        messages: [{ role: 'user', content: payload }],
      })

      if (response.stop_reason === 'refusal') {
        console.warn(`translate  거절됨: ${article.id}`)

        return { ...article, translationStatus: 'failed' }
      }

      const text = response.content
        .filter((block) => block.type === 'text')
        .map((block) => block.text)
        .join('')

      const parsed = parseJson(text)

      if (!parsed) {
        console.warn(`translate  형식을 읽지 못했다: ${article.id}`)

        return { ...article, translationStatus: 'failed' }
      }

      cache[key] = { title: parsed.title, summary: parsed.summary ?? '' }

      return {
        ...article,
        titleKo: parsed.title,
        summaryKo: parsed.summary || undefined,
        translationStatus: 'done',
      }
    } catch (error) {
      console.warn(`translate  실패: ${article.id} — ${error.message}`)

      return { ...article, translationStatus: 'failed' }
    }
  }
}
