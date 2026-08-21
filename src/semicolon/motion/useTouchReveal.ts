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
 * 모바일을 데스크톱의 축소판으로 만들지 않는다는 것은, hover에 걸어 둔 반응을
 * 그냥 포기한다는 뜻이 아니라 touch에 맞는 계기를 따로 준다는 뜻이다.
 * 찍으면 반응하고, 손을 떼고 나면 스스로 가라앉는다.
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
