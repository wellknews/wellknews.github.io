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

import { classify, dropReason } from './classify.mjs'
import { deduplicate } from './deduplicate.mjs'
import { normalize } from './normalize.mjs'
import { createTranslator } from './translate.mjs'
import { validateFeed } from './validate.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REGISTRY = join(ROOT, 'src', 'mamaboy', 'data', 'sources.json')
const OUT_DIR = join(ROOT, 'src', 'mamaboy', 'content', 'generated')
const FEED_FILE = join(OUT_DIR, 'feed.json')
const CACHE_FILE = join(OUT_DIR, 'translations.json')
/** 소스별 건강 기록(§18). 어떤 피드가 계속 실패하는지 여기서 드러난다. */
const HEALTH_FILE = join(OUT_DIR, 'sources-health.json')

/** 지면에 남기는 최대치와 기간. 오래된 것은 검색에도 남기지 않는다. */
const MAX_ARTICLES = 120
const MAX_AGE_DAYS = 30
/**
 * 한 소스가 한 번에 들여올 수 있는 최대치.
 *
 * 어떤 피드는 한 번에 1500건을 뱉는다. 상한이 전체에만 걸려 있으면 그런 소스
 * 하나가 지면을 통째로 가져가고, 전문 번역까지 하는 지금은 그 값이 그대로
 * 비용이 된다. 각 소스에서 최신 것부터 이만큼만 받는다 — 여러 곳을 섞겠다는
 * 것이 이 매거진의 전제이므로, 한 곳이 많이 쓴다고 더 많이 실리지 않는다.
 */
const MAX_PER_SOURCE = 20
/** 이보다 오래 쓰이지 않은 번역은 캐시에서 내린다. 파일이 끝없이 자라지 않게. */
const CACHE_KEEP_DAYS = 90
/*
 * 15초로는 모자란 피드가 있다. Longevity.Technology는 한 번에 1500건을 뱉어
 * 12초 넘게 걸리고, 러너가 붐비면 그대로 시간 초과가 된다 — 실제로 한 번
 * 놓쳤다. 넉넉히 두는 값이 한 소스를 통째로 잃는 것보다 싸다.
 */
const FETCH_TIMEOUT_MS = 40_000

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

  const health = await readJson(HEALTH_FILE, {})
  const collected = []
  const stats = { attempted: 0, succeeded: 0, normalized: 0, kept: 0 }
  /** 무엇 때문에 떨어뜨렸는지. 필터가 조이는지 느슨한지는 여기서만 보인다. */
  const drops = {}

  for (const source of sources) {
    stats.attempted += 1

    const xml = await fetchFeed(source)
    const record = health[source.id] ?? { failureCount: 0 }

    if (!xml) {
      /*
       * 한 소스가 죽었다고 그날의 지면 전체가 비면 안 된다. 실패는 그 소스만
       * 건너뛰고 기록에 남긴다 — 계속 실패하는 피드는 숫자로 드러나야 한다.
       */
      health[source.id] = {
        ...record,
        lastFailure: now.toISOString(),
        failureCount: (record.failureCount ?? 0) + 1,
      }

      continue
    }

    stats.succeeded += 1

    const normalized = normalize(xml, source, now)
    const classified = normalized.map((article) => classify(article, source))
    const kept = []

    for (const article of classified) {
      const reason = dropReason(article)

      if (reason) drops[reason] = (drops[reason] ?? 0) + 1
      else kept.push(article)
    }

    stats.normalized += normalized.length
    stats.kept += kept.length

    health[source.id] = {
      ...record,
      lastSuccess: now.toISOString(),
      failureCount: 0,
      articleCount: Math.min(kept.length, MAX_PER_SOURCE),
    }

    /* 최신 것부터 상한까지만. 자르는 것은 이 소스 안에서이지 지면 전체가 아니다. */
    const taken = [...kept]
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, MAX_PER_SOURCE)

    const trimmed = kept.length > taken.length ? ` (상한 ${MAX_PER_SOURCE}건으로 자름)` : ''

    console.log(
      `  ${source.id.padEnd(22)} ${normalized.length}건 수집 → ${kept.length}건 통과 → ${taken.length}건 사용${trimmed}`,
    )
    collected.push(...taken)
  }

  const oldest = now.getTime() - MAX_AGE_DAYS * 86_400_000

  const fresh = collected
    .filter((article) => Date.parse(article.publishedAt) >= oldest)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))

  const unique = deduplicate(fresh).slice(0, MAX_ARTICLES)

  const cache = await readJson(CACHE_FILE, {})
  const translate = await createTranslator(cache)
  const articles = []
  const translated = { done: 0, failed: 0, pending: 0, none: 0 }

  for (const article of unique) {
    const result = await translate(article)

    translated[result.translationStatus] = (translated[result.translationStatus] ?? 0) + 1
    articles.push(result)
  }

  const feed = { generatedAt: now.toISOString(), prototype: false, articles }
  const { ok, problems } = validateFeed(feed, { now: now.getTime() })

  /*
   * 관측 가능성(§49).
   *
   * 무엇이 몇 건 들어와서 몇 건이 떨어졌는지가 로그에 남아야 한다. 화면을 보고
   * 역추적하는 구조를 피하는 것이 이 블록의 목적이다.
   */
  console.log('')
  console.log(`소스        ${stats.succeeded}/${stats.attempted} 응답`)
  console.log(`수집        ${stats.normalized}건`)
  console.log(`편집 필터   ${stats.normalized - stats.kept}건 제외 → ${stats.kept}건`)

  for (const [reason, count] of Object.entries(drops).sort((a, b) => b[1] - a[1])) {
    console.log(`            · ${reason} ${count}건`)
  }

  console.log(`기간·중복   ${stats.kept - unique.length}건 제외 → ${unique.length}건`)
  /* 무료 한도가 달마다 정해져 있으므로 얼마나 썼는지가 로그에 남아야 한다. */
  const used = translate.used?.() ?? 0
  const characters = used ? ` · 쓴 글자 ${used.toLocaleString('ko-KR')}자` : ''

  console.log(
    `번역        완료 ${translated.done ?? 0} · 실패 ${translated.failed ?? 0} · 대기 ${translated.pending ?? 0} · 불필요 ${translated.none ?? 0}${characters}`,
  )
  console.log(`최종        ${articles.length}건`)

  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(HEALTH_FILE, `${JSON.stringify(health, null, 2)}\n`)

  if (!ok) {
    /*
     * 마지막 정상 feed를 유지한다(§47).
     *
     * 새 결과가 기준에 못 미치면 덮어쓰지 않는다. 지면은 어제의 정상 데이터로
     * 계속 서 있고, 워크플로는 실패로 끝나 사람이 이유를 보게 된다.
     */
    console.error('')
    console.error(`검증 실패 — 기존 feed를 그대로 둔다 (${problems.length}건)`)

    for (const problem of problems.slice(0, 20)) console.error(`  · ${problem}`)
    if (problems.length > 20) console.error(`  · 그 밖 ${problems.length - 20}건`)

    process.exitCode = 1

    return
  }

  /*
   * 오래된 번역을 내린다.
   *
   * 캐시는 지우지 않으면 계속 자란다. 다만 이번 실행에 쓰이지 않았다고 바로
   * 버리지는 않는다 — 기간을 벗어났다가 다시 걸리는 글이 있고, 그때 다시
   * 번역하면 돈만 든다.
   */
  const cutoff = now.getTime() - CACHE_KEEP_DAYS * 86_400_000
  let pruned = 0

  for (const [key, entry] of Object.entries(cache)) {
    const at = Date.parse(entry?.at ?? '')

    if (!Number.isNaN(at) && at < cutoff) {
      delete cache[key]
      pruned += 1
    }
  }

  if (pruned > 0) console.log(`번역 캐시   ${pruned}건 정리`)

  await writeFile(FEED_FILE, `${JSON.stringify(feed, null, 2)}\n`)
  await writeFile(CACHE_FILE, `${JSON.stringify(cache, null, 2)}\n`)

  console.log('')
  console.log(`feed.json  ${articles.length}건 기록`)
}

await main()
