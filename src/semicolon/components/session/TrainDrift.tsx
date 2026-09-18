import type { ReactNode } from 'react'

import styles from './TrainDrift.module.css'

type Props = {
  /**
   * 창밖이 어떻게 지나가는지.
   *
   *   passing  계속 지나간다. 왜 가고 있는지는 아직 모른다.
   *   settled  이름을 찾은 뒤. 기차는 그대로 가는데 옆으로 흐르던 것이 멎는다.
   *
   * 기차가 멈춘 것이 아니다. 대전을 지나든 천안을 지나든 열차는 같은 속도로
   * 가고 있었고, 달라진 것은 창밖이 아니라 창 안쪽이다.
   */
  state?: 'passing' | 'settled'
  children: ReactNode
}

/**
 * 이 대화가 기차 안에서 일어났다는 사실.
 *
 * 기차를 그리지 않는다. 철도 아이콘도, 노선도도, 창밖 사진도 없다. 그것을
 * 그리는 순간 이 장면은 «기차 여행에 대한 글»이 되는데, 실제로 기차는 이
 * 글의 소재가 아니라 조건이다 — 몸이 이미 한 방향으로 옮겨지고 있는 동안
 * 머릿속에서 원인을 찾고 있었다는, 그 두 방향의 어긋남만이 내용이다.
 *
 * 그래서 남기는 것은 방향뿐이다. 페이지는 아래로 내려가는데 뒤의 얇은 층은
 * 옆으로 흐른다. 그 층에는 읽을 것이 하나도 없고 판면의 바깥쪽 가장자리에만
 * 걸쳐 있어서, 알아차리지 못하고 끝까지 읽어도 잃는 것이 없다.
 *
 * 무엇이 흐르는지는 말하지 않는다. 창밖의 무엇인지 알아볼 수 있게 그리면
 * 그것은 삽화가 되고, 삽화가 되면 읽는 사람이 그것을 본다.
 *
 * 이 구간 안에서는 보조 정보가 기준선에서 조금 벗어나 있다(--drift-off).
 * 본문은 건드리지 않는다 — 정렬이 어긋난 것과 글이 안 읽히는 것은 다르고,
 * 이 기록에서 흔들리고 있던 것은 지면이 아니라 상태였다.
 */
export function TrainDrift({ state = 'passing', children }: Props) {
  return (
    <div className={styles.train} data-state={state}>
      <div className={styles.window} aria-hidden="true">
        <span className={styles.band} />
      </div>

      <div className={styles.body}>{children}</div>
    </div>
  )
}
