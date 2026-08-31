export type FacingSignal = {
  ids: readonly string[]
  labels: readonly string[]
}

export type FacingProviderId = 'chatgpt' | 'gemini' | 'claude'

export type FacingAiProvider = {
  id: FacingProviderId
  label: string
  url: string
  note: string
}

export const FACING_AI_PROVIDERS: readonly FacingAiProvider[] = [
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    url: 'https://chatgpt.com/',
    note: 'OpenAI',
  },
  {
    id: 'gemini',
    label: 'Gemini',
    url: 'https://gemini.google.com/',
    note: 'Google',
  },
  {
    id: 'claude',
    label: 'Claude',
    url: 'https://claude.ai/new',
    note: 'Anthropic',
  },
]

const RESULT_SCHEMA = `{
  "summary": "오늘 상태 한 문장",
  "care": ["오늘 할 관리"],
  "ingredients": [
    { "name": "성분 이름", "reason": "왜 고려할 수 있는지" }
  ],
  "lifestyle": ["확인해 볼 생활 요인"],
  "avoid": ["오늘 피할 행동이나 자극"],
  "watch": ["며칠 동안 관찰할 변화"],
  "getHelp": null
}`

/**
 * facing이 AI에 넘기는 계약.
 *
 * 사용자가 직접 고른 신호만 «관찰된 사실»로 취급한다. 원인·질병·생활습관을
 * 선택값 밖에서 만들어 내지 못하게 경계를 먼저 세우고, 결과를 다시 웹에서
 * 안전하게 읽을 수 있도록 JSON 출력 계약까지 이 함수가 소유한다.
 */
export function buildFacingPrompt(signals: readonly FacingSignal[]): string {
  const observations = signals
    .filter((signal) => signal.labels.length > 0)
    .map((signal) => `- ${signal.labels.join(' > ')}`)

  if (observations.length === 0) return ''

  return [
    '[facing / morning check]',
    '',
    '아래 내용은 사용자가 오늘 아침 거울을 보고 직접 선택한 자기 관찰입니다.',
    '선택하지 않은 증상·원인·질환·생활습관은 사실처럼 추가하지 마세요.',
    '',
    '[오늘의 facing]',
    ...observations,
    '',
    '[답변 목표]',
    '오늘 하루에 바로 적용할 수 있는 스킨케어·두피·웰니스 가이드를 한국어로 짧고 명확하게 작성하세요.',
    '',
    '[중요 규칙]',
    '- 진단하지 마세요. 가능한 원인은 가능성으로만 표현하세요.',
    '- 사용자가 선택하지 않은 상태를 있다고 단정하지 마세요.',
    '- 현재 사용 중인 제품, 질환, 약물, 알레르기 정보가 없으므로 이를 가정하지 마세요.',
    '- 약물이나 보충제의 구체적인 복용량을 처방하지 마세요.',
    '- 눈 통증·시야 변화, 갑작스럽고 심한 탈모, 심한 피부 반응처럼 진료가 필요한 신호가 관련되면 관리 팁보다 진료 안내를 우선하세요.',
    '- 장황한 의학 설명보다 오늘 실행할 수 있는 행동을 우선하세요.',
    '- care, lifestyle, avoid, watch는 각각 최대 4개로 제한하세요.',
    '- ingredients는 최대 4개로 제한하고, 약물이 아니라 일반적인 화장품·식품·영양 성분 중심으로 작성하세요.',
    '',
    '[출력 계약 — 가장 중요]',
    '설명, 인사말, 마크다운 코드블록 없이 아래 형태의 JSON 객체 하나만 출력하세요.',
    '키 이름을 바꾸거나 새 키를 추가하지 마세요.',
    '해당되는 진료 위험 신호가 없으면 getHelp는 반드시 null로 출력하세요.',
    '',
    RESULT_SCHEMA,
  ].join('\n')
}

/** AI가 출력 계약을 어겼을 때 같은 내용을 다시 생성하게 만드는 교정 요청. */
export function buildFacingRepairPrompt(
  originalPrompt: string,
  rejectedResponse: string,
  reason: string,
): string {
  const clippedResponse = rejectedResponse.trim().slice(0, 12_000)

  return [
    '[facing / format repair]',
    '',
    '방금 답변은 내용 때문이 아니라 출력 형식 때문에 facing으로 가져오지 못했습니다.',
    `검증 오류: ${reason}`,
    '',
    '아래 원래 요청의 사실성·안전 규칙을 그대로 유지하면서, 방금 답변의 의미를 가능한 한 보존해 다시 작성하세요.',
    '새로운 증상, 진단, 원인, 제품 사용 사실을 추가하지 마세요.',
    '설명이나 코드블록 없이 JSON 객체 하나만 출력하세요.',
    '',
    '[반드시 지킬 JSON 형태]',
    RESULT_SCHEMA,
    '',
    '[원래 요청]',
    originalPrompt.trim(),
    '',
    '[거절된 답변]',
    clippedResponse,
  ].join('\n')
}
