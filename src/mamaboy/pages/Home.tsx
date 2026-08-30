import { useMemo } from 'react'

import { CategorySection } from '../components/CategorySection'
import { EditorialFeed } from '../components/EditorialFeed'
import { FacingCheck } from '../components/FacingCheck'
import { FloatingGel } from '../components/FloatingGel'
import { PrototypeNote } from '../components/PrototypeNote'
import { articles } from '../content/feed'
import { mamaboy } from '../content/site'
import { Link, path } from '../router'
import { compose } from '../services/editorial'
import { formatDate } from '../services/time'
import type { Category, Placed } from '../content/types'
import styles from './Home.module.css'

/**
 * 첫 화면(§26).
 *
 * 구조는 즉시 이해되고, 안쪽은 자유롭다.
 *
 * 전에는 다섯 카테고리의 기사를 하나의 긴 흐름으로 섞었다. 섞는다는 철학은
 * 맞았지만 처음 온 사람에게는 «어디서 어디까지가 무엇인지»가 보이지 않았다.
 * 이제 카테고리마다 종이 한 장을 깔고, 그 안쪽에서만 기존의 비정형 조판을
 * 그대로 쓴다.
 *
 * CARE와 CURIOSITY를 위아래로 가르지 않는다는 원칙은 그대로다(§9). 다만 기사
 * 하나하나를 섞는 대신 «면의 순서»로 섞는다 — SKIN 다음에 PLAY가 오고 그다음에
 * BODY가 온다. 두 축이 교차하되 지금 보고 있는 것이 무엇인지는 분명하다.
 *
 * 브랜드 이름은 헤더에 한 번만 나온다. 같은 화면에서 제호를 한 번 더 세우면
 * 그만큼 기사가 늦게 시작된다.
 */

/** 면의 순서. care와 curiosity가 번갈아 오도록 짠다(§15). */
const ORDER: Category[] = ['skin', 'play', 'body', 'culture', 'age']

/**
 * 카테고리마다 다른 리듬(§17).
 *
 * 면이 구분을 맡아 주므로 안쪽까지 같은 모양일 이유가 없다. 오히려 다 같으면
 * 다섯 번 반복되는 표가 된다. 몇 개를 크게 열지, 몇 편까지 실을지를 카테고리마다
 * 다르게 둔다.
 */
const RHYTHM: Record<Category, { features: number; limit: number; offset: number }> = {
  skin: { features: 1, limit: 7, offset: 0 },
  play: { features: 1, limit: 9, offset: 2 },
  body: { features: 1, limit: 6, offset: 1 },
  culture: { features: 2, limit: 11, offset: 3 },
  age: { features: 2, limit: 11, offset: 4 },
}

export function Home() {
  const sections = useMemo(() => {
    const out: { category: Category; items: Placed[]; offset: number }[] = []

    for (const category of ORDER) {
      const rhythm = RHYTHM[category]
      const items = compose(
        articles.filter((article) => article.category === category),
        { features: rhythm.features },
      ).slice(0, rhythm.limit)

      if (items.length > 0) out.push({ category, items, offset: rhythm.offset })
    }

    return out
  }, [])

  const today = new Date().toISOString()

  return (
    <div className={`page ${styles.page}`}>
      <FacingCheck />

      <FloatingGel />

      <section className={`shell ${styles.masthead}`}>
        <h1 className="visually-hidden">{mamaboy.hero.documentTitle}</h1>

        <p className={`meta ${styles.edition}`}>
          <span className="label">{mamaboy.hero.editionLabel}</span>
          <time dateTime={today.slice(0, 10)}>{formatDate(today)}</time>
        </p>
      </section>

      <div className={`shell ${styles.notice}`}>
        <PrototypeNote />
      </div>

      <div className={`shell ${styles.sections}`}>
        {sections.length > 0 ? (
          sections.map(({ category, items, offset }, index) => (
            <CategorySection key={category} category={category}>
              <EditorialFeed
                items={items}
                priority={index === 0}
                offset={offset}
                showCategory={false}
              />
            </CategorySection>
          ))
        ) : (
          <p className={styles.empty}>{mamaboy.feed.empty}</p>
        )}
      </div>

      {/*
        면마다 이미 그 카테고리로 가는 길이 있으므로, 아래에는 전체로 가는 문
        하나만 둔다(§18). 같은 목록을 두 번 두면 둘 다 약해진다.
      */}
      <div className={`shell ${styles.archive}`}>
        <Link to={path.sources} className={`label pressable ${styles.archiveLink}`}>
          {mamaboy.feed.origin}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  )
}
