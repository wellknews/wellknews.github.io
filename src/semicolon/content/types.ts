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
  /**
   * 흰 바탕에 오려 놓은 컷인지.
   *
   * 제품 시안처럼 흰 배경을 가진 이미지를 종이 위에 그냥 얹으면 흰 사각형이
   * 생기고, 그 순간 이미지가 지면의 일부가 아니라 붙여 놓은 카드로 보인다.
   * 곱하기로 겹치면 흰 바탕이 종이색이 되고 검은 부분만 남는다.
   *
   * 실제로 찍은 사진에는 쓰지 않는다. 사진 전체가 어두워진다.
   */
  onPaper?: boolean
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
