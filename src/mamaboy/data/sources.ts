/**
 * RSS Source Registry(§34).
 *
 * 피드 주소를 코드 곳곳에 흩어 두지 않는다. 소스를 더하거나 잠시 끄는 일이
 * UI 코드를 건드리지 않고 끝나야 하기 때문이다. 실제 목록은 옆의 sources.json에
 * 있고, 수집 파이프라인(scripts/mamaboy/)도 같은 파일을 읽는다.
 *
 * 여기 있는 어떤 소스도 기본값이 enabled: true가 아니다. 피드 주소가 살아 있는지,
 * 그 매체가 어디까지 재사용을 허용하는지 사람이 한 번 확인한 뒤에 켠다.
 * 확인되지 않은 소스를 켜 두면 이 지면은 남의 글을 무단으로 옮기는 곳이 된다.
 */
import type { Category, ContentPolicy, ContentType } from '../content/types'
import registry from './sources.json'

export type Source = {
  id: string
  name: string
  feedUrl: string
  homepage: string
  /** 이 피드가 주로 내보내는 언어. 실제 판정은 수집 단계에서 글마다 다시 한다. */
  language: string
  /** 이 소스가 주로 걸리는 자리. 분류기의 출발점이지 최종값이 아니다. */
  categories: Category[]
  /**
   * 이 소스가 두 축에 얼마나 기여하는지(1이 기준).
   *
   * 학술지의 완구 기사와 완구 매체의 노화 기사를 같은 무게로 다루지 않기 위한
   * 값이다. 분류기가 계산한 점수에 곱해지고, 상한 1은 그대로 지킨다.
   */
  careWeight: number
  curiosityWeight: number
  /** 이 매체가 내는 글의 기본 성격(§33). 글마다 달라질 수 있다. */
  trustType: ContentType
  /**
   * 얼마나 믿을 수 있는가. 1..5.
   *
   * 콘텐츠의 «종류»(trustType)와 «신뢰도»는 다르다. 같은 NEWS라도 학술 출판사의
   * 뉴스와 제품 홍보에 가까운 업계지의 뉴스가 있다. 건강 카테고리에서는 이 값이
   * 낮은 소스가 지면의 앞자리를 차지하지 못하게 한다.
   */
  trustLevel: number
  /** 이 지면에 어디까지 실을 수 있는지(§15). 모르면 가장 좁은 쪽으로 둔다. */
  contentPolicy: ContentPolicy
  enabled: boolean
  /** 왜 켜져 있는지, 혹은 왜 꺼져 있는지. 사람이 읽는 메모다. */
  note?: string
}

export const sources = registry.sources as Source[]

export const enabledSources = sources.filter((source) => source.enabled)
