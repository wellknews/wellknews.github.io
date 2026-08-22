/**
 * 이어서 읽을 것(§40).
 *
 * 같은 카테고리의 최신 글 세 개를 붙이지 않는다. 스킨케어를 읽고 나온 사람에게
 * 스킨케어를 세 개 더 보여주는 것은 이 매거진이 하려는 일이 아니다 — 몸을
 * 돌보다가 호기심 쪽으로 넘어가는 순간이 브랜드의 한가운데이기 때문이다.
 *
 * 그래서 세 가지를 함께 본다.
 *
 *   1. 얼마나 닮았는가        제목·요약·키워드가 겹치는 정도
 *   2. 어느 축에서 왔는가      반대쪽 축에서 온 글에 웃돈을 준다
 *   3. 어디서 왔는가          같은 출처를 반복하지 않는다
 *
 * 임베딩을 쓰지 않는다. 이 지면은 정적 호스팅이고 계산은 브라우저에서 일어나므로,
 * 낱말이 겹치는 정도로 «닮음»을 근사한다. 한국어는 조사가 붙어 낱말이 그대로
 * 일치하지 않으므로 두 글자 단위로 쪼개어 본다 — «레티놀을»과 «레티놀은»이
 * 서로 남남이 되지 않게 하는 가장 싼 방법이다.
 */
import { axisOf } from '../content/site'
import type { Article } from '../content/types'

/** 반나절이면 절반으로 줄어드는 최신성. 관련성 앞에서 시간은 거들 뿐이다. */
const HALF_LIFE_HOURS = 48

const WEIGHT = {
  similarity: 0.55,
  oppositeAxis: 0.2,
  otherSource: 0.15,
  recency: 0.1,
}

function tokensOf(article: Article): Set<string> {
  const text = [
    article.titleKo,
    article.titleOriginal,
    article.summaryKo,
    article.summaryOriginal,
    ...(article.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  // 라틴은 낱말 그대로, 한글은 두 글자 단위로. 조사와 어미를 넘어가기 위해서다.
  const latin = text.match(/[a-z][a-z0-9-]{2,}/g) ?? []
  const hangul = text.match(/[가-힣]{2,}/g) ?? []
  const bigrams = hangul.flatMap((word) =>
    Array.from({ length: word.length - 1 }, (_, index) => word.slice(index, index + 2)),
  )

  return new Set([...latin, ...bigrams])
}

/** 0..1. 겹치는 낱말 수를 두 집합의 크기로 정규화한 코사인에 가까운 값. */
function similarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0

  let shared = 0

  for (const token of a) if (b.has(token)) shared += 1

  return shared / Math.sqrt(a.size * b.size)
}

/**
 * 세 편을 고른다.
 *
 * 점수만으로 위에서 세 개를 자르면 축의 웃돈이 유사도를 눌러 버린다. 짧은
 * 제목 두 개가 겹치는 정도는 대개 작아서, 그대로 두면 «닮은 글»은 한 편도
 * 못 들어오고 반대쪽 축만 셋이 온다. 그래서 자리를 나눈다.
 *
 *   첫 자리   가장 닮은 글. 축이 어느 쪽이든 상관없다
 *   나머지    점수 순. 다만 출처는 서로 달라야 하고
 *             적어도 하나는 반대쪽 축에서 와야 한다
 *
 * 닮은 것 하나와 뜻밖의 것 하나가 같이 있어야 이어 읽기가 성립한다.
 */
export function relatedTo(article: Article, pool: Article[], count = 3): Article[] {
  const now = Date.now()
  const axis = axisOf(article.category)
  const source = tokensOf(article)

  const ranked = pool
    .filter((candidate) => candidate.id !== article.id)
    .map((candidate) => {
      const ageHours = Math.max(0, (now - Date.parse(candidate.publishedAt)) / 3_600_000)
      const recency = Math.pow(0.5, ageHours / HALF_LIFE_HOURS)
      const closeness = similarity(source, tokensOf(candidate))
      const opposite = axisOf(candidate.category) !== axis

      const score =
        WEIGHT.similarity * closeness +
        WEIGHT.oppositeAxis * (opposite ? 1 : 0) +
        WEIGHT.otherSource * (candidate.sourceName === article.sourceName ? 0 : 1) +
        WEIGHT.recency * recency

      return { candidate, closeness, score, opposite }
    })
    .sort((a, b) => b.score - a.score)

  if (ranked.length === 0) return []

  const picked: Article[] = []
  const usedSources = new Set<string>()

  const take = (entry: (typeof ranked)[number] | undefined) => {
    if (!entry) return
    if (picked.some((chosen) => chosen.id === entry.candidate.id)) return
    if (usedSources.has(entry.candidate.sourceName)) return

    picked.push(entry.candidate)
    usedSources.add(entry.candidate.sourceName)
  }

  // 첫 자리는 가장 닮은 글에게 준다. 겹치는 낱말이 하나도 없으면 그냥 점수 순으로 간다.
  const closest = [...ranked].sort((a, b) => b.closeness - a.closeness)[0]

  if (closest && closest.closeness > 0) take(closest)

  for (const entry of ranked) {
    if (picked.length >= count) break

    take(entry)
  }

  // 반대쪽 축이 하나도 없으면 마지막 자리를 그쪽에 내준다.
  if (!picked.some((entry) => axisOf(entry.category) !== axis)) {
    const crossing = ranked.find(
      (entry) => entry.opposite && !picked.some((chosen) => chosen.id === entry.candidate.id),
    )

    if (crossing && picked.length > 0) picked[picked.length - 1] = crossing.candidate
  }

  return picked
}
