import { copyright, semicolon } from '../content/semicolon'
import styles from './Foot.module.css'

/**
 * 돌아가는 길과 연도. 그 이상은 두지 않는다.
 *
 * Semicolon은 WELLKNEWS에서 갈라져 나온 가지이므로 뿌리로 가는 길을 하나 남긴다.
 * 다만 앞세우지는 않는다 — 이 공간의 성격은 뿌리와 다르다.
 */
export function Foot() {
  return (
    <footer className={styles.foot}>
      <div className={`sc-shell ${styles.inner}`}>
        <a className={`sc-path ${styles.root}`} href={semicolon.root.href}>
          wellknews.github.io
        </a>

        <p className={`sc-mono ${styles.copyright}`}>{copyright}</p>
      </div>
    </footer>
  )
}
