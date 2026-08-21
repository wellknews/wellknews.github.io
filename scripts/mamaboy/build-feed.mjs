/**
 * MAMABOY의 수집 파이프라인(§11, §35).
 *
 *   RSS SOURCES → FETCH → NORMALIZE → CLASSIFY → FILTER → DEDUPE → TRANSLATE → JSON
 *
 * 프론트엔드는 RSS에 직접 접근하지 않는다. 이 스크립트가 만든 파일 하나만 읽는다.
 * GitHub Pages는 정적 호스팅이므로 이 스크립트는 GitHub Actions가 주기적으로
 * 돌리고, 결과가 바뀌면 커밋한다(.github/workflows/mamaboy-feed.yml).
 *
 *   node scripts/mamaboy/build-feed.mjs
 *
 * ANTHROPIC_API_KEY가 있으면 번역까지 하고, 없으면 원문 그대로 둔다.
 * 어느 쪽이든 지면은 정상적으로 만들어진다.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { classify, passes } from './classify.mjs'
import { deduplicate } from './deduplicate.mjs'
import { normalize } from './normalize.mjs'
import { createTranslator } from './translate.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REGISTRY = join(ROOT, 'src', 'mamaboy', 'data', 'sources.json')
const OUT_DIR = join(ROOT, 'src', 'mamaboy', 'content', 'generated')
const FEED_FILE = join(OUT_DIR, 'feed.json')
const CACHE_FILE = join(OUT_DIR, 'translations.json')

/** 지면에 남기는 최대치와 기간. 오래된 것은 검색에도 남기지 않는다. */
const MAX_ARTICLES = 120
const MAX_AGE_DAYS = 30
const FETCH_TIMEOUT_MS = 15_000

async function readJson(path, fallback) {
  try {
    return JSON.parse(await readFile(path, 'utf8'))
  } catch {
    return fallback
  }
}

/**
 * 피드 하나를 가져온다.
 *
 * 한 소스가 죽어 있다고 해서 그날의 지면 전체가 비면 안 된다. 실패는 그 소스만
 * 건너뛰고 로그에 남긴다.
 */
async function fetchFeed(source) {
  try {
    const response = await fetch(source.feedUrl, {
      headers: {
        // 우리가 누구인지 밝힌다. 차단하려는 매체가 차단할 수 있어야 한다.
        'user-agent': 'mamaboy-feed/1.0 (+https://wellknews.github.io/mamaboy/)',
        accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (!response.ok) {
      console.warn(`fetch  ${source.id} — HTTP ${response.status}`)

      return null
    }

    return await response.text()
  } catch (error) {
    console.warn(`fetch  ${source.id} — ${error.message}`)

    return null
  }
}

async function main() {
  const registry = await readJson(REGISTRY, { sources: [] })
  const sources = registry.sources.filter((source) => source.enabled)
  const now = new Date()

  if (sources.length === 0) {
    console.log('소스가 하나도 켜져 있지 않다. src/mamaboy/data/sources.json을 확인한다.')
    console.log('지면은 예시 데이터(content/seed.ts)로 계속 그려진다.')

    return
  }

  const collected = []

  for (const source of sources) {
    const xml = await fetchFeed(source)

    if (!xml) continue

    const normalized = normalize(xml, source, now)
    const classified = normalized.map((article) => classify(article, source))
    const kept = classified.filter((article) => passes(article))

    console.log(`${source.id}  ${normalized.length}건 중 ${kept.length}건 통과`)
    collected.push(...kept)
  }

  const oldest = now.getTime() - MAX_AGE_DAYS * 86_400_000

  const fresh = collected
    .filter((article) => Date.parse(article.publishedAt) >= oldest)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))

  const unique = deduplicate(fresh).slice(0, MAX_ARTICLES)

  console.log(`중복 제거 후 ${unique.length}건`)

  const cache = await readJson(CACHE_FILE, {})
  const translate = await createTranslator(cache)
  const articles = []

  for (const article of unique) {
    articles.push(await translate(article))
  }

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(
    FEED_FILE,
    `${JSON.stringify({ generatedAt: now.toISOString(), prototype: false, articles }, null, 2)}\n`,
  )
  await writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`)

  console.log(`feed.json  ${articles.length}건`)
}

await main()
