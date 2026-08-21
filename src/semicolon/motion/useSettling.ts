import { useCallback, useEffect, useRef } from 'react'

/**
 * 사람이 건드릴 때만 도는 프레임 루프.
 *
 * 이 공간의 규칙은 «움직임은 사람이 시작한다»이다. 그래서 루프를 계속 돌려
 * 놓고 값이 0인 상태를 그리는 대신, 더 움직일 것이 남지 않으면 루프 자체를
 * 세운다. 아무도 건드리지 않는 동안 SEMICOLON은 정말로 정지해 있다.
 *
 * step은 남은 움직임이 있으면 true를 돌려준다. false를 돌려주는 순간
 * requestAnimationFrame이 끊기고, 다음 wake()에서 그 자리부터 다시 돈다.
 */
export function useSettling(step: (dt: number) => boolean): () => void {
  const stepRef = useRef(step)
  const frame = useRef<number | undefined>(undefined)
  const last = useRef(0)

  // 렌더 중에 ref를 쓰지 않는다. 매 렌더 뒤 최신 step으로 갈아 끼운다.
  useEffect(() => {
    stepRef.current = step
  })

  const tick = useCallback((now: number) => {
    /*
     * 탭이 백그라운드에 다녀오거나 첫 프레임이 늦게 오면 dt가 크게 튄다.
     * 그대로 쓰면 색면이 한 프레임에 목표까지 순간이동한다. 상한을 둔다.
     */
    const dt = Math.min((now - last.current) / 1000, 1 / 30)

    last.current = now

    if (stepRef.current(dt)) {
      frame.current = window.requestAnimationFrame(tick)
    } else {
      frame.current = undefined
    }
  }, [])

  const wake = useCallback(() => {
    if (frame.current !== undefined) return

    last.current = performance.now()
    frame.current = window.requestAnimationFrame(tick)
  }, [tick])

  useEffect(
    () => () => {
      if (frame.current === undefined) return

      window.cancelAnimationFrame(frame.current)
      frame.current = undefined
    },
    [],
  )

  return wake
}
