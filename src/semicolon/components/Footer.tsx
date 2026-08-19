import { semicolon } from '../content/site'
import styles from './Footer.module.css'

const { entrance } = semicolon

/**
 * 나가는 문 하나뿐이다.
 *
 * 이 공간은 WELLKNEWS에서 갈라져 나왔지만 브랜드를 공유하지 않는다.
 * 그래서 저작권 표기나 워드마크를 반복하지 않고, 돌아가는 길만 남긴다.
 * 문서가 다르므로 SPA 링크가 아니라 실제 이동이다.
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <a className={`mono ${styles.back}`} href={entrance.href}>
          <span aria-hidden="true">←</span> {entrance.label}
        </a>
      </div>
    </footer>
  )
}
