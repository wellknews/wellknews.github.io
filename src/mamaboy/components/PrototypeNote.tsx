import { feed } from '../content/feed'
import { mamaboy } from '../content/site'
import styles from './PrototypeNote.module.css'

/**
 * 예시 데이터로 그린 지면이라는 표시.
 *
 * 실제 RSS가 붙기 전까지 이 지면의 기사는 전부 지어낸 것이다. 그 사실을 숨기면
 * 존재하지 않는 매체가 실제로 그렇게 보도한 것처럼 읽힌다 — attribution을
 * 시스템 요구사항으로 두기로 한 이상(§15), 이 표시도 시스템의 일부다.
 *
 * 파이프라인이 실제 데이터를 만들어 넣으면 이 줄은 저절로 사라진다.
 */
export function PrototypeNote() {
  if (!feed.prototype) return null

  return (
    <p className={styles.note}>
      <span className={`label ${styles.badge}`}>{mamaboy.prototype.label}</span>
      <span className={`meta ${styles.text}`}>{mamaboy.prototype.note}</span>
    </p>
  )
}
