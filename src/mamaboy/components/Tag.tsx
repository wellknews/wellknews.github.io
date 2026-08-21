import { mamaboy } from '../content/site'
import type { Category, ContentType } from '../content/types'
import styles from './Tag.module.css'

/**
 * 카테고리 표시.
 *
 * 기사 카드에 반드시 있는 세 가지 중 하나다 — CATEGORY / TITLE / SOURCE·TIME(§27).
 * 색을 칠한 알약으로 만들지 않는다. 다섯 개의 카테고리에 다섯 개의 색을 주면
 * 지면이 색으로 분류되고, 이 매거진이 섞으려던 것이 다시 갈라진다.
 * 대신 축(CARE/CURIOSITY)에 따라 앞의 점 하나만 색 온도를 바꾼다.
 */
export function CategoryTag({ category }: { category: Category }) {
  const { label, axis } = mamaboy.categories[category]

  return (
    <span className={`label ${styles.category}`} data-axis={axis}>
      {label}
    </span>
  )
}

/**
 * 콘텐츠의 성격(§33).
 *
 * 건강 관련 정보에서 연구 결과와 개인의 경험담이 같은 무게로 보이면 안 된다.
 * 다만 모든 카드에 붙이면 라벨이 두 개씩 달려 제목이 뒤로 밀리므로,
 * 판단의 근거가 되는 성격에만 붙인다.
 */
export function ContentTypeTag({ type }: { type: ContentType }) {
  if (type === 'news' || type === 'opinion') return null

  return <span className={`label ${styles.type}`}>{mamaboy.contentTypes[type].label}</span>
}
