/**
 * Semicolon의 모든 카피와 경로. 마크업에는 문자열을 하드코딩하지 않는다.
 *
 * 편집 규칙 —
 *   · 이 공간을 설명하려 들지 않는다. 왜 이름이 ';'인지는 읽다 보면 드러나야 한다.
 *   · 한 문장이 두 곳에서 같은 말을 하지 않는다.
 *   · 채울 데이터가 없으면 비워 둔다. 자리를 메우려고 값을 만들지 않는다.
 */

export const semicolon = {
  name: 'SEMICOLON',
  /** 이 공간의 이름이자 유일한 그래픽 자산 */
  mark: ';',
  /** 주소창에 보이는 그대로 */
  path: '/;',
  href: '/;/',
  url: 'https://wellknews.github.io/;/',

  /** 갈라져 나온 뿌리. 관계를 끊지는 않되 앞세우지도 않는다. */
  root: {
    name: 'WELLKNEWS',
    href: '/',
  },

  home: {
    /** 이 공간이 무엇인지 한 번에 말하는 유일한 자리 */
    headline: ['바쁜 삶 속의', '세미콜론.'],
    /** 세미콜론이 왜 세미콜론인지. 마침표도 아니고 이어짐도 아니라는 것. */
    statement: [
      '세미콜론은 문장을 끝내지 않는다. 그렇다고 쉼 없이 이어가지도 않는다. 진행 중인 문장을 잠시 구분하고 다시 이어간다.',
      '여기서 말하는 여유도 삶을 중단하거나 현실에서 빠져나오는 일이 아니다. 계속 이어지는 삶의 중간에 잠시 삽입되는 하나의 구간이다.',
    ],
    /** 두 콘텐츠를 소개하기 전에 놓는 기준선 */
    principle: '여유로운 삶을 추구하는 것이 아니라, 바쁜 삶 속에 여유를 삽입한다.',
  },

  session: {
    label: 'SESSION',
    path: '/;/session',
    href: '/;/session/',
    /** 영문 한 줄은 개념의 정의, 국문 한 줄은 하는 일 */
    concept: 'Bounded experience.',
    definition: '경계를 가진 하나의 경험을 대상으로 삼아 분석한다.',
    /** 아직 글이 없을 때 화면에 남기는 유일한 문장 */
    empty: '아직 분석한 경험이 없다.',
  },

  thread: {
    label: 'THREAD',
    path: '/;/thread',
    href: '/;/thread/',
    concept: 'Ongoing thought.',
    definition: '아직 끝나지 않은 생각을 그대로 이어간다.',
    empty: '아직 이어가는 생각이 없다.',
  },

  /** 각 페이지의 <title>·<meta description>과 짝을 이루는 값 */
  meta: {
    description:
      '바쁜 삶 속에 삽입하는 여유. Semicolon은 장소를 수집하지 않고, 삶의 흐름에서 구분할 가치가 있었던 경험을 분석한다.',
  },
} as const

/**
 * 저작권 연도는 빌드 시점이 아니라 조회 시점 기준으로 표기한다.
 *
 * 소유자 이름을 붙이지 않는다 — 바로 옆에 루트 도메인이 적혀 있어 같은 정보가 두 번 들어간다.
 */
export const copyright = `© ${new Date().getFullYear()}`
