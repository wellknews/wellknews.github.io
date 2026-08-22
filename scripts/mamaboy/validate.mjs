/**
 * 만들어진 feed가 지면에 올라가도 되는지 확인한다(§48).
 *
 * 수집이 «성공»했다는 것과 그 결과가 쓸 만하다는 것은 다르다. 소스 절반이
 * 죽은 날, 파서가 빈 문자열을 채운 날, 날짜가 1970년으로 찍힌 날에도
 * 스크립트 자체는 오류 없이 끝난다. 그런 파일이 그대로 배포되면 지면이
 * 조용히 망가지고, 무엇 때문인지는 화면을 보고 역추적해야 한다.
 *
 * 그래서 쓰기 전에 한 번 막는다. 통과하지 못한 결과는 버리고 이미 있는
 * 마지막 정상 feed를 그대로 둔다(§47).
 */

/** 이보다 적으면 지면이라고 부를 수 없다. */
const MIN_ARTICLES = 6

/** 없으면 화면이 그릴 수 없는 것들. */
const REQUIRED = [
  'id',
  'slug',
  'titleOriginal',
  'sourceName',
  'sourceUrl',
  'originalUrl',
  'publishedAt',
  'language',
  'category',
  'careScore',
  'curiosityScore',
  'contentType',
  'contentPolicy',
  'translationStatus',
]

const CATEGORIES = new Set(['skin', 'body', 'age', 'play', 'culture'])
const POLICIES = new Set(['full', 'summary', 'link'])
const STATUSES = new Set(['none', 'done', 'pending', 'failed'])

function isHttpUrl(value) {
  try {
    const url = new URL(value)

    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

/**
 * @returns {{ ok: boolean, problems: string[] }}
 */
export function validateFeed(feed, { now = Date.now() } = {}) {
  const problems = []

  if (!feed || typeof feed !== 'object') return { ok: false, problems: ['feed가 객체가 아니다'] }
  if (!Array.isArray(feed.articles)) return { ok: false, problems: ['articles가 배열이 아니다'] }
  if (typeof feed.generatedAt !== 'string' || Number.isNaN(Date.parse(feed.generatedAt))) {
    problems.push('generatedAt이 날짜가 아니다')
  }

  if (feed.articles.length < MIN_ARTICLES) {
    problems.push(`기사가 ${feed.articles.length}건뿐이다 (최소 ${MIN_ARTICLES})`)
  }

  const ids = new Set()
  const slugs = new Set()
  // 앞으로 하루 이상 미래인 발행일은 파싱이 어긋났다는 신호다.
  const horizon = now + 86_400_000

  for (const [index, article] of feed.articles.entries()) {
    const where = `articles[${index}] ${article?.slug ?? article?.id ?? ''}`.trim()

    for (const field of REQUIRED) {
      const value = article?.[field]

      if (value === undefined || value === null || value === '') {
        problems.push(`${where}: ${field}가 비어 있다`)
      }
    }

    if (ids.has(article?.id)) problems.push(`${where}: id가 중복이다`)
    if (slugs.has(article?.slug)) problems.push(`${where}: slug가 중복이다`)

    ids.add(article?.id)
    slugs.add(article?.slug)

    if (!isHttpUrl(article?.originalUrl)) problems.push(`${where}: originalUrl이 주소가 아니다`)
    if (!isHttpUrl(article?.sourceUrl)) problems.push(`${where}: sourceUrl이 주소가 아니다`)

    const published = Date.parse(article?.publishedAt)

    if (Number.isNaN(published)) problems.push(`${where}: publishedAt이 날짜가 아니다`)
    else if (published > horizon) problems.push(`${where}: publishedAt이 미래다`)

    if (!CATEGORIES.has(article?.category)) problems.push(`${where}: 알 수 없는 category`)
    if (!POLICIES.has(article?.contentPolicy)) problems.push(`${where}: 알 수 없는 contentPolicy`)
    if (!STATUSES.has(article?.translationStatus)) {
      problems.push(`${where}: 알 수 없는 translationStatus`)
    }

    for (const field of ['careScore', 'curiosityScore']) {
      const score = article?.[field]

      if (typeof score !== 'number' || Number.isNaN(score) || score < 0 || score > 1) {
        problems.push(`${where}: ${field}가 0..1이 아니다`)
      }
    }

    if (article?.image && !isHttpUrl(article.image.url) && !article.image.url?.startsWith('/')) {
      problems.push(`${where}: image.url이 주소가 아니다`)
    }

    /*
     * 본문 블록.
     *
     * 화면은 kind로 갈라 그린다. 모르는 kind가 하나라도 섞이면 그 블록은 조용히
     * 사라지므로, 여기서 걸러 «본문이 일부만 나오는» 판을 내보내지 않는다.
     */
    for (const [position, block] of (article?.bodyOriginal ?? []).entries()) {
      const at = `${where} 본문 ${position + 1}번째 블록`

      if (block?.kind === 'text') {
        if (typeof block.text !== 'string' || !block.text.trim())
          problems.push(`${at}: 글이 비었다`)
      } else if (block?.kind === 'image') {
        if (!isHttpUrl(block.url)) problems.push(`${at}: 그림 주소가 아니다`)
      } else {
        problems.push(`${at}: 알 수 없는 kind`)
      }
    }

    if (article?.bodyKo && !Array.isArray(article.bodyKo)) {
      problems.push(`${where}: bodyKo가 배열이 아니다`)
    }
  }

  return { ok: problems.length === 0, problems }
}
