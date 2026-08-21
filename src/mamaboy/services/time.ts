/**
 * 시간 표기.
 *
 * 카드에는 «SOURCE · 2H»처럼 아주 짧게 붙는다(§28). 오늘 발견한 것이라는 사실이
 * 중요하지, 분 단위의 정확도가 중요한 자리가 아니기 때문이다. 기사 상세에서는
 * 반대로 날짜를 정확히 적는다 — 건강 정보는 언제 나온 이야기인지가 정보의 일부다.
 */

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** 목록용. 'NOW' · '42M' · '6H' · '3D' · 그보다 오래된 것은 날짜. */
export function shortAge(iso: string, now: number = Date.now()): string {
  const at = Date.parse(iso)

  if (Number.isNaN(at)) return ''

  const elapsed = Math.max(0, now - at)

  if (elapsed < 5 * MINUTE) return 'NOW'
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)}M`
  if (elapsed < DAY) return `${Math.floor(elapsed / HOUR)}H`
  if (elapsed < 7 * DAY) return `${Math.floor(elapsed / DAY)}D`

  return formatDate(iso)
}

/** 상세용. 'YYYY. MM. DD.' */
export function formatDate(iso: string): string {
  const at = new Date(iso)

  if (Number.isNaN(at.getTime())) return ''

  const year = at.getFullYear()
  const month = `${at.getMonth() + 1}`.padStart(2, '0')
  const day = `${at.getDate()}`.padStart(2, '0')

  return `${year}. ${month}. ${day}.`
}

/** <time datetime="…">에 들어갈 값. 화면에 보이는 글자와 기계가 읽는 값을 나눈다. */
export function machineDate(iso: string): string {
  const at = new Date(iso)

  return Number.isNaN(at.getTime()) ? '' : at.toISOString()
}
