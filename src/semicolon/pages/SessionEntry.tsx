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

export function SessionEntry({ slug }: Props) {
  const session = findSession(slug)

  if (!session) return <NotFound />

  return (
    <div className="shell page">
      <article>
        <header className={styles.head}>
          <MetaLine meta={session.meta} />

          <h1 className={styles.title}>{session.title}</h1>

          {session.subtitle ? <p className={styles.subtitle}>{session.subtitle}</p> : null}
        </header>

        <Prose>{session.body}</Prose>
      </article>

      <BackLink to={path.sessionIndex} label={path.sessionIndex} />
    </div>
  )
}
