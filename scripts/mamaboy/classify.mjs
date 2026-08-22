/**
 * 분류와 점수(§10, §33).
 *
 * 수집된 것을 모두 게시하지 않는다. 모든 글은 두 질문 중 최소한 하나를 통과해야 한다.
 *
 *   CARE      이 콘텐츠가 자신을 더 오래 건강하게 유지하는 데 의미가 있는가
 *   CURIOSITY 이 콘텐츠가 새로운 관심·놀이·문화·취향을 발견하게 하는가
 *
 * 여기서 하는 판단은 낱말에 기댄 규칙이다. 나중에 모델을 붙이더라도 이 규칙을
 * 없애지 않는다 — 노출 여부를 모델 하나의 판단에 통째로 맡기지 않기로 했다(§10).
 * 모델은 점수를 «조정»할 수 있고, 통과 여부의 하한은 규칙이 지킨다.
 */

/** 카테고리별 신호어. 한국어와 영어를 함께 둔다. */
/*
 * 신호는 낱말이 아니라 «그 분야에서만 쓰이는 낱말»이어야 한다.
 *
 * barrier 하나로 건축 기사가 SKIN에 실렸다 — 그물 칸막이를 두고 «internal
 * barrier»라고 쓴 문장이 피부 장벽으로 읽혔다. 영어에서 더 흔한 뜻이 이 지면
 * 밖에 있는 낱말은 구절로 적는다. console(가구/위로하다), figure(수치/인물),
 * plush(고급스러운), strength(강도)도 같은 이유로 바꿨다 — 지금 켜 둔 소스에
 * 건축·디자인 매체가 셋이라 언제 터져도 이상하지 않았다.
 */
const SIGNALS = {
  skin: [
    'skin',
    'skincare',
    'dermatolog*',
    'retinol',
    'retinoid*',
    'sunscreen',
    'spf',
    'uva',
    'ceramide',
    'niacinamide',
    'skin barrier',
    'moisture barrier',
    'barrier repair',
    'barrier function',
    'acne',
    'collagen',
    '피부',
    '스킨케어',
    '레티놀',
    '자외선',
    '선크림',
    '세라마이드',
    '보습',
    '여드름',
    '콜라겐',
  ],
  body: [
    'sleep',
    'exercise',
    'training',
    'protein',
    'nutrition',
    'muscle',
    'cardio',
    'recovery',
    'vo2',
    'strength training',
    'grip strength',
    'diet',
    '수면',
    '운동',
    '단백질',
    '영양',
    '근육',
    '회복',
    '유산소',
    '식단',
  ],
  age: [
    'aging',
    'ageing',
    'longevity',
    'senolytic',
    'lifespan',
    'healthspan',
    'biological age',
    'epigenetic clock',
    'mortality',
    '노화',
    '수명',
    '건강수명',
    '항노화',
    '안티에이징',
  ],
  play: [
    'toy',
    'toys',
    'action figure',
    'figurine',
    'sofubi',
    'game',
    'gaming',
    'game console',
    'handheld console',
    'lego',
    'collector*',
    'collecting',
    'character',
    'plush toy',
    'plushie',
    'gunpla',
    '장난감',
    '완구',
    '피규어',
    '게임',
    '수집',
    '캐릭터',
    '키덜트',
    '소프비',
  ],
  culture: [
    'culture',
    'trend',
    'generation',
    'design',
    'aesthetic',
    'subculture',
    'consumer',
    'nostalgia',
    'fashion',
    '문화',
    '트렌드',
    '세대',
    '디자인',
    '취향',
    '소비',
    '향수',
    '유행',
  ],
}

const AXIS = { skin: 'care', body: 'care', age: 'care', play: 'curiosity', culture: 'curiosity' }

/**
 * 콘텐츠의 성격을 가리키는 낱말. 없으면 소스의 기본값(trustType)을 쓴다.
 *
 * 순서가 중요하다. 연구를 소개하며 제품 이름을 언급하는 글은 제품 소개가 아니라
 * 연구 소개다. 위에 있는 것이 먼저 이긴다.
 */
const TYPE_SIGNALS = {
  research: [
    'study',
    'studies',
    'trial',
    'randomi*',
    'cohort',
    'meta-analysis',
    'researcher*',
    'published in',
    '연구',
    '임상',
    '코호트',
    '논문',
  ],
  opinion: ['opinion', 'i think', 'why i', 'essay', '칼럼', '단상'],
  product: [
    'on sale',
    'best deals',
    'discount',
    'pre-order',
    'now available',
    'restock*',
    '출시',
    '신제품',
    '할인',
  ],
}

function haystack(article) {
  return [article.titleOriginal, article.summaryOriginal, ...(article.keywords ?? [])]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

/**
 * 낱말 하나가 걸리는지.
 *
 * 부분 문자열로 세면 «they buy»가 제품 소개가 되고 «therapy»가 «rap»에 걸린다.
 * 라틴 낱말은 앞뒤 경계를 보고, 끝에 *가 붙은 항목만 뒤를 열어 둔다
 * (dermatolog* → dermatologist). 한국어는 조사가 붙으므로 경계를 보지 않는다.
 */
function matches(text, word) {
  const prefix = word.endsWith('*')
  const stem = prefix ? word.slice(0, -1) : word

  if (!/^[\x20-\x7e]+$/.test(stem)) return text.includes(stem)

  const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const tail = prefix ? '' : '(?![\\p{L}\\p{N}])'

  return new RegExp(`(?<![\\p{L}\\p{N}])${escaped}${tail}`, 'iu').test(text)
}

function hits(text, words) {
  return words.reduce((count, word) => (matches(text, word) ? count + 1 : count), 0)
}

/**
 * 카테고리와 두 점수를 붙인다.
 *
 * 소스가 미리 선언한 카테고리는 출발점일 뿐 최종값이 아니다. 스킨케어 매체가
 * 캐릭터 협업을 다룰 수 있고, 완구 매체가 성분 이야기를 할 수 있다.
 */
export function classify(article, source) {
  const text = haystack(article)

  const scored = Object.entries(SIGNALS)
    .map(([category, words]) => {
      const found = hits(text, words)
      // 소스가 선언한 카테고리는 동점일 때만 이긴다. 선언만으로 이기면 분류기가 아니다.
      const declared = source.categories.includes(category) ? 0.6 : 0

      return { category, found, score: found + declared }
    })
    .sort((a, b) => b.score - a.score)

  const best = scored[0]
  const category = best && best.score > 0 ? best.category : (source.categories[0] ?? 'culture')

  /*
   * 신호가 하나도 없는 글에는 축의 웃돈을 주지 않는다.
   *
   * 스킨케어 매체가 낸 양말 할인 소식이 «스킨케어라서» 통과하면 편집 필터가
   * 아니라 소스 필터가 된다. 무엇에 대한 글인지 본문이 말하지 않으면 떨어진다.
   */
  const grounded = scored.some((entry) => entry.found > 0)

  /*
   * 두 축의 점수.
   *
   * 축 안의 신호가 많을수록 그 축이 높아진다. 반대쪽 축의 신호도 함께 세는
   * 이유는, 두 축을 동시에 건드리는 글이 이 매거진의 한가운데이기 때문이다 —
   * «캐릭터가 그려진 자외선차단제»는 어느 한쪽으로만 읽히면 안 된다.
   */
  const careHits = hits(text, [...SIGNALS.skin, ...SIGNALS.body, ...SIGNALS.age])
  const curiosityHits = hits(text, [...SIGNALS.play, ...SIGNALS.culture])

  const bonus = grounded ? 0.45 : 0
  const careScore = Math.min(1, careHits / 4 + (AXIS[category] === 'care' ? bonus : 0))
  const curiosityScore = Math.min(
    1,
    curiosityHits / 4 + (AXIS[category] === 'curiosity' ? bonus : 0),
  )

  const contentType =
    Object.entries(TYPE_SIGNALS).find(([, words]) => hits(text, words) > 0)?.[0] ?? source.trustType

  return {
    ...article,
    category,
    trustLevel: source.trustLevel ?? 3,
    careScore: Number(careScore.toFixed(2)),
    curiosityScore: Number(curiosityScore.toFixed(2)),
    contentType,
  }
}

/** 이보다 낮으면 어느 축으로도 이 지면의 글이 아니다. */
const PASS_THRESHOLD = 0.4

/** 건강 카테고리에서 앞자리를 차지하려면 이만큼의 신뢰도가 필요하다. */
const HEALTH_TRUST_FLOOR = 2
const HEALTH = new Set(['skin', 'body', 'age'])

/**
 * 왜 떨어뜨렸는지(§18의 DROP).
 *
 * 통과 여부만 돌려주면 로그에 «몇 건 떨어졌다»만 남고, 필터가 지나치게
 * 조이는지 느슨한지 알 수 없다. 이유를 함께 돌려주면 그것이 드러난다.
 *
 * @returns {string | null} 떨어뜨린 이유. 통과하면 null.
 */
export function dropReason(article) {
  const peak = Math.max(article.careScore, article.curiosityScore)

  if (peak < PASS_THRESHOLD) return '두 축 모두 낮음'

  /*
   * 건강 정보는 «누가 말했는가»가 정보의 일부다. 신뢰도가 낮은 소스의
   * 제품 홍보성 글이 SKIN·BODY·AGE의 지면에 오르면, 연구와 광고가 같은
   * 무게로 읽히게 된다.
   */
  if (HEALTH.has(article.category)) {
    if ((article.trustLevel ?? 3) < HEALTH_TRUST_FLOOR) return '건강 지면에 신뢰도 부족'
    if (article.contentType === 'product' && article.careScore < 0.8) {
      return '건강 지면의 제품 홍보'
    }
  }

  return null
}

/** 편집 필터(§10). 두 축 모두 낮으면 이 지면에 올리지 않는다. */
export function passes(article) {
  return dropReason(article) === null
}
