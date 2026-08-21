import { BriefStory, FeatureStory, StandardStory } from './Story'
import type { Placed } from '../content/types'
import styles from './EditorialFeed.module.css'

/**
 * 편집 지면(§16).
 *
 * 메인은 RSS 목록이 아니라 «오늘 인터넷에서 발견한 MAMABOY다운 것들»의 지면이다.
 * 그래서 모든 기사를 같은 카드 크기로 출력하지 않는다.
 *
 * 어느 기사가 어떤 크기를 갖는지는 services/editorial이 이미 정해서 넘겨준다.
 * 이 컴포넌트가 하는 일은 그 가중치를 지면의 폭과 높이로 옮기는 것뿐이다.
 *
 *   FEATURE   판면 전체
 *   STANDARD  6칸 또는 5칸 — 순서에 따라 번갈아
 *   BRIEF     4칸 또는 3칸
 *
 * 여기에 항목마다 다른 «들림»(lift)을 주어 같은 행의 기사들이 같은 높이에서
 * 시작하지 않게 한다. 격자를 지키되 격자처럼 보이지 않게 하는 장치다.
 */

/** 순환하는 폭. 합이 12로 딱 떨어지지 않는 것이 이 지면의 여백을 만든다. */
const STANDARD_SPANS = [6, 5, 6, 4]
const BRIEF_SPANS = [4, 3]
const LIFTS = [0, 2, 0, 1, 3, 0]

type Props = {
  items: Placed[]
  /** 이 지면의 첫 이미지만 즉시 로드한다. 목록 안의 목록에서는 꺼 둔다. */
  priority?: boolean
}

export function EditorialFeed({ items, priority = true }: Props) {
  let standards = 0
  let briefs = 0

  return (
    <ul className={styles.feed} role="list">
      {items.map((item, index) => {
        const span =
          item.weight === 'feature'
            ? 12
            : item.weight === 'standard'
              ? (STANDARD_SPANS[standards++ % STANDARD_SPANS.length] ?? 6)
              : (BRIEF_SPANS[briefs++ % BRIEF_SPANS.length] ?? 4)

        return (
          <li
            key={item.article.id}
            className={styles.item}
            data-span={span}
            data-lift={LIFTS[index % LIFTS.length]}
          >
            {item.weight === 'feature' ? (
              <FeatureStory article={item.article} priority={priority && index === 0} />
            ) : item.weight === 'standard' ? (
              <StandardStory article={item.article} />
            ) : (
              <BriefStory article={item.article} />
            )}
          </li>
        )
      })}
    </ul>
  )
}
