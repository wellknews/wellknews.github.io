import type { CSSProperties } from 'react'

import { GelObject } from './GelObject'
import { BriefStory, FeatureStory, StandardStory } from './Story'
import type { Placed } from '../content/types'
import styles from './EditorialFeed.module.css'

/**
 * 편집 지면.
 *
 * 메인은 RSS 목록이 아니라 «오늘 인터넷에서 발견한 MAMABOY다운 것들»의 지면이다.
 * 그래서 모든 기사를 같은 폭의 카드로 늘어놓지 않는다.
 *
 * 어느 기사가 어떤 무게를 갖는지는 services/editorial이 이미 정해서 넘겨준다.
 * 이 컴포넌트가 하는 일은 그 무게를 판면 위의 «자리»로 옮기는 것뿐이다.
 *
 * 자리는 무작위가 아니라 두 개의 순환하는 표에서 나온다. 열 시작점이 서로 달라서
 * STANDARD가 왼쪽에서 시작하면 BRIEF가 오른쪽 끝에 붙고, 다음 STANDARD는 한
 * 칸 안으로 들여 앉는다. 격자를 지키면서 격자로 보이지 않게 하는 장치다.
 */

type Slot = { col: number; span: number; composition?: 'stacked' | 'side'; lift?: number }

const STANDARD_SLOTS: Slot[] = [
  { col: 1, span: 7, composition: 'side' },
  { col: 9, span: 4, composition: 'stacked', lift: 2 },
  { col: 3, span: 5, composition: 'stacked' },
  { col: 8, span: 5, composition: 'stacked', lift: 1 },
  { col: 1, span: 5, composition: 'stacked', lift: 2 },
  { col: 7, span: 6, composition: 'side' },
]

const BRIEF_SLOTS: Slot[] = [
  { col: 9, span: 4 },
  { col: 1, span: 4, lift: 1 },
  { col: 6, span: 4 },
  { col: 2, span: 4, lift: 2 },
]

/**
 * 젤 오브젝트가 앉는 자리(§21).
 *
 * 빈 공간을 전부 오브젝트로 채우지 않는다. 지면이 한 번 숨을 쉬는 자리에만
 * 하나씩 놓아 시선을 돌리고, 그 다음 기사가 다시 시작되게 한다.
 */
const OBJECTS: (Slot & { shape: 'sphere' | 'capsule' | 'blob'; size: 'sm' | 'md' | 'lg' })[] = [
  { col: 10, span: 3, shape: 'sphere', size: 'md' },
  { col: 2, span: 3, shape: 'capsule', size: 'sm' },
]

/** 오브젝트가 끼어드는 지점. 지면의 앞쪽과 중간에 하나씩. */
const OBJECT_AT = [3, 9]

type Props = {
  items: Placed[]
  /** 이 지면의 첫 이미지만 즉시 로드한다. 목록 안의 목록에서는 꺼 둔다. */
  priority?: boolean
}

function slotStyle(slot: Slot): CSSProperties {
  return { '--col': slot.col, '--span': slot.span } as CSSProperties
}

/**
 * 좁은 판면에서 쓸 폭의 종류.
 *
 * 열 시작점은 여섯 칸짜리 격자에서 다시 계산할 수 없다. 그래서 태블릿에서는
 * 자리를 버리고 «넓은 것과 좁은 것» 두 가지로만 접는다.
 */
function widthOf(slot: Slot): 'wide' | 'narrow' {
  return slot.span >= 5 ? 'wide' : 'narrow'
}

export function EditorialFeed({ items, priority = true }: Props) {
  let standards = 0
  let briefs = 0
  let objects = 0

  const rendered = items.flatMap((item, index) => {
    const nodes = []

    if (OBJECT_AT.includes(index) && objects < OBJECTS.length) {
      const object = OBJECTS[objects++]

      if (object) {
        nodes.push(
          <li
            key={`object-${index}`}
            className={styles.object}
            style={slotStyle(object)}
            data-lift={object.lift ?? 0}
            data-object={objects - 1}
          >
            <GelObject shape={object.shape} size={object.size} />
          </li>,
        )
      }
    }

    if (item.weight === 'feature') {
      nodes.push(
        <li key={item.article.id} className={styles.item} data-weight="feature">
          <FeatureStory article={item.article} priority={priority && index === 0} />
        </li>,
      )

      return nodes
    }

    if (item.weight === 'standard') {
      const slot = STANDARD_SLOTS[standards++ % STANDARD_SLOTS.length] ?? { col: 1, span: 6 }

      nodes.push(
        <li
          key={item.article.id}
          className={styles.item}
          style={slotStyle(slot)}
          data-lift={slot.lift ?? 0}
          data-width={widthOf(slot)}
        >
          <StandardStory article={item.article} composition={slot.composition ?? 'stacked'} />
        </li>,
      )

      return nodes
    }

    const slot = BRIEF_SLOTS[briefs % BRIEF_SLOTS.length] ?? { col: 1, span: 4 }

    nodes.push(
      <li
        key={item.article.id}
        className={styles.item}
        style={slotStyle(slot)}
        data-lift={slot.lift ?? 0}
        data-width={widthOf(slot)}
      >
        <BriefStory article={item.article} index={++briefs} />
      </li>,
    )

    return nodes
  })

  return (
    <ul className={styles.feed} role="list">
      {rendered}
    </ul>
  )
}
