import { useCallback, useRef, type CSSProperties } from 'react'

import type { Cover } from '../../content/types'
import { clamp } from '../../motion/damp'
import { usePointerLight } from '../../motion/usePointerLight'
import styles from './Materialize.module.css'

/** 초점이 반응하기 시작하는 거리(이미지 폭 대비). */
const FOCUS_REACH = 0.28

type Props = {
  image: Cover
  /**
   * 이 이미지에서 특히 드러나야 하는 자리(0..1의 비율).
   *
   * 다가가면 그 부분만 한 겹 더 또렷해진다. 이 기록에서는 토끼 심볼의 자리다 —
   * 화면 안에 있던 것 중에 실제로 옷으로 옮겨간 부분이 정확히 그것이라서.
   */
  focus?: { x: number; y: number }
  /** 아무도 건드리지 않았을 때의 밝기. 작게 걸리는 이미지는 조금 더 보여야 한다. */
  rest?: number
}

/**
 * 아직 물건이 아닌 이미지.
 *
 * 처음에는 거의 보이지 않는다. 흐릿하게 형태만 있고, 이것이 무엇인지 단정할 수
 * 없는 상태다. 사람이 다가가면 그 자리만 또렷해진다.
 *
 * 이 SESSION이 하려는 이야기가 «화면 안에만 있던 것»에서 시작하기 때문에,
 * 첫 이미지도 아직 완전히 존재하지 않는 상태로 둔다. 완성된 사진을 처음부터
 * 크게 걸어 버리면 그 다음에 일어나는 일이 아무것도 아니게 된다.
 *
 * 히어로의 ';'가 다가가야 잉크를 얻는 것과 같은 규칙이다. 이 공간에서는
 * 보는 일도 사람이 시작한다.
 */
export function Materialize({ image, focus, rest }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)

  /* 초점은 이 장치에만 있는 계산이다. 자리를 읽는 일은 공용 규칙이 맡는다. */
  const aim = useCallback(
    (x: number, y: number, rect: DOMRect) => {
      if (!focus) return

      /* 세로 거리는 종횡비로 보정한다. 그러지 않으면 납작한 이미지에서 초점이 세로로만 넓어진다. */
      const dx = x - focus.x
      const dy = (y - focus.y) * (rect.height / rect.width)
      const near = 1 - Math.hypot(dx, dy) / FOCUS_REACH

      hostRef.current?.style.setProperty('--focus', clamp(near, 0, 1).toFixed(3))
    },
    [focus],
  )

  const light = usePointerLight(hostRef, aim)

  return (
    <div
      className={styles.materialize}
      ref={hostRef}
      data-lit="false"
      style={rest === undefined ? undefined : ({ '--rest': rest } as CSSProperties)}
      {...light}
    >
      {/* 아직 다 존재하지 않는 상태. 형태만 있다. */}
      <img
        className={styles.base}
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        decoding="async"
      />

      {/* 사람이 보고 있는 자리만 온전해진다. */}
      <img
        className={styles.lit}
        src={image.src}
        alt=""
        width={image.width}
        height={image.height}
        aria-hidden="true"
        decoding="async"
      />

      {focus ? (
        <img
          className={styles.focus}
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          aria-hidden="true"
          decoding="async"
          style={{ '--fx': `${focus.x * 100}%`, '--fy': `${focus.y * 100}%` } as CSSProperties}
        />
      ) : null}
    </div>
  )
}
