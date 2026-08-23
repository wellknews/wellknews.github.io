import type { ReactNode } from 'react'

import styles from './Scene.module.css'

type Props = {
  children: ReactNode
  /**
   * 이 장면이 쓰는 폭.
   *
   *   page   기본. 판면 안에 앉는다.
   *   bleed  여백까지 쓴다. 이미지가 공간을 넘어설 때.
   */
  width?: 'page' | 'bleed'
  /** 앞뒤로 더 크게 비울지. 장면이 바뀌는 자리에 쓴다. */
  air?: boolean
  /**
   * 앞뒤의 여백을 좁힐지. 서두르는 구간에 쓴다.
   *
   * 시간이 부족해지는 대목에서 여백을 한 단계씩 줄이면, 읽는 사람이 의식하지
   * 않아도 페이지 자체가 서두르기 시작한다. 초읽기 UI를 그리는 것보다 이쪽이
   * 정직하다 — 화면에 숫자를 띄우는 대신 지면의 호흡을 실제로 바꾼다.
   *
   * brisk → fast → rushed 순서로 좁아진다.
   */
  pace?: 'brisk' | 'fast' | 'rushed'
}

/**
 * 기록의 한 장면.
 *
 * 카드가 아니다. 테두리도 배경도 그림자도 없다. 각 장면을 상자로 나누는 순간
 * 이 페이지는 하나의 연속된 공간이 아니라 블록의 목록이 되고, 스크롤은
 * 이야기가 아니라 항목 넘기기가 된다.
 *
 * 장면을 나누는 것은 오직 여백이다.
 */
export function Scene({ children, width = 'page', air = false, pace }: Props) {
  return (
    <section
      className={styles.scene}
      data-width={width}
      data-air={air}
      {...(pace ? { 'data-pace': pace } : {})}
    >
      <div className={width === 'bleed' ? styles.stack : `shell ${styles.stack}`}>{children}</div>
    </section>
  )
}
