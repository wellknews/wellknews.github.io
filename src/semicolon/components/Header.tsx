import { semicolon } from '../content/site'
import { Link, path, type Route } from '../router'
import styles from './Header.module.css'

type Props = {
  route: Route
}

/**
 * 왼쪽에 ';' 하나, 오른쪽에 두 개의 개념.
 *
 * ABOUT이나 ARCHIVE 같은 메뉴는 만들지 않는다. 필요해지기 전에 만든 메뉴는
 * 콘텐츠가 아니라 구조를 설명하게 되고, 이 공간은 설명으로 이해시키지 않는다.
 * 복수형(SESSIONS)을 쓰지 않는 것도 같은 이유다 — 게시판 이름이 아니라
 * 이 공간이 무엇을 다루는지에 대한 선언이다.
 */
export function Header({ route }: Props) {
  const inSession = route.kind === 'session' || route.kind === 'session-index'
  const inThread = route.kind === 'thread' || route.kind === 'thread-index'

  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Link
          to={path.home}
          className={styles.mark}
          aria-label={`${semicolon.name} 홈`}
          current={route.kind === 'home'}
        >
          {semicolon.mark}
        </Link>

        <nav className={styles.nav} aria-label="주요 메뉴">
          <Link to={path.sessionIndex} className={`mono ${styles.link}`} current={inSession}>
            {semicolon.session.label}
          </Link>

          <Link to={path.threadIndex} className={`mono ${styles.link}`} current={inThread}>
            {semicolon.thread.label}
          </Link>
        </nav>
      </div>
    </header>
  )
}
