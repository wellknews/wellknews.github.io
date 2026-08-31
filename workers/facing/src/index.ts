type FacingSignal = {
  ids: readonly string[]
  labels: readonly string[]
}

type FacingIngredient = {
  name: string
  reason: string
}

type FacingAiResult = {
  summary: string
  care: string[]
  ingredients: FacingIngredient[]
  lifestyle: string[]
  avoid: string[]
  watch: string[]
  getHelp: string | null
}

const FACING_RESULT_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    care: { type: 'array', items: { type: 'string' }, maxItems: 4 },
    ingredients: {
      type: 'array',
      maxItems: 4,
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['name', 'reason'],
        additionalProperties: false,
      },
    },
    lifestyle: { type: 'array', items: { type: 'string' }, maxItems: 4 },
    avoid: { type: 'array', items: { type: 'string' }, maxItems: 4 },
    watch: { type: 'array', items: { type: 'string' }, maxItems: 4 },
    getHelp: { type: ['string', 'null'] },
  },
  required: ['summary', 'care', 'ingredients', 'lifestyle', 'avoid', 'watch', 'getHelp'],
  additionalProperties: false,
} as const

const FACING_SYSTEM_INSTRUCTIONS = [
  '너는 Mamaboy의 Facing AI Morning Check를 돕는 에디토리얼 가이드다.',
  '사용자가 오늘 아침 거울을 보고 직접 고른 관찰만 사실로 취급한다.',
  '선택하지 않은 증상, 원인, 질환, 생활습관, 사용 제품을 사실처럼 추가하지 않는다.',
  '진단하지 않는다. 가능한 원인은 가능성으로만 표현한다.',
  '약물이나 보충제의 구체적인 복용량을 처방하지 않는다.',
  '눈 통증·시야 변화, 갑작스럽고 심한 탈모, 심한 피부 반응처럼 진료가 필요한 신호가 관련되면 관리 팁보다 진료 안내를 우선한다.',
  '장황한 의학 설명보다 오늘 바로 실행할 수 있는 행동을 우선한다.',
  '한국어로 짧고 명확하게 쓴다.',
  'care, lifestyle, avoid, watch는 각각 최대 4개만 제안한다.',
  'ingredients는 최대 4개이며 일반적인 화장품·식품·영양 성분 중심으로 제안한다.',
  '관련 진료 위험 신호가 없으면 getHelp는 null이다.',
].join('\n')

function buildFacingObservationPrompt(signals: readonly FacingSignal[]): string {
  const observations = signals
    .filter((signal) => signal.labels.length > 0)
    .map((signal) => `- ${signal.labels.join(' > ')}`)

  return [
    '[오늘의 Facing AI]',
    ...observations,
    '',
    '이 관찰만 바탕으로 오늘 하루에 적용할 수 있는 스킨케어·두피·웰니스 가이드를 작성해.',
  ].join('\n')
}

const MAX_TEXT_LENGTH = 280
const MAX_LIST_ITEMS = 6

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

function cleanIngredients(value: unknown): FacingIngredient[] {
  if (!Array.isArray(value)) throw new Error('ingredients가 배열이 아니야.')
  if (value.length > MAX_LIST_ITEMS) throw new Error('ingredients 항목이 너무 많아.')
  return value.map((item, index) => {
    if (!isRecord(item)) throw new Error(`ingredients[${index}] 형식이 달라.`)
    return {
      name: cleanText(item.name, `ingredients[${index}].name`, 100),
      reason: cleanText(item.reason, `ingredients[${index}].reason`, 220),
    }
  })
}

function validateFacingAiResult(value: unknown): FacingAiResult {
  if (!isRecord(value)) throw new Error('최상위 값이 JSON 객체가 아니야.')
  return {
    summary: cleanText(value.summary, 'summary'),
    care: cleanTextArray(value.care, 'care'),
    ingredients: cleanIngredients(value.ingredients),
    lifestyle: cleanTextArray(value.lifestyle, 'lifestyle'),
    avoid: cleanTextArray(value.avoid, 'avoid'),
    watch: cleanTextArray(value.watch, 'watch'),
    getHelp: value.getHelp === null ? null : cleanText(value.getHelp, 'getHelp', 320),
  }
}

type RateLimitBinding = {
  limit(input: { key: string }): Promise<{ success: boolean }>
}

type WorkersAiBinding = {
  run(model: string, input: Record<string, unknown>): Promise<unknown>
}

type Env = {
  AI: WorkersAiBinding
  ALLOWED_ORIGINS?: string
  FACING_CLIENT_RATE_LIMITER?: RateLimitBinding
}

const FREE_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast'
const MAX_BODY_BYTES = 24_000
const MAX_SIGNALS = 12
const MAX_PATH_DEPTH = 4
const MAX_LABEL_LENGTH = 80

function json(body: unknown, status: number, origin: string | null): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  })
  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin)
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    headers.set('Access-Control-Allow-Headers', 'Content-Type, X-Facing-Client')
    headers.set('Vary', 'Origin')
  }
  return new Response(JSON.stringify(body), { status, headers })
}

function allowedOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get('Origin')
  if (!origin) return null

  const allowed = (env.ALLOWED_ORIGINS ?? 'https://wellknews.github.io')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return allowed.includes(origin) ? origin : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeSignals(value: unknown): FacingSignal[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_SIGNALS) {
    throw new Error('signals 범위가 올바르지 않아.')
  }

  return value.map((item, signalIndex) => {
    if (!isRecord(item) || !Array.isArray(item.ids) || !Array.isArray(item.labels)) {
      throw new Error(`signals[${signalIndex}] 형식이 달라.`)
    }
    if (
      item.ids.length === 0 ||
      item.ids.length > MAX_PATH_DEPTH ||
      item.labels.length !== item.ids.length
    ) {
      throw new Error(`signals[${signalIndex}] 경로가 올바르지 않아.`)
    }

    const ids = item.ids.map((id, pathIndex) => {
      if (typeof id !== 'string' || !/^[a-z0-9-]{1,80}$/.test(id)) {
        throw new Error(`signals[${signalIndex}].ids[${pathIndex}] 값이 올바르지 않아.`)
      }
      return id
    })

    const labels = item.labels.map((label, pathIndex) => {
      if (typeof label !== 'string') {
        throw new Error(`signals[${signalIndex}].labels[${pathIndex}] 값이 올바르지 않아.`)
      }
      const cleaned = label.replace(/\s+/g, ' ').trim()
      if (!cleaned || cleaned.length > MAX_LABEL_LENGTH) {
        throw new Error(`signals[${signalIndex}].labels[${pathIndex}] 길이가 올바르지 않아.`)
      }
      return cleaned
    })

    return { ids, labels }
  })
}

function workersAiErrorCode(error: unknown): string | null {
  if (!isRecord(error)) {
    const message = error instanceof Error ? error.message : String(error)
    return message.match(/\b(3036|3040|5035)\b/)?.[1] ?? null
  }

  const directCode = error.code
  if (typeof directCode === 'number' || typeof directCode === 'string') {
    const code = String(directCode)
    if (['3036', '3040', '5035'].includes(code)) return code
  }

  const message = typeof error.message === 'string' ? error.message : JSON.stringify(error)
  return message.match(/\b(3036|3040|5035)\b/)?.[1] ?? null
}

async function runFacingAi(signals: readonly FacingSignal[], env: Env) {
  const payload = await env.AI.run(FREE_MODEL, {
    messages: [
      { role: 'system', content: FACING_SYSTEM_INSTRUCTIONS },
      { role: 'user', content: buildFacingObservationPrompt(signals) },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: FACING_RESULT_SCHEMA,
    },
    temperature: 0.25,
    max_tokens: 900,
  })

  if (!isRecord(payload) || !('response' in payload)) {
    throw new Error('Workers AI response did not contain response')
  }

  /*
   * 모델이 뱉은 글자를 읽는 자리다. 여기서 나는 SyntaxError를 그대로 올려보내면
   * 바깥의 catch가 요청 본문이 깨진 것과 구분하지 못해, 선택은 멀쩡한 사람에게
   * «다시 골라 줘»라고 답한다. 모델이 계약을 어긴 것은 사용자의 잘못이 아니므로
   * 평범한 Error로 바꿔 ai-unavailable로 내려보낸다.
   */
  const response = payload.response
  let parsed: unknown = response

  if (typeof response === 'string') {
    try {
      parsed = JSON.parse(response)
    } catch {
      throw new Error('Workers AI response was not valid JSON')
    }
  }

  return validateFacingAiResult(parsed)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const origin = allowedOrigin(request, env)

    if (url.pathname === '/health' && request.method === 'GET') {
      return json(
        { ok: true, service: 'mamaboy-facing-ai', mode: 'workers-ai-free', model: FREE_MODEL },
        200,
        origin,
      )
    }

    if (url.pathname !== '/facing') return json({ ok: false, message: 'Not found' }, 404, origin)

    if (request.method === 'OPTIONS') {
      if (!origin) return json({ ok: false, message: 'Origin not allowed' }, 403, null)
      return json({ ok: true }, 200, origin)
    }

    if (request.method !== 'POST') {
      return json({ ok: false, message: 'Method not allowed' }, 405, origin)
    }
    if (!origin) return json({ ok: false, message: 'Origin not allowed' }, 403, null)

    if (env.FACING_CLIENT_RATE_LIMITER) {
      const clientKey = request.headers.get('X-Facing-Client')?.trim().slice(0, 96) || 'anonymous'
      const limit = await env.FACING_CLIENT_RATE_LIMITER.limit({ key: clientKey })
      if (!limit.success) {
        return json(
          {
            ok: false,
            code: 'rate-limited',
            message: '너무 빠르게 여러 번 보고 있어. 잠깐 뒤에 다시 봐 줘.',
          },
          429,
          origin,
        )
      }
    }

    try {
      const rawBody = await request.text()
      if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
        return json({ ok: false, message: '요청이 너무 커.' }, 413, origin)
      }

      const body: unknown = JSON.parse(rawBody)
      if (!isRecord(body)) {
        return json({ ok: false, message: '요청 형식을 읽지 못했어.' }, 400, origin)
      }

      const signals = sanitizeSignals(body.signals)
      const result = await runFacingAi(signals, env)
      return json({ ok: true, provider: 'workers-ai', model: FREE_MODEL, result }, 200, origin)
    } catch (error) {
      const aiCode = workersAiErrorCode(error)

      if (aiCode === '3036') {
        return json(
          {
            ok: false,
            code: 'daily-free-limit',
            message: '오늘 무료 Facing AI 사용량을 다 썼어. 무료 할당이 리셋되면 다시 볼 수 있어.',
          },
          429,
          origin,
        )
      }

      if (aiCode === '3040') {
        return json(
          {
            ok: false,
            code: 'capacity',
            message: '지금 Facing AI 쪽이 붐비고 있어. 잠깐 뒤에 다시 봐 줘.',
          },
          503,
          origin,
        )
      }

      if (aiCode === '5035') {
        console.error('Facing AI model unexpectedly requires Workers Paid', error)
        return json(
          {
            ok: false,
            code: 'free-model-required',
            message: '무료 모델 설정을 확인해야 해. 유료 모델로 자동 전환하지 않았어.',
          },
          503,
          origin,
        )
      }

      console.error('Facing AI request failed', error)
      const badRequest =
        error instanceof SyntaxError ||
        (error instanceof Error && error.message.startsWith('signals'))

      return json(
        {
          ok: false,
          code: badRequest ? 'bad-request' : 'ai-unavailable',
          message: badRequest
            ? '고른 상태를 읽지 못했어. 다시 골라 줘.'
            : '지금은 Facing AI 연결이 매끄럽지 않아.',
        },
        badRequest ? 400 : 502,
        origin,
      )
    }
  },
}
