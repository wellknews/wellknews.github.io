/**
 * 중복 처리(§32).
 *
 * 여러 매체가 같은 연구나 같은 발표를 다룬다. 주소만 비교하면 걸러지지 않는다.
 * 그래서 세 가지를 함께 본다 — 정규화한 주소, 정규화한 제목, 그리고 제목 낱말의
 * 겹침 정도.
 *
 * 같은 사건을 다뤘더라도 독립적인 분석 가치가 있으면 남긴다. 완전히 같은 보도만
 * 통합하고, 남길 하나는 «먼저 낸 쪽»이 아니라 «성격이 더 분명한 쪽»으로 고른다.
 */

const TYPE_RANK = { research: 5, expert: 4, news: 3, opinion: 2, product: 1 }
const STOPWORDS = new Set([
  'the',
  'a',
  'an',
  'of',
  'to',
  'in',
  'on',
  'for',
  'and',
  'is',
  'are',
  'with',
  'that',
  'this',
  'your',
  'you',
])

function tokens(title) {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 1 && !STOPWORDS.has(word)),
  )
}

function jaccard(a, b) {
  if (a.size === 0 || b.size === 0) return 0

  let shared = 0

  for (const token of a) if (b.has(token)) shared += 1

  return shared / (a.size + b.size - shared)
}

/** 겹치는 정도가 이보다 높고 발행 시각이 가까우면 같은 보도로 본다. */
const SIMILARITY = 0.72
const WINDOW_HOURS = 72

export function deduplicate(articles) {
  const kept = []

  for (const article of articles) {
    const signature = tokens(article.titleOriginal)
    const at = Date.parse(article.publishedAt)

    const twinIndex = kept.findIndex((existing) => {
      if (existing.originalUrl === article.originalUrl) return true

      const apart = Math.abs(Date.parse(existing.publishedAt) - at) / 3_600_000

      if (apart > WINDOW_HOURS) return false

      return jaccard(existing.signature, signature) >= SIMILARITY
    })

    if (twinIndex === -1) {
      kept.push({ ...article, signature })
      continue
    }

    const twin = kept[twinIndex]
    const challengerRank = TYPE_RANK[article.contentType] ?? 0
    const holderRank = TYPE_RANK[twin.contentType] ?? 0

    // 성격이 더 분명한 쪽을 남긴다. 같으면 이미지가 있는 쪽, 그다음은 먼저 나온 쪽.
    const better =
      challengerRank > holderRank ||
      (challengerRank === holderRank && Boolean(article.image) && !twin.image)

    if (better) kept[twinIndex] = { ...article, signature }
  }

  return kept.map(({ signature: _signature, ...article }) => article)
}
