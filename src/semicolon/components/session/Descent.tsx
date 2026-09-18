import type { ReactNode } from 'react'

import styles from './Descent.module.css'

type Props = {
  /**
   * 몇 번째로 좁아진 판면인가.
   *
   *   1  상수까지의 폭. 이 기록이 내내 써 온 판면이다.
   *   2  한 단계 좁다.
   *   3  두 단계.
   *   4  공연장 문 앞. 좌우의 여백이 본문보다 넓어진다.
   */
  step: 1 | 2 | 3 | 4
  children: ReactNode
}

/**
 * 좁아지는 판면.
 *
 * 지하로 내려가는 동안 본문의 폭이 단계적으로 줄어든다. 좌우 여백이 그만큼
 * 커지고, 같은 글이 점점 가운데로 몰린다.
 *
 * 벽을 그리지 않는다. 이 공간에는 판면을 관통하는 세로선이 없고, 구획을
 * 색면으로 칠하지도 않는다. 좁아지는 것은 선이 아니라 글이 쓸 수 있는
 * 자리다 — 계단을 내려가면서 실제로 줄어든 것도 그것이었다.
 *
 * 글자 크기는 건드리지 않는다. 좁아진 판면에서 활자까지 줄이면 그것은 공간이
 * 좁아진 것이 아니라 화면이 멀어진 것이 된다.
 */
export function Descent({ step, children }: Props) {
  return (
    <div className={styles.descent} data-step={step}>
      {children}
    </div>
  )
}
