/**
 * 수집 단계의 정규화(§11).
 *
 * 소스마다 adapter를 만들지 않는다. RSS 2.0과 Atom의 차이는 여기서 한 번 흡수하고,
 * 그 아래로는 하나의 Article 형태만 흘러간다. 새 소스를 붙일 때 손댈 파일이
 * 늘어나지 않는 것이 이 구조의 목적이다.
 *
 * 외부 HTML은 여기서 평문으로 벗긴다. 화면까지 태그를 들고 가면 결국 어딘가에서
 * 그 HTML을 그대로 주입하게 되고, 그 순간 남의 사이트의 스크립트가 이 지면에서
 * 실행될 수 있다.
 */
import { XMLParser } from 'fast-xml-parser'
import { createHash } from 'node:crypto'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  processEntities: true,
  htmlEntities: true,
  trimValues: true,
})

/** XML 노드는 문자열일 수도, 객체일 수도, 배열일 수도 있다. */
function text(value) {
  if (value == null) return ''
  if (typeof value === 'string') return value.trim()
  if (typeof value === 'number') return String(value)
  if (Array.isArray(value)) return text(value[0])
  if (typeof value === 'object') return text(value['#text'] ?? value['@_href'] ?? '')

  return ''
}

function list(value) {
  if (value == null) return []

  return Array.isArray(value) ? value : [value]
}

function stripHtml(value) {
  return text(value)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** 전문 게재가 허용된 글에서만 쓰는 본문. 문단 단위로 끊어 평문으로 만든다. */
function paragraphs(html) {
  const raw = text(html)

  if (!raw) return []

  return raw
    .split(/<\/p>|<br\s*\/?>\s*<br\s*\/?>|\n{2,}/i)
    .map((block) => stripHtml(block))
    .filter((block) => block.length > 40)
    .slice(0, 40)
}

function firstImage(html) {
  const match = /<img[^>]+src=["']([^"']+)["']/i.exec(text(html))

  return match?.[1] ?? ''
}

function toIso(value) {
  const raw = text(value)

  if (!raw) return ''

  const at = new Date(raw)

  return Number.isNaN(at.getTime()) ? '' : at.toISOString()
}

/** 추적 파라미터를 뗀 주소. 중복 판정과 id 생성이 같은 값을 봐야 한다. */
export function canonicalUrl(url) {
  try {
    const parsed = new URL(url)

    for (const key of [...parsed.searchParams.keys()]) {
      if (key.startsWith('utm_') || key === 'fbclid' || key === 'gclid') {
        parsed.searchParams.delete(key)
      }
    }

    parsed.hash = ''

    return parsed.toString().replace(/\/$/, '')
  } catch {
    return url
  }
}

function hash(value) {
  return createHash('sha1').update(value).digest('hex').slice(0, 10)
}

/**
 * 주소에 쓰는 이름.
 *
 * 라틴 글자가 없는 제목(한국어·일본어 등)에서는 주소 해시만 남는다. 한글을 그대로
 * 주소에 넣으면 공유할 때마다 퍼센트 인코딩된 긴 문자열이 되기 때문이다.
 */
export function slugify(title, digest) {
  const latin = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .split('-')
    .filter(Boolean)
    .slice(0, 8)
    .join('-')

  return latin ? `${latin}-${digest.slice(0, 6)}` : digest
}

function imageOf(node) {
  const enclosure = list(node.enclosure).find((item) =>
    String(item?.['@_type'] ?? '').startsWith('image/'),
  )

  const url =
    enclosure?.['@_url'] ??
    list(node['media:content']).find((item) =>
      String(item?.['@_medium'] ?? item?.['@_type'] ?? '').includes('image'),
    )?.['@_url'] ??
    list(node['media:thumbnail'])[0]?.['@_url'] ??
    firstImage(node['content:encoded'] ?? node.content ?? node.description)

  return url ? { url: String(url) } : undefined
}

function linkOf(node) {
  const links = list(node.link)

  const alternate = links.find(
    (item) => typeof item === 'object' && (item['@_rel'] ?? 'alternate') === 'alternate',
  )

  return text(alternate ?? links[0] ?? node.id ?? node.guid)
}

/**
 * 피드 하나를 Article 후보 배열로 옮긴다.
 *
 * 여기서는 아직 점수도 카테고리도 붙지 않는다. 무엇이 들어왔는지만 확정하고,
 * 판단은 다음 단계(classify)로 넘긴다.
 */
export function normalize(xml, source, now = new Date()) {
  const document = parser.parse(xml)
  const channel = document?.rss?.channel ?? document?.['rdf:RDF']
  const feed = document?.feed

  const nodes = channel ? list(channel.item) : feed ? list(feed.entry) : []

  return nodes
    .map((node) => {
      const originalUrl = canonicalUrl(linkOf(node))
      const titleOriginal = stripHtml(node.title)

      if (!originalUrl || !titleOriginal) return null

      const digest = hash(originalUrl)
      const id = `${source.id}:${digest}`
      const published =
        toIso(node.pubDate ?? node.published ?? node.updated ?? node['dc:date']) ||
        now.toISOString()

      const summaryOriginal = stripHtml(
        node.description ?? node.summary ?? node['content:encoded'] ?? node.content,
      ).slice(0, 400)

      return {
        id,
        slug: slugify(titleOriginal, digest),
        titleOriginal,
        summaryOriginal: summaryOriginal || undefined,
        bodyOriginal:
          source.contentPolicy === 'full'
            ? paragraphs(node['content:encoded'] ?? node.content ?? node.description)
            : undefined,
        sourceName: source.name,
        sourceUrl: source.homepage,
        originalUrl,
        author: stripHtml(node['dc:creator'] ?? node.author?.name ?? node.author) || undefined,
        publishedAt: published,
        fetchedAt: now.toISOString(),
        language: source.language,
        keywords: list(node.category)
          .map((item) => stripHtml(item))
          .filter(Boolean)
          .slice(0, 8),
        image: imageOf(node),
        translationStatus: source.language === 'ko' ? 'none' : 'pending',
        contentPolicy: source.contentPolicy,
      }
    })
    .filter(Boolean)
}
