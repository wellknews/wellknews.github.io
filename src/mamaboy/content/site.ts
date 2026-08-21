/**
 * MAMABOY의 모든 카피. 마크업에 문자열을 하드코딩하지 않는다.
 *
 * 이 공간의 성격은 세 개의 모순으로 정해져 있다(§7).
 *   «깊지만 철없다» · «진지하지만 근엄하지 않다» · «고급스럽지만 점잖은 척하지 않는다»
 *
 * 그래서 설명문을 길게 두지 않는다. 브랜드를 소개하는 정적인 영역을 크게 만들지
 * 않고(§26), 첫 화면은 오늘의 편집판 그 자체가 되게 한다. 여기 남은 문장은
 * 그 판면이 스스로 말하지 못하는 것들뿐이다.
 *
 * 성별을 분류 기준으로 쓰지 않는다(§5). MEN / WOMEN / FOR HIM / FOR HER 같은
 * 라벨은 이 파일에 들어올 수 없다. BOY는 성별이 아니라 «아직 굳어지지 않은 상태»다.
 */
import type { Axis, Category, ContentType, Material, TranslationStatus } from './types'

export const mamaboy = {
  name: 'mamaboy',
  /** 브랜드의 내부 공식. 화면에서는 헤더 옆과 공유 카드에만 짧게 나온다. */
  formula: 'CARE + CURIOSITY',
  /** 이 브랜드를 관통하는 한 문장(§48). */
  belief: '나이는 먹는다. 늙는 방식은 고른다.',
  url: 'https://wellknews.github.io/mamaboy/',

  /**
   * 첫 화면.
   *
   * 매일 같은 브랜드 Hero를 보여주는 구조는 RSS 매거진과 맞지 않는다. 여기 있는
   * 것은 판면의 이름표일 뿐이고, 화면의 주인공은 그날의 FEATURE 기사다.
   */
  hero: {
    /** 낭독과 검색에 남는 문서의 제목. 화면에는 레터링이 그 자리를 대신한다. */
    documentTitle: 'mamaboy — 몸은 돌보고, 호기심은 늙지 않게 한다',
    editionLabel: 'TODAY',
  },

  /**
   * 다섯 개의 1차 분류. 순서가 곧 헤더의 순서다.
   *
   * axis는 지면을 섞을 때 쓰고(services/editorial), material은 그 카테고리에
   * 들어갔을 때 판면의 공기가 어느 쪽으로 기우는지를 정한다(components/Ambient).
   */
  categories: {
    skin: {
      label: 'SKIN',
      material: 'clean',
      axis: 'care',
      title: '피부',
      definition: '스킨케어, 피부과학, 성분, 자외선, 피부 노화 연구.',
    },
    body: {
      label: 'BODY',
      material: 'clean',
      axis: 'care',
      title: '몸',
      definition: '운동, 영양, 수면, 회복, 신체 건강.',
    },
    age: {
      label: 'AGE',
      material: 'chrome',
      axis: 'care',
      title: '나이',
      definition: '노화 연구, longevity, 건강수명, 노화를 다루는 기술.',
    },
    play: {
      label: 'PLAY',
      material: 'gel',
      axis: 'curiosity',
      title: '놀이',
      definition: '게임, 장난감, 캐릭터, 키덜트, 취미, 수집.',
    },
    culture: {
      label: 'CULTURE',
      material: 'gel',
      axis: 'curiosity',
      title: '문화',
      definition: '세대 문화, 새로운 소비, 라이프스타일, 지금 생겨나는 취향.',
    },
  } satisfies Record<
    Category,
    { label: string; material: Material; axis: Axis; title: string; definition: string }
  >,

  /** 두 개의 축. 화면을 나누지 않고 섞는 데 쓴다(§9). */
  axes: {
    care: { label: 'CARE', definition: '몸을 돌보는 쪽.' },
    curiosity: { label: 'CURIOSITY', definition: '아직 굳어지지 않은 쪽.' },
  } satisfies Record<Axis, { label: string; definition: string }>,

  /** 콘텐츠의 성격(§33). 연구와 경험담을 같은 무게로 보여주지 않기 위한 라벨. */
  contentTypes: {
    research: { label: 'RESEARCH', title: '연구' },
    expert: { label: 'EXPERT', title: '전문가' },
    news: { label: 'NEWS', title: '뉴스' },
    opinion: { label: 'OPINION', title: '의견' },
    product: { label: 'PRODUCT', title: '제품' },
  } satisfies Record<ContentType, { label: string; title: string }>,

  /** 번역 상태 배지(§14). 번역된 글에는 반드시 이 표시가 붙는다. */
  translation: {
    none: null,
    done: 'AI TRANSLATED',
    pending: 'ORIGINAL',
    failed: 'ORIGINAL',
  } satisfies Record<TranslationStatus, string | null>,

  /** 기사 읽기 화면(§29, §30). */
  reader: {
    /** 언어 전환. 권한이 없으면 KR 쪽이 사라지고 이 버튼만 남는다. */
    korean: 'KR',
    original: 'ORIGINAL',
    readOriginal: 'READ ORIGINAL',
    /** 전문을 실을 권한이 없는 글에 남기는 한 줄. 요약까지가 이 지면의 몫이다. */
    summaryOnly: '이 글은 요약까지만 옮긴다. 전문은 원 사이트에 있다.',
    linkOnly: '이 글은 제목과 출처만 옮긴다. 본문은 원 사이트에 있다.',
    translatedNote: '기계 번역을 사람이 손보지 않은 상태다. 정확한 표현은 원문을 따른다.',
    /** 건강 관련 글에 붙는 한 줄. 의학적 조언이 아니라는 사실을 숨기지 않는다. */
    healthNote: '의학적 조언이 아니다. 판단이 필요한 일은 전문가와 상의한다.',
  },

  search: {
    label: 'SEARCH',
    placeholder: '제목, 출처, 카테고리',
    /** 검색 대상을 밝혀 둔다 — 사용자가 무엇을 찾을 수 있는지 알아야 한다(§31). */
    scope: '번역 제목 · 원문 제목 · 요약 · 카테고리 · 출처 · 키워드',
    empty: '걸리는 것이 없다.',
    close: '검색 닫기',
    open: '검색 열기',
    resultCount: (count: number) => `${count}건`,
  },

  /*
   * 모바일에서만 보이는 버튼. 화면에는 라틴 라벨을 쓰고 낭독에는 한국어를 준다 —
   * 320px 화면에서 «메뉴 열기»는 SEARCH와 나란히 서면 헤더를 넘긴다.
   */
  menu: {
    label: 'MENU',
    closeLabel: 'CLOSE',
    open: '메뉴 열기',
    close: '메뉴 닫기',
  },

  feed: {
    /** 지면에 아무것도 없을 때. 상태를 숨기지 않는다. */
    empty: '오늘 이 지면에 올릴 것을 아직 고르지 못했다.',
    more: '더 보기',
  },

  /** 출처 목록 페이지(§34). attribution은 디자인 요소가 아니라 시스템 요구사항이다. */
  sources: {
    label: 'SOURCES',
    title: '어디서 오는가',
    definition:
      'MAMABOY는 기사를 쓰지 않는다. 아래 매체의 공개 피드에서 발견하고, 고르고, 옮긴다. 모든 글의 저작자는 원 매체와 그 필자다.',
    disabled: '지금은 쉬는 중',
  },

  /**
   * 아직 실제 RSS가 연결되지 않았을 때 지면에 남기는 표시.
   *
   * 가짜 데이터를 진짜처럼 보이게 두지 않는다. 여기 걸린 출처는 실재하지 않는
   * 이름이고, 어떤 글도 실제 매체의 것이 아니다.
   */
  prototype: {
    label: 'PROTOTYPE',
    note: '지면을 검증하기 위한 예시 데이터다. 출처와 본문은 실재하지 않는다.',
  },

  /** 입구로 돌아가는 길. WELLKNEWS와 이 공간을 잇는 유일한 연결이다. */
  entrance: {
    label: 'WELLKNEWS',
    href: '/',
  },

  notFound: {
    code: '404',
    title: '없는 주소',
    back: '지면으로 돌아가기',
  },
} as const

/** 헤더와 카테고리 화면이 함께 쓰는 순서. 다섯 개가 상한이다(§8). */
export const categoryOrder = [
  'skin',
  'body',
  'age',
  'play',
  'culture',
] as const satisfies readonly Category[]

/** 그 카테고리가 어느 축에 속하는지. 지면을 섞을 때 쓴다(§9). */
export function axisOf(category: Category): Axis {
  return mamaboy.categories[category].axis
}
