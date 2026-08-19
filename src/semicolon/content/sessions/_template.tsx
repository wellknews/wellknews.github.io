import type { Session } from '../types'

/**
 * 새 SESSION을 쓸 때 이 파일을 복사한다.
 *
 *   1. sessions/유원재.tsx 처럼 파일을 만든다 (파일명은 slug와 맞추는 편이 편하다)
 *   2. 아래 형태로 내용을 채운다
 *   3. content/sessions.ts의 sessions 배열 맨 앞에 import해서 넣는다
 *
 * 규칙은 두 가지뿐이다.
 *
 *   · 없는 정보는 비워 둔다. meta의 항목은 전부 선택이고, 채우려고 값을
 *     지어내지 않는다. 적지 않으면 화면에도 나오지 않는다.
 *   · body의 구조는 이 콘텐츠가 정한다. 아래 예시는 최소한의 형태일 뿐이고,
 *     필요하면 여기서 얼마든지 다른 구조를 만들어도 된다.
 *
 * 쓰는 대상은 여행 일정이나 방문 기록이 아니라 하나의 경험이다. 무엇을 했는지
 * 시간순으로 늘어놓는 대신, 그 경험에서 흥미로웠던 지점을 분해해서 본다.
 * 사진도 마찬가지다. 분위기를 전하려고 걸지 않고, 그 문단의 근거가 될 때만 건다.
 *
 * 이 파일은 sessions 배열에 등록되어 있지 않으므로 사이트에 나오지 않는다.
 */
export const template: Session = {
  slug: 'slug',
  title: '제목',

  /** 있으면 적고 없으면 지운다. 목록과 본문 머리에 같은 줄로 나온다. */
  meta: {
    date: '2026-01-01',
    location: '장소',
    duration: '1박 2일',
    type: 'STAY',
  },

  /** 목록에 걸리는 한 줄. 요약이 아니라 이 글이 무엇을 보는지에 대한 문장. */
  excerpt: '이 경험에서 무엇을 봤는지 한 줄.',

  body: (
    <>
      <p>본문.</p>

      <h3>소제목</h3>

      <p>단락.</p>

      <figure>
        <img src="/;/images/파일명.jpg" alt="사진이 무엇을 보여주는지" />
        <figcaption>이 사진이 어떤 근거인지</figcaption>
      </figure>

      <blockquote>인용이나 따로 떼어 둘 문장.</blockquote>
    </>
  ),
}
