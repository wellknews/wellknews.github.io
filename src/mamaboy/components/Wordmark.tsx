/**
 * mamaboy 레터링.
 *
 * 로고를 서체로 조판하지 않고 직접 그린다. 이 브랜드에서 가장 강한 시각 자산이
 * 이름 그 자체이기 때문이다. 소문자만 쓰고, 획 대비가 없는 두꺼운 단선에 둥근
 * 종단을 준다 — 반복되는 m-a-m-a의 리듬이 그때 가장 잘 읽힌다.
 *
 * 그리고 boy에서 그 리듬을 한 번 깬다. o의 자리에 속을 별로 도려낸 원반이
 * 들어가고, 그 위로 작은 반짝임 하나가 떠 있다. 여섯 글자가 같은 박자로
 * 이어지다가 일곱 번째에서 어긋나는 것이 이 레터링의 전부다.
 *
 * 기본형은 Flat Ink다(§13). 3D·젤·광택은 화면 안에서의 확장이지 로고 자체가
 * 아니므로, 이 파일은 색 하나와 형태만 갖는다.
 *
 * 좌표계
 *   기준선 150 · x-높이 바깥 50 · 어센더 18 · 디센더 196 · 획 두께 32
 *   좌표는 획의 중심선이고, 둥근 종단이 양끝으로 16씩 더 나간다.
 */

const STROKE = 32

/** 아치 두 개와 왼쪽 기둥. 이 글자의 리듬이 이름 전체를 지배한다. */
function m(x: number): string {
  return [
    `M ${x},150 V 96`,
    `A 30,30 0 0 1 ${x + 60},96`,
    `V 150`,
    `M ${x + 60},96`,
    `A 30,30 0 0 1 ${x + 120},96`,
    `V 150`,
  ].join(' ')
}

/** 완전한 원. a와 b가 같은 원을 공유해서 낱글자들이 한 식구로 읽힌다. */
function bowl(cx: number): string {
  return `M ${cx - 34},100 A 34,34 0 0 1 ${cx + 34},100 A 34,34 0 0 1 ${cx - 34},100`
}

/** 단층(single-story) a. 2층 구조는 이 두께에서 곧바로 막힌다. */
function a(cx: number): string {
  return `${bowl(cx)} M ${cx + 34},66 V 150`
}

function b(cx: number): string {
  return `${bowl(cx)} M ${cx - 34},34 V 150`
}

/**
 * u에 꼬리를 붙인 y.
 *
 * 사선 두 개로 만든 y는 이 레터링에서 유일하게 각진 글자가 되어 리듬을 끊는다.
 * 마지막 획이 기준선 아래에서 왼쪽으로 감기면 단어 전체가 한 번 더 둥글게 닫힌다.
 */
function y(cx: number): string {
  return [
    `M ${cx - 34},66 V 116`,
    `A 34,34 0 0 0 ${cx + 34},116`,
    `M ${cx + 34},66 V 150`,
    `A 30,30 0 0 1 ${cx + 4},180`,
  ].join(' ')
}

/**
 * 네 갈래 반짝임.
 *
 * 곡선의 조종점을 중심 가까이 두어 옆구리를 오목하게 만든다. 별처럼 각지지
 * 않고, 빛이 번지는 모양에 가깝게 남는다.
 */
function sparkle(cx: number, cy: number, r: number): string {
  const k = r * 0.16

  return [
    `M ${cx},${cy - r}`,
    `Q ${cx + k},${cy - k} ${cx + r},${cy}`,
    `Q ${cx + k},${cy + k} ${cx},${cy + r}`,
    `Q ${cx - k},${cy + k} ${cx - r},${cy}`,
    `Q ${cx - k},${cy - k} ${cx},${cy - r}`,
    'Z',
  ].join(' ')
}

/** 속을 반짝임 모양으로 도려낸 원반. o의 자리에 들어가 리듬을 깬다. */
function sparkleO(cx: number, cy: number): string {
  const disc = `M ${cx - 50},${cy} A 50,50 0 1 0 ${cx + 50},${cy} A 50,50 0 1 0 ${cx - 50},${cy} Z`

  return `${disc} ${sparkle(cx, cy, 34)}`
}

/* 낱글자의 자리. 종단까지 포함한 잉크 사이가 20씩 벌어진다. */
const STROKED = [m(16), a(222), m(308), a(514), b(634), y(874)]
const FILLED = sparkleO(754, 100)
/** 떠 있는 반짝임. 유일하게 잉크가 아닌 색을 갖는 부분이다. */
const ACCENT = sparkle(812, 26, 24)

const VIEW_BOX = '0 0 928 200'

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
      fill="currentColor"
      {...(title ? { role: 'img', 'aria-label': title } : { 'aria-hidden': true })}
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {STROKED.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>

      <path d={FILLED} fillRule="evenodd" />

      {/*
        반짝임의 색은 바깥에서 정한다. 잉크 한 색만 있는 자리(파비콘, 흰 글자로
        찍는 반전 로고)에서는 currentColor로 떨어뜨려 형태만 남긴다.
      */}
      <path d={ACCENT} fill="var(--wordmark-accent, currentColor)" />
    </svg>
  )
}
