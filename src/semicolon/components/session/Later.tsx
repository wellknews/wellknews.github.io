import type { ReactNode } from 'react'

import styles from './Later.module.css'

type Props = {
  children: ReactNode
}

/**
 * 조금 늦게 들어서는 것.
 *
 * 앞의 문장을 읽고 나서야 눈에 들어와야 하는 한마디에 쓴다. 같이 나오면
 * 두 문장이 한 덩어리로 읽히고, 뒤의 것이 앞의 것에 붙은 설명이 된다.
 *
 * 늦게 나오는 것이 정보를 감추는 일이 되어서는 안 되므로, 스크롤 타임라인이
 * 없거나 움직임을 줄이기로 한 화면에서는 처음부터 그냥 보인다.
 */
export function Later({ children }: Props) {
  return <div className={styles.later}>{children}</div>
}
