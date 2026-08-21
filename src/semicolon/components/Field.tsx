import { useCallback, useEffect, useRef } from 'react'

import { useViewport } from '../layout/useViewport'
import { clamp, damp, settled } from '../motion/damp'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useSettling } from '../motion/useSettling'
import styles from './Field.module.css'

/**
 * 색면이 밀려나는 거리(자기 크기 대비 %).
 *
 * 이 숫자가 커지면 색이 커서를 따라다니는 효과가 된다. 화면을 몇 번 훑고 나서야
 * '아까와 다르네' 싶은 정도가 상한이다.
 */
const TRAVEL_MINT = 7
const TRAVEL_PINK = 4.5

/**
 * 목표까지 좁혀 오는 속도. 민트가 더 느려서 둘이 조금씩 어긋나고,
 * 그 어긋남이 색면을 한 겹이 아니라 두 겹으로 보이게 한다.
 */
const RATE_MINT = 1.1
const RATE_PINK = 1.9

/** 스크롤이 만든 압축·신장이 따라붙는 속도와, 손을 뗀 뒤 0으로 풀리는 속도. */
const RATE_STRETCH = 3
const RATE_RELEASE = 2.4

/** 스크롤 속도를 -1..1로 옮기는 기준(px). 한 번에 이만큼 굴려야 최대치가 된다. */
const SCROLL_REFERENCE = 900

/** 스크롤이 만드는 최대 배율과, 그때 색면이 끌려가는 거리(%). */
const STRETCH_SCALE = 0.05
const STRETCH_DRAG = 2.5

/**
 * 좁은 판면에서 움직임의 양을 줄이는 비율.
 *
 * 반응을 없애지는 않는다. 같은 폭으로 밀리면 넓은 화면에서 «공간의 온도»였던
 * 것이 좁은 화면에서는 화면 전체가 흔들리는 일이 되기 때문에, 일어나는 일은
 * 그대로 두고 그 크기만 절반 아래로 낮춘다.
 */
const COMPACT_DAMPING = 0.4

type Vec = { x: number; y: number }

/**
 * 이 공간의 재료.
 *
 * 종이색 위에 민트와 핑크가 거의 인식되지 않을 정도로 깔려 있다. 아무도
 * 건드리지 않으면 화면은 정지해 있다. 커서가 움직이면 색면이 한 박자 늦게
 * 밀려나고, 스크롤하면 아주 조금 눌렸다 늘어난다.
 *
 * 색이 커서를 따라오게 하지 않는 것이 핵심이다. 따라오면 마우스를 꾸미는
 * 장식이 되고, 밀려나면 사람이 표면 아래를 지나간 흔적이 된다. 그래서 목표
 * 위치는 커서의 반대쪽이고, 도착은 늘 늦다.
 *
 * 색면은 판면 뒤로 완전히 물러나 있고 포인터 이벤트를 받지 않는다. 읽는 것을
 * 방해하지 않으면서 공간의 온도만 바꾸는 것이 이 층이 하는 일의 전부다.
 */
export function Field() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const viewport = useViewport()

  /* 커서가 지정한 목표. 손을 떼도 제자리로 돌아오지 않는다 — 밀린 채로 멈춘다. */
  const target = useRef<Vec>({ x: 0, y: 0 })
  const mint = useRef<Vec>({ x: 0, y: 0 })
  const pink = useRef<Vec>({ x: 0, y: 0 })

  /* 스크롤이 만드는 눌림. 스크롤을 멈추면 목표가 스스로 0으로 풀린다. */
  const stretch = useRef(0)
  const stretchTarget = useRef(0)
  const lastScroll = useRef(0)

  const damping = viewport === 'compact' ? COMPACT_DAMPING : 1

  const wake = useSettling(
    useCallback(
      (dt: number) => {
        const element = ref.current

        if (!element) return false

        const to = target.current

        mint.current.x = damp(mint.current.x, to.x, RATE_MINT, dt)
        mint.current.y = damp(mint.current.y, to.y, RATE_MINT, dt)
        pink.current.x = damp(pink.current.x, to.x, RATE_PINK, dt)
        pink.current.y = damp(pink.current.y, to.y, RATE_PINK, dt)

        stretchTarget.current = damp(stretchTarget.current, 0, RATE_RELEASE, dt)
        stretch.current = damp(stretch.current, stretchTarget.current, RATE_STRETCH, dt)

        const drag = stretch.current * STRETCH_DRAG * damping
        const mintTravel = TRAVEL_MINT * damping
        const pinkTravel = TRAVEL_PINK * damping

        element.style.setProperty('--mint-x', (mint.current.x * mintTravel).toFixed(3))
        element.style.setProperty('--mint-y', (mint.current.y * mintTravel - drag).toFixed(3))
        element.style.setProperty('--pink-x', (pink.current.x * pinkTravel).toFixed(3))
        element.style.setProperty('--pink-y', (pink.current.y * pinkTravel + drag).toFixed(3))
        element.style.setProperty(
          '--field-scale',
          (1 + stretch.current * STRETCH_SCALE * damping).toFixed(4),
        )

        const moving =
          !settled(mint.current.x, to.x) ||
          !settled(mint.current.y, to.y) ||
          !settled(pink.current.x, to.x) ||
          !settled(pink.current.y, to.y) ||
          !settled(stretch.current, stretchTarget.current) ||
          !settled(stretchTarget.current, 0)

        // 가라앉고 나면 합성 레이어를 붙들고 있을 이유가 없다.
        if (!moving) element.dataset.active = 'false'

        return moving
      },
      [damping],
    ),
  )

  const nudge = useCallback(() => {
    const element = ref.current

    if (element) element.dataset.active = 'true'

    wake()
  }, [wake])

  useEffect(() => {
    // 움직임을 줄이기로 한 사람에게만 리스너를 붙이지 않는다.
    if (reduced) return

    const handleMove = (event: PointerEvent) => {
      const nx = clamp((event.clientX / window.innerWidth - 0.5) * 2, -1, 1)
      const ny = clamp((event.clientY / window.innerHeight - 0.5) * 2, -1, 1)

      // 부호가 반대인 것이 이 층의 전부다. 커서가 오면 색이 비켜난다.
      target.current = { x: -nx, y: -ny }
      nudge()
    }

    const handleScroll = () => {
      const y = window.scrollY
      const delta = y - lastScroll.current

      lastScroll.current = y

      stretchTarget.current = clamp(stretchTarget.current + delta / SCROLL_REFERENCE, -1, 1)

      nudge()
    }

    lastScroll.current = window.scrollY

    /*
     * 전부 passive다. 네이티브 스크롤과 터치는 이 층이 만지지 않는다.
     * 손가락으로 끌 때도 pointermove가 오므로 마우스와 같은 규칙으로 반응한다.
     */
    window.addEventListener('pointermove', handleMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [nudge, reduced])

  return (
    <div className={styles.field} ref={ref} aria-hidden="true">
      <span className={`${styles.plane} ${styles.mint}`} />
      <span className={`${styles.plane} ${styles.pink}`} />
    </div>
  )
}
