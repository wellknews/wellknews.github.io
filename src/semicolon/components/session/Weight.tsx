import type { ReactNode } from 'react'

import styles from './Weight.module.css'

type Props = {
  children: ReactNode
}

/**
 * 글이 다가올수록 잉크를 얻는 자리.
 *
 * 투명도가 아니라 잉크의 농도로 한다. 투명하게 만들면 어느 순간 읽을 수 없는
 * 글이 생기고, 그러면 연출을 위해 내용을 가린 것이 된다. 색으로 하면 제일 옅은
 * 자리에서도 종이 대비 6:1을 넘는다 — 끝까지 읽을 수 있다.
 *
 * 스크롤 타임라인이 없거나 움직임을 줄이기로 한 화면에서는 가장 진한 상태로
 * 서 있는다. 도착한 상태가 곧 읽어야 할 상태이기 때문이다.
 */
export function Weight({ children }: Props) {
  return <div className={styles.weight}>{children}</div>
}
