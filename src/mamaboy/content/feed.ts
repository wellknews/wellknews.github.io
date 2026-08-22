/**
 * 이 지면이 읽는 유일한 입구.
 *
 * 프론트엔드는 RSS에 직접 접근하지 않는다(§35). 수집·정규화·번역은 전부 빌드
 * 바깥의 파이프라인이 끝내 두고, 여기서는 그 결과 파일 하나만 읽는다.
 *
 *   scripts/mamaboy/build-feed.mjs  →  content/generated/feed.json  →  이 파일
 *
 * 아직 그 파일이 없으면 예시 데이터(seed)로 지면을 그린다. 다만 그것이 허용되는
 * 것은 소스를 하나도 켜지 않은 «검증 단계»까지다. 소스를 켠 뒤에 생성물이 없다는
 * 것은 파이프라인이 실패했다는 뜻이고, 그 자리에 지어낸 기사를 세우면 사고를
 * 감추는 것이 된다(아래 seedAllowed).
 */
import { enabledSources } from '../data/sources'
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

/** 아무것도 고르지 못한 지면. 화면은 이 상태를 숨기지 않고 그대로 말한다. */
const EMPTY: Feed = { generatedAt: new Date(0).toISOString(), prototype: false, articles: [] }

/**
 * 예시 데이터를 써도 되는 때인지.
 *
 * 소스가 하나도 켜져 있지 않다면 아직 지면을 검증하는 단계이고, 그때의 예시
 * 데이터는 PROTOTYPE 표시와 함께 정직하게 쓰인다. 반대로 소스를 하나라도 켠
 * 뒤에 생성물이 없다는 것은 파이프라인이 실패했다는 뜻이다 — 그 자리에 지어낸
 * 기사를 대신 세우면 사고를 감추는 것이 된다. 그때는 비어 있다고 말한다.
 *
 * 개발 중에는 언제나 예시 데이터를 쓴다. 화면을 고치는 사람이 매번 수집기를
 * 돌려야 한다면 그것대로 잘못된 구조다.
 */
const seedAllowed = import.meta.env.DEV || enabledSources.length === 0

function pick(): Feed {
  const candidate = Object.values(generated)[0]

  // 파이프라인이 한 번도 돌지 않았거나, 돌았지만 한 건도 통과하지 못한 경우.
  if (candidate && Array.isArray(candidate.articles) && candidate.articles.length > 0) {
    return candidate
  }

  return seedAllowed ? seedFeed : EMPTY
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
