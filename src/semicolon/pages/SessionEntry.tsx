import { BackLink } from '../components/BackLink'
import { MetaLine } from '../components/MetaLine'
import { Prose } from '../components/Prose'
import { findSession } from '../content/sessions'
import { path } from '../router'
import { NotFound } from './NotFound'
import styles from './SessionEntry.module.css'

type Props = {
  slug: string
}

/**
 * 세션 한 편.
 *
 * 제목은 판면 전체를 쓰고, 메타데이터는 본문 옆 여백 칼럼으로 내려간다.
 * 읽는 동안 눈은 본문 한 줄기만 따라가고, 언제 어디였는지는 필요할 때만
 * 곁눈으로 확인하게 된다.
 */
export function SessionEntry({ slug }: Props) {
  const session = findSession(slug)

  if (!session) return <NotFound />

  return (
    <div className="shell page">
      <article>
        <header className={styles.head}>
          <p className={`mono ${styles.path}`}>
            <span>{path.session(session.slug)}</span>
            <span className="rule" aria-hidden="true" />
          </p>

          <h1 className={styles.title}>{session.title}</h1>

          {session.subtitle ? <p className={styles.subtitle}>{session.subtitle}</p> : null}
        </header>

        <div className={styles.body}>
          <div className={styles.aside}>
            <MetaLine meta={session.meta} className={styles.meta} />
          </div>

          <div>
            <Prose>{session.body}</Prose>

            {/* 여기서 문장이 잠시 멈춘다는 표시 */}
            <span className="endmark" aria-hidden="true">
              ;
            </span>
          </div>
        </div>
      </article>

      <BackLink to={path.sessionIndex} label={path.sessionIndex} />
    </div>
  )
}
