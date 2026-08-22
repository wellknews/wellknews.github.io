import type { ReactNode } from 'react'

import { mamaboy } from '../content/site'
import { Link, path } from '../router'
import type { Category } from '../content/types'
import styles from './CategorySection.module.css'

type Props = {
  category: Category
  children: ReactNode
}

/**
 * 한 카테고리가 앉는 면(§2).
 *
 * 이 지면의 문제는 각 요소의 완성도가 아니라 «어디서 어디까지가 한 묶음인지»가
 * 보이지 않는 것이었다. 기사를 하나씩 카드로 만들면 그 문제는 풀리지만 이곳의
 * 비정형 조판이 함께 죽는다. 그래서 카드로 쪼개는 대신 카테고리 전체를 종이 한
 * 장으로 묶는다 — 바깥은 즉시 이해되고, 안쪽은 그대로 자유롭다.
 *
 * 색은 카테고리마다 다르지만 «이 블럭은 파란색»이라고 느낄 정도가 아니다.
 * 크림에서 아주 조금씩 기울 뿐이고, 스크롤하는 동안 공기가 바뀌는 정도로만
 * 읽혀야 한다. 강한 고유색을 주면 포털의 카테고리 UI가 된다.
 *
 * 그림자도 카드처럼 떠 보이면 안 된다. 종이 위에 다른 질감의 종이가 한 장
 * 얹힌 정도다.
 */
export function CategorySection({ category, children }: Props) {
  const meta = mamaboy.categories[category]

  return (
    <section
      className={styles.surface}
      data-category={category}
      aria-labelledby={`section-${category}`}
    >
      <div className={styles.inner}>
        <h2 className={styles.head} id={`section-${category}`}>
          <Link to={path.category(category)} className={`label ${styles.link}`}>
            {meta.label}
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </Link>
        </h2>

        {children}
      </div>
    </section>
  )
}
