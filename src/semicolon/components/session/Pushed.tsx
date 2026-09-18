import type { ReactNode } from 'react'

import styles from './Pushed.module.css'

type Props = {
  children: ReactNode
}

/**
 * 내가 가는 게 아니라 뒤에서 밀리는 것.
 *
 * 화면 한가운데에 있을 때, 스크롤하면 이 문장만 잠깐 스크롤과 반대 방향으로
 * 간다. 30~40픽셀쯤 아래로 밀렸다가 다시 정상 방향으로 내려간다.
 *
 * 스크롤을 가로채지 않는다. 휠 입력도 관성도 건드리지 않고, 판면은 사람이
 * 민 만큼 정확히 움직인다. 움직이는 것은 이 문장의 transform 하나뿐이다.
 * 가로채는 순간 그것은 «떠밀림»이 아니라 고장 난 페이지가 된다.
 *
 * 크기를 키우지 않는다. 이 문장을 큰 타이포 카드로 만들면 «시간에 떠밀렸다»가
 * 이 하루의 표어가 되는데, 실제로는 그냥 시간이 계속 갔을 뿐이다.
 */
export function Pushed({ children }: Props) {
  return <div className={styles.pushed}>{children}</div>
}
