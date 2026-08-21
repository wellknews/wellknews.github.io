import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

/**
 * 커서가 있는 화면인지.
 *
 * 판면 폭과는 다른 질문이다. 폭은 «무엇을 어떤 순서로 놓을까»를 정하고,
 * 이것은 «이 장치가 자기 존재를 알릴 수 있는가»를 정한다.
 *
 * 이 공간에는 커서가 있어야만 성립하는 장치가 몇 개 있다. 다가가면 갈라지는
 * 선, 밀려나는 색면, 지나가는 자리만 또렷해지는 이미지, 가로지르면 뒤집히는
 * 시안 — 전부 커서 모양이나 움직임 자체가 «여기서 무언가 할 수 있다»는 말을
 * 대신하고 있다. 손가락에는 그 말이 전해지지 않는다. 알릴 수 없는 장치는
 * 장치가 아니라 장식이므로, 그런 곳에서는 아예 정지한 상태로 놓는다.
 *
 * 폭이 아니라 입력 방식으로 나누는 이유는 큰 태블릿 때문이다. 900px이 넘어도
 * 커서가 없으면 사정은 휴대폰과 같다.
 */
export function useCursor(): boolean {
  const [cursor, setCursor] = useState(() => window.matchMedia(QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const sync = () => setCursor(media.matches)

    sync()
    media.addEventListener('change', sync)

    return () => media.removeEventListener('change', sync)
  }, [])

  return cursor
}
