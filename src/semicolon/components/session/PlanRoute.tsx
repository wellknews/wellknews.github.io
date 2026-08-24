import type { CSSProperties } from 'react'

import { useVisit } from './PlanStage'
import styles from './PlanRoute.module.css'

/**
 * 한 자리에서 다음 자리로 가는 선의 성격.
 *
 *   plan       아침에 그어 둔 선. 실제로 그 위를 걷지는 않았다.
 *   actual     실제로 걸은 선.
 *   cancelled  긋기는 했는데 끝점이 없어진 선.
 *   back       왔던 길을 그대로 되짚은 구간.
 */
export type Leg = 'plan' | 'actual' | 'cancelled' | 'back'

export type Stop = {
  name: string
  /** 이 자리에서 다음 자리로 가는 선. 마지막 자리에는 없다. */
  leg?: Leg
}

type Props = {
  stops: readonly Stop[]
  /**
   * 이 선이 끊기면서 계획표에서 빠지는 자리.
   *
   * 끊긴 선을 그리는 것과 계획이 취소되는 것은 같은 일이 아니다. 어떤 선은
   * 끊긴 채로도 그 끝의 계획이 살아 있고, 어떤 선은 끊긴 그 순간에 계획이
   * 끝난다. 그림에서 읽어 낼 수 있는 차이가 아니라서 적어서 알린다.
   */
  drops?: string
}

/**
 * 하루의 선.
 *
 * 지도가 아니다. 좌표도 축척도 방향도 없고, 성수와 뚝섬이 실제로 어느 쪽에
 * 있는지는 이 그림에서 알 수 없다. 여기 있는 것은 순서 하나뿐이다 — 어디를
 * 먼저 갔고 어디에서 되돌아왔는가.
 *
 * 지도를 그리면 이 기록은 «성수 코스 추천»이 된다. 그날 실제로 일어난 일은
 * 어느 길로 갔느냐가 아니라 아침에 그은 선과 저녁에 남은 선이 다르다는
 * 것이었고, 그것을 보여 주는 데 지리는 필요하지 않다.
 *
 * 네 종류의 선이 한 그림 안에 함께 있다. 계획선은 얇고 물러나 있고, 실제선은
 * 진하고, 끝점이 없어진 선은 점선이고, 되짚은 구간은 두 줄이다. 되짚은 선을
 * 하나로 그리면 갔다 온 것이 아니라 한 번 간 것이 된다.
 */
export function PlanRoute({ stops, drops }: Props) {
  /*
   * 계획에서 빠지는 자리는 도착하기 전에 적힌다.
   *
   * 더커피가 그랬다. 문이 닫힌 것도 아니고 내가 그 앞에서 마음을 바꾼 것도
   * 아니었다 — 휴먼메이드에서 커피를 마신 순간, 아직 한 시간도 더 남은
   * 그 자리의 이유가 이미 없어져 있었다.
   */
  const ref = useVisit<HTMLOListElement>(drops, 'skipped')

  return (
    <ol className={styles.route} role="list" ref={ref}>
      {stops.map((stop, index) => (
        <li key={stop.name} style={{ '--order': index } as CSSProperties}>
          <span className={`mono ${styles.name}`}>{stop.name}</span>

          {stop.leg ? (
            <svg
              className={styles.leg}
              data-leg={stop.leg}
              viewBox="0 0 24 48"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line className={styles.line} x1="8" y1="0" x2="8" y2="48" pathLength={100} />

              {/* 되짚은 구간에만 한 줄이 더 있다. 갈 때와 올 때가 겹치지 않는다. */}
              {stop.leg === 'back' ? (
                <line className={styles.line} x1="16" y1="0" x2="16" y2="48" pathLength={100} />
              ) : null}
            </svg>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
