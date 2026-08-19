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
export type Session = {
  slug: string
  title: string
  subtitle?: string
  meta?: Meta
  /** 목록에 걸리는 한 줄. 없으면 목록은 제목만 보여준다. */
  excerpt?: string
  body: ReactNode
}

/**
 * THREAD — 이어지고 있는 생각.
 *
 * 완성된 분석이 아니므로 제목이 없어도 된다. 대신 날짜는 반드시 있다.
 * 생각을 이어붙인 순서 자체가 Thread의 형식이기 때문이다.
 */
export type Thread = {
  slug: string
  /** 'YYYY-MM-DD' */
  date: string
  title?: string
  body: ReactNode
}
