import { useMemo } from 'react'

import { CategoryIndex } from '../components/CategoryIndex'
import { EditorialFeed } from '../components/EditorialFeed'
import { articlesIn } from '../content/feed'
import { mamaboy } from '../content/site'
import { compose } from '../services/editorial'
import type { Category } from '../content/types'
import styles from './Page.module.css'

/**
 * 카테고리 화면.
 *
 * 다섯 개의 분류는 지면을 나누는 벽이 아니라 좁혀 보는 방법이다. 그래서 여기서도
 * 배치는 홈과 같은 편집 지면이고, 달라지는 것은 지면 전체의 색 온도뿐이다(§39).
 * 색 온도는 App이 라우트를 보고 바꾼다.
 */
export function CategoryPage({ category }: { category: Category }) {
  const meta = mamaboy.categories[category]
  const items = useMemo(() => compose(articlesIn(category), { features: 1 }), [category])

  return (
    <div className="page">
      <header className={`shell ${styles.head}`}>
        <p className={`label ${styles.label}`}>{meta.label}</p>
        <h1 className={styles.title}>{meta.title}</h1>
        <p className={styles.definition}>{meta.definition}</p>
      </header>

      <div className={`shell ${styles.index}`}>
        <CategoryIndex current={category} />
      </div>

      <div className="shell">
        {items.length > 0 ? (
          <EditorialFeed items={items} />
        ) : (
          <p className={styles.empty}>{mamaboy.feed.empty}</p>
        )}
      </div>
    </div>
  )
}
