import type { FacingProviderId, FacingSignal } from './facingPrompt'

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
  care: string[]
  ingredients: FacingSkincareIngredient[]
  nutrients: FacingNutrient[]
  lifestyle: string[]
  avoid: string[]
  watch: string[]
  getHelp: string | null
}

export type FacingRecord = {
  version: 1
  date: string
  savedAt: string
  provider: FacingProviderId | null
  signals: FacingSignal[]
  result: FacingAiResult
}

export type FacingParseResult = { ok: true; result: FacingAiResult } | { ok: false; reason: string }

const STORAGE_KEY = 'mamaboy:facing:history:v1'
const MAX_HISTORY = 30
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
    care: cleanTextArray(value.care, 'care'),
    ingredients: cleanIngredients(value.ingredients),
    nutrients: cleanNutrients(value.nutrients),
    lifestyle: cleanTextArray(value.lifestyle, 'lifestyle'),
    avoid: cleanTextArray(value.avoid, 'avoid'),
    watch: cleanTextArray(value.watch, 'watch'),
    getHelp: cleanGetHelp(value.getHelp),
  }
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

function dateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function readHistory(): FacingRecord[] {
  if (typeof window === 'undefined') return []

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.flatMap((item): FacingRecord[] => {
      if (!isRecord(item) || item.version !== 1) return []
      if (typeof item.date !== 'string' || typeof item.savedAt !== 'string') return []
      if (!Array.isArray(item.signals)) return []
      if (
        item.provider !== null &&
        !['workers-ai', 'chatgpt', 'gemini', 'claude'].includes(String(item.provider))
      ) {
        return []
      }

      try {
        const result = validateResult(item.result)
        const signals = item.signals.flatMap((signal): FacingSignal[] => {
          if (!isRecord(signal) || !Array.isArray(signal.ids) || !Array.isArray(signal.labels)) {
            return []
          }
          if (!signal.ids.every((id) => typeof id === 'string')) return []
          if (!signal.labels.every((label) => typeof label === 'string')) return []
          return [{ ids: [...signal.ids] as string[], labels: [...signal.labels] as string[] }]
        })
        if (signals.length === 0) return []

        return [
          {
            version: 1,
            date: item.date,
            savedAt: item.savedAt,
            provider: item.provider as FacingProviderId | null,
            signals,
            result,
          },
        ]
      } catch {
        return []
      }
    })
  } catch {
    return []
  }
}

export function loadTodayFacingRecord(): FacingRecord | null {
  return readHistory().find((record) => record.date === dateKey()) ?? null
}

export function saveFacingRecord(
  signals: readonly FacingSignal[],
  result: FacingAiResult,
  provider: FacingProviderId | null,
): FacingRecord | null {
  if (typeof window === 'undefined' || signals.length === 0) return null

  const record: FacingRecord = {
    version: 1,
    date: dateKey(),
    savedAt: new Date().toISOString(),
    provider,
    signals: signals.map((signal) => ({ ids: [...signal.ids], labels: [...signal.labels] })),
    result,
  }

  try {
    const history = readHistory().filter((item) => item.date !== record.date)
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([record, ...history].slice(0, MAX_HISTORY)),
    )
    return record
  } catch {
    return null
  }
}
