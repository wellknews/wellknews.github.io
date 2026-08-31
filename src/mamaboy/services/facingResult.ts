export type FacingSkincareIngredient = {
  name: string
  easy: string
  target: string
  lookFor: string
  caution: string
}

export type FacingNutrient = {
  name: string
  easy: string
  why: string
  guidance: string
  caution: string
}

export type FacingAiResult = {
  summary: string
  routine: string[]
  ingredients: FacingSkincareIngredient[]
  nutrients: FacingNutrient[]
  lifestyle: string[]
  avoid: string[]
  watch: string[]
  getHelp: string | null
}

export type FacingParseResult = { ok: true; result: FacingAiResult } | { ok: false; reason: string }

const MAX_RESPONSE_LENGTH = 50_000
const MAX_TEXT_LENGTH = 280
const MAX_LIST_ITEMS = 6

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function cleanText(value: unknown, field: string, maxLength = MAX_TEXT_LENGTH): string {
  if (typeof value !== 'string') throw new Error(`${field}가 문자열이 아니야.`)
  const cleaned = value.replace(/\s+/g, ' ').trim()
  if (!cleaned) throw new Error(`${field}가 비어 있어.`)
  if (cleaned.length > maxLength) throw new Error(`${field}가 너무 길어.`)
  return cleaned
}

function cleanTextArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${field}가 배열이 아니야.`)
  if (value.length > MAX_LIST_ITEMS) throw new Error(`${field} 항목이 너무 많아.`)
  return value.map((item, index) => cleanText(item, `${field}[${index}]`, 220))
}

function cleanIngredients(value: unknown): FacingSkincareIngredient[] {
  if (!Array.isArray(value)) throw new Error('ingredients가 배열이 아니야.')
  if (value.length > MAX_LIST_ITEMS) throw new Error('ingredients 항목이 너무 많아.')

  return value.map((item, index) => {
    if (!isRecord(item)) throw new Error(`ingredients[${index}] 형식이 달라.`)
    const name = cleanText(item.name, `ingredients[${index}].name`, 100)

    /* v4.8 이전 저장 기록도 버리지 않는다. 예전 reason 한 줄을 새 화면에서 읽을 수 있게만 이관한다. */
    if (typeof item.easy !== 'string' && typeof item.reason === 'string') {
      return {
        name,
        easy: cleanText(item.reason, `ingredients[${index}].reason`, 220),
        target: '이전 기록',
        lookFor: '제품 성분표에서 이 이름을 확인해 봐.',
        caution: '새 성분 큐레이터 기준 적용 전 결과야. 다시 물어보면 더 구체적으로 볼 수 있어.',
      }
    }

    return {
      name,
      easy: cleanText(item.easy, `ingredients[${index}].easy`, 180),
      target: cleanText(item.target, `ingredients[${index}].target`, 120),
      lookFor: cleanText(item.lookFor, `ingredients[${index}].lookFor`, 180),
      caution: cleanText(item.caution, `ingredients[${index}].caution`, 180),
    }
  })
}

function cleanNutrients(value: unknown): FacingNutrient[] {
  if (value === undefined) return []
  if (!Array.isArray(value)) throw new Error('nutrients가 배열이 아니야.')
  if (value.length > MAX_LIST_ITEMS) throw new Error('nutrients 항목이 너무 많아.')

  return value.map((item, index) => {
    if (!isRecord(item)) throw new Error(`nutrients[${index}] 형식이 달라.`)
    return {
      name: cleanText(item.name, `nutrients[${index}].name`, 100),
      easy: cleanText(item.easy, `nutrients[${index}].easy`, 180),
      why: cleanText(item.why, `nutrients[${index}].why`, 200),
      guidance: cleanText(item.guidance, `nutrients[${index}].guidance`, 220),
      caution: cleanText(item.caution, `nutrients[${index}].caution`, 200),
    }
  })
}

function cleanGetHelp(value: unknown): string | null {
  if (value === null) return null
  return cleanText(value, 'getHelp', 320)
}

function validateResult(value: unknown): FacingAiResult {
  if (!isRecord(value)) throw new Error('최상위 값이 JSON 객체가 아니야.')

  return {
    summary: cleanText(value.summary, 'summary'),
    routine: cleanTextArray(value.routine ?? value.care, 'routine'),
    ingredients: cleanIngredients(value.ingredients),
    nutrients: cleanNutrients(value.nutrients),
    lifestyle: cleanTextArray(value.lifestyle, 'lifestyle'),
    avoid: cleanTextArray(value.avoid, 'avoid'),
    watch: cleanTextArray(value.watch, 'watch'),
    getHelp: cleanGetHelp(value.getHelp),
  }
}

export function normalizeFacingAiResult(value: unknown): FacingAiResult {
  return validateResult(value)
}

function jsonCandidate(raw: string): string {
  const trimmed = raw.trim()
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  if (fenced?.[1]) return fenced[1].trim()

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1)
  return trimmed
}

export function parseFacingAiResponse(raw: string): FacingParseResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, reason: 'Facing AI 답변이 비어 있어.' }
  if (trimmed.length > MAX_RESPONSE_LENGTH) {
    return { ok: false, reason: 'Facing AI 답변이 너무 길어.' }
  }

  try {
    const parsed: unknown = JSON.parse(jsonCandidate(trimmed))
    return { ok: true, result: validateResult(parsed) }
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : 'JSON 형식을 읽지 못했어.',
    }
  }
}
