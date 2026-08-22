import type { CSSProperties } from 'react'

import styles from './Detour.module.css'

type Props = {
  /** 잘못 간 걸음 수. */
  out: number
  /** 되돌아온 걸음 수. 간 만큼 전부 돌아오지는 않는다. */
  back: number
  /** 돌아서기 직전에 알아차린 것. */
  note: string
}

/**
 * 길을 잘못 든 구간.
 *
 * 지도를 그리지 않는다. 화살표가 한 줄씩 오른쪽으로 밀려 나가다가 제일 멀리
 * 간 자리에서 한마디로 멈추고, 거기서부터 다시 왼쪽으로 돌아온다. 어디였는지는
 * 이 장면에서 중요하지 않다 — 중요한 것은 잘못 간 걸음과 돌아오는 걸음이 화면에서
 * 서로 반대 방향이라는 사실이고, 그 되돌아오는 동안에 오늘의 마지막 생각이
 * 떠올랐다는 것이다.
 *
 * 알아차린 자리를 왼쪽 끝에 두면 «처음부터 알고 있었다»처럼 보인다. 그래서
 * 한마디는 제일 멀리 나간 걸음과 같은 자리에 선다.
 */
export function Detour({ out, back, note }: Props) {
  return (
    <div className={styles.detour} style={{ '--out': out } as CSSProperties}>
      <p className={`mono ${styles.run}`} aria-hidden="true">
        {Array.from({ length: out }, (_, step) => (
          <span key={step} style={{ '--step': step } as CSSProperties}>
            →
          </span>
        ))}
      </p>

      <p className={`mono ${styles.note}`}>{note}</p>

      <p className={`mono ${styles.run} ${styles.returning}`} aria-hidden="true">
        {Array.from({ length: back }, (_, step) => (
          <span key={step} style={{ '--step': step } as CSSProperties}>
            ←
          </span>
        ))}
      </p>
    </div>
  )
}
