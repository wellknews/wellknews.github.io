/**
 * 등록된 RSS 소스를 실제로 한 번 두드려 본다(§16).
 *
 * 이 저장소의 개발 환경에서는 바깥으로 나가는 요청이 막혀 있어 피드가 살아
 * 있는지 확인할 수 없다. GitHub Actions의 러너에서는 열려 있으므로, 확인은
 * 거기서 하고 결과를 로그로 읽는다.
 *
 *   .github/workflows/mamaboy-probe.yml  (workflow_dispatch)
 *
 * 켜져 있지 않은 소스까지 전부 두드린다. 이 스크립트의 목적이 «지금 무엇이
 * 돌고 있는가»가 아니라 «무엇을 켜도 되는가»를 판단하는 것이기 때문이다.
 * 다만 켜는 결정 자체는 사람이 한다 — 응답한다는 것과 그 매체가 재사용을
 * 허용한다는 것은 다른 문제다.
 */
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

import { normalize } from './normalize.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REGISTRY = join(ROOT, 'src', 'mamaboy', 'data', 'sources.json')
const TIMEOUT_MS = 20_000

function field(article, name) {
  const value = article?.[name]

  if (value === undefined || value === null || value === '') return '−'
  if (name === 'image') return value.url ? '○' : '−'

  return '○'
}

async function probe(source) {
  const started = Date.now()

  try {
    const response = await fetch(source.feedUrl, {
      headers: {
        'user-agent': 'mamaboy-probe/1.0 (+https://wellknews.github.io/mamaboy/)',
        accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })

    const took = Date.now() - started
    const body = await response.text()

    if (!response.ok) {
      return `HTTP ${response.status}  ${took}ms`
    }

    const redirected = response.url !== source.feedUrl ? `\n      → ${response.url}` : ''
    const format = /<feed[\s>]/i.test(body)
      ? 'Atom'
      : /<rss[\s>]/i.test(body)
        ? 'RSS'
        : '알 수 없음'
    const items = normalize(body, source, new Date())
    const first = items[0]

    if (!first) {
      return `HTTP ${response.status}  ${took}ms  ${format}  항목 0건${redirected}`
    }

    const fields = ['titleOriginal', 'summaryOriginal', 'author', 'image', 'publishedAt']
      .map((name) => `${name.replace('Original', '')}:${field(first, name)}`)
      .join(' ')

    return [
      `HTTP ${response.status}  ${took}ms  ${format}  ${items.length}건${redirected}`,
      `      ${fields}`,
      `      최신: ${first.publishedAt}  ${first.titleOriginal.slice(0, 56)}`,
      `      주소: ${first.originalUrl}`,
    ].join('\n')
  } catch (error) {
    return `실패 — ${error.message}`
  }
}

const registry = JSON.parse(await readFile(REGISTRY, 'utf8'))

console.log(`등록된 소스 ${registry.sources.length}개를 확인한다\n`)

for (const source of registry.sources) {
  console.log(`[${source.enabled ? 'ON ' : 'OFF'}] ${source.name}  ${source.feedUrl}`)
  console.log(`      ${await probe(source)}`)
  console.log('')
}

console.log('응답한다는 것과 재사용이 허용된다는 것은 다른 문제다.')
console.log('enabled를 켜기 전에 각 매체의 이용 조건을 사람이 확인한다.')
