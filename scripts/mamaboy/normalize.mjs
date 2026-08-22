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

/** 본문에 실을 것이 못 되는 그림. 추적 픽셀·아바타·공유 버튼·이모지가 여기 걸린다. */
const JUNK_IMAGE =
  /(feedburner|feedproxy|gravatar|wp-emoji|pixel|1x1|spacer|blank\.gif|doubleclick|share|badge|button|icon|avatar|logo)/i

/** 원문에서 온 주소를 절대 주소로 편다. 상대 경로는 우리 도메인에서 깨진다. */
function absolute(url, base) {
  try {
    return new URL(url, base).toString()
  } catch {
    return ''
  }
}

function attribute(tag, name) {
  const match = new RegExp(`${name}=["']([^"']*)["']`, 'i').exec(tag)

  return match?.[1] ?? ''
}

/**
 * 전문 게재가 허용된 글의 본문(§15).
 *
 * 태그를 통째로 벗기지 않고 원문의 순서를 지키며 걸어간다. 벗기면 글 사이에
 * 있던 그림이 전부 사라지는데, 사진이 논지의 일부인 글에서는 그것이 본문의
 * 손실이다. 남는 것은 평문 덩어리와 그림 한 장, 두 가지뿐이다 — 외부 HTML을
 * 화면에 그대로 주입하지 않는다는 규칙은 그대로다.
 *
 * 그림 주소는 절대 주소로 펴고, 추적 픽셀과 아바타 같은 것은 버린다. 같은
 * 그림이 두 번 나오면 처음 것만 남긴다.
 */
function blocks(html, base) {
  const raw = text(html)

  if (!raw) return []

  const out = []
  const seen = new Set()
  const pattern = /<img\b[^>]*>/gi
  let cursor = 0

  const pushText = (chunk) => {
    for (const piece of chunk.split(/<\/p>|<br\s*\/?>\s*<br\s*\/?>|\n{2,}/i)) {
      const plain = stripHtml(piece)

      if (plain.length > 40) out.push({ kind: 'text', text: plain })
    }
  }

  for (let match = pattern.exec(raw); match; match = pattern.exec(raw)) {
    pushText(raw.slice(cursor, match.index))
    cursor = match.index + match[0].length

    const url = absolute(attribute(match[0], 'src'), base)

    if (!url || JUNK_IMAGE.test(url) || seen.has(url)) continue

    seen.add(url)

    const alt = stripHtml(attribute(match[0], 'alt'))

    out.push(alt ? { kind: 'image', url, alt } : { kind: 'image', url })
  }

  pushText(raw.slice(cursor))

  /*
   * 그림으로 시작하거나 끝나는 본문이 흔하다. 앞의 것은 대표 이미지와 겹치고
   * 뒤의 것은 대개 저자 아바타나 배너다. 글 사이에 낀 그림만 본문의 일부다.
   */
  while (out.length && out[0].kind === 'image') out.shift()
  while (out.length && out[out.length - 1].kind === 'image') out.pop()

  return out.slice(0, 60)
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

/** 피드에서 항목 노드만 꺼낸다. RSS·RDF·Atom 세 형태를 같은 자리에서 받는다. */
function nodesOf(xml) {
  const document = parser.parse(xml)
  const channel = document?.rss?.channel ?? document?.['rdf:RDF']
  const feed = document?.feed

  return channel ? list(channel.item) : feed ? list(feed.entry) : []
}

function median(values) {
  if (!values.length) return 0

  const sorted = [...values].sort((a, b) => a - b)

  return sorted[Math.floor(sorted.length / 2)]
}

/**
 * 이 피드가 무엇을 주는가(§15).
 *
 * 라이선스가 전문 게재를 허용하더라도 피드가 요약만 보내면 전문은 없는 것이다.
 * 소스를 켜기 전에 그 둘을 따로 확인해야 해서, 여기서는 «몇 건에 본문이 실려
 * 있고, 그 본문이 몇 글자이며, 그 안에 그림이 몇 장 들어 있는가»만 센다.
 *
 * 판단은 하지 않는다. 세는 것과 켜는 것은 다른 일이다.
 */
export function richness(xml) {
  const nodes = nodesOf(xml)
  const chars = []
  const images = []

  for (const node of nodes) {
    const html = text(node['content:encoded'] ?? node.content ?? '')

    if (!html) continue

    const plain = stripHtml(html)

    /* 요약을 본문 자리에 그대로 넣어 두는 피드가 있다. 그런 것은 전문으로 세지 않는다. */
    const summary = stripHtml(node.description ?? node.summary ?? '')

    if (plain.length < 600 || plain === summary) continue

    chars.push(plain.length)
    images.push((html.match(/<img[\s>]/gi) ?? []).length)
  }

  return {
    total: nodes.length,
    withBody: chars.length,
    medianChars: median(chars),
    medianImages: median(images),
  }
}

/**
 * 피드 하나를 Article 후보 배열로 옮긴다.
 *
 * 여기서는 아직 점수도 카테고리도 붙지 않는다. 무엇이 들어왔는지만 확정하고,
 * 판단은 다음 단계(classify)로 넘긴다.
 */
export function normalize(xml, source, now = new Date()) {
  return nodesOf(xml)
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
            ? blocks(node['content:encoded'] ?? node.content ?? node.description, originalUrl)
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
