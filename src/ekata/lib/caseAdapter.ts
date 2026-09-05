import type { MissingChildCase } from '../types/missingChild'

export const OFFICIAL_URL = 'https://www.safe182.go.kr/'
export const CAMPAIGN_URL = 'https://wellknews.github.io/ekata/'

export function officialCaseUrl(value?: string): string {
  if (!value) return OFFICIAL_URL
  try {
    const url = new URL(value)
    return url.protocol === 'https:' &&
      (url.hostname === 'www.safe182.go.kr' || url.hostname === 'safe182.go.kr')
      ? url.href
      : OFFICIAL_URL
  } catch {
    return OFFICIAL_URL
  }
}

// This is the frontend's normalized proxy contract, NOT an invented Safe182 response.
// The server-side Safe182 adapter must map and validate the authenticated response first.
export function caseAdapter(value: unknown): MissingChildCase {
  if (!value || typeof value !== 'object') throw new Error('사건 정보 형식을 확인할 수 없습니다.')
  const input = value as Record<string, unknown>
  const text = (key: string) =>
    typeof input[key] === 'string' ? input[key].trim() || undefined : undefined
  const age = (key: string) =>
    typeof input[key] === 'number' &&
    Number.isInteger(input[key]) &&
    input[key] >= 0 &&
    input[key] <= 130
      ? input[key]
      : undefined
  const status = text('status')
  if (
    !text('id') ||
    !text('name') ||
    !text('sourceLabel') ||
    !['sample', 'active', 'stale', 'unavailable'].includes(status ?? '')
  ) {
    throw new Error('필수 사건 정보를 확인할 수 없습니다.')
  }
  const photo = text('photoUrl')
  return currentCase({
    id: text('id')!,
    name: text('name')!,
    sourceLabel: text('sourceLabel')!,
    status: status as MissingChildCase['status'],
    photoUrl: photo?.startsWith('https://') ? photo : undefined,
    ageAtMissing: age('ageAtMissing'),
    currentAge: age('currentAge'),
    sex: text('sex'),
    missingDate: text('missingDate'),
    missingArea: text('missingArea'),
    height: text('height'),
    weight: text('weight'),
    physicalFeatures: text('physicalFeatures'),
    clothing: text('clothing'),
    officialUrl: officialCaseUrl(text('officialUrl')),
    verifiedAt: text('verifiedAt'),
    expiresAt: text('expiresAt'),
  })
}

export function currentCase(record: MissingChildCase, now = Date.now()): MissingChildCase {
  if (record.status === 'sample') return record
  if (record.status !== 'active')
    return { id: record.id, name: '', sourceLabel: record.sourceLabel, status: record.status }
  const verified = Date.parse(record.verifiedAt ?? '')
  const expires = Date.parse(record.expiresAt ?? '')
  if (
    !Number.isFinite(verified) ||
    !Number.isFinite(expires) ||
    verified > now ||
    expires <= now ||
    expires <= verified
  ) {
    return { id: record.id, name: '', sourceLabel: record.sourceLabel, status: 'stale' }
  }
  return record
}

export function caseShareUrl(record: MissingChildCase): string {
  const url = new URL(CAMPAIGN_URL)
  // Query-based links work on GitHub Pages; a case route can replace this later.
  url.searchParams.set(record.status === 'sample' ? 'sample' : 'case', record.id)
  return url.href
}

export function caseDate(value?: string): string {
  return value ? value.replaceAll('-', '.') : '정보 없음'
}

export function verificationTime(value?: string): string {
  if (!value || !Number.isFinite(Date.parse(value))) return '확인 시각 없음'
  return (
    new Intl.DateTimeFormat('ko-KR', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(value)) + ' KST'
  )
}
