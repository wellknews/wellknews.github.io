import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

type Options = {
  /** 커서를 따라가는 비율. 1이면 커서에 완전히 붙는다. */
  strength?: number
  /** 요소 경계에서 이만큼 바깥까지 반응 범위로 잡는다(px). */
  padding?: number
}

/**
 * 요소가 커서 쪽으로 살짝 끌려오는 마그네틱 효과.
 * 포인터가 정밀한 기기(마우스)에서만 동작하고, 모션 최소화 설정이면 완전히 비활성화된다.
 */
export function useMagnetic<T extends HTMLElement>({
  strength = 0.28,
  padding = 40,
}: Options = {}) {
  const ref = useRef<T>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let frame = 0

    const onPointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = event.clientX - cx
        const dy = event.clientY - cy

        const withinX = Math.abs(dx) < rect.width / 2 + padding
        const withinY = Math.abs(dy) < rect.height / 2 + padding

        if (withinX && withinY) {
          el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`
        } else {
          el.style.transform = ''
        }
      })
    }

    const reset = () => {
      cancelAnimationFrame(frame)
      el.style.transform = ''
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', reset)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', reset)
      reset()
    }
  }, [strength, padding, prefersReduced])

  return ref
}
