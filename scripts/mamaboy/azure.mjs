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
import { GLOSSARY } from './glossary.mjs'

const ENDPOINT =
  'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=en&to=ko'

/** 한 번의 요청에 담을 수 있는 한계. 둘 중 하나만 넘어도 400이 온다. */
const MAX_CHARS = 45_000
const MAX_ITEMS = 900

const TIMEOUT_MS = 30_000
const RETRY_DELAY_MS = 2_000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/** 한도를 다 썼다는 신호. 다시 시도해도 이번 달에는 열리지 않는다. */
export class QuotaExhausted extends Error {
  constructor(status) {
    super(`Azure 번역 한도 (HTTP ${status})`)
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
  const found = GLOSSARY.filter(({ en }) => new RegExp(`\\b${en}\\b`, 'i').test(text))

  if (!found.length) return text

  const pattern = new RegExp(`\\b(${found.map(({ en }) => en).join('|')})\\b`, 'gi')

  return text.replaceAll(pattern, (match) => {
    const entry = found.find(({ en }) => en.toLowerCase() === match.toLowerCase())
    const korean = entry?.ko[0]

    if (!korean) return match

    return `<mstrans:dictionary translation="${escapeAttribute(korean)}">${match}</mstrans:dictionary>`
  })
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
export function createAzureTranslator({ key, region }) {
  let charactersUsed = 0

  async function translate(texts) {
    if (!texts.length) return []

    const out = []

    for (const group of batches(texts.map((text) => markTerms(text)))) {
      const payload = group.map((text) => ({ Text: text }))
      let result

      for (const attempt of [0, 1]) {
        try {
          result = await post(payload, { key, region })
          break
        } catch (error) {
          if (error instanceof QuotaExhausted) throw error

          /* 429가 두 번 오면 잠깐 몰린 것이 아니라 한도다. */
          if (error.status === 429 && attempt === 1) throw new QuotaExhausted(429)

          if (attempt === 1) throw error

          await sleep(RETRY_DELAY_MS)
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
