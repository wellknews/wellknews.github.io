/**
 * 이 공간이 인정하는 세 가지 판면.
 *
 * 화면이 좁아졌다고 해서 같은 조판을 접기만 하는 것이 아니라, 폭에 따라 아예
 * 다른 편집 문법을 쓴다. 그래서 분기점이 «어디서 줄이 깨지는가»가 아니라
 * «어디서부터 다른 지면이 되는가»에서 나온다.
 *
 *   compact  ≤ 599px   대부분을 지우고 몇 장면만 남긴다
 *   snug     600–899   여백 칼럼은 없지만 구조는 남는다
 *   wide     ≥ 900px   넓은 판면 위에서 여백과 반응으로 의미를 만든다
 *
 * CSS는 사용자 지정 속성을 미디어 쿼리 조건에 쓸 수 없어 각 파일이 숫자를
 * 그대로 적는다. 그 숫자의 뜻은 전부 여기에 있다. 바꿀 일이 생기면
 * `grep 599px`와 `grep 900px`로 한 번에 찾을 수 있다.
 */
export const COMPACT_MAX = 599
export const WIDE_MIN = 900

export type Viewport = 'compact' | 'snug' | 'wide'

/** 지금 폭이 어느 판면에 해당하는지. */
export function viewportOf(width: number): Viewport {
  if (width <= COMPACT_MAX) return 'compact'
  if (width < WIDE_MIN) return 'snug'
  return 'wide'
}
