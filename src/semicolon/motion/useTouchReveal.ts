import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

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
 * 화면이 좁다고 이것을 끄지는 않는다. 좁은 화면에서 줄여야 하는 것은 한 번에
 * 일어나는 일의 수이지 만질 수 있는지 여부가 아니다.
 *
 * 마우스는 hover가 이미 같은 일을 하므로 여기서 다시 처리하지 않는다.
 */
export function useTouchReveal(): Reveal {
  const [active, setActive] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const onPointerDown = useCallback((event: PointerEvent<Element>) => {
    if (event.pointerType !== 'touch') return

    setActive(true)

    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActive(false), HOLD)
  }, [])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { active, onPointerDown }
}
