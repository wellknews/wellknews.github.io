import { MetaLine } from '../MetaLine'
import type { Session } from '../../content/types'
import { Materialize } from './Materialize'
import styles from './Opening.module.css'

type Props = {
  session: Session
  /** 이 기록의 실제 주소 */
  path: string
}

/**
 * 판면을 통째로 쓰는 기록의 머리.
 *
 * 제목을 먼저 크게 세우지 않는다. 첫 화면에는 아직 무엇인지 알 수 없는
 * 이미지 한 장이 있고, 사람이 다가가야 그것이 드러난다. 스크롤해서 내려오면
 * 그제서야 제목이 들어선다.
 *
 * 순서를 이렇게 두는 이유는, 제목이 먼저 나오면 이미지가 제목의 삽화가 되기
 * 때문이다. 이 기록에서 그 이미지는 삽화가 아니라 사건의 출발점이다.
 */
export function Opening({ session, path }: Props) {
  return (
    <header className={styles.opening}>
      <div className={`shell ${styles.inner}`}>
        <p className={`mono ${styles.path}`}>
          <span>{path}</span>
        </p>

        {session.cover ? (
          <div className={styles.cover}>
            <Materialize
              image={session.cover}
              {...(session.cover.focus ? { focus: session.cover.focus } : {})}
            />
          </div>
        ) : null}

        <div className={styles.title}>
          <h1 className={styles.headline}>{session.title}</h1>

          {session.subtitle ? (
            <p className={`mono ${styles.subtitle}`}>{session.subtitle}</p>
          ) : null}

          <MetaLine meta={session.meta} className={styles.meta} />
        </div>
      </div>
    </header>
  )
}
