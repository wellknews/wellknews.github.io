import { mamaboy } from '../content/site'
import { Link, path } from '../router'
import styles from './Footer.module.css'

/**
 * 지면의 끝.
 *
 * 여기 남는 것은 세 가지뿐이다 — 이 브랜드를 관통하는 한 문장, 콘텐츠가 어디서
 * 오는지로 가는 길, 그리고 입구로 돌아가는 길. 문서가 다르므로 WELLKNEWS로
 * 돌아가는 것은 SPA 링크가 아니라 실제 이동이다.
 */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <p className={styles.belief}>{mamaboy.belief}</p>

        <nav className={styles.links} aria-label="바닥글">
          <Link to={path.sources} className={`label ${styles.link}`}>
            {mamaboy.sources.label}
          </Link>

          <a className={`label ${styles.link}`} href={mamaboy.entrance.href}>
            <span aria-hidden="true">←</span> {mamaboy.entrance.label}
          </a>
        </nav>
      </div>
    </footer>
  )
}
