/**
 * 이 지면이 읽는 유일한 입구.
 *
 * 프론트엔드는 RSS에 직접 접근하지 않는다(§35). 수집·정규화·번역은 전부 빌드
 * 바깥의 파이프라인이 끝내 두고, 여기서는 그 결과 파일 하나만 읽는다.
 *
 *   scripts/mamaboy/build-feed.mjs  →  content/generated/feed.json  →  이 파일
 *
 * 아직 그 파일이 없으면 예시 데이터(seed)로 지면을 그린다. 파이프라인이 붙기
 * 전에도 디자인을 끝까지 검증할 수 있어야 하기 때문이다. 두 경우를 구분해 두는
 * 이유는 하나뿐이다 — 예시 데이터일 때 그 사실을 화면에 표시하기 위해서다.
 */
import { seedFeed } from './seed'
import type { Article, Category, Feed } from './types'

/*
 * 생성물이 없을 수도 있는 파일을 정적으로 import하면 빌드가 깨진다.
 * glob은 맞는 파일이 없으면 빈 객체가 되므로, 있으면 쓰고 없으면 넘어간다.
 */
const generated = import.meta.glob<Feed>('./generated/feed.json', {
  eager: true,
  import: 'default',
})

function pick(): Feed {
  const candidate = Object.values(generated)[0]

  // 파이프라인이 한 번도 돌지 않았거나, 돌았지만 한 건도 통과하지 못한 경우.
  if (!candidate || !Array.isArray(candidate.articles) || candidate.articles.length === 0) {
    return seedFeed
  }

  return candidate
}

export const feed = pick()

/** 최신순. 지면의 모든 화면이 이 순서에서 출발한다. */
export const articles: Article[] = [...feed.articles].sort(
  (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt),
)

export function articlesIn(category: Category): Article[] {
  return articles.filter((article) => article.category === category)
}

export function findArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}
