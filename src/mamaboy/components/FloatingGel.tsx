import { useEffect, useRef, useState } from 'react'

import styles from './FloatingGel.module.css'

/**
 * 떠오르는 젤(§8–§13, §21).
 *
 * 전에는 젤이 기사들 사이의 격자 한 칸을 차지하고 있었다. 장식이 콘텐츠의
 * 자리를 밀어내고 있었다는 뜻이다. 이제 격자 밖으로 나와 판면 뒤에 독립적으로
 * 뜬다 — 기사의 위치를 건드리지 않는다.
 *
 * 저절로 도는 애니메이션은 두지 않는다(§21). 스크롤을 내리면 물속의 공기방울처럼
 * 위로 오르고, 멈추면 함께 멈춘다. 크기가 다르면 오르는 속도도 다르고, 그 차이가
 * 깊이를 만든다.
 *
 * 자리는 «면과 면 사이»다.
 *
 * 카테고리 면이 불투명하고 판면의 폭을 거의 다 쓰기 때문에, 면 위에 놓인 젤은
 * 그냥 안 보인다. 처음에는 화면 높이(vh)로 자리를 잡았는데 네 개가 열여덟 화면짜리
 * 페이지의 위 18% 안에 몰렸고, 좁은 화면에서는 좌우에 20px밖에 남지 않아 스크롤
 * 전체의 5%에서만 드러났다.
 *
 * 그래서 자리를 미리 적어 두지 않고 그릴 때 잰다. 면들 사이의 틈을 찾아 그
 * 한가운데에 젤의 중심을 놓으면, 가운데 띠만 보이고 위아래는 면 뒤로 들어간다 —
 * 가리려고 애쓸 필요 없이 저절로 그렇게 된다(§12).
 */

type Bubble = {
  size: number
  /** 500px을 내렸을 때 오르는 거리. 클수록 앞쪽에 있는 것처럼 보인다. */
  rise: number
  drift: number
  spin: number
  material: 'gel' | 'glass' | 'milk' | 'yellow'
  /** 판면 기준 가로 위치. 면의 가장자리를 걸치도록 잡는다. */
  x: string
}

const BUBBLES: Bubble[] = [
  { size: 132, rise: 110, drift: 12, spin: 4, material: 'gel', x: '72%' },
  { size: 104, rise: 62, drift: -8, spin: -3, material: 'glass', x: '14%' },
  { size: 168, rise: 148, drift: 10, spin: 5, material: 'milk', x: '64%' },
  { size: 116, rise: 82, drift: -14, spin: -4, material: 'yellow', x: '22%' },
  { size: 96, rise: 96, drift: 9, spin: 3, material: 'glass', x: '80%' },
  { size: 140, rise: 70, drift: -11, spin: -5, material: 'gel', x: '10%' },
]

/** 면과 면 사이의 한가운데들. 레이어 기준의 px. */
function gapsIn(layer: HTMLElement): number[] {
  const page = layer.parentElement

  if (!page) return []

  const sections = [...page.querySelectorAll('section[data-category]')]
  const top = page.getBoundingClientRect().top + window.scrollY

  return sections.slice(1).map((section, index) => {
    const previous = sections[index] as HTMLElement
    const before = previous.getBoundingClientRect().bottom + window.scrollY
    const after = section.getBoundingClientRect().top + window.scrollY

    return (before + after) / 2 - top
  })
}

export function FloatingGel() {
  const layer = useRef<HTMLDivElement>(null)
  const [gaps, setGaps] = useState<number[]>([])

  /*
   * 틈의 위치는 그림이 도착하고 글꼴이 바뀔 때마다 달라진다. 한 번 재고 끝내면
   * 젤이 엉뚱한 데 남으므로, 지면의 높이가 바뀔 때마다 다시 잰다.
   */
  useEffect(() => {
    const element = layer.current
    const page = element?.parentElement

    if (!element || !page) return

    const measure = () => setGaps(gapsIn(element))

    measure()

    const observer = new ResizeObserver(measure)

    observer.observe(page)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={layer} className={styles.layer} aria-hidden="true">
      {gaps.map((gap, index) => {
        const bubble = BUBBLES[index % BUBBLES.length]

        if (!bubble) return null

        return (
          <span
            key={gap}
            className={styles.bubble}
            data-material={bubble.material}
            style={
              {
                '--x': bubble.x,
                '--top': `${Math.round(gap)}px`,
                '--size': `${bubble.size}px`,
                '--rise': bubble.rise,
                '--drift': bubble.drift,
                '--spin': bubble.spin,
              } as React.CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
