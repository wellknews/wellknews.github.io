import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * 움직임을 줄이기로 한 사람인지.
 *
 * CSS 쪽은 미디어 쿼리가 알아서 처리하지만, 프레임 루프는 애초에 돌지
 * 않아야 한다. 이 값이 true면 리스너도 붙이지 않고 정지한 화면을 그린다.
 *
 * 설정은 브라우저를 쓰는 도중에도 바뀔 수 있어 변화를 계속 듣는다.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const sync = () => setReduced(media.matches)

    sync()
    media.addEventListener('change', sync)

    return () => media.removeEventListener('change', sync)
  }, [])

  return reduced
}
