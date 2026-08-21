import { useMemo } from 'react'

import { EditorialFeed } from '../components/EditorialFeed'
import { PrototypeNote } from '../components/PrototypeNote'
import { Wordmark } from '../components/Wordmark'
import { articles } from '../content/feed'
import { mamaboy } from '../content/site'
import { compose } from '../services/editorial'
import { formatDate } from '../services/time'
import styles from './Home.module.css'

/**
 * 첫 화면(§26).
 *
 * 매일 같은 브랜드 Hero를 보여주지 않는다. 이름과 오늘 날짜가 적힌 아주 얇은
 * 제호 아래에서 곧바로 그날의 FEATURE가 시작된다 — 첫 화면 자체가 최신 편집판이다.
 *
 * CARE와 CURIOSITY를 물리적으로 양분하지 않는다(§9). 레티놀 다음에 캐릭터
 * 완구가 오고 그다음에 수면이 오는 배열은 실수가 아니라 이 지면의 정체성이다.
 */
export function Home() {
  const items = useMemo(() => compose(articles), [])

  return (
    <div className="page">
      <section className={`shell ${styles.masthead}`}>
        <h1 className={styles.nameplate}>
          <Wordmark className={styles.mark} title={mamaboy.name} />
          <span className={styles.formula}>{mamaboy.formula}</span>
        </h1>

        <p className={`meta ${styles.edition}`}>
          <span className="label">{mamaboy.hero.editionLabel}</span>
          <time dateTime={new Date().toISOString().slice(0, 10)}>
            {formatDate(new Date().toISOString())}
          </time>
        </p>
      </section>

      <div className={`shell ${styles.notice}`}>
        <PrototypeNote />
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
