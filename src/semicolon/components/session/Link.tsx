import type { ReactNode } from 'react'

import styles from './Link.module.css'

type Props = {
  /** 링크가 걸리기까지의 말. 두 점 사이에서 읽힌다. */
  children: ReactNode
  /** 두 좌표가 정확히 맞는 순간의 한 문장. */
  at: string
  /**
   * 그 아래에 아주 작게 남는 한 줄.
   *
   * 'received ≈ intended' 정도. 같다고 적지 않는 것이 요점이다 — 그날 일어난
   * 일은 상대가 나를 복제한 것이 아니라 의도와 수신값이 충분히 가까워진 것이다.
   * 등호를 쓰면 없던 일이 생긴다.
   */
  checksum?: string
}

/**
 * 타자와 링크되는 자리.
 *
 * 이 기록에서 단일 본문 레이아웃이 처음 깨지는 곳이다. 좌우에 점이 하나씩
 * 서고 본문이 그 사이를 지나간다. 두 점은 처음부터 같은 높이에 있지 않다 —
 * 말이 오가는 동안 오차가 조금씩 줄어들고, 한 문장에서 정확히 맞는다.
 *
 * 맞는 순간에만 아주 얇은 선이 한 번 그어졌다가 사라진다. 선을 미리 그려
 * 두지 않는 것이 이 장치의 전부다. 미리 그려 두면 그것은 연결이 아니라
 * 두 점을 잇는 장식이 되고, 그러면 «연결되었다»가 사건이 아니라 배경이 된다.
 *
 * 아이콘을 쓰지 않는다. 네트워크 표시도 사람 모양도 없다. 그런 그림이 하나라도
 * 들어오면 이 장면은 통신 상태를 알리는 화면이 되는데, 그날 일어난 일은
 * 디저트바에서 사람과 잠깐 말이 통한 것이다.
 *
 * 스크롤 타임라인이 없거나 움직임을 줄이기로 한 화면에서는 두 점이 처음부터
 * 맞아 있고 선은 나오지 않는다. 읽어야 할 것은 어긋남이 아니라 맞았다는
 * 사실이고, 맞아 있는 두 점이 그것을 이미 말한다.
 */
export function Link({ children, at, checksum }: Props) {
  return (
    <div className={styles.link}>
      <div className={styles.lead}>{children}</div>

      <div className={styles.pivot}>
        <p className={styles.sentence}>{at}</p>

        <div className={styles.rail} aria-hidden="true">
          <span className={styles.dot} data-side="left" />
          <span className={styles.wire} />
          <span className={styles.dot} data-side="right" />
        </div>

        {checksum ? <p className={`mono ${styles.checksum}`}>{checksum}</p> : null}
      </div>
    </div>
  )
}
