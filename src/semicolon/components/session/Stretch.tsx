import type { ReactNode } from 'react'

import styles from './Stretch.module.css'

type Props = {
  children: ReactNode
}

/**
 * 문장 사이가 점점 멀어지는 구간.
 *
 * 앞에서는 문단과 문단 사이가 일정했다. 여기서부터 한 칸씩 벌어진다. 같은
 * 양의 글을 읽는 데 손가락이 더 많이 움직이고, 읽는 사람은 무엇이 달라졌는지
 * 알아차리지 못한 채로 기다리게 된다.
 *
 * 화면에 «WAITING»이나 «90 MIN»을 적지 않는다. 남은 시간을 그리는 막대도
 * 두지 않는다. 그런 표시는 기다림을 설명하는 것이지 기다리게 하는 것이 아니고,
 * 무엇보다 이 공간에는 진행 막대가 없다.
 *
 * 스크롤해야 하는 거리 자체가 기다린 시간이다. 이 저장소가 처음부터 쓰던
 * «빈 자리가 시간이다»를 한 구간 안으로 가져온 것뿐이다.
 */
export function Stretch({ children }: Props) {
  return <div className={styles.stretch}>{children}</div>
}
