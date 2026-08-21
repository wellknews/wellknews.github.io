import { useEffect, useState } from 'react'

import { COMPACT_MAX, viewportOf, WIDE_MIN, type Viewport } from './viewport'

/** 세 판면의 경계를 그대로 미디어 쿼리로 옮긴 것. */
const COMPACT = `(max-width: ${COMPACT_MAX}px)`
const WIDE = `(min-width: ${WIDE_MIN}px)`

/**
 * 지금 어느 판면에 있는지.
 *
 * 대부분의 차이는 CSS가 처리한다. 이 훅은 «같은 내용을 다른 순서로 놓아야
 * 하는» 경우에만 쓴다 — 좁은 화면에서 장면을 합치거나, 커서를 전제로 만든
 * 장치를 아예 그리지 않을 때다.
 *
 * 두 벌을 다 그려 놓고 CSS로 숨기지 않는 이유는 이미지 때문이다. 숨긴 쪽의
 * 사진도 문서에 남아 있으면 쓰지 않을 파일을 받게 되고, 스크린리더는 같은
 * 내용을 두 번 읽는다.
 */
export function useViewport(): Viewport {
  const [viewport, setViewport] = useState<Viewport>(() => viewportOf(window.innerWidth))

  useEffect(() => {
    const compact = window.matchMedia(COMPACT)
    const wide = window.matchMedia(WIDE)

    /* 폭을 직접 읽는다. 두 질의의 참·거짓을 조합하는 것보다 경계에서 헷갈릴 일이 없다. */
    const sync = () => setViewport(viewportOf(window.innerWidth))

    sync()
    compact.addEventListener('change', sync)
    wide.addEventListener('change', sync)

    return () => {
      compact.removeEventListener('change', sync)
      wide.removeEventListener('change', sync)
    }
  }, [])

  return viewport
}
