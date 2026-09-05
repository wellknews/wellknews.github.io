import type { ReactNode } from 'react'

/**
 * 콘텐츠에 붙는 부가 정보.
 *
 * 모든 항목이 같은 메타데이터를 가질 필요는 없다. 없는 정보를 채우려고 값을
 * 지어내지 않고, 있는 정보라도 그 콘텐츠를 이해하는 데 필요할 때만 적는다.
 * 화면은 여기 실제로 들어온 것만 보여준다.
 */
export type Meta = {
  /** 'YYYY-MM-DD', 'YYYY-MM' 등 아는 만큼만. 화면에는 적은 그대로 나온다. */
  date?: string
  location?: string
  duration?: string
  type?: string
}

/**
 * SESSION — 경계를 가진 경험.
 *
 * 공간만이 아니라 시간·사건·기간까지 포괄한다. 하루짜리 축제도, 3주짜리
 * 부트캠프도 하나의 Session이다. 기준은 길이가 아니라 '떼어낼 수 있는가'다.
 *
 * body를 템플릿으로 고정하지 않고 ReactNode로 받는 이유는, 어떤 경험은 사진이
 * 중심이고 어떤 경험은 문장이 중심이기 때문이다. 공통 문법(Prose)은 유지하되
 * 구조는 콘텐츠마다 새로 짠다.
 */
/**
 * 목록과 본문이 함께 쓰는 한 장.
 *
 * 완성품 사진일 필요는 없다. 그 경험이 시작될 때의 상태를 보여 주는 편이
 * 더 정확할 때가 많다 — 만들기 전의 시안이라든지.
 */
export type Cover = {
  src: string
  /** 이 사진이 무엇을 보여주는지. 장식이 아니므로 빈 alt를 쓰지 않는다. */
  alt: string
  width: number
  height: number
  /**
   * 이 이미지에서 의미가 있는 자리(0..1의 비율).
   *
   * 연출값이 아니라 이미지에 대한 사실이다. 어디에 무엇이 찍혀 있는지는
   * 이 파일을 고른 사람만 알고, 표지든 목록이든 그 자리를 기준으로 보여 준다.
   */
  focus?: { x: number; y: number }
}

/**
 * 이 경험이 지면을 어떻게 쓰는지.
 *
 *   column  기본. 제목·메타데이터·본문이 정해진 판면에 앉는다.
 *   stage   본문이 판면 전체를 가져간다. 그 경험에만 있는 인터랙션이 필요할 때.
 *
 * 대부분의 SESSION은 column이다. stage는 형태 자체가 그 경험의 일부일 때만 쓴다 —
 * 남발하면 SESSION마다 다른 사이트가 되고, 그러면 공통 문법이 사라진다.
 */
export type SessionDisplay = 'column' | 'stage'

export type Session = {
  slug: string
  title: string
  subtitle?: string
  meta?: Meta
  /** 목록에 걸리는 한 줄. 없으면 목록은 제목만 보여준다. */
  excerpt?: string
  cover?: Cover
  display?: SessionDisplay
  body: ReactNode
  /**
   * 작은 판면(≤599px)을 위한 다른 배치.
   *
   * 내용을 줄이는 자리가 아니다. 같은 문장을 그대로 쓰되 장면을 합치고,
   * 커서를 전제로 만든 장치를 뺀다. 넓은 지면에서 각자 자리를 갖던 것들이
   * 한 줄 안에 모이면 «공간의 다양성»이 «장치의 연속»으로 바뀌기 때문이다.
   *
   * 적지 않으면 좁은 화면도 `body`를 그대로 쓴다. 대부분의 기록은 그래도 된다.
   */
  compact?: ReactNode
}

/**
 * 어디에서 어디까지인가.
 *
 * 버전 이름을 지어 붙이지 않는다. v2.3.0 같은 이름은 사람이 나중에 정한 것이고,
 * 실제로 일어난 일은 «이 커밋에서 저 커밋까지»다. 짧은 해시 일곱 자리는
 * 꾸며낸 데가 없는 유일한 이름이라 그것을 그대로 쓴다.
 */
export type Revision = {
  /** 시작한 자리. '8cd8123' */
  from: string
  /** 도착한 자리. '7d5e68d' */
  to: string
}

/**
 * 그 사이에 실제로 움직인 양.
 *
 * git이 세어 주는 숫자 그대로다. 여기에 «난이도»나 «중요도» 같은 값을 더하지
 * 않는다 — 그런 것은 사람이 매기는 인상이고, 인상은 본문이 말한다.
 */
export type Diff = {
  commits: number
  files: number
  /** 더한 줄 */
  added: number
  /** 지운 줄 */
  removed: number
}

/**
 * CODE — 프로젝트가 옮겨 간 자리.
 *
 * SESSION이 경계를 가진 «경험»이라면 CODE는 경계를 가진 «변경»이다. 둘 다
 * 시작과 끝이 있지만, 세션의 경계는 기억이 정하고 코드의 경계는 두 개의
 * 해시가 정한다. 그래서 이쪽에는 지어낼 수 있는 값이 거의 없다.
 *
 * 세션과 달리 머리에 들어가는 항목이 미리 정해져 있다. 코드의 변경에는 실제로
 * 공통된 모양이 있기 때문이다 — 어디에서 어디까지, 몇 개의 커밋, 몇 줄이
 * 늘고 줄었는지. 그것을 매번 새로 짜는 것은 자유가 아니라 낭비다.
 *
 * 대신 body는 여전히 ReactNode다. 무엇을 고쳤는지는 정형이지만 무엇을
 * 잘못 짚었는지는 매번 다른 이야기라서, 그쪽까지 틀에 넣지는 않는다.
 */
export type Code = {
  slug: string
  title: string
  subtitle?: string
  /** 어느 저장소인가. 주소가 아니라 이름 하나면 된다. */
  repo?: string
  revision?: Revision
  diff?: Diff
  meta?: Meta
  /** 목록에 걸리는 한 줄. 무엇을 고쳤는지가 아니라 이 기록이 무엇을 보는지. */
  excerpt?: string
  body: ReactNode
  /** 작은 판면을 위한 다른 배치. 적지 않으면 body를 그대로 쓴다. */
  compact?: ReactNode
}

/**
 * THREAD — 이어지고 있는 생각.
 *
 * 완성된 분석이 아니므로 제목이 없어도 된다. 대신 날짜는 반드시 있다.
 * 생각을 이어붙인 순서 자체가 Thread의 형식이기 때문이다.
 */
/**
 * 이 생각이 지면에 앉는 방식.
 *
 *   note   기본. 날짜가 여백 칼럼에 앉고 본문이 그 옆에 온다.
 *   loud   한 문장짜리 생각. 판면 전체를 쓰고 크게 앉는다.
 *   aside  곁가지. 오른쪽 안쪽으로 물러나 좁고 낮게 앉는다.
 *
 * 길이가 형태를 정하지는 않는다. 어떤 자리에 놓고 싶은지를 글이 직접 고른다.
 */
export type ThreadForm = 'note' | 'loud' | 'aside'

export type Thread = {
  slug: string
  /** 'YYYY-MM-DD' */
  date: string
  title?: string
  form?: ThreadForm
  body: ReactNode
}
