import type { Meta } from '../content/types'
import styles from './MetaLine.module.css'

type Props = {
  meta?: Meta | undefined
  className?: string | undefined
}

/** 표시 순서. 시간 → 장소 → 기간 → 종류 순으로 좁혀 읽힌다. */
const ORDER = ['date', 'location', 'duration', 'type'] as const

/**
 * 콘텐츠에 실제로 들어 있는 메타데이터만 적는다.
 *
 * 빈 항목을 '—'로 채우지 않고, 라벨도 붙이지 않는다. 날짜인지 장소인지는
 * 값 자체가 이미 말한다. 정보가 있다고 해서 반드시 화면에 둘 필요도 없어서,
 * 무엇을 넣을지는 각 콘텐츠가 정한다.
 */
export function MetaLine({ meta, className }: Props) {
  if (!meta) return null

  const items = ORDER.flatMap((key) => {
    const value = meta[key]
    return value ? [{ key, value }] : []
  })

  if (items.length === 0) return null

  return (
    <ul className={`mono ${styles.list}${className ? ` ${className}` : ''}`} role="list">
      {items.map((item) => (
        <li key={item.key}>{item.value}</li>
      ))}
    </ul>
  )
}
