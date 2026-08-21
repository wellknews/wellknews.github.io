import { BackLink } from '../components/BackLink'
import { MetaLine } from '../components/MetaLine'
import { Prose } from '../components/Prose'
import { Opening } from '../components/session/Opening'
import { findSession } from '../content/sessions'
import { useViewport } from '../layout/useViewport'
import { path } from '../router'
import { NotFound } from './NotFound'
import styles from './SessionEntry.module.css'

type Props = {
  slug: string
}

/**
 * 세션 한 편.
 *
 * 기본은 정해진 판면이다. 제목이 판면 전체를 쓰고, 메타데이터는 본문 옆 여백
 * 칼럼으로 내려간다. 읽는 동안 눈은 본문 한 줄기만 따라가고, 언제 어디였는지는
 * 필요할 때만 곁눈으로 확인하게 된다.
 *
 * 어떤 경험은 형태 자체가 내용의 일부다. 그런 기록은 `display: 'stage'`로 판면을
 * 통째로 가져가고, 제목과 메타데이터를 놓는 방식까지 스스로 정한다. 여기서
 * 두 갈래를 나눠 두는 이유는, 그런 기록이 생길 때마다 페이지를 새로 만들지
 * 않으면서도 평범한 기록이 특별한 기록의 구조를 떠안지 않게 하기 위해서다.
 */
export function SessionEntry({ slug }: Props) {
  const session = findSession(slug)
  const viewport = useViewport()

  if (!session) return <NotFound />

  if (session.display === 'stage') {
    /*
     * 좁은 화면에는 다른 배치가 있을 수 있다. 내용은 같고 장면 수만 다르다.
     * 두 벌을 다 그려 놓고 숨기지 않는 이유는 `layout/useViewport.ts`에 적었다.
     */
    const arrangement = viewport === 'compact' && session.compact ? session.compact : session.body

    return (
      <article className={styles.stage}>
        <Opening session={session} path={path.session(session.slug)} />

        {arrangement}

        <div className="shell">
          <BackLink to={path.sessionIndex} label={path.sessionIndex} />
        </div>
      </article>
    )
  }

  return (
    <div className="shell page">
      <article>
        <header className={styles.head}>
          <p className={`mono ${styles.path}`}>
            <span>{path.session(session.slug)}</span>
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
