import { semicolon } from '../content/semicolon'
import styles from './Nav.module.css'

export type NavKey = 'home' | 'session' | 'thread'

type Props = {
  current: NavKey
  /** 지금 보고 있는 주소. 주소창에 보이는 그대로 적는다. */
  path: string
}

/**
 * ;  SESSION  THREAD
 *
 * 복수형을 쓰지 않는다. SESSIONS / THREADS는 게시판 이름처럼 읽히고,
 * 단수형은 그 콘텐츠가 무엇인지 개념 자체를 선언한다.
 *
 * 홈에서는 왼쪽 자리에 ';' 대신 이름을 세운다. 홈에는 이미 커다란 ';'가 있어
 * 같은 글자를 한 화면에 두 번 두지 않기 위해서다 — 바깥 페이지에서는 그 자리가
 * 돌아오는 문이 된다.
 */
export function Nav({ current, path }: Props) {
  return (
    <header className={styles.header}>
      <div className={`sc-shell ${styles.inner}`}>
        <div className={styles.left}>
          {current === 'home' ? (
            <span className={`sc-mono ${styles.wordmark}`}>{semicolon.name}</span>
          ) : (
            <a className={styles.mark} href={semicolon.href} aria-label={`${semicolon.name} 홈`}>
              {semicolon.mark}
            </a>
          )}

          <nav className={styles.links} aria-label={semicolon.name}>
            <a
              className={`sc-mono ${styles.link}`}
              href={semicolon.session.href}
              aria-current={current === 'session' ? 'page' : undefined}
            >
              {semicolon.session.label}
            </a>

            <a
              className={`sc-mono ${styles.link}`}
              href={semicolon.thread.href}
              aria-current={current === 'thread' ? 'page' : undefined}
            >
              {semicolon.thread.label}
            </a>
          </nav>
        </div>

        {/* 주소창에 이미 같은 값이 있으므로 보조기술에는 읽히지 않는다. */}
        <span className={`sc-path ${styles.path}`} aria-hidden="true">
          {path}
        </span>
      </div>
    </header>
  )
}
