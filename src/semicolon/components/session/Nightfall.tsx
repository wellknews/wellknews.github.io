import type { ReactNode } from 'react'

import styles from './Nightfall.module.css'

type Props = {
  /** '7:50 PM' — 불이 꺼진 시각. */
  at: string
  children: ReactNode
}

/**
 * 같은 자리가 다른 공간이 되는 구간.
 *
 * 장소를 옮긴 것이 아니다. 앉아 있던 식당이 8시가 되기 10분 전에 조명을 낮추고
 * 음악을 틀었을 뿐이다. 그래서 여기서 Place를 다시 쓰지 않는다 — 주소가 한 번
 * 더 나오면 식당과 맥주와 R&B가 서로 다른 세 곳이 되어 버린다.
 *
 * 이 구간만 어두워진다. 사이트 전체의 색을 바꾸지 않고, 검정으로 가지도
 * 않는다. 아이보리가 두 단계 내려앉는 정도다. 하려는 말은 «밤이 됐다»가
 * 아니라 «같은 가게가 갑자기 다르게 느껴졌다»이고, 그 정도의 일에 화면 전체를
 * 뒤집으면 기억보다 연출이 커진다.
 *
 * 색은 이어지지 않고 단으로 떨어진다. 실제로 조명을 한 번에 다 끄지 않고
 * 몇 번에 나눠 껐고, 그 끊김이 흘러나오던 음악의 박자와 겹쳤다. 흐르는
 * 그러데이션으로 만들면 그 사실이 사라진다.
 *
 * 음악은 재생하지 않는다. 오디오도 플레이어도 두지 않는다.
 */
export function Nightfall({ at, children }: Props) {
  return (
    <div className={styles.nightfall}>
      <div className={`shell ${styles.inner}`}>
        <p className={`mono ${styles.at}`}>{at}</p>

        {children}
      </div>
    </div>
  )
}
