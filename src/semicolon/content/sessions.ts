/**
 * SESSION — 경계를 가진 경험 하나를 대상으로 삼아 분석한 글.
 *
 * CMS를 두지 않는다. 글마다 필요한 구조가 다르기 때문이다. 어떤 글은 사진이 많고
 * 어떤 글은 문장만으로 끝난다. 공통 UI 문법(제목·메타·본문 블록)만 공유하고,
 * 그 안의 구성은 글마다 따로 짠다.
 *
 * 새 Session을 추가하는 순서 —
 *   1. 이 파일의 sessions 배열 맨 앞에 항목을 추가한다 (배열 순서가 곧 노출 순서다)
 *   2. `;/session/<slug>/index.html`을 만든다 (template 폴더를 복사하면 된다)
 *   3. vite.config.ts의 input 목록에 그 HTML을 등록한다
 */

export type SessionBlock =
  /** 본문 문단 */
  | { type: 'text'; value: string }
  /** 글 안의 소제목. 번호를 붙이지 않는다. */
  | { type: 'heading'; value: string }
  /** 인용하거나 따로 떼어 세우는 한 문장 */
  | { type: 'quote'; value: string }
  /**
   * 사진.
   *
   * 방문 인증이나 분위기 전달용으로 넣지 않는다. 주장에 필요한 장면만 넣는다.
   * 그래서 alt는 접근성 대체 텍스트이고, caption은 이 사진이 왜 근거인지를 적는 자리다.
   */
  | { type: 'image'; src: string; alt: string; width: number; height: number; caption?: string }

/** 이 경험에만 있는 정보. 항목 이름까지 글마다 다르게 정한다. */
export type SessionMeta = {
  term: string
  value: string
}

export type Session = {
  /** URL 조각. `;/session/<slug>/index.html`과 반드시 같아야 한다. */
  slug: string
  /** 사실상 유일한 필수 항목 */
  title: string
  subtitle?: string
  /** 표시용. 정렬에는 쓰지 않는다 — 순서는 배열이 정한다. */
  date?: string
  /** 없으면 메타 영역 자체를 그리지 않는다. */
  meta?: SessionMeta[]
  /** 본문에 들어가기 전에 한 번 세우는 문장 */
  lead?: string
  body: SessionBlock[]
  /**
   * 초안. 개발 서버에서만 보이고 배포본 목록에는 나오지 않는다.
   * 페이지 자체는 빌드되므로 링크를 아는 사람은 볼 수 있다.
   */
  draft?: boolean
}

export const sessions: Session[] = [
  {
    slug: 'template',
    draft: true,
    title: '이 글은 형식이다',
    subtitle: 'Session 하나가 화면에서 어떻게 조립되는지 보여주기 위한 초안',
    date: '2026',
    meta: [
      { term: 'TYPE', value: 'Template' },
      { term: 'STATUS', value: 'Draft' },
    ],
    lead: 'Session은 다녀온 곳을 소개하지 않는다. 경계를 가진 경험 하나를 떼어내 무엇이 그 경험을 그렇게 만들었는지 분석한다.',
    body: [
      {
        type: 'text',
        value:
          '제목과 메타, 본문 블록만 공유하고 나머지는 글마다 다르게 짠다. 이 페이지는 그 골격을 눈으로 확인하기 위한 초안이며, 실제 글이 들어오면 지운다.',
      },
      { type: 'heading', value: '무엇을 분석하는가' },
      {
        type: 'text',
        value:
          '대상은 장소일 수도, 사흘짜리 프로그램일 수도, 세 시간짜리 공연일 수도 있다. 공통점은 하나다. 일상과 구분되는 경계가 있었다는 것.',
      },
      {
        type: 'quote',
        value: '경험을 기록하는 것이 아니라, 경험을 하나의 대상으로 놓고 분석한다.',
      },
      {
        type: 'text',
        value:
          '사진은 근거로만 쓴다. 공간을 분석하면 공간 사진을, 서비스를 분석하면 그 장면을, 핵심이 디테일이라면 그 디테일을 넣는다. 넣을 이유를 한 문장으로 쓸 수 없는 사진은 넣지 않는다.',
      },
      {
        type: 'text',
        value:
          '메타도 마찬가지다. 모든 글이 같은 항목을 가질 필요가 없다. 기간이 의미 있는 경험에만 기간을 적고, 위치가 분석의 일부일 때만 위치를 적는다. 빈칸을 채우려고 값을 만들지 않는다.',
      },
    ],
  },
]

/**
 * 배포본에서는 초안을 목록에 올리지 않는다.
 *
 * 순서는 배열이 정한다. 날짜로 정렬하지 않는 이유는 날짜가 없는 글도 있기 때문이다.
 */
export const listedSessions: Session[] = sessions.filter(
  (session) => !session.draft || import.meta.env.DEV,
)

export function findSession(slug: string): Session | undefined {
  return sessions.find((session) => session.slug === slug)
}
