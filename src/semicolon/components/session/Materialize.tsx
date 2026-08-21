import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent } from 'react'

import type { Cover } from '../../content/types'
import { clamp } from '../../motion/damp'
import styles from './Materialize.module.css'

/** 손가락으로 찍은 자리가 밝은 채로 머무는 시간(ms). */
const HOLD = 2200

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
  const holdTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(holdTimer.current), [])

  const light = useCallback(
    (clientX: number, clientY: number) => {
      const host = hostRef.current

      if (!host) return

      const rect = host.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height

      host.style.setProperty('--x', `${(x * 100).toFixed(2)}%`)
      host.style.setProperty('--y', `${(y * 100).toFixed(2)}%`)
      host.dataset.lit = 'true'

      if (!focus) return

      /* 세로 거리는 종횡비로 보정한다. 그러지 않으면 납작한 이미지에서 초점이 세로로만 넓어진다. */
      const dx = x - focus.x
      const dy = (y - focus.y) * (rect.height / rect.width)
      const near = 1 - Math.hypot(dx, dy) / FOCUS_REACH

      host.style.setProperty('--focus', clamp(near, 0, 1).toFixed(3))
    },
    [focus],
  )

  const dim = useCallback(() => {
    const host = hostRef.current

    if (!host) return

    window.clearTimeout(holdTimer.current)
    host.dataset.lit = 'false'
    host.style.setProperty('--focus', '0')
  }, [])

  const handleMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      // 터치는 누르는 동안만 따라간다. 끌고 다니면 스크롤을 방해한다.
      if (event.pointerType === 'touch') return

      light(event.clientX, event.clientY)
    },
    [light],
  )

  const handleDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      light(event.clientX, event.clientY)

      if (event.pointerType !== 'touch') return

      window.clearTimeout(holdTimer.current)
      holdTimer.current = window.setTimeout(dim, HOLD)
    },
    [dim, light],
  )

  /*
   * 터치는 손을 떼는 순간 포인터가 사라지면서 leave가 곧바로 따라온다.
   * 그 신호로 끄면 찍은 자리가 밝을 시간이 없다. 손가락이 켠 빛은 타이머가 끈다.
   */
  const handleLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch') return

      dim()
    },
    [dim],
  )

  return (
    <div
      className={styles.materialize}
      ref={hostRef}
      data-lit="false"
      data-paper={image.onPaper === true}
      style={rest === undefined ? undefined : ({ '--rest': rest } as CSSProperties)}
      onPointerMove={handleMove}
      onPointerDown={handleDown}
      onPointerLeave={handleLeave}
      onPointerCancel={dim}
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
