import { BackLink } from '../components/BackLink'
import { Stat } from '../components/code/Stat'
import { MetaLine } from '../components/MetaLine'
import { Prose } from '../components/Prose'
import { findCode } from '../content/code'
import { useViewport } from '../layout/useViewport'
import { path } from '../router'
import { NotFound } from './NotFound'
import styles from './CodeEntry.module.css'

type Props = {
  slug: string
}

/**
 * 코드 기록 한 편.
 *
 * 세션의 판면과 뼈대는 같지만 머리가 다르다. 세션에서는 제목 아래에 부제가
 * 오고 메타데이터가 본문 옆으로 내려가는데, 여기서는 제목 아래에 저장소와
 * 해시 범위와 변경의 크기가 먼저 온다.
 *
 * 순서에 이유가 있다. 코드 기록에서 가장 먼저 확인해야 하는 것은 «무슨
 * 이야기인가»가 아니라 «어디에서 어디까지인가»다. 그 범위가 이 글이 다루는
 * 것의 전부이고, 범위 밖의 이야기는 이 글에 없다. 머리에서 그것을 먼저
 * 밝혀 두면 본문은 이유만 말하면 된다.
 *
 * 세션처럼 stage 배치를 두지 않는다. 코드의 변경에는 형식이 내용의 일부가
 * 되는 경우가 드물고, 한 벌의 판면을 지키는 편이 여러 편을 나란히 읽을 때
 * 훨씬 정확하다 — 이 기록들은 서로 견주어 읽히는 것이 목적이기 때문이다.
 */
export function CodeEntry({ slug }: Props) {
  const code = findCode(slug)
  const viewport = useViewport()

  if (!code) return <NotFound />

  /* 좁은 화면에 다른 배치가 있으면 그것을 쓴다. 내용은 같고 장면 수만 다르다. */
  const arrangement = viewport === 'compact' && code.compact ? code.compact : code.body

  return (
    <div className="shell page">
      <article>
        <header className={styles.head}>
          <p className={`mono ${styles.path}`}>
            <span>{path.code(code.slug)}</span>
          </p>

          <h1 className={styles.title}>{code.title}</h1>

          {code.subtitle ? <p className={styles.subtitle}>{code.subtitle}</p> : null}

          {/* 이 글이 다루는 범위. 본문보다 먼저 온다. */}
          <div className={styles.stat}>
            <Stat repo={code.repo} revision={code.revision} diff={code.diff} variant="head" />
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.aside}>
            <MetaLine meta={code.meta} className={styles.meta} />
          </div>

          <div>
            <Prose>{arrangement}</Prose>

            {/* 여기서 문장이 잠시 멈춘다는 표시 */}
            <span className="endmark" aria-hidden="true">
              ;
            </span>
          </div>
        </div>
      </article>

      <BackLink to={path.codeIndex} label={path.codeIndex} />
    </div>
  )
}
