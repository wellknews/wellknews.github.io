import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

import { useViewport } from '../layout/useViewport'

/** 찍은 자리가 반응한 채로 머무는 시간(ms). */
const HOLD = 1700

type Reveal = {
  /** 지금 반응 중인지. `data-touched` 속성으로 내보내 CSS가 hover와 같이 다룬다. */
  active: boolean
  onPointerDown: (event: PointerEvent<Element>) => void
}

/**
 * 손가락에는 hover가 없다.
 *
 * hover에 걸어 둔 반응을 touch에서 그냥 포기하지 않으려고 만든 계기다.
 * 찍으면 반응하고, 손을 떼고 나면 스스로 가라앉는다.
 *
 * 다만 아주 좁은 화면에서는 아무 일도 하지 않는다. 커서가 없는 화면에서 PC의
 * 반응을 전부 되살리려 하면, 각각은 작아도 한 줄 안에 모여 결국 «움직이는
 * 것이 많은 화면»이 된다. 모바일은 hover가 없는 PC가 아니라 다른 매체다.
 *
 * 마우스는 hover가 이미 같은 일을 하므로 여기서 다시 처리하지 않는다.
 */
export function useTouchReveal(): Reveal {
  const [active, setActive] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  const viewport = useViewport()

  const onPointerDown = useCallback(
    (event: PointerEvent<Element>) => {
      if (event.pointerType !== 'touch') return
      if (viewport === 'compact') return

      setActive(true)

      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setActive(false), HOLD)
    },
    [viewport],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { active, onPointerDown }
}
