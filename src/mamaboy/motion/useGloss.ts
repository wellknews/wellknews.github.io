import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

import { useReducedMotion } from './useReducedMotion'

/** 손가락을 뗀 뒤 빛이 남아 있는 시간. 이보다 짧으면 반응한 것이 보이지 않는다. */
const TOUCH_LINGER_MS = 900

/**
 * 표면 위를 지나가는 빛(LIGHT).
 *
 * 이 공간의 소재는 종이가 아니라 젤과 유리와 코팅면이다. 그래서 hover에서
 * 이미지를 확대하는 대신 표면의 광택이 포인터를 따라 옮겨 간다. 커서를 꾸미는
 * 장식이 아니라 «이 면은 만질 수 있는 것»이라는 감각을 주는 것이 목적이므로,
 * 빛은 늘 요소 안쪽에만 있고 화면을 따라다니지 않는다.
 *
 * 손가락에도 같은 것을 준다(§26). 모바일을 데스크톱 hover의 축소판으로 만들지
 * 않는다는 것은, 반응을 지우는 것이 아니라 계기를 바꾼다는 뜻이다 — 커서가
 * 있는 곳에서는 지나가는 자리가, 손가락에는 누른 자리가 빛의 위치가 된다.
 * 다만 손가락은 화면에 머물지 않으므로 떼고 나면 빛도 스스로 가라앉는다.
 *
 * 좌표는 CSS 변수(--gx, --gy)로 넘긴다. 값이 바뀔 때마다 React를 다시 그리면
 * 포인터를 움직이는 동안 지면 전체가 렌더링되므로, DOM에 직접 쓰고 rAF로 묶는다.
 */
export function useGloss<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const frame = useRef(0)
  const timer = useRef(0)
  const next = useRef<{ x: number; y: number } | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current)
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [])

  const flush = useCallback(() => {
    frame.current = 0

    const element = ref.current
    const point = next.current

    if (!element || !point) return

    element.style.setProperty('--gx', `${point.x}%`)
    element.style.setProperty('--gy', `${point.y}%`)
  }, [])

  const light = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (reduced) return

      const element = ref.current

      if (!element) return

      const box = element.getBoundingClientRect()

      next.current = {
        x: ((event.clientX - box.left) / box.width) * 100,
        y: ((event.clientY - box.top) / box.height) * 100,
      }

      element.dataset['lit'] = 'true'

      if (!frame.current) frame.current = window.requestAnimationFrame(flush)
    },
    [flush, reduced],
  )

  const dim = useCallback(() => {
    const element = ref.current

    if (element) delete element.dataset['lit']
  }, [])

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<T>) => {
      // 마우스는 지나가는 동안 계속 비춘다. 손가락은 눌렀을 때만 비춘다.
      if (event.pointerType !== 'mouse') return

      light(event)
    },
    [light],
  )

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (event.pointerType === 'mouse') return

      if (timer.current) window.clearTimeout(timer.current)

      light(event)
    },
    [light],
  )

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (event.pointerType === 'mouse') return

      // 손가락을 뗀 자리에서 빛이 한 박자 늦게 가라앉는다.
      timer.current = window.setTimeout(dim, TOUCH_LINGER_MS)
    },
    [dim],
  )

  /*
   * 손가락을 떼면 브라우저가 곧바로 pointerleave까지 보낸다. 그것을 그대로
   * 받으면 위에서 잡아 둔 여운이 즉시 지워져 «반응하지 않는 화면»이 된다.
   * 떠나는 것은 커서에게만 있는 일이므로 마우스에서만 끈다.
   */
  const onPointerLeave = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (event.pointerType !== 'mouse') return

      dim()
    },
    [dim],
  )

  return { ref, onPointerMove, onPointerDown, onPointerUp, onPointerLeave }
}
