import { useCallback, useEffect, useRef, type PointerEvent, type RefObject } from 'react'

/** 손가락으로 찍은 자리가 밝은 채로 머무는 시간(ms). */
const HOLD = 2200

export type PointerLight = {
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
  onPointerDown: (event: PointerEvent<HTMLElement>) => void
  onPointerLeave: (event: PointerEvent<HTMLElement>) => void
  onPointerCancel: () => void
}

/**
 * 사람이 보고 있는 자리를 판에 적어 두는 일.
 *
 * 커서는 지나가는 동안 따라오고, 손가락은 찍은 자리에 잠깐 머문다. 이 두 규칙이
 * 미묘해서 두 곳에 따로 적어 두면 반드시 한쪽만 고쳐지는 날이 온다. 실제로
 * 그렇게 해서 좁은 화면의 반응이 통째로 죽은 채 배포된 적이 있다.
 *
 * 규칙은 세 가지다.
 *
 *   · 커서는 판 위를 지나는 동안 따라온다. 손가락은 끌 때 따라오지 않는다 —
 *     따라오게 하면 세로 스크롤을 방해한다.
 *   · 찍으면 그 자리가 켜진다. 커서든 손가락이든 같다.
 *   · 손가락에서는 leave로 끄지 않는다. 손을 떼는 순간 포인터가 사라지면서
 *     leave가 곧바로 따라오기 때문에, 그 신호로 끄면 찍은 자리가 밝을 시간이
 *     없다. 손가락이 켠 빛은 타이머가 끈다.
 *
 * 판에는 `--x`, `--y`(백분율)와 `data-lit`을 적는다. 그것으로 무엇을 할지는
 * 각 장치의 CSS가 정한다.
 */
export function usePointerLight(
  ref: RefObject<HTMLElement | null>,
  /** 자리를 알았을 때 더 계산할 것이 있으면. 비율(0..1)과 판의 크기를 받는다. */
  at?: (x: number, y: number, rect: DOMRect) => void,
): PointerLight {
  const holdTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(holdTimer.current), [])

  const light = useCallback(
    (clientX: number, clientY: number) => {
      const host = ref.current

      if (!host) return

      const rect = host.getBoundingClientRect()
      const x = (clientX - rect.left) / rect.width
      const y = (clientY - rect.top) / rect.height

      host.style.setProperty('--x', `${(x * 100).toFixed(2)}%`)
      host.style.setProperty('--y', `${(y * 100).toFixed(2)}%`)
      host.dataset.lit = 'true'

      at?.(x, y, rect)
    },
    [at, ref],
  )

  const dim = useCallback(() => {
    const host = ref.current

    if (!host) return

    window.clearTimeout(holdTimer.current)
    host.dataset.lit = 'false'
    host.style.setProperty('--focus', '0')
  }, [ref])

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return

      light(event.clientX, event.clientY)
    },
    [light],
  )

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      light(event.clientX, event.clientY)

      if (event.pointerType !== 'touch') return

      window.clearTimeout(holdTimer.current)
      holdTimer.current = window.setTimeout(dim, HOLD)
    },
    [dim, light],
  )

  const onPointerLeave = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      if (event.pointerType === 'touch') return

      dim()
    },
    [dim],
  )

  return { onPointerMove, onPointerDown, onPointerLeave, onPointerCancel: dim }
}
