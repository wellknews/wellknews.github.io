/**
 * MAMABOY가 다루는 유일한 데이터 형태.
 *
 * 소스마다 adapter를 만들지 않는다. RSS 2.0이든 Atom이든 수집 단계에서 이 하나의
 * 형태로 정규화하고, 화면은 여기 들어온 것만 그린다(§11).
 *
 * 개발 계획서의 Article Schema는 snake_case로 적혀 있지만, 저장소의 TypeScript
 * 관례를 따라 camelCase로 옮겼다. 파이프라인이 내보내는 JSON도 같은 이름을 쓴다.
 */

/** 1차 분류. 이 다섯 개 밖의 값은 만들지 않는다(§8). */
export type Category = 'skin' | 'body' | 'age' | 'play' | 'culture'

/**
 * 다섯 카테고리 위에 있는 두 개의 축(§9).
 *
 * 화면에서 CARE와 CURIOSITY를 양분하지 않는다. 이 값은 지면을 나누는 데 쓰는
 * 것이 아니라, 섞을 때 한쪽으로 쏠리지 않게 하는 기준으로 쓴다.
 */
export type Axis = 'care' | 'curiosity'

/**
 * 그 카테고리가 지면에서 강조하는 소재(§12).
 *
 *   clean   종이가 맑아진다 — SKIN · BODY
 *   chrome  차가운 빛이 스친다 — AGE
 *   gel     젤이 번진다 — PLAY · CULTURE
 *
 * 소재를 카테고리마다 새로 만들지 않는다. 팔레트도 물성도 하나이고,
 * 여기서 정하는 것은 그 하나를 얼마나 세게 쓰는가뿐이다.
 */
export type Material = 'clean' | 'chrome' | 'gel'

/**
 * 콘텐츠의 성격(§33).
 *
 * 건강 관련 정보가 들어오므로 연구 결과와 개인의 경험담을 같은 무게로 보여주지
 * 않는다. 화면에서 이 값을 숨기지 않는 이유다.
 */
export type ContentType = 'research' | 'expert' | 'news' | 'opinion' | 'product'

/**
 * 원문을 어디까지 이 지면에 실을 수 있는지(§15).
 *
 *   full     TYPE A — 재사용이 허용된 전문
 *   summary  TYPE B — 제목 + 요약 + 대표 이미지 + 원문 링크
 *   link     TYPE C — 제목과 최소 메타데이터, 그리고 원 사이트로 가는 링크
 *
 * RSS가 전문을 준다고 해서 전문 재게시를 기본값으로 삼지 않는다. 값을 모르면
 * 가장 좁은 쪽(link)으로 둔다.
 */
export type ContentPolicy = 'full' | 'summary' | 'link'

/**
 * 번역 상태(§13, §14).
 *
 *   none    한국어 원문이라 번역이 필요 없다
 *   done    번역이 있다 — 화면에 반드시 그 사실을 표시한다
 *   pending 번역 대상이지만 아직 번역되지 않았다
 *   failed  번역을 시도했고 실패했다. 원문을 그대로 보여준다
 *
 * 어느 경우에도 원문 데이터를 번역 결과로 덮어쓰지 않는다.
 */
export type TranslationStatus = 'none' | 'done' | 'pending' | 'failed'

/**
 * 편집 가중치. 지면에서 이 기사가 차지하는 크기.
 *
 *   feature   그날의 지면을 여는 기사
 *   standard  일반 기사
 *   brief     짧게 확인할 만한 글. 이미지가 없어도 된다
 *   drop      MAMABOY의 기준에 맞지 않아 지면에 올리지 않는 글
 *
 * drop이 있어야 이곳이 RSS Aggregator에서 벗어난다. 수집한 것을 전부 보여주는
 * 것은 편집이 아니다 — 무엇을 버렸는지가 무엇을 골랐는지를 만든다.
 */
export type Weight = 'feature' | 'standard' | 'brief' | 'drop'

/** RSS의 대표 이미지. 언제든 깨질 수 있다고 가정한다(§37). */
export type ArticleImage = {
  url: string
  /** 미리 알 수 있으면 적는다. layout shift를 막는 유일한 방법이다(§36). */
  width?: number
  height?: number
  /** 원문이 준 설명. 없으면 장식으로 취급해 빈 alt로 둔다. */
  alt?: string
}

/**
 * 본문을 이루는 한 조각(§15).
 *
 * 외부 HTML을 그대로 주입하지 않는다. 수집 단계에서 태그를 벗기고 이 둘 중
 * 하나로만 남긴다 — 평문 한 덩어리이거나, 그림 한 장이거나.
 */
export type BodyBlock =
  | { kind: 'text'; text: string }
  | { kind: 'image'; url: string; alt?: string }

export type Article = {
  /** 소스와 원문 주소로 만든 안정적인 식별자. 다시 수집해도 같은 값이 나온다. */
  id: string
  /** 주소에 쓰이는 이름. /mamaboy/article/{slug} */
  slug: string

  /** 원문 제목. 번역이 있어도 이 값은 그대로 남는다. */
  titleOriginal: string
  titleKo?: string
  summaryOriginal?: string
  summaryKo?: string

  /**
   * 전문 게재가 허용된 글(TYPE A)의 본문.
   *
   * 글과 그림이 원문에 있던 순서 그대로 섞여 들어온다. 요약만 옮기면 읽을
   * 것이 남지 않고, 문단만 옮기면 원문에서 글 사이에 있던 그림이 통째로
   * 사라진다 — 사진이 논지의 일부인 글에서는 그것이 본문의 손실이다.
   */
  bodyOriginal?: BodyBlock[]
  /**
   * 번역된 글 블록만, 원문에 나온 순서대로.
   *
   * 그림은 번역할 것이 없으므로 여기 담지 않는다. 화면은 bodyOriginal을 걸어
   * 가면서 n번째 글 블록을 이 배열의 n번째로 갈아 끼운다. 그래야 번역이
   * 실패하거나 일부만 되어도 그림의 자리가 흔들리지 않는다.
   */
  bodyKo?: string[]

  sourceName: string
  sourceUrl: string
  originalUrl: string
  author?: string

  /** ISO 8601 */
  publishedAt: string
  fetchedAt: string

  /** BCP-47의 언어 부분. 'ko', 'en', 'ja' … */
  language: string

  category: Category
  /** 이 글을 낸 소스의 신뢰도(1..5). 수집 단계에서 레지스트리를 보고 붙인다. */
  trustLevel?: number
  /** 0..1. 자기 자신을 더 오래 건강하게 유지하는 데 의미 있는가(§10). */
  careScore: number
  /** 0..1. 새로운 관심·놀이·문화·취향을 발견하게 하는가(§10). */
  curiosityScore: number
  /** 검색과 중복 판정이 함께 쓰는 낱말들. */
  keywords?: string[]

  image?: ArticleImage
  translationStatus: TranslationStatus
  contentType: ContentType
  contentPolicy: ContentPolicy
}

/**
 * 파이프라인이 내보내는 문서 하나.
 *
 * prototype이 true면 아직 실제 RSS가 아니라 지면을 검증하기 위한 가짜 데이터다.
 * 그 사실을 화면에서 숨기지 않는다 — 없는 출처를 진짜처럼 보이게 두지 않는다.
 */
export type Feed = {
  generatedAt: string
  prototype: boolean
  articles: Article[]
}

/** 지면에 앉을 자리까지 정해진 기사. editorial 서비스가 만든다. */
export type Placed = {
  article: Article
  weight: Weight
  axis: Axis
}
