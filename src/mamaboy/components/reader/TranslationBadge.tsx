import { mamaboy } from '../../content/site'
import type { TranslationStatus } from '../../content/types'
import styles from './Reader.module.css'

/**
 * 번역 상태(§14).
 *
 * 번역된 글에는 반드시 이 표시가 붙는다. 기계가 옮긴 문장을 사람이 쓴 문장처럼
 * 보이게 두지 않기 위해서다. 번역이 필요 없는 한국어 원문에는 아무것도 붙지 않는다.
 */
export function TranslationBadge({ status }: { status: TranslationStatus }) {
  const label = mamaboy.translation[status]

  if (!label) return null

  return (
    <span className={`label ${styles.badge}`} data-status={status}>
      {label}
    </span>
  )
}
