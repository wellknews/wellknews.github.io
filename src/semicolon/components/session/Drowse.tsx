import { useCallback, useState, type ReactNode } from 'react'

import styles from './Drowse.module.css'

type Props = {
  /**
   * 그 구간에서의 졸음.
   *
   *   1  깨어 있다. 커피가 막 들어온 직후.
   *   2  졸리다. 아침부터 그랬다.
   *   3  눈을 뜬 채로 자고 있다. 커피가 떨어진 뒤.
   */
  level: 1 | 2 | 3
  children: ReactNode
}

/**
 * 졸음이 지면에 하는 일.
 *
 * 본문을 흐리게 만들지 않는다. 화면 전체를 어둡게 하지도 않고, 글자를
 * 흔들지도 않는다. 그런 연출은 «졸린 사람»을 흉내 내는 것이지 졸린 상태가
 * 아니고, 무엇보다 읽는 사람의 눈을 대신 피곤하게 만든다.
 *
 * 대신 보조 층만 기준선에서 조금씩 벗어난다. 결과 표시가 몇 픽셀 내려앉고,
 * 조건이 그보다 더 내려앉고, 계획선이 옅어진다. 정보는 전부 거기 있는데
 * 정렬이 조금씩 어긋나 있는 상태 — 그날 화면을 보던 눈이 실제로 그랬다.
 *
 * 눈에 힘을 줄 수 있다.
 *
 * 이 구간을 누르고 있는 동안에는 어긋나 있던 것들이 제자리로 돌아온다.
 * 손을 떼면 다시 내려앉는다. 그날 몇 번이나 그렇게 했다 — 잠깐 정신을
 * 차리고, 조금 뒤에 다시 풀리고. 누르는 동안에도 본문은 그대로다.
 * 읽는 데 필요한 것을 인터랙션의 대가로 걸지 않는다.
 *
 * 지나가는 것만으로는 켜지지 않는다. 이 구간은 화면 몇 개를 덮을 만큼 넓어서
 * 커서가 들어오는 것을 «힘을 줬다»로 치면 읽는 내내 켜져 있게 되고, 그러면
 * 졸음이 표현되는 시간이 한 번도 없다. 힘을 주는 것은 지나가는 일이 아니라
 * 하는 일이라, 커서든 손가락이든 누르고 있는 동안만이다.
 */
export function Drowse({ level, children }: Props) {
  const [awake, setAwake] = useState(false)

  const take = useCallback(() => setAwake(true), [])
  const release = useCallback(() => setAwake(false), [])

  return (
    <div
      className={styles.drowse}
      data-level={level}
      data-awake={awake}
      onPointerDown={take}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      {children}
    </div>
  )
}
