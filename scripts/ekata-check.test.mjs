import test from 'node:test'
import assert from 'node:assert/strict'
import {
  caseAdapter,
  currentCase,
  officialCaseUrl,
  caseShareUrl,
} from '../src/ekata/lib/caseAdapter.ts'
import { sampleCases } from '../src/ekata/data/sampleCases.ts'
import { shareCase } from '../src/ekata/lib/share.ts'

test('all five fixtures stay fictional and round-trip as complete sample data', () => {
  assert.equal(sampleCases.length, 5)
  for (const record of sampleCases) {
    const normalized = caseAdapter(record)
    assert.equal(normalized.status, 'sample')
    assert.equal(normalized.photoUrl, undefined)
    assert.equal(normalized.physicalFeatures, record.physicalFeatures)
    assert.equal(normalized.clothing, record.clothing)
    assert.equal(new URL(caseShareUrl(normalized)).searchParams.get('sample'), record.id)
  }
})

test('expired, unavailable and unverified cases cannot retain identity or photos', () => {
  const now = Date.parse('2026-09-06T00:00:00Z')
  const active = {
    ...sampleCases[0],
    status: 'active',
    photoUrl: 'https://www.safe182.go.kr/example.jpg',
    verifiedAt: '2026-09-05T23:00:00Z',
    expiresAt: '2026-09-06T01:00:00Z',
  }
  assert.equal(currentCase(active, now).status, 'active')
  for (const record of [
    { ...active, expiresAt: '2026-09-06T00:00:00Z' },
    { ...active, verifiedAt: undefined },
    { ...active, verifiedAt: '2026-09-07T00:00:00Z' },
    { ...active, status: 'unavailable' },
    { ...active, status: 'stale' },
  ]) {
    const result = currentCase(record, now)
    assert.notEqual(result.status, 'active')
    assert.equal(result.name, '')
    assert.equal(result.photoUrl, undefined)
    assert.equal(result.physicalFeatures, undefined)
  }
})

test('invalid payloads and unsafe official URLs cannot enter the public actions', () => {
  assert.throws(() => caseAdapter({}))
  assert.throws(() => caseAdapter({ ...sampleCases[0], status: 'found' }))
  const fallback = 'https://www.safe182.go.kr/'
  for (const url of [
    'javascript:alert(1)',
    'https://safe182.go.kr.evil.example/',
    'http://safe182.go.kr/',
  ]) {
    assert.equal(officialCaseUrl(url), fallback)
  }
  assert.equal(
    officialCaseUrl('https://www.safe182.go.kr/home/index.do'),
    'https://www.safe182.go.kr/home/index.do',
  )
})

test('native sharing, cancellation, clipboard and manual fallback remain distinct', async () => {
  const data = { title: '개발용 예시', url: 'https://wellknews.github.io/ekata/?sample=sample-a' }
  let copied
  assert.equal(await shareCase(data, { share: async () => {} }), 'shared')
  assert.equal(
    await shareCase(data, {
      share: async () => {
        throw new DOMException('cancel', 'AbortError')
      },
      copy: async () => {
        assert.fail('A cancelled share must not write the clipboard')
      },
    }),
    'cancelled',
  )
  assert.equal(
    await shareCase(data, {
      copy: async (value) => {
        copied = value
      },
    }),
    'copied',
  )
  assert.equal(copied, data.url)
  assert.equal(
    await shareCase(data, {
      share: async () => {
        throw new Error('unsupported')
      },
      copy: async (value) => {
        copied = value
      },
    }),
    'copied',
  )
  assert.equal(
    await shareCase(data, {
      copy: async () => {
        throw new Error('denied')
      },
    }),
    'manual',
  )
  assert.equal(await shareCase(data, {}), 'manual')
})
