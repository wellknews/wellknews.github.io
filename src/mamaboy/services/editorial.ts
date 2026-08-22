/**
 * 자동 편집(§17, Phase 6).
 *
 * RSS 기반이므로 사람이 매번 지면을 짤 수 없다. 그렇다고 모든 기사를 같은 크기의
 * 카드로 늘어놓으면 이곳은 Feedly가 된다. 그래서 metadata만 보고 편집 가중치를
 * 부여하고, 그 가중치가 지면의 위계를 만든다.
 *
 * 규칙은 세 가지다.
 *   1. 점수는 CARE/CURIOSITY와 최신성, 그리고 콘텐츠의 성격에서 나온다(§10, §33).
 *   2. 이미지가 없는 기사는 자리를 비워 두지 않고 BRIEF로 바꾼다(§37).
 *   3. 지면은 의도적으로 섞는다 — CARE 다음에 CURIOSITY가 오게, 같은 출처가
 *      연달아 오지 않게(§9).
 *
 * 무작위를 쓰지 않는다. 같은 데이터에서는 늘 같은 지면이 나와야 새로고침할
 * 때마다 판면이 흔들리지 않는다.
 */
import { axisOf } from '../content/site'
import type { Article, Axis, Category, ContentType, Placed, Weight } from '../content/types'

/** 24시간마다 절반으로 줄어든다. 하루 지난 글은 오늘 글의 절반 무게. */
const HALF_LIFE_HOURS = 24

/** 두 번째 FEATURE가 앉는 자리. 첫 화면을 지나 한 번 숨이 필요한 지점이다. */
const SECOND_FEATURE_AT = 5

/**
 * «첫 화면»으로 치는 기사 수(§37).
 *
 * 여기까지는 한 출처가 두 번 나오지 않는다. 처음 보이는 화면이 한 매체로
 * 채워지면, 무엇을 골랐는지가 아니라 어디서 가져왔는지가 먼저 보인다.
 */
const FIRST_VIEW = 4

/**
 * 콘텐츠의 성격에 따른 가중.
 *
 * 연구 결과와 개인 블로그의 경험담을 같은 무게로 보여주지 않는다(§33).
 * 제품 소개는 가장 낮다 — 발견의 즐거움이 아니라 판매의 목적이 먼저인 글이다.
 */
const TYPE_WEIGHT: Record<ContentType, number> = {
  research: 1.15,
  expert: 1.1,
  news: 1,
  opinion: 0.95,
  product: 0.8,
}

/**
 * 이 기사가 지면에서 갖는 힘.
 *
 * CARE와 CURIOSITY 중 «높은 쪽»을 쓴다. 두 축의 평균을 쓰면 양쪽 모두 어중간한
 * 글이 1등이 되고, 이 매거진이 반대하는 «정체성 없는 라이프스타일 지면»이 된다.
 * 한쪽으로 확실한 글이 이겨야 한다.
 */
export function scoreOf(article: Article, now: number = Date.now()): number {
  const peak = Math.max(article.careScore, article.curiosityScore)
  const both = Math.min(article.careScore, article.curiosityScore)

  const ageHours = Math.max(0, (now - Date.parse(article.publishedAt)) / 3_600_000)
  const recency = Math.pow(0.5, ageHours / HALF_LIFE_HOURS)

  // 두 축을 모두 건드리는 글에는 아주 작은 웃돈을 준다. 이 브랜드의 한가운데다.
  const bothBonus = 1 + both * 0.15

  /*
   * 출처의 신뢰도(1..5)를 ±15% 안에서 반영한다.
   *
   * 이 값으로 순위를 뒤집지 않는다. 같은 이야기를 두 곳이 냈을 때 어느 쪽을
   * 앞에 둘지 정도의 크기다 — 신뢰도가 콘텐츠의 가치를 대신하면 이 지면은
   * 매체 목록이 된다.
   */
  const trust = 0.85 + ((article.trustLevel ?? 3) - 1) * 0.075

  return peak * bothBonus * TYPE_WEIGHT[article.contentType] * (0.35 + 0.65 * recency) * trust
}

/**
 * DROP 판정.
 *
 * 두 축 모두 낮으면 지면에 올리지 않는다. 수집한 것을 전부 보여주는 것은 편집이
 * 아니므로, 이 함수가 «아니오»라고 말할 수 있어야 이곳이 RSS Reader가 아니게 된다.
 */
export function isDropped(article: Article, threshold = 0.35): boolean {
  return Math.max(article.careScore, article.curiosityScore) < threshold
}

type ComposeOptions = {
  now?: number
  /** 이 지면의 머리에 세울 기사 수. 카테고리 화면에서는 1이 기본이다. */
  features?: number
}

/**
 * 기사 목록을 지면으로 바꾼다.
 *
 * 반환값의 순서가 곧 화면의 순서다. 컴포넌트는 여기서 나온 것을 그대로 그린다.
 */
export function compose(source: Article[], options: ComposeOptions = {}): Placed[] {
  const now = options.now ?? Date.now()
  const ranked = [...source]
    .filter((article) => !isDropped(article))
    .sort((a, b) => scoreOf(b, now) - scoreOf(a, now))

  if (ranked.length === 0) return []

  const featureCount = Math.max(1, Math.min(options.features ?? (ranked.length >= 9 ? 2 : 1), 3))
  const features = ranked.slice(0, featureCount)
  const rest = ranked.slice(featureCount)

  /*
   * BRIEF의 몫.
   *
   * 이미지가 없고 점수가 낮은 쪽부터 채운다. 다만 지면의 3분의 1을 넘기지
   * 않는다 — 제목만 있는 줄이 너무 많아지면 잡지가 아니라 목록이 된다.
   */
  const briefBudget = Math.floor(rest.length / 3)
  const briefIds = new Set(
    [...rest]
      .filter((article) => !article.image)
      .sort((a, b) => scoreOf(a, now) - scoreOf(b, now))
      .slice(0, briefBudget)
      .map((article) => article.id),
  )

  const [leadArticle] = features
  const body = mix(
    rest.map((article) => place(article, briefIds.has(article.id) ? 'brief' : 'standard')),
    leadArticle ? { source: leadArticle.sourceName, category: leadArticle.category } : {},
  )

  /*
   * 두 번째 FEATURE는 맨 위에 붙이지 않고 지면 중간에 넣는다.
   *
   * 큰 기사 두 개가 연달아 오면 첫 화면이 표지 두 장이 되고, 그 아래의 리듬이
   * 시작되기 전에 스크롤이 길어진다. 잡지에서 두 번째 큰 지면이 하는 일은
   * 시작을 알리는 것이 아니라 흐름을 한 번 끊는 것이다.
   */
  const [lead, ...laterFeatures] = features.map((article) => place(article, 'feature'))
  const placed = lead ? [lead, ...body] : body

  for (const [index, feature] of laterFeatures.entries()) {
    const at = Math.min(placed.length, SECOND_FEATURE_AT + index * SECOND_FEATURE_AT)

    placed.splice(at, 0, feature)
  }

  return placed
}

function place(article: Article, weight: Weight): Placed {
  return { article, weight, axis: axisOf(article.category) }
}

/**
 * 지면을 섞는다.
 *
 * 일반적인 웰니스 매거진에서는 어색한 배열이 여기서는 정체성이 된다 —
 * 레티놀 다음에 캐릭터 완구, 그다음에 수면. 점수 순서를 완전히 버리지 않고,
 * 아래 규칙을 만족하는 가장 높은 점수의 글을 하나씩 뽑는다.
 *
 *   1. 바로 앞과 다른 축
 *   2. 같은 카테고리가 세 번 연달아 오지 않는다
 *   3. 바로 앞과 다른 출처
 *   4. 첫 화면에서는 한 출처가 두 번 나오지 않는다
 *
 * 네 가지를 모두 만족하는 후보가 없으면 하나씩 풀어 준다. 규칙 때문에 지면이
 * 비는 것보다는 규칙이 한 번 어긋나는 편이 낫다 — 순서는 편집의 도구이지
 * 지켜야 할 계율이 아니다.
 */
function mix(items: Placed[], seed: { source?: string; category?: Category } = {}): Placed[] {
  const pool = [...items]
  const out: Placed[] = []
  const viewportSources = new Set<string>()

  if (seed.source) viewportSources.add(seed.source)

  let previousAxis: Axis | null = null
  let previousSource: string | undefined = seed.source
  let run = { category: seed.category, length: seed.category ? 1 : 0 }

  const fits = (item: Placed, level: number) => {
    const source = item.article.sourceName
    const inViewport = out.length < FIRST_VIEW

    // 4 → 1 순으로 조건을 풀어 준다. level 0에서는 전부 지킨다.
    if (level < 4 && inViewport && viewportSources.has(source)) return false
    if (level < 3 && source === previousSource) return false
    if (level < 2 && run.category === item.article.category && run.length >= 2) return false
    if (level < 1 && item.axis === previousAxis) return false

    return true
  }

  while (pool.length > 0) {
    let index = -1

    for (let level = 0; level <= 4 && index === -1; level += 1) {
      index = pool.findIndex((item) => fits(item, level))
    }

    const [next] = pool.splice(index === -1 ? 0 : index, 1)

    if (!next) break

    out.push(next)

    previousAxis = next.axis
    previousSource = next.article.sourceName
    run =
      run.category === next.article.category
        ? { category: run.category, length: run.length + 1 }
        : { category: next.article.category, length: 1 }

    if (out.length <= FIRST_VIEW) viewportSources.add(next.article.sourceName)
  }

  return out
}
