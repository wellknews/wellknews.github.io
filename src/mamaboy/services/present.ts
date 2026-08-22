/**
 * 화면에 무엇을 보여줄지 고르는 규칙.
 *
 * 원문과 번역은 데이터에서 끝까지 분리되어 있다(§12). 번역 결과로 원문을
 * 덮어쓰지 않으므로, 어느 쪽을 보여줄지는 그릴 때마다 여기서 정한다.
 */
import type { Article } from '../content/types'

export type Reading = {
  text: string
  /** 낭독과 검색이 언어를 알아야 한다. 번역문은 ko, 그 밖에는 원문의 언어. */
  lang: string
  translated: boolean
}

/** 한국어 독자가 먼저 읽을 제목. 번역이 없으면 원문 그대로 보여준다. */
export function title(article: Article): Reading {
  if (article.titleKo) {
    return { text: article.titleKo, lang: 'ko', translated: article.language !== 'ko' }
  }

  return { text: article.titleOriginal, lang: article.language, translated: false }
}

/**
 * 카드와 읽기 화면이 함께 쓰는 요약(§15).
 *
 * link 정책의 글에는 요약이 없다. 화면에는 «제목과 출처만 옮긴다»고 적어 두고
 * 실제로는 그 매체의 요약문을 그대로 실으면, 적어 둔 말이 거짓이 된다. 무엇을
 * 실을 수 있는지는 수집 단계에서 정해지고, 그 값을 지키는 자리는 여기 하나뿐이라
 * 카드와 본문이 서로 다르게 판단할 여지도 없앤다.
 */
export function summary(article: Article): Reading | null {
  if (article.contentPolicy === 'link') return null

  if (article.summaryKo) {
    return { text: article.summaryKo, lang: 'ko', translated: article.language !== 'ko' }
  }

  if (article.summaryOriginal) {
    return { text: article.summaryOriginal, lang: article.language, translated: false }
  }

  return null
}

/** 전문을 실을 수 있는 글(TYPE A)의 본문. 없으면 빈 배열이다(§15). */
export function body(article: Article): { paragraphs: string[]; lang: string } | null {
  if (article.contentPolicy !== 'full') return null

  if (article.bodyKo?.length) return { paragraphs: article.bodyKo, lang: 'ko' }
  if (article.bodyOriginal?.length) {
    return { paragraphs: article.bodyOriginal, lang: article.language }
  }

  return null
}

/** 건강 정보인지. SKIN·BODY·AGE에는 한 줄의 주의를 남긴다(§33). */
export function isHealth(article: Article): boolean {
  return article.category === 'skin' || article.category === 'body' || article.category === 'age'
}
