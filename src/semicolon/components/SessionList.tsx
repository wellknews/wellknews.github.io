import type { Session } from '../content/types'
import { Link, path } from '../router'
import { EmptyState } from './EmptyState'
import { MetaLine } from './MetaLine'
import styles from './SessionList.module.css'

type Props = {
  sessions: readonly Session[]
  /** 아직 아무것도 없을 때 대신 놓을 한 줄 */
  empty: string
}

/**
 * 목차의 한 행.
 *
 * 왼쪽 여백 칼럼에 고정폭으로 적힌 메타데이터, 가운데에 명조로 앉은 제목,
 * 오른쪽 끝에 화살표. 세 자리가 페이지마다 같은 세로선 위에 놓이면서
 * 목록 전체가 하나의 판면으로 읽힌다.
 *
 * 번호는 붙이지 않는다. '001'처럼 자릿수를 맞춘 번호는 에디토리얼한 분위기를
 * 만들려고 지어낸 규칙이 되기 쉽고, 그 순간부터 미래의 콘텐츠가 지금의 디자인
 * 규격에 맞춰야 한다. 순서가 의미를 갖게 되는 날 자연수로 붙이면 된다.
 */
export function SessionList({ sessions, empty }: Props) {
  if (sessions.length === 0) {
    return <EmptyState>{empty}</EmptyState>
  }

  return (
    <ul className={styles.list} role="list">
      {sessions.map((session) => (
        <li key={session.slug} className={styles.item}>
          <Link to={path.session(session.slug)} className={styles.row}>
            {/* 메타데이터가 없는 세션도 있으므로 칸 자체는 늘 자리를 지킨다. */}
            <span className={styles.aside}>
              <MetaLine meta={session.meta} className={styles.meta} />
            </span>

            <span className={styles.main}>
              <h2 className={styles.title}>{session.title}</h2>

              {session.excerpt ? <span className={styles.excerpt}>{session.excerpt}</span> : null}
            </span>

            <span className={`mono ${styles.arrow}`} aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
