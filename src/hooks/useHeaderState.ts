import { useEffect, useState } from 'react'

export type HeaderState = {
  /** 마지막으로 감지된 스크롤 방향. 아래로 내릴 때 헤더를 숨긴다. */
  direction: 'up' | 'down'
  /** 페이지 최상단 근처 — 헤더 배경을 투명하게 둔다. */
  atTop: boolean
  /**
   * 히어로를 지났는지. 히어로에 큰 로고가 떠 있는 동안에는 헤더 로고를 띄우지 않는다.
   * 같은 로고가 한 화면에 두 번 보이는 것을 피하기 위한 값이다.
   */
  pastHero: boolean
}

/** 방향 전환으로 인정할 최소 이동량(px). 미세한 떨림으로 헤더가 깜빡이는 것을 막는다. */
const DIRECTION_THRESHOLD = 8

export function useHeaderState(): HeaderState {
  const [state, setState] = useState<HeaderState>({
    direction: 'up',
    atTop: true,
    pastHero: false,
  })

  useEffect(() => {
    let lastY = window.scrollY
    let ticking = false

    const read = () => {
      ticking = false
      const y = window.scrollY
      const atTop = y < 24
      const pastHero = y > window.innerHeight * 0.6

      let direction: HeaderState['direction'] | null = null
      if (Math.abs(y - lastY) >= DIRECTION_THRESHOLD) {
        direction = y > lastY ? 'down' : 'up'
        lastY = y
      }

      setState((prev) => {
        const next: HeaderState = {
          direction: direction ?? prev.direction,
          atTop,
          pastHero,
        }
        const unchanged =
          prev.direction === next.direction &&
          prev.atTop === next.atTop &&
          prev.pastHero === next.pastHero
        return unchanged ? prev : next
      })
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(read)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    read()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return state
}
