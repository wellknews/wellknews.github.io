import type { FacingSignal } from './facingPrompt'
import { parseFacingAiResponse, type FacingAiResult } from './facingResult'

export type FacingNativeResponse = {
  result: FacingAiResult
  provider: 'workers-ai'
  model: string
}

export class FacingApiError extends Error {
  constructor(
    message: string,
    readonly code:
      | 'not-configured'
      | 'timeout'
      | 'rate-limited'
      | 'free-limit'
      | 'upstream'
      | 'invalid-response',
  ) {
    super(message)
    this.name = 'FacingApiError'
  }
}

const REQUEST_TIMEOUT_MS = 35_000
const CLIENT_KEY_STORAGE = 'mamaboy:facing:client:v1'

function clientKey(): string | null {
  try {
    const existing = window.localStorage.getItem(CLIENT_KEY_STORAGE)
    if (existing) return existing
    const created = crypto.randomUUID()
    window.localStorage.setItem(CLIENT_KEY_STORAGE, created)
    return created
  } catch {
    return null
  }
}

function endpoint(): string {
  const configured = import.meta.env.VITE_FACING_API_URL?.trim()
  if (!configured) {
    throw new FacingApiError('Facing AI 연결 주소가 아직 설정되지 않았어.', 'not-configured')
  }
  return configured
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function requestFacingAnalysis(
  signals: readonly FacingSignal[],
): Promise<FacingNativeResponse> {
  if (signals.length === 0) {
    throw new FacingApiError('먼저 거울에서 걸리는 걸 골라 줘.', 'invalid-response')
  }

  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    const client = clientKey()
    if (client) headers['X-Facing-Client'] = client

    const response = await fetch(endpoint(), {
      method: 'POST',
      headers,
      body: JSON.stringify({ signals }),
      credentials: 'omit',
      signal: controller.signal,
    })

    const payload: unknown = await response.json().catch(() => null)

    if (!response.ok) {
      const message =
        isRecord(payload) && typeof payload.message === 'string'
          ? payload.message
          : '지금은 Facing AI 연결이 매끄럽지 않아.'
      const serverCode = isRecord(payload) && typeof payload.code === 'string' ? payload.code : ''

      if (serverCode === 'daily-free-limit') {
        throw new FacingApiError(message, 'free-limit')
      }
      if (response.status === 429) {
        throw new FacingApiError(message, 'rate-limited')
      }
      throw new FacingApiError(message, 'upstream')
    }

    if (!isRecord(payload) || payload.ok !== true || payload.provider !== 'workers-ai') {
      throw new FacingApiError('Facing AI 답변 형식을 확인하지 못했어.', 'invalid-response')
    }

    if (typeof payload.model !== 'string' || !payload.model.trim()) {
      throw new FacingApiError('Facing AI 모델 정보를 확인하지 못했어.', 'invalid-response')
    }

    const parsed = parseFacingAiResponse(JSON.stringify(payload.result))
    if (!parsed.ok) {
      throw new FacingApiError(`Facing AI 답변을 읽지 못했어. ${parsed.reason}`, 'invalid-response')
    }

    return {
      result: parsed.result,
      provider: 'workers-ai',
      model: payload.model.trim(),
    }
  } catch (error) {
    if (error instanceof FacingApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new FacingApiError('생각보다 오래 걸리고 있어. 다시 한 번 눌러 줘.', 'timeout')
    }
    throw new FacingApiError('지금은 Facing AI에 연결하지 못했어.', 'upstream')
  } finally {
    window.clearTimeout(timer)
  }
}
