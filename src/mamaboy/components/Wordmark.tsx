/**
 * mamaboy 레터링(§20).
 *
 * 로고를 서체로 조판하지 않고 직접 그린다. 이 브랜드에서 가장 강한 시각 자산이
 * 이름 그 자체이기 때문이다. 소문자만 쓰고, 획 대비가 없는 단선(monoline)에
 * 둥근 종단을 준다 — 반복되는 m-a-m-a의 리듬이 그때 가장 잘 읽힌다.
 *
 * 지나치게 귀엽지 않게 만드는 장치는 두 가지다. 첫째, 아치와 원의 반지름을
 * 크게 잡아 글자 하나하나가 기하학적으로 정확하게 보이게 한다. 둘째, 어떤
 * 글자에도 얼굴(눈·표정)이나 기울기 같은 장난을 넣지 않는다. 형태는 차분하고,
 * 장난기는 이름의 리듬과 이 지면의 표면감이 만든다.
 *
 * 좌표계
 *   기준선 150 · x-높이 60 · 어센더 26 · 디센더 188 · 획 두께 24
 *   모든 좌표는 획의 중심선이고, 둥근 종단이 양끝으로 12씩 더 나간다.
 */

/** 아치 두 개와 왼쪽 기둥. 이 글자의 리듬이 브랜드 이름 전체를 지배한다. */
function m(x: number): string {
  return [
    `M ${x},150 V 88`,
    `A 28,28 0 0 1 ${x + 56},88`,
    `V 150`,
    `M ${x + 56},88`,
    `A 28,28 0 0 1 ${x + 112},88`,
    `V 150`,
  ].join(' ')
}

/** 완전한 원. b·o·a가 같은 원을 공유해서 낱글자들이 한 식구로 읽힌다. */
function bowl(x: number): string {
  return `M ${x},105 A 45,45 0 0 1 ${x + 90},105 A 45,45 0 0 1 ${x},105`
}

/** 단층(single-story) a. 2층 구조를 쓰면 이 크기에서 곧바로 딱딱해진다. */
function a(x: number): string {
  return `${bowl(x)} M ${x + 90},60 V 150`
}

function b(x: number): string {
  return `${bowl(x)} M ${x},26 V 150`
}

/**
 * u에 꼬리를 붙인 y.
 *
 * 사선 두 개로 만든 y는 이 레터링에서 유일하게 각진 글자가 되어 리듬을 끊는다.
 * 마지막 획이 기준선 아래에서 왼쪽으로 감기면 단어 전체가 한 번 더 둥글게 닫힌다.
 */
function y(x: number): string {
  return [
    `M ${x},60 V 105`,
    `A 45,45 0 0 0 ${x + 90},105`,
    `M ${x + 90},60 V 158`,
    `A 30,30 0 0 1 ${x + 60},188`,
  ].join(' ')
}

/* 낱글자의 자리. 중심선 기준 48씩 띄우면 종단까지 포함해 24의 간격이 남는다. */
const GLYPHS = [m(12), a(172), m(310), a(470), b(608), bowl(746), y(884)]

const VIEW_BOX = '0 0 990 214'

type Props = {
  /** 로고가 이름을 대신하는 자리에서는 낭독할 이름을 함께 준다. */
  title?: string | undefined
  className?: string | undefined
}

export function Wordmark({ title, className }: Props) {
  return (
    <svg
      className={className}
      viewBox={VIEW_BOX}
      fill="none"
      stroke="currentColor"
      strokeWidth={24}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      {GLYPHS.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  )
}
