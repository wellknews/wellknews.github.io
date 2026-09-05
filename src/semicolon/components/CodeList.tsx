import type { Code } from '../content/types'
import { Link, path } from '../router'
import { Stat } from './code/Stat'
import { EmptyState } from './EmptyState'
import { MetaLine } from './MetaLine'
import styles from './CodeList.module.css'

type Props = {
  codes: readonly Code[]
  /** 아직 아무것도 없을 때 대신 놓을 한 줄 */
  empty: string
}

/**
 * 목차의 한 행.
 *
 * 세션의 목록과 같은 뼈대를 쓴다 — 여백 칼럼의 메타데이터, 가운데의 제목,
 * 오른쪽 끝의 화살표. 다른 것은 표지의 자리다. 세션에는 그 자리에 사진의
 * 한 조각이 걸리는데, 코드 기록에는 걸 사진이 없다. 대신 그 변경의 크기가
 * 걸린다 — 해시 두 개와, 더한 줄과 지운 줄의 비율로 칠해진 막대 하나.
 *
 * 그 막대를 사진처럼 «흐렸다가 또렷해지게» 만들지 않는다. 사진은 알아볼
 * 만큼 보여 주지 않는 것이 재미이지만, 이 값은 처음부터 정확하게 보여야
 * 한다. 숨길 이유가 없고, 숨기면 장식이 된다.
 */
export function CodeList({ codes, empty }: Props) {
  if (codes.length === 0) {
    return <EmptyState>{empty}</EmptyState>
  }

  return (
    <ul className={styles.list} role="list">
      {codes.map((code) => (
        <li key={code.slug} className={styles.item}>
          <Link to={path.code(code.slug)} className={styles.row}>
            <div className={styles.aside}>
              <MetaLine meta={code.meta} className={styles.meta} />
            </div>

            <div className={styles.main}>
              <h2 className={styles.title}>{code.title}</h2>

              {code.excerpt ? <span className={styles.excerpt}>{code.excerpt}</span> : null}

              <span className={styles.stat}>
                <Stat repo={code.repo} revision={code.revision} diff={code.diff} variant="row" />
              </span>
            </div>

            <span className={`mono ${styles.arrow}`} aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
