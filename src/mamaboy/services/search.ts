/**
 * 검색(§31).
 *
 * RSS가 쌓이면 검색이 중요한 기능이 된다. 대상은 번역 제목·원문 제목·요약·
 * 카테고리·출처·키워드다. 지금은 데이터가 전부 클라이언트에 있으므로 서버를
 * 두지 않는다 — 나중에 규모가 커지면 이 파일의 구현만 바꾼다.
 *
 * 걸리는 것을 모으는 일과 그중 무엇을 위에 두는 일은 다르다. 걸린 순서대로
 * 늘어놓으면 «비타민»으로 검색했을 때 제목이 «비타민»인 글과 요약 끝에 그
 * 낱말이 한 번 스친 글이 같은 자리에 선다. 그래서 어디에서 걸렸는지에 따라
 * 무게를 다르게 주고, 같은 무게면 최근 것을 위에 둔다.
 */
import { mamaboy } from '../content/site'
import type { Article, Category } from '../content/types'

/**
 * 어디에서 걸렸는가에 따른 무게.
 *
 * 제목이 가장 무겁다 — 제목에 있는 낱말은 그 글이 무엇에 관한 글인지를 말한다.
 * 요약이 가장 가볍다. 요약은 길고, 길면 우연히 걸린다.
 */
const FIELD_WEIGHT = {
  title: 5,
  keyword: 3,
  source: 2.5,
  category: 2.5,
  summary: 1.5,
} as const

type Field = keyof typeof FIELD_WEIGHT
type Fields = Record<Field, string>

const FIELDS = Object.keys(FIELD_WEIGHT) as Field[]

/** 낱말의 첫머리에서 걸렸을 때의 배수. «케어»는 «스킨케어»보다 «케어 루틴»에 가깝다. */
const AT_WORD_START = 1.6

/** 최신 글에 주는 최대 가산. 관련도를 뒤집지 않을 만큼만 준다. */
const RECENCY_BONUS = 0.12
const RECENCY_DAYS = 30

const LETTER = /[\p{L}\p{N}]/u

function fieldsOf(article: Article): Fields {
  const category = mamaboy.categories[article.category]

  return {
    title: [article.titleKo, article.titleOriginal].filter(Boolean).join(' ').toLowerCase(),
    keyword: (article.keywords ?? []).join(' ').toLowerCase(),
    source: article.sourceName.toLowerCase(),
    category: `${category.label} ${category.title}`.toLowerCase(),
    summary: [article.summaryKo, article.summaryOriginal].filter(Boolean).join(' ').toLowerCase(),
  }
}

/** 0이면 없다. 1이면 안쪽에서 걸렸다. 1.6이면 낱말의 첫머리에서 걸렸다. */
function hit(text: string, term: string): number {
  const at = text.indexOf(term)

  if (at < 0) return 0

  const before = at === 0 ? undefined : text[at - 1]

  return before === undefined || !LETTER.test(before) ? AT_WORD_START : 1
}

function freshness(article: Article, now: number): number {
  const days = (now - Date.parse(article.publishedAt)) / 86_400_000

  if (!Number.isFinite(days)) return 0

  return Math.min(Math.max(1 - days / RECENCY_DAYS, 0), 1)
}

/**
 * 한 기사의 점수. 모든 낱말이 어딘가에서 걸려야 하고, 하나라도 없으면 0이다.
 *
 * 낱말마다 가장 무거운 자리 하나만 센다. 합을 내면 요약이 긴 글이 제목이 정확한
 * 글을 이긴다 — 길이가 관련도가 되어서는 안 된다.
 */
function scoreOf(fields: Fields, words: string[]): number {
  let total = 0

  for (const term of words) {
    let best = 0

    for (const field of FIELDS) {
      const factor = hit(fields[field], term)

      if (factor > 0) best = Math.max(best, FIELD_WEIGHT[field] * factor)
    }

    if (best === 0) return 0

    total += best
  }

  return total
}

/** 검색 결과를 좁히는 조건. 아무것도 고르지 않은 상태를 undefined로 두지 않는다. */
export type SearchFilter = {
  category: Category | null
  source: string | null
}

export const NO_FILTER: SearchFilter = { category: null, source: null }

function passes(article: Article, filter: SearchFilter): boolean {
  if (filter.category && article.category !== filter.category) return false
  if (filter.source && article.sourceName !== filter.source) return false

  return true
}

export function terms(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean)
}

/** 고른 조건으로 좁힌다. 검색과 나눠 둔다 — 좁히기는 점수를 다시 매기지 않는다. */
export function narrow(articles: Article[], filter: SearchFilter): Article[] {
  if (!filter.category && !filter.source) return articles

  return articles.filter((article) => passes(article, filter))
}

/** 공백으로 끊은 모든 낱말이 들어 있어야 걸린다. 짧은 질의에 결과가 쏟아지는 것을 막는다. */
export function search(articles: Article[], query: string, now: number = Date.now()): Article[] {
  const words = terms(query)

  if (words.length === 0) return []

  const scored: { article: Article; score: number }[] = []

  for (const article of articles) {
    const score = scoreOf(fieldsOf(article), words)

    if (score === 0) continue

    scored.push({ article, score: score * (1 + RECENCY_BONUS * freshness(article, now)) })
  }

  return scored.sort((a, b) => b.score - a.score).map((entry) => entry.article)
}

export type Facet = {
  /** 좁히는 데 쓰는 값. 카테고리면 Category, 출처면 출처 이름 그대로. */
  value: string
  label: string
  count: number
}

/**
 * 결과를 어떻게 더 좁힐 수 있는지(§31).
 *
 * 세는 대상은 «지금 걸린 것 전부»다. 이미 고른 조건을 빼고 다시 세면 숫자가
 * 누를 때마다 흔들려서, 무엇을 누르면 무엇이 남는지 읽을 수 없게 된다.
 */
export function facets(matches: Article[]): { categories: Facet[]; sources: Facet[] } {
  const categories = new Map<string, number>()
  const sources = new Map<string, number>()

  for (const article of matches) {
    categories.set(article.category, (categories.get(article.category) ?? 0) + 1)
    sources.set(article.sourceName, (sources.get(article.sourceName) ?? 0) + 1)
  }

  const byCount = (a: Facet, b: Facet) => b.count - a.count || a.label.localeCompare(b.label)

  return {
    categories: [...categories]
      .map(([value, count]) => ({
        value,
        label: mamaboy.categories[value as Category].label,
        count,
      }))
      .sort(byCount),
    sources: [...sources].map(([value, count]) => ({ value, label: value, count })).sort(byCount),
  }
}
