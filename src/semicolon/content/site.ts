/**
 * SEMICOLON의 모든 카피. 마크업에는 문자열을 하드코딩하지 않는다.
 *
 * 이 공간은 설명해서 이해시키지 않는다. 그래서 소개문도, 브랜드 슬로건도 두지 않고
 * 각 콘텐츠 종류가 무엇인지 한 줄로만 밝힌다.
 */
export const semicolon = {
  name: 'SEMICOLON',
  /** 이 공간에서 가장 강한 시각 자산. 로고를 따로 만들지 않는 이유다. */
  mark: ';',
  url: 'https://wellknews.github.io/;',

  hero: {
    /** 줄바꿈 위치는 디자인이 통제한다. */
    line: ['바쁜 삶 속의', '세미콜론.'],
  },

  session: {
    label: 'SESSION',
    /** 이 공간에서 SESSION이 무엇인지 선언한다. 설명이 아니라 정의다. */
    definition: '경계를 가진 경험을 하나씩 떼어내 분석한다.',
    empty: '아직 떼어낸 경험이 없다.',
  },

  thread: {
    label: 'THREAD',
    definition: '그 사이 계속 이어지는 생각을 남긴다.',
    empty: '아직 이어붙인 생각이 없다.',
  },

  /** 입구로 돌아가는 길. 이 공간과 WELLKNEWS를 잇는 유일한 연결이다. */
  entrance: {
    label: 'WELLKNEWS',
    href: '/',
  },

  notFound: {
    title: '없는 경로',
    body: '이 주소에 해당하는 것이 없다.',
  },
} as const
