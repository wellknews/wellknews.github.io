type FacingSignal = {
  ids: readonly string[]
  labels: readonly string[]
}

type FacingSkincareIngredient = {
  name: string
  easy: string
  target: string
  lookFor: string
  caution: string
}

type FacingNutrient = {
  name: string
  easy: string
  why: string
  guidance: string
  caution: string
}

type FacingAiResult = {
  summary: string
  routine: string[]
  ingredients: FacingSkincareIngredient[]
  nutrients: FacingNutrient[]
  lifestyle: string[]
  avoid: string[]
  watch: string[]
  getHelp: string | null
}

type IngredientEntry = Omit<FacingSkincareIngredient, 'target'> & {
  id: string
  aliases: readonly string[]
  signalIds: readonly string[]
  priority: number
  group: string
  strong?: boolean
}

type NutrientEntry = FacingNutrient & {
  id: string
  aliases: readonly string[]
  signalIds: readonly string[]
  priority: number
}

type ActionEntry = {
  id: string
  signalIds: readonly string[]
  text: string
  priority: number
  group: string
}

const INGREDIENTS: readonly IngredientEntry[] = [
  {
    id: 'salicylic-acid',
    name: '살리실산(BHA)',
    aliases: ['salicylicacid', 'bha', '살리실산', '살리실산bha'],
    signalIds: ['acne', 'acne-comedonal', 'blackheads', 'pores', 'oiliness'],
    priority: 96,
    group: 'exfoliant',
    strong: true,
    easy: '기름에 잘 녹아서 모공 안쪽의 피지와 묵은 각질을 정리하는 데 쓰는 성분이야.',
    lookFor: '토너 · 세럼 · 클렌저',
    caution: '눈가·입가처럼 민감한 부위에는 가까이 바르지 말고, 건조함이나 따가움이 심해지면 쉬어.',
  },
  {
    id: 'niacinamide',
    name: '나이아신아마이드',
    aliases: ['niacinamide', '나이아신아마이드'],
    signalIds: ['acne', 'pores', 'oiliness', 'redness', 'pigmentation', 'acne-marks'],
    priority: 84,
    group: 'balance',
    easy: '번들거림을 줄이는 쪽과 피부 장벽을 돕는 쪽에 함께 쓰여서 활용 범위가 넓은 성분이야.',
    lookFor: '세럼 · 크림 · 마스크팩',
    caution: '함량이 높다고 무조건 더 좋은 건 아니야. 따갑거나 붉어지면 횟수나 함량을 낮춰.',
  },
  {
    id: 'ceramides',
    name: '세라마이드',
    aliases: ['ceramide', 'ceramides', '세라마이드'],
    signalIds: ['dryness', 'redness', 'fine-lines', 'shaving'],
    priority: 86,
    group: 'barrier',
    easy: '피부 표면의 틈을 메우는 벽돌 사이 시멘트처럼 수분이 빠져나가는 걸 줄이는 데 도움을 주는 성분이야.',
    lookFor: '크림 · 로션 · 마스크팩',
    caution: '트러블을 바로 없애는 성분은 아니야. 건조함과 장벽 관리용으로 생각하면 돼.',
  },
  {
    id: 'panthenol',
    name: '판테놀',
    aliases: ['panthenol', '판테놀'],
    signalIds: ['dryness', 'redness', 'shaving'],
    priority: 82,
    group: 'soothing',
    easy: '따갑거나 건조한 피부가 수분을 지키고 진정되는 데 도움을 주는 성분이야.',
    lookFor: '토너 · 세럼 · 크림 · 마스크팩',
    caution: '진정 성분이어도 모든 피부에 맞는 건 아니야. 바른 뒤 더 따갑거나 붉어지면 중단해.',
  },
  {
    id: 'glycerin',
    name: '글리세린',
    aliases: ['glycerin', 'glycerine', '글리세린'],
    signalIds: ['dryness', 'fine-lines', 'redness'],
    priority: 72,
    group: 'hydration',
    easy: '피부가 물을 붙잡아 두도록 도와서 건조하고 거칠게 느껴질 때 기본 보습을 맡는 성분이야.',
    lookFor: '토너 · 세럼 · 크림 · 마스크팩',
    caution: '원액을 따로 쓰기보다 보습 제품의 성분표에서 확인하는 편이 다루기 쉬워.',
  },
  {
    id: 'hyaluronic-acid',
    name: '히알루론산',
    aliases: ['hyaluronicacid', 'sodiumhyaluronate', '히알루론산', '소듐하이알루로네이트'],
    signalIds: ['dryness', 'fine-lines'],
    priority: 70,
    group: 'hydration',
    easy: '피부 표면에 수분을 끌어당겨 건조해서 더 도드라져 보이는 잔주름을 덜 거칠어 보이게 하는 보습 성분이야.',
    lookFor: '토너 · 세럼 · 크림 · 마스크팩',
    caution:
      '깊은 주름을 없애는 성분은 아니야. 보습으로 피부가 덜 건조해 보이게 하는 역할에 가까워.',
  },
  {
    id: 'retinol',
    name: '레티놀',
    aliases: ['retinol', 'retinoid', '레티놀', '레티노이드'],
    signalIds: ['fine-lines', 'texture', 'pigmentation'],
    priority: 92,
    group: 'retinoid',
    strong: true,
    easy: '비타민 A 계열 성분으로 피부가 새로 바뀌는 과정과 콜라겐 생성에 관여해서 잔주름과 피부결 관리에 많이 쓰여.',
    lookFor: '세럼 · 크림',
    caution:
      '임신·수유 중이라면 사용 전에 전문가에게 확인해. 눈가 가까이에서 따갑다면 그 부위는 보습 위주로 돌려.',
  },
  {
    id: 'vitamin-c',
    name: '비타민 C',
    aliases: ['vitaminc', 'ascorbicacid', '비타민c', '아스코빅애씨드'],
    signalIds: ['pigmentation', 'pigmentation-dull', 'pigmentation-brown-spots'],
    priority: 84,
    group: 'brightening',
    easy: '자외선과 환경 자극으로 생기는 산화 스트레스를 줄이는 데 도움을 주고 칙칙한 톤 관리에 많이 쓰는 성분이야.',
    lookFor: '세럼 · 크림',
    caution:
      '제품이 심하게 변색됐거나 냄새가 달라졌다면 사용하지 말고, 바를 때 따갑다면 횟수를 줄여.',
  },
  {
    id: 'caffeine',
    name: '카페인',
    aliases: ['caffeine', '카페인'],
    signalIds: ['puffiness', 'dark-circles-puffy', 'dark-circles-blue'],
    priority: 68,
    group: 'eye',
    easy: '눈가가 부어 보일 때 일시적으로 덜 부어 보이게 하는 데 쓰이는 성분이야.',
    lookFor: '아이 세럼 · 아이 크림 · 마스크팩',
    caution: '다크서클 원인을 없애는 성분은 아니야. 눈에 들어가지 않게 쓰고 따갑다면 중단해.',
  },
]

const NUTRIENTS: readonly NutrientEntry[] = [
  {
    id: 'iron',
    name: '철분',
    aliases: ['iron', 'ferritin', '철분', '페리틴'],
    signalIds: ['hair-loss', 'hair-loss-m', 'hair-loss-crown', 'hair-loss-part'],
    priority: 90,
    easy: '몸이 산소를 나르고 머리카락이 자라는 데 필요한 영양소야.',
    why: '철분이 부족한 사람에서는 탈모가 함께 나타날 수 있어서, 탈모가 계속될 때 결핍 여부를 확인해볼 수 있어.',
    guidance: '영양제를 바로 고르기보다 식단과 필요하면 혈액검사로 부족한지 먼저 확인해.',
    caution: '부족하지 않은데 고용량을 오래 먹는 건 권하지 않아.',
  },
  {
    id: 'vitamin-d',
    name: '비타민 D',
    aliases: ['vitamind', '비타민d'],
    signalIds: ['hair-loss', 'hair-loss-m', 'hair-loss-crown', 'hair-loss-part'],
    priority: 76,
    easy: '뼈뿐 아니라 피부와 모발을 포함한 여러 몸 기능에 관여하는 영양소야.',
    why: '탈모 원인은 다양하지만 비타민 D가 부족한 경우도 있어서 필요하면 상태를 확인해볼 수 있어.',
    guidance: '식습관·햇빛 노출과 함께 필요하면 검사로 수치를 확인한 뒤 보충 여부를 정해.',
    caution: '거울에서 머리숱이 줄어 보인다는 이유만으로 결핍이라고 단정하지 마.',
  },
  {
    id: 'zinc',
    name: '아연',
    aliases: ['zinc', '아연'],
    signalIds: ['hair-loss', 'hair-loss-m', 'hair-loss-crown', 'hair-loss-part'],
    priority: 64,
    easy: '피부와 머리카락이 정상적으로 만들어지는 데 필요한 영양소야.',
    why: '심한 결핍이 있으면 모발 문제와 겹칠 수 있어서, 식사가 불균형하다면 확인할 가치가 있어.',
    guidance: '평소 식단을 먼저 보고 장기간 보충이 필요하다면 전문가와 상의해.',
    caution: '아연을 너무 많이 오래 먹으면 다른 영양소 균형을 깨뜨릴 수 있어.',
  },
]

const ROUTINES: readonly ActionEntry[] = [
  {
    id: 'gentle-cleanse',
    signalIds: ['acne', 'blackheads', 'pores', 'oiliness', 'redness', 'dryness', 'shaving'],
    priority: 96,
    group: 'cleanse',
    text: '세안은 아침·저녁 정도로만 하고 미지근한 물과 손으로 부드럽게 해. 자주 씻는다고 피부 상태가 더 좋아지는 건 아니야.',
  },
  {
    id: 'moisturize-damp',
    signalIds: ['dryness', 'fine-lines', 'redness', 'shaving'],
    priority: 92,
    group: 'moisture',
    text: '세안 뒤 피부가 완전히 마르기 전에 보습제를 얇게 발라서 수분이 날아가는 걸 줄여.',
  },
  {
    id: 'sunscreen-day',
    signalIds: ['fine-lines', 'pigmentation', 'pigmentation-acne-marks'],
    priority: 86,
    group: 'sun',
    text: '낮에는 스킨케어 마지막 단계에 자외선 차단제를 발라. 새 성분을 더하는 것만큼 기본적인 보호를 유지하는 게 중요해.',
  },
  {
    id: 'mask-by-ingredients',
    signalIds: ['dryness', 'redness', 'fine-lines'],
    priority: 66,
    group: 'mask',
    text: '마스크팩은 “진정·보습” 문구보다 글리세린·판테놀·세라마이드 같은 성분표를 먼저 보고 골라. 붙였을 때 따가우면 바로 떼어.',
  },
  {
    id: 'eye-gentle',
    signalIds: ['fine-lines-eye', 'dryness-eye', 'dark-circles'],
    priority: 94,
    group: 'moisture',
    text: '눈가는 문지르지 말고 보습 위주로 가. BHA나 레티놀 같은 자극될 수 있는 성분은 속눈썹 가까이까지 바르지 마.',
  },
  {
    id: 'shave-gently',
    signalIds: ['shaving'],
    priority: 98,
    group: 'shave',
    text: '면도 전 피부와 수염을 충분히 적시고 같은 부위를 여러 번 밀지 마. 면도 뒤에는 향보다 보습·장벽 성분을 먼저 봐.',
  },
  {
    id: 'scalp-gentle',
    signalIds: ['hair-loss'],
    priority: 98,
    group: 'scalp',
    text: '두피는 손톱으로 긁거나 강하게 마사지하지 말고, 샴푸 뒤 잔여물이 남지 않게 충분히 헹궈.',
  },
]

const LIFESTYLE: readonly ActionEntry[] = [
  {
    id: 'exercise-sweat',
    signalIds: ['acne', 'oiliness'],
    priority: 82,
    group: 'exercise',
    text: '운동은 피부 때문에 줄일 필요 없어. 끝난 뒤 땀과 마찰이 오래 남지만 않게 관리해.',
  },
  {
    id: 'sleep-recovery',
    signalIds: ['tired-sleep'],
    priority: 100,
    group: 'sleep',
    text: '오늘은 스킨케어를 더 늘리기보다 수면 시간을 먼저 회복하는 게 우선이야.',
  },
  {
    id: 'alcohol-recovery',
    signalIds: ['tired-alcohol'],
    priority: 100,
    group: 'alcohol',
    text: '술 마신 다음날은 추가 음주를 피하고 식사와 수면 리듬을 정상으로 돌리는 데 집중해.',
  },
  {
    id: 'late-meal-reset',
    signalIds: ['tired-late-meal'],
    priority: 96,
    group: 'meal',
    text: '오늘은 늦은 야식을 반복하기보다 평소 식사 시간으로 돌아와. 한 번의 야식을 피부 문제 원인으로 단정할 필요는 없어.',
  },
]

const AVOID: readonly ActionEntry[] = [
  {
    id: 'no-scrub',
    signalIds: ['acne', 'blackheads', 'pores'],
    priority: 94,
    group: 'friction',
    text: '코팩·알갱이 스크럽처럼 뜯거나 세게 문질러 피지를 빼는 방식은 피하기.',
  },
  {
    id: 'no-picking',
    signalIds: ['acne'],
    priority: 88,
    group: 'picking',
    text: '여드름을 손으로 짜거나 같은 부위를 계속 만지는 행동은 피하기.',
  },
]

const WATCH: readonly ActionEntry[] = [
  {
    id: 'watch-acne',
    signalIds: ['acne'],
    priority: 94,
    group: 'acne',
    text: '새 성분을 바꾼 뒤 2~4주 동안 새 여드름 수와 붉음이 줄거나 늘었는지 같은 기준으로 기록해.',
  },
  {
    id: 'watch-pores',
    signalIds: ['blackheads', 'pores', 'oiliness'],
    priority: 86,
    group: 'pores',
    text: '같은 조명과 거리에서 2~4주 간격으로 사진을 남겨서 고른 부위가 덜 도드라지는지 비교해.',
  },
  {
    id: 'watch-dryness',
    signalIds: ['dryness'],
    priority: 84,
    group: 'dryness',
    text: '세안 직후와 몇 시간 뒤의 당김·각질 정도를 같은 기준으로 기록해. 보습 루틴이 맞는지 보기 쉬워져.',
  },
  {
    id: 'watch-fine-lines',
    signalIds: ['fine-lines'],
    priority: 82,
    group: 'fine-lines',
    text: '보습 직후와 하루 끝의 잔주름 차이를 봐. 건조 때문에 더 도드라지는 부분이 있는지 판단하는 단서가 돼.',
  },
  {
    id: 'watch-redness',
    signalIds: ['redness', 'shaving'],
    priority: 88,
    group: 'redness',
    text: '특정 제품을 쓴 뒤 따가움·붉음이 반복되는지 제품을 하나씩 바꿔가며 기록해.',
  },
  {
    id: 'watch-hair',
    signalIds: ['hair-loss'],
    priority: 94,
    group: 'hair',
    text: '사진처럼 같은 기준으로 4~8주 정도 추세를 봐. 갑자기 빠지는 양이 크게 늘면 제품보다 진료를 먼저 생각해.',
  },
  {
    id: 'watch-puffiness',
    signalIds: ['puffiness'],
    priority: 76,
    group: 'puffiness',
    text: '아침 붓기가 몇 시간 안에 가라앉는지와 한쪽만 계속 남는지를 구분해서 기록해.',
  },
]

function normalizeName(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[\s()·._\-/]/g, '')
}

function signalIdSet(signals: readonly FacingSignal[]): Set<string> {
  return new Set(signals.flatMap((signal) => signal.ids))
}

function score(
  signalIds: ReadonlySet<string>,
  entryIds: readonly string[],
  priority: number,
): number {
  let matches = 0
  for (const id of entryIds) {
    if (signalIds.has(id)) matches += 1
  }
  return matches === 0 ? 0 : matches * 100 + priority
}

function targetFor(entry: IngredientEntry, signals: readonly FacingSignal[]): string {
  const labels: string[] = []
  for (const signal of signals) {
    if (!signal.ids.some((id) => entry.signalIds.includes(id))) continue
    const label = signal.labels[0]
    if (label && !labels.includes(label)) labels.push(label)
  }
  return labels.slice(0, 3).join(' · ') || '오늘 선택'
}

function selectIngredients(
  signals: readonly FacingSignal[],
  raw: readonly FacingSkincareIngredient[],
): FacingSkincareIngredient[] {
  const ids = signalIdSet(signals)
  const relevant = INGREDIENTS.map((entry) => ({
    entry,
    score: score(ids, entry.signalIds, entry.priority),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const requested: string[] = []
  for (const item of raw) {
    const normalized = normalizeName(item.name)
    const matched = INGREDIENTS.find((entry) =>
      entry.aliases.some((alias) => normalizeName(alias) === normalized),
    )
    if (matched && relevant.some((candidate) => candidate.entry.id === matched.id)) {
      requested.push(matched.id)
    }
  }

  const requestedSet = new Set(requested)
  const ordered = [...relevant].sort(
    (a, b) =>
      b.score +
      (requestedSet.has(b.entry.id) ? 25 : 0) -
      (a.score + (requestedSet.has(a.entry.id) ? 25 : 0)),
  )

  const selected: IngredientEntry[] = []
  const seen = new Set<string>()
  const groups = new Set<string>()
  let strongCount = 0

  for (const { entry } of ordered) {
    if (seen.has(entry.id)) continue
    if (entry.strong && strongCount >= 1) continue
    if (groups.has(entry.group) && selected.length >= 2) continue

    selected.push(entry)
    seen.add(entry.id)
    groups.add(entry.group)
    if (entry.strong) strongCount += 1
    if (selected.length >= 3) break
  }

  return selected.map((entry) => ({
    name: entry.name,
    easy: entry.easy,
    target: targetFor(entry, signals),
    lookFor: entry.lookFor,
    caution: entry.caution,
  }))
}

function selectNutrients(
  signals: readonly FacingSignal[],
  raw: readonly FacingNutrient[],
): FacingNutrient[] {
  const ids = signalIdSet(signals)
  if (ids.has('hair-loss-sudden')) return []

  const relevant = NUTRIENTS.map((entry) => ({
    entry,
    score: score(ids, entry.signalIds, entry.priority),
  }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  const requested: string[] = []
  for (const item of raw) {
    const normalized = normalizeName(item.name)
    const matched = NUTRIENTS.find((entry) =>
      entry.aliases.some((alias) => normalizeName(alias) === normalized),
    )
    if (matched && relevant.some((candidate) => candidate.entry.id === matched.id)) {
      requested.push(matched.id)
    }
  }

  const requestedSet = new Set(requested)
  const ordered = [...relevant].sort(
    (a, b) =>
      b.score +
      (requestedSet.has(b.entry.id) ? 20 : 0) -
      (a.score + (requestedSet.has(a.entry.id) ? 20 : 0)),
  )

  const selected: NutrientEntry[] = []
  const seen = new Set<string>()
  for (const { entry } of ordered) {
    if (seen.has(entry.id)) continue
    selected.push(entry)
    seen.add(entry.id)
    if (selected.length >= 2) break
  }

  return selected.map(
    ({ id: _id, aliases: _aliases, signalIds: _signalIds, priority: _priority, ...item }) => item,
  )
}

function selectActions(
  signals: readonly FacingSignal[],
  catalog: readonly ActionEntry[],
  limit: number,
): string[] {
  const ids = signalIdSet(signals)
  const selected: ActionEntry[] = []
  const groups = new Set<string>()

  const ranked = catalog
    .map((entry) => ({ entry, score: score(ids, entry.signalIds, entry.priority) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  for (const { entry } of ranked) {
    if (groups.has(entry.group)) continue
    selected.push(entry)
    groups.add(entry.group)
    if (selected.length >= limit) break
  }

  return selected.map((entry) => entry.text)
}

function containsStrongIngredient(items: readonly FacingSkincareIngredient[]): boolean {
  const names = new Set(items.map((item) => normalizeName(item.name)))
  return INGREDIENTS.some(
    (entry) => entry.strong && entry.aliases.some((alias) => names.has(normalizeName(alias))),
  )
}

function buildRoutine(
  signals: readonly FacingSignal[],
  ingredients: readonly FacingSkincareIngredient[],
): string[] {
  const base = selectActions(signals, ROUTINES, 3)
  if (!containsStrongIngredient(ingredients)) return base

  const singleActive =
    '새 활성성분은 한 번에 하나만 추가해. 따가움·붉음·각질이 늘면 횟수를 줄이거나 중단해.'
  return [...base, singleActive].slice(0, 4)
}

function buildAvoid(
  signals: readonly FacingSignal[],
  ingredients: readonly FacingSkincareIngredient[],
): string[] {
  const base = selectActions(signals, AVOID, 2)
  if (!containsStrongIngredient(ingredients)) return base

  const stack = 'BHA·AHA·레티놀처럼 자극될 수 있는 활성성분을 같은 날 새로 여러 개 시작하지 않기.'
  return [stack, ...base].slice(0, 3)
}

function buildWatch(
  signals: readonly FacingSignal[],
  ingredients: readonly FacingSkincareIngredient[],
): string[] {
  const base = selectActions(signals, WATCH, 2)
  if (!containsStrongIngredient(ingredients)) return base

  const irritation =
    '새 활성성분 뒤 따가움·화끈거림·각질이 며칠 계속되면 그 성분은 쉬고 피부가 진정되는지 봐.'
  return [irritation, ...base].slice(0, 3)
}

function themeLabels(signals: readonly FacingSignal[]): string[] {
  const ids = signalIdSet(signals)
  const themes: string[] = []
  const push = (value: string) => {
    if (!themes.includes(value)) themes.push(value)
  }

  if (['acne', 'blackheads', 'pores', 'oiliness'].some((id) => ids.has(id))) push('피지·모공')
  if (['redness', 'dryness', 'shaving'].some((id) => ids.has(id))) push('장벽·진정')
  if (ids.has('fine-lines')) push('보습·잔주름')
  if (ids.has('texture')) push('피부결')
  if (ids.has('pigmentation')) push('톤·자외선')
  if (['dark-circles', 'puffiness'].some((id) => ids.has(id))) push('눈가')
  if (ids.has('hair-loss')) push('두피·모발')
  if (ids.has('red-eyes')) push('눈')
  if (ids.has('tired')) push('컨디션')

  return themes.slice(0, 3)
}

function buildSummary(
  signals: readonly FacingSignal[],
  ingredients: readonly FacingSkincareIngredient[],
): string {
  const themes = themeLabels(signals)
  const themeText = themes.length > 0 ? themes.join(' / ') : '오늘 선택한 신호'
  const names = ingredients.map((item) => item.name).slice(0, 3)

  if (names.length === 0) {
    return `오늘의 초점은 ${themeText}. 제품보다 루틴부터 정리하고, 필요 없는 성분은 억지로 더하지 마.`
  }

  return `오늘의 초점은 ${themeText}. 성분표에서는 ${names.join(' · ')}부터 확인하되, 한꺼번에 다 새로 쓰지는 마.`
}

function buildGetHelp(signals: readonly FacingSignal[]): string | null {
  const ids = signalIdSet(signals)
  if (ids.has('hair-loss-sudden')) {
    return '갑자기 머리카락이 많이 빠지는 변화는 영양제나 두피 제품부터 고르기보다 피부과 등 의료진 평가를 먼저 받아봐.'
  }
  if (ids.has('red-eyes')) {
    return '충혈과 함께 눈 통증·시야 변화·심한 눈부심이 있으면 스킨케어보다 안과 진료를 우선해.'
  }
  if (ids.has('puffiness-one-side')) {
    return '한쪽 붓기가 갑자기 심해지거나 통증·호흡곤란 같은 다른 증상이 함께 있으면 진료를 받아.'
  }
  if (ids.has('redness-hot')) {
    return '화끈거림이 심하거나 붓기·물집이 생기면 새 제품 사용을 중단하고 진료를 받아.'
  }
  return null
}

export function stabilizeFacingAdvice(
  signals: readonly FacingSignal[],
  raw: FacingAiResult,
): FacingAiResult {
  const ingredients = selectIngredients(signals, raw.ingredients)
  const nutrients = selectNutrients(signals, raw.nutrients)

  return {
    summary: buildSummary(signals, ingredients),
    routine: buildRoutine(signals, ingredients),
    ingredients,
    nutrients,
    lifestyle: selectActions(signals, LIFESTYLE, 2),
    avoid: buildAvoid(signals, ingredients),
    watch: buildWatch(signals, ingredients),
    getHelp: buildGetHelp(signals),
  }
}
