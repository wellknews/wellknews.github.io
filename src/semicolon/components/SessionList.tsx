import type { Session } from '../content/types'
import { Link, path } from '../router'
import { MetaLine } from './MetaLine'
import styles from './SessionList.module.css'

type Props = {
  sessions: readonly Session[]
  /** 아직 아무것도 없을 때 대신 놓을 한 줄 */
  empty: string
}

/**
 * 번호를 붙이지 않는다.
 *
 * '001'처럼 자릿수를 맞춘 번호는 에디토리얼한 분위기를 만들려고 지어낸 규칙이 되기 쉽고,
 * 그 순간부터 미래의 콘텐츠가 지금의 디자인 규격에 맞춰야 한다. 순서가 의미를 갖게
 * 되는 날 자연수로 붙이면 된다.
 */
export function SessionList({ sessions, empty }: Props) {
  if (sessions.length === 0) {
    return <p className={styles.empty}>{empty}</p>
  }

  return (
    <ul className={styles.list} role="list">
      {sessions.map((session) => (
        <li key={session.slug} className={styles.item}>
          <Link to={path.session(session.slug)} className={styles.row}>
            <MetaLine meta={session.meta} className={styles.meta} />

            <h2 className={styles.title}>{session.title}</h2>

            {session.excerpt ? <p className={styles.excerpt}>{session.excerpt}</p> : null}
          </Link>
        </li>
      ))}
    </ul>
  )
}
