import type { ReactNode } from 'react'

import styles from './Passage.module.css'

type Props = {
  children: ReactNode
  /**
   * 이 문단이 얼마나 크게 앉는지.
   *
   *   note  기본. 읽는 크기.
   *   loud  한두 문장짜리. 판면 가운데에 크게 앉는다.
   */
  tone?: 'note' | 'loud'
}

/**
 * 문장 몇 개.
 *
 * 이 기록에서 글은 대부분 두세 문장이다. 길게 설명하지 않기로 했기 때문에,
 * 남은 문장은 각자 넓은 자리를 갖는다. 문단이 짧을수록 주변의 여백이
 * 그 문장을 읽는 속도를 정한다.
 */
export function Passage({ children, tone = 'note' }: Props) {
  return (
    <div className={styles.passage} data-tone={tone}>
      {children}
    </div>
  )
}
