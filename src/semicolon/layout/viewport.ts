/**
 * 이 공간이 인정하는 세 가지 판면.
 *
 * 화면이 좁아졌다고 해서 같은 조판을 접기만 하는 것이 아니라, 폭에 따라 아예
 * 다른 편집 문법을 쓴다. 그래서 분기점이 «어디서 줄이 깨지는가»가 아니라
 * «어디서부터 다른 지면이 되는가»에서 나온다.
 *
 *   compact  ≤ 599px   장면을 합치고 움직임의 폭을 낮춘다
 *   snug     600–899   여백 칼럼은 없지만 구조는 남는다
 *   wide     ≥ 900px   넓은 판면 위에서 여백과 반응으로 의미를 만든다
 *
 * 좁아진다고 반응이 없어지지는 않는다. 합치는 것은 장면이고 낮추는 것은
 * 움직임의 폭이지, 만질 수 있는 것 자체가 아니다. 손가락으로 찍어 본 사람에게
 * 아무 일도 일어나지 않으면 그것은 얌전한 판면이 아니라 고장 난 판면이다.
 * `npm run audit`이 세 판면 모두에서 이 선을 지킨다.
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
