/**
 * 검색(§31).
 *
 * RSS가 쌓이면 검색이 중요한 기능이 된다. 대상은 번역 제목·원문 제목·요약·
 * 카테고리·출처·키워드다. 지금은 데이터가 전부 클라이언트에 있으므로 서버를
 * 두지 않는다 — 나중에 규모가 커지면 이 함수의 구현만 바꾼다.
 */
import { mamaboy } from '../content/site'
import type { Article } from '../content/types'

function haystack(article: Article): string {
  return [
    article.titleKo,
    article.titleOriginal,
    article.summaryKo,
    article.summaryOriginal,
    article.sourceName,
    mamaboy.categories[article.category].label,
    mamaboy.categories[article.category].title,
    ...(article.keywords ?? []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

/** 공백으로 끊은 모든 낱말이 들어 있어야 걸린다. 짧은 질의에 결과가 쏟아지는 것을 막는다. */
export function search(articles: Article[], query: string): Article[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)

  if (terms.length === 0) return []

  return articles.filter((article) => {
    const text = haystack(article)

    return terms.every((term) => text.includes(term))
  })
}
