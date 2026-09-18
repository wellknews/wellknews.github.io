import type { CSSProperties } from 'react'

import type { Cover } from '../../content/types'
import styles from './Wait.module.css'

type Props = {
  /** '15:54' — 줄 끝에 선 시각. */
  from: string
  /** '17:00' — 안으로 들어간 시각. 사이의 시각은 적지 않는다. */
  to: string
  /**
   * 기다리는 동안 지나간 것들.
   *
   * 체크리스트가 아니다. 받은 것과 본 것과 안 아팠던 것이 순서 없이 섞여 있고,
   * 각자 잠깐 나타났다 사라진다. 목록으로 쌓으면 그것은 «웨이팅 중 한 일»이라는
   * 정리가 되는데, 벤치에 앉아 있는 동안에는 아무것도 정리되지 않았다.
   */
  notes: readonly string[]
  /**
   * 붙박여 있는 한 장.
   *
   * 없으면 시각이 그 자리를 가진다. 없는 사진을 만들어 넣지 않는다 — 이 공간의
   * 사진은 장식이 아니라 증거다.
   */
  image?: Cover
}

/**
 * 사람은 움직이고 나는 안 움직인다.
 *
 * 보통 웹에서는 스크롤하면 사진이 지나간다. 여기서는 반대다. 사진이 화면
 * 한가운데에 붙박여 있고, 주변의 작은 기록만 바뀐다. 손가락을 아무리 움직여도
 * 한가운데의 것은 그대로 있다.
 *
 * 강남역 벤치에 앉아 있던 상태가 그것이다. 거리는 계속 지나갔고 나는 한 시간
 * 넘게 같은 자리에 있었다.
 *
 * 시각은 두 번만 나온다.
 *
 * 시작에 15:54, 끝에 17:00. 사이의 시각은 적지 않고 숫자가 올라가는 애니메이션도
 * 쓰지 않는다. 두 숫자 사이를 직접 스크롤해 지나온 거리가 곧 기다린 시간이고,
 * 그 사이에 무슨 일이 있었는지는 옆에 잠깐씩 나타난 것이 전부다.
 *
 * 붙잡아 두는 것은 화면이 아니라 이 구간이다. 구간이 끝나면 저절로 놓인다 —
 * 스크롤을 가로채지 않는다.
 */
export function Wait({ from, to, notes, image }: Props) {
  return (
    <div className={styles.wait} style={{ '--notes': notes.length } as CSSProperties}>
      <div className={styles.stage}>
        <p className={`mono ${styles.clock}`}>
          {/* 읽어 주는 쪽에는 두 시각이 한 줄로 간다. 바뀌는 것은 화면에서만 일어난다. */}
          <span className="visually-hidden">
            {from} — {to}
          </span>

          <span className={styles.face} aria-hidden="true">
            <span className={styles.from}>{from}</span>
            <span className={styles.to}>{to}</span>
          </span>
        </p>

        {image ? (
          <figure className={styles.held}>
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              decoding="async"
              loading="lazy"
            />
          </figure>
        ) : null}

        <div className={styles.notes}>
          {notes.map((note, index) => (
            <p key={note} className={styles.note} style={{ '--slot': index } as CSSProperties}>
              {note}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
