import type { ReactNode } from 'react'

import styles from './Trace.module.css'

type Props = {
  /** '11:58' — 그 자리에 있었던 시각. */
  at: string
  /**
   * 시각이 본문 쪽으로 얼마나 들어왔는가.
   *
   *   0  여백의 맨 끝. 아침에는 시간이 나와 상관없는 자리에 있었다.
   *   1  한 뼘 들어온다.
   *   2  본문 바로 옆까지.
   *   3  본문 위. 더 이상 여백이 아니다.
   *
   * 처음에는 내가 시간을 봤고 나중에는 시간이 내 글 안으로 들어왔다. 그
   * 차이를 문장으로 적지 않고 이 값으로 적는다.
   *
   * 글을 가리지는 않는다. 시각은 끝까지 본문과 다른 칸에 앉아 있고, 마지막
   * 단에서만 위아래로 자리를 바꾼다. 읽는 것을 방해하는 순간 이것은 압박이
   * 아니라 고장이다.
   */
  creep?: 0 | 1 | 2 | 3
  children: ReactNode
}

/**
 * 그 시각에 내가 있었던 흔적.
 *
 * 현재 위치를 알려 주는 막대가 아니다. 화면 위에 떠 있지 않고, 배경도 테두리도
 * 없고, 눌러도 아무 데로도 가지 않는다. 판면의 여백에 숫자 하나가 놓여 있고
 * 본문이 그 옆을 지나갈 뿐이다. 다음 자리로 넘어가면 다음 숫자로 바뀐다.
 *
 * 아침의 표(Daybook)에서 목적지가 물러나고 남은 것이 이 숫자들이다. 계획은
 * 어디에 가느냐였고 하루에 실제로 남은 것은 몇 시였느냐였다.
 *
 * 좁은 판면에서는 여백 칼럼 자체가 없다(--margin-col: 0). 그래서 붙박이지
 * 않고 그 자리 맨 위에 한 번 적힌다 — 여백이 없는 지면에서 무언가를 여백에
 * 두려고 하면 그것은 본문 위에 뜬다.
 */
export function Trace({ at, creep = 0, children }: Props) {
  return (
    <div className={styles.trace} data-creep={creep}>
      <p className={`mono ${styles.at}`}>
        <span>{at}</span>
      </p>

      <div className={styles.body}>{children}</div>
    </div>
  )
}
