import { useCallback, useEffect, useRef, type PointerEvent as ReactPointerEvent } from 'react'

import { useReducedMotion } from './useReducedMotion'

/**
 * 표면 위를 지나가는 아주 약한 반사광(§22, §39).
 *
 * 이 공간의 소재는 종이가 아니라 피부·젤·코팅면이다. 그래서 hover에 이미지를
 * 확대하는 대신 표면의 광택이 포인터를 따라 옮겨 간다. 커서를 꾸미는 장식이
 * 아니라 «이 면은 만질 수 있는 것»이라는 감각을 주는 것이 목적이므로,
 * 광택은 늘 요소 안쪽에만 있고 화면을 따라다니지 않는다.
 *
 * 좌표는 CSS 변수(--gx, --gy)로 넘긴다. 값이 바뀔 때마다 React를 다시 그리면
 * 포인터를 움직이는 동안 지면 전체가 렌더링되므로, DOM에 직접 쓰고 rAF로 묶는다.
 *
 * 손가락에는 hover가 없다. 포인터가 굵은 기기에서는 광택을 켜지 않고,
 * 움직임을 줄이기로 한 사람에게도 붙이지 않는다.
 */
export function useGloss<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const frame = useRef(0)
  const next = useRef<{ x: number; y: number } | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    return () => {
      if (frame.current) window.cancelAnimationFrame(frame.current)
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

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (reduced || event.pointerType !== 'mouse') return

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

  const onPointerLeave = useCallback(() => {
    const element = ref.current

    if (element) delete element.dataset['lit']
  }, [])

  return { ref, onPointerMove, onPointerLeave }
}
