/**
 * 옮기면 안 되는 말(§27).
 *
 * 스킨케어 성분, 의학·노화 연구 용어, 연구기관, 제품·브랜드 이름은 번역기가
 * «읽기 쉬운 말»로 바꾸는 순간 정보가 사라진다. 레티노이드를 «비타민A 유도체»로
 * 풀어 쓰면 문장은 부드러워지지만, 그 글이 어떤 성분에 대한 것인지 검색으로
 * 찾을 수 없게 된다.
 *
 * 그래서 두 곳에서 지킨다. 번역 요청에 이 목록을 함께 넣고, 돌아온 결과에서
 * 원문에 있던 용어가 실제로 남아 있는지 다시 확인한다. 프롬프트는 부탁이고,
 * 확인은 규칙이다.
 *
 * ko에는 «이렇게 옮겨도 된다»고 인정하는 표기를 적는다. 레티놀처럼 한국어
 * 표기가 이미 굳은 말은 그대로 두는 것이 자연스럽고, 그 경우까지 원어를
 * 강요하면 번역이 읽히지 않는다.
 */
export const GLOSSARY = [
  // 성분
  { en: 'retinol', ko: ['레티놀'] },
  { en: 'retinoid', ko: ['레티노이드'] },
  { en: 'tretinoin', ko: ['트레티노인'] },
  { en: 'niacinamide', ko: ['나이아신아마이드', '니아신아마이드'] },
  { en: 'ceramide', ko: ['세라마이드'] },
  { en: 'hyaluronic acid', ko: ['히알루론산'] },
  { en: 'salicylic acid', ko: ['살리실산'] },
  { en: 'azelaic acid', ko: ['아젤라산'] },
  { en: 'benzoyl peroxide', ko: ['벤조일 퍼옥사이드'] },
  { en: 'peptide', ko: ['펩타이드'] },
  { en: 'collagen', ko: ['콜라겐'] },
  { en: 'spf', ko: ['SPF'] },
  { en: 'uva', ko: ['UVA'] },
  { en: 'uvb', ko: ['UVB'] },

  // 의학·노화 연구
  { en: 'senolytic', ko: ['세놀리틱'] },
  { en: 'senescence', ko: ['노화세포', '세포 노화'] },
  { en: 'telomere', ko: ['텔로미어'] },
  { en: 'epigenetic clock', ko: ['후성유전 시계'] },
  { en: 'biological age', ko: ['생물학적 나이'] },
  { en: 'healthspan', ko: ['건강수명'] },
  { en: 'longevity', ko: ['롱제비티', '장수'] },
  { en: 'metformin', ko: ['메트포르민'] },
  { en: 'rapamycin', ko: ['라파마이신'] },
  { en: 'vo2 max', ko: ['VO2 max', '최대산소섭취량'] },
  { en: 'randomized controlled trial', ko: ['무작위 대조 시험', 'RCT'] },
  { en: 'cohort', ko: ['코호트'] },
  { en: 'placebo', ko: ['플라세보', '위약'] },
  { en: 'microbiome', ko: ['마이크로바이옴'] },

  // 연구기관·학술지
  { en: 'nature', ko: ['Nature'] },
  { en: 'the lancet', ko: ['The Lancet', '랜싯'] },
  { en: 'cell', ko: ['Cell'] },
  { en: 'nih', ko: ['NIH'] },
  { en: 'fda', ko: ['FDA'] },
  { en: 'who', ko: ['WHO', '세계보건기구'] },
]

/**
 * 번역에서 사라진 용어를 찾는다.
 *
 * 원문에 있던 용어가 번역문에 원어로도, 인정된 한국어 표기로도 없다면 그
 * 문장은 정보를 하나 잃은 것이다. 문장이 얼마나 매끄러운지는 여기서 보지 않는다.
 *
 * @returns {string[]} 사라진 용어들.
 */
export function missingTerms(original, translated) {
  const source = original.toLowerCase()
  const result = translated.toLowerCase()

  return GLOSSARY.filter(({ en, ko }) => {
    if (!source.includes(en)) return false
    if (result.includes(en)) return false

    return !ko.some((form) => translated.includes(form) || result.includes(form.toLowerCase()))
  }).map(({ en }) => en)
}

/** 요청에 함께 보내는 목록. 원문에 실제로 나온 용어만 넣는다. */
export function glossaryFor(original) {
  const source = original.toLowerCase()

  return GLOSSARY.filter(({ en }) => source.includes(en)).map(
    ({ en, ko }) => `- ${en} → ${ko.join(' 또는 ')} (원어를 지우지 않는다)`,
  )
}
