/**
 * 사이트의 모든 카피와 링크. 마크업에는 문자열을 하드코딩하지 않는다.
 *
 * 편집 규칙 — 브랜드명, 슬로건, 행동 유도 문구는 페이지 전체에서 각각 한 번만 등장한다.
 * 새 정보를 담지 못하는 요소는 추가하지 않는다.
 *   · 'WELLKNEWS' 워드마크 → 히어로 로고 1회 + 푸터 저작권 1회
 *   · 'Every news, well knew.' → 히어로 헤드라인 1회
 *   · '제보' 관련 문구 → REPORT 섹션 안에서 역할이 겹치지 않게 배분
 */

export type Channel = {
  name: string
  href: string
}

export type NavItem = {
  label: string
  href: string
}

/** 이 루트에서 갈라져 나온 개인 프로젝트 하나. */
export type Branch = {
  /** 화면에 크게 노출되는 이름 */
  name: string
  /** 표기용 경로. 주소창에 보이는 그대로 적는다. */
  path: string
  /** 실제 링크. 정적 호스팅이 디렉터리 리다이렉트를 하지 않도록 슬래시까지 적는다. */
  href: string
  /** 이름만으로 전달되지 않는 한 줄. 설명이 아니라 성격을 적는다. */
  description: string
}

export const site = {
  name: 'WELLKNEWS',
  /** 배포 도메인. 메타태그와 구조화 데이터의 절대 URL 기준점. */
  url: 'https://wellknews.github.io',
  locale: 'ko_KR',

  /** <meta name="description"> 및 OG 설명 */
  description:
    'WELLKNEWS는 숏폼으로 소식을 전하는 뉴스 채널입니다. 확인된 사실만, 넘긴 뒤에도 남는 형태로 전합니다.',

  nav: [
    { label: 'REPORT', href: '#report' },
    { label: 'CHANNELS', href: '#channels' },
    { label: 'ABOUT', href: '#about' },
  ] satisfies NavItem[],

  hero: {
    /** 글자 단위 마스크 리빌의 단위가 되는 줄. 줄바꿈 위치는 디자인이 통제한다. */
    headline: ['EVERY NEWS,', 'WELL KNEW.'],
    /** 영문 슬로건이 정서를 맡고, 이 줄이 '무엇을 하는 곳인가'를 맡는다. */
    positioning: '숏폼으로 보는 소식',
    /** 검은 색면 위에서 아래에 더 있다는 것을 알리는 유일한 단서 */
    scrollCue: 'SCROLL',
  },

  report: {
    index: '01',
    label: 'REPORT',
    /** 훅 — 제보의 동기를 건드린다 */
    heading: ['세상에 알려야 할', '이야기가 있다면.'],
    /** 훅이 말하지 않은 것만 말한다 — 어떻게 다뤄지는지 */
    body: '보내주신 내용은 사실 확인을 거친 뒤에만 다룹니다. 신원은 밝히지 않아도 됩니다.',
    /** 무엇을 보낼 수 있는지 */
    types: ['사진', '영상', '문서', '링크'],
    cta: '제보하기',
  },

  channels: {
    index: '02',
    label: 'CHANNELS',
    /**
     * 채널 자체가 제품이므로 설명을 덧붙이지 않고 목록에 화면을 내준다.
     * 플랫폼 로고를 넣지 않는 것도 같은 이유다 — 이름이 이미 그 정보를 담고 있다.
     */
    items: [
      { name: 'Instagram', href: 'https://instagram.com/wellknews' },
      { name: 'Threads', href: 'https://threads.net/@wellknews' },
      { name: 'YouTube', href: 'https://www.youtube.com/@wellknews' },
      { name: 'Facebook', href: 'https://facebook.com/wellknewskr' },
    ] satisfies Channel[],
  },

  about: {
    index: '03',
    label: 'ABOUT',
    /** 브랜드명·슬로건을 반복하지 않고, 편집 기준 자체를 본문으로 삼는다. */
    lead: ['짧게 전하지만', '가볍게 만들지 않습니다.'],
    principles: [
      { term: '확인', description: '출처가 분명한 것만 다룹니다.' },
      { term: '맥락', description: '분량을 줄이되 맥락은 덜어내지 않습니다.' },
      { term: '기록', description: '넘긴 뒤에도 남도록 편집합니다.' },
    ],
  },

  /**
   * 이 루트에서 갈라져 나온 개인 프로젝트들.
   *
   * Semicolon 전용 섹션을 만들지 않는 이유는 하나다 — 프로젝트가 하나 늘 때마다
   * 메인 구조를 다시 짜야 하기 때문이다. 여기서는 items에 한 줄만 더한다.
   *
   * 입구는 끝까지 WELLKNEWS의 언어를 쓴다. 링크 너머의 디자인을 이 화면으로
   * 미리 가져오지 않는다 — 문을 통과한 뒤에 만나야 다른 세계로 읽힌다.
   */
  elsewhere: {
    index: '04',
    label: 'ELSEWHERE',
    items: [
      {
        name: 'SEMICOLON',
        path: '/;',
        href: '/;/',
        description: 'A pause inside a busy life.',
      },
    ] satisfies Branch[],
  },

  footer: {
    /** 사이트를 만든 사람. 브랜드 계정(CHANNELS)과 역할이 달라 중복이 아니다. */
    creditLabel: 'SITE BY',
    contacts: [
      { label: 'Instagram @muishiz', href: 'https://instagram.com/muishiz', external: true },
      { label: 'muishizen51@gmail.com', href: 'mailto:muishizen51@gmail.com', external: false },
    ],
  },
} as const

/** 저작권 연도는 빌드 시점이 아니라 조회 시점 기준으로 표기한다. */
export const copyright = `© ${new Date().getFullYear()} ${site.name}`
