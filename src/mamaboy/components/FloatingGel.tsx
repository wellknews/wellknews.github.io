import { useEffect, useRef } from 'react'

import { useReducedMotion } from '../motion/useReducedMotion'
import styles from './FloatingGel.module.css'

/**
 * 떠오르는 젤(§8–§13, §21).
 *
 * 전에는 젤이 기사들 사이의 격자 한 칸을 차지하고 있었다. 장식이 콘텐츠의
 * 자리를 밀어내고 있었다는 뜻이다. 이제 격자 밖으로 나와 판면 뒤에 독립적으로
 * 뜬다 — 기사의 위치를 건드리지 않는다.
 *
 * 저절로 도는 애니메이션은 두지 않는다. 이 지면의 움직임은 언제나 사람이
 * 만든다(§21). 스크롤을 내리면 물속의 공기방울처럼 위로 오르고, 멈추면 함께
 * 멈춘다. 크기가 다르면 오르는 속도도 다르다 — 그 차이가 깊이를 만든다.
 *
 * 카테고리 면(CategorySection) 뒤에 놓인다. 면을 지날 때 가려졌다가 면과 면
 * 사이에서 다시 보인다. 화면 위에 얹힌 그림이 아니라 지면 안쪽에 있는 것처럼
 * 보이게 하는 장치다(§12).
 */

type Bubble = {
  /** 판면 기준 가로 위치와 처음 앉는 높이. */
  x: string
  top: string
  size: number
  /** 500px을 내렸을 때 오르는 거리. 클수록 앞쪽에 있는 것처럼 보인다. */
  rise: number
  drift: number
  spin: number
  material: 'gel' | 'glass' | 'milk' | 'yellow'
}

/*
 * 자리는 면의 가장자리를 걸치게 잡는다.
 *
 * 처음에는 판면 한가운데 근처에 두었더니 마흔여덟 개 스크롤 지점 중 한 곳에서만
 * 드러났다 — 카테고리 면이 판면의 폭을 거의 다 쓰기 때문에 안쪽에 둔 것은 늘
 * 가려진다. 가장자리에 걸쳐 두면 바깥쪽 절반은 언제나 보이고 안쪽 절반은 면 뒤로
 * 들어간다. 가려지는 것과 안 보이는 것은 다르다(§12).
 */
const BUBBLES: Bubble[] = [
  { x: '87%', top: '62vh', size: 132, rise: 110, drift: 12, spin: 4, material: 'gel' },
  { x: '-2%', top: '148vh', size: 96, rise: 62, drift: -8, spin: -3, material: 'glass' },
  { x: '90%', top: '236vh', size: 168, rise: 148, drift: 10, spin: 5, material: 'milk' },
  { x: '1%', top: '332vh', size: 110, rise: 82, drift: -14, spin: -4, material: 'yellow' },
]

/**
 * 젤이 설 자리가 있는 폭.
 *
 * 좁은 화면에서는 카테고리 면이 판면을 거의 다 쓰고 좌우 여백이 20px밖에 남지
 * 않는다. 거기에 젤을 두면 스크롤을 다 내리는 동안 5%의 구간에서만 드러난다 —
 * 보이지도 않는 장식을 위해 스크롤을 듣고 있을 이유가 없다. 좁은 화면에서는
 * 읽는 것이 먼저다(§11).
 */
const ROOM = '(min-width: 900px)'

export function FloatingGel() {
  const layer = useRef<HTMLDivElement>(null)
  const still = useReducedMotion()

  useEffect(() => {
    if (still || !window.matchMedia(ROOM).matches) return

    const element = layer.current

    if (!element) return

    let frame = 0

    /*
     * 스크롤 이벤트마다 스타일을 쓰지 않는다. 값만 기억해 두고 다음 프레임에
     * 한 번 쓴다 — 안 그러면 한 프레임에 여러 번 레이아웃을 건드린다.
     */
    const onScroll = () => {
      if (frame) return

      frame = window.requestAnimationFrame(() => {
        frame = 0
        element.style.setProperty('--scrolled', String(window.scrollY / 500))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)

      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [still])

  return (
    <div ref={layer} className={styles.layer} aria-hidden="true">
      {BUBBLES.map((bubble) => (
        <span
          key={`${bubble.x}-${bubble.top}`}
          className={styles.bubble}
          data-material={bubble.material}
          style={
            {
              '--x': bubble.x,
              '--top': bubble.top,
              '--size': `${bubble.size}px`,
              '--rise': bubble.rise,
              '--drift': bubble.drift,
              '--spin': bubble.spin,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
