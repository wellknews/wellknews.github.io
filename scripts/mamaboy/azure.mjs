/**
 * Azure Translator로 옮긴다(§25).
 *
 * 이 지면의 번역은 무료 한도 안에서 끝나야 한다. Azure의 F0 티어가 달마다
 * 200만 자를 주고, 이 매거진이 쓰는 양은 그 절반이 안 된다. 한도를 넘으면
 * 자동으로 과금되는 것이 아니라 429나 403이 오고 다음 달에 리셋된다 — 모르는
 * 사이에 청구서가 생기지 않는다는 뜻이기도 하다.
 *
 * 한도를 넘긴 글은 번역하지 않고 실패로 남긴다. 지면에서 사라지지는 않는다.
 * 원문 제목 그대로 걸리고 ORIGINAL 배지가 그 사실을 밝힌다 — 이 지면은 처음부터
 * 번역이 없는 상태를 숨기지 않도록 만들어져 있다(§14).
 *
 * 용어는 부탁하지 않고 지정한다. Azure의 dynamic dictionary는 «이 낱말은 이렇게
 * 옮겨라»를 문장 안에 직접 박아 넣는 장치라, 프롬프트로 부탁하던 것과 달리
 * 결과가 보장된다. 다만 문서가 고유명사·제품명에만 안전하다고 못 박고 있어,
 * 성분명과 기관 이름처럼 그 성격에 맞는 것에만 쓴다.
 */
import { termPattern, termsIn } from './glossary.mjs'

const ENDPOINT =
  'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=ko'

/** 한 번의 요청에 담을 수 있는 한계. 둘 중 하나만 넘어도 400이 온다. */
const MAX_CHARS = 45_000
const MAX_ITEMS = 900

const TIMEOUT_MS = 30_000

/*
 * F0는 달마다 200만 자를 주지만 «한꺼번에» 주지는 않는다. 분당 한도가 따로
 * 있어서, 요청 사이만 띄우고 양을 보지 않으면 그대로 걸린다 — 20초에
 * 51,945자를 밀어 넣었더니 429가 왔다.
 *
 * 그래서 요청 수가 아니라 글자 수로 속도를 잰다. 한 기사가 8,000자일 때와
 * 300자일 때 쉬어야 하는 시간이 같을 리 없다. 분당 30,000자로 맞춘다 —
 * 문서가 말하는 한도보다 낮게 잡아 두는 편이 재시도보다 싸다.
 */
const CHARS_PER_MINUTE = 30_000
const WINDOW_MS = 60_000
const RETRIES = 5
const BACKOFF_MS = 3_000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 더 부를 수 없다는 신호.
 *
 * 403은 이번 달치를 다 썼다는 뜻이고, 429는 «너무 빠르다»와 «다 썼다» 두 가지에
 * 다 쓰인다. 둘을 헤더만으로 가릴 수 없어서, 429는 물러섰다가 여러 번 다시 해
 * 보고 그래도 오면 그때 이 오류로 올린다.
 */
export class QuotaExhausted extends Error {
  constructor(status, reason) {
    super(status === 403 ? 'Azure 이번 달 번역 한도를 다 썼다' : `Azure가 계속 ${reason}`)
    this.name = 'QuotaExhausted'
    this.status = status
  }
}

function escapeAttribute(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')
}

/**
 * 지켜야 하는 용어를 문장 안에 지정해 넣는다.
 *
 * 낱말 경계에서만 바꾼다 — «collagen»을 찾는다고 «procollagenase» 안쪽을 건드리면
 * 원문에 없던 말을 만들게 된다. 이미 넣은 표시 안쪽을 다시 건드리지 않도록 한
 * 번에 하나의 정규식으로 훑는다.
 */
export function markTerms(text) {
  let marked = text

  for (const entry of termsIn(text)) {
    const korean = entry.ko[0]

    if (!korean) continue

    /* 이미 넣은 표시 안쪽을 다시 건드리지 않도록, 표시 밖에 있는 것만 바꾼다. */
    marked = marked.replaceAll(termPattern(entry), (match, offset, whole) =>
      inside(whole, offset)
        ? match
        : `<mstrans:dictionary translation="${escapeAttribute(korean)}">${match}</mstrans:dictionary>`,
    )
  }

  return marked
}

/** 이 자리가 이미 넣어 둔 표시 안쪽인가. */
function inside(text, offset) {
  const opened = text.lastIndexOf('<mstrans:dictionary', offset)

  if (opened < 0) return false

  return text.indexOf('</mstrans:dictionary>', opened) > offset
}

/** 문자 수와 개수, 둘 다 한계 안에 들도록 끊는다. */
export function batches(texts) {
  const out = []
  let current = []
  let chars = 0

  for (const text of texts) {
    const size = text.length

    if (current.length && (current.length >= MAX_ITEMS || chars + size > MAX_CHARS)) {
      out.push(current)
      current = []
      chars = 0
    }

    current.push(text)
    chars += size
  }

  if (current.length) out.push(current)

  return out
}

async function post(body, { key, region }) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': key,
      ...(region ? { 'Ocp-Apim-Subscription-Region': region } : {}),
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  /*
   * 403은 한도를 다 썼다는 뜻이고, 429는 한도이거나 잠깐 몰린 것이다. 둘을
   * 구분할 수 없으므로 429는 한 번 쉬었다 다시 해 보고, 그래도 오면 한도로 본다.
   */
  if (response.status === 403) throw new QuotaExhausted(403)

  if (!response.ok) {
    const detail = (await response.text()).slice(0, 200)
    const error = new Error(`Azure ${response.status}: ${detail}`)

    error.status = response.status
    /* 서버가 얼마나 기다리라고 하면 그 말을 따른다. 우리 추측보다 정확하다. */
    error.retryAfter = Number(response.headers.get('retry-after')) * 1000 || 0

    throw error
  }

  return response.json()
}

/**
 * 번역기 하나를 만든다.
 *
 * 쓴 글자 수를 세어 돌려준다 — 무료 한도가 달마다 정해져 있으므로 얼마나 남았는지
 * 로그에 남아야 판단할 수 있다.
 */
/**
 * 분당 글자 수를 지키는 속도 조절기.
 *
 * 창 하나가 60초다. 이번 요청을 보내면 창의 몫을 넘길 것 같으면, 창이 새로
 * 열릴 때까지 기다렸다가 보낸다. 429를 맞고 물러서는 것보다 처음부터 천천히
 * 가는 편이 결과적으로 빠르다 — 물러서는 동안에도 시간은 똑같이 간다.
 */
function createPacer(limit = CHARS_PER_MINUTE) {
  let windowStart = Date.now()
  let inWindow = 0

  return async function wait(size) {
    const now = Date.now()

    if (now - windowStart >= WINDOW_MS) {
      windowStart = now
      inWindow = 0
    }

    if (inWindow > 0 && inWindow + size > limit) {
      const rest = windowStart + WINDOW_MS - now

      if (rest > 0) {
        console.log(`translate  분당 한도에 닿았다 — ${Math.ceil(rest / 1000)}초 쉰다`)
        await sleep(rest)
      }

      windowStart = Date.now()
      inWindow = 0
    }

    inWindow += size
  }
}

export function createAzureTranslator({ key, region, limit }) {
  let charactersUsed = 0
  const pace = createPacer(limit)

  async function translate(texts) {
    if (!texts.length) return []

    const out = []

    for (const group of batches(texts.map((text) => markTerms(text)))) {
      const payload = group.map((text) => ({ Text: text }))
      let result

      await pace(group.reduce((sum, text) => sum + text.length, 0))

      for (let attempt = 0; ; attempt += 1) {
        try {
          result = await post(payload, { key, region })
          break
        } catch (error) {
          if (error instanceof QuotaExhausted) throw error

          if (attempt >= RETRIES) {
            if (error.status === 429) throw new QuotaExhausted(429, '너무 빠르다고 한다 (429)')

            throw error
          }

          /* 물러서는 폭을 배로 늘린다. 서버가 시간을 알려 줬으면 그쪽을 따른다. */
          await sleep(error.retryAfter || BACKOFF_MS * 2 ** attempt)
        }
      }

      charactersUsed += group.reduce((sum, text) => sum + text.length, 0)

      for (const item of result) {
        out.push(item?.translations?.[0]?.text ?? '')
      }
    }

    if (out.length !== texts.length) {
      throw new Error(`Azure가 ${texts.length}건에 ${out.length}건을 돌려줬다`)
    }

    return out
  }

  return { translate, used: () => charactersUsed }
}
