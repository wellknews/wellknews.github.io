import type { CSSProperties } from 'react'

import type { Diff, Revision } from '../../content/types'
import styles from './Stat.module.css'

type Props = {
  repo?: string | undefined
  revision?: Revision | undefined
  diff?: Diff | undefined
  /**
   * 이 값이 앉는 자리.
   *
   *   head  기록의 머리. 저장소·범위·크기가 전부 나온다.
   *   row   목록의 한 행. 같은 것이 한 단계 작게 앉는다.
   */
  variant: 'head' | 'row'
}

/**
 * 이 기록이 다룬 변경의 크기.
 *
 * 코드 기록에는 표지 사진이 없다. 대신 이것이 표지다 — 한 줄의 막대.
 * 그 막대가 두 가지를 동시에 말한다.
 *
 *   색   왼쪽이 더한 줄, 오른쪽이 지운 줄. 길이가 그 비율이다.
 *   눈금 커밋 수만큼 잘려 있다.
 *
 * 두 가지를 겹쳐 놓는 것이 이 게시판의 기호와 같은 그림이기 때문이다.
 * CODE의 기호는 «닫혀 있는데 안이 나뉘어 있는 선»이고, 이 막대도 그렇다.
 * 목록에서 기호를 보고 들어온 사람이 본문에서 같은 모양을 다시 만난다.
 *
 * 커밋 수와 파일 수를 «16 COMMITS»처럼 적어 두었었다. 이 공간은 메타데이터에
 * 라벨을 붙이지 않기로 되어 있다 — 날짜인지 장소인지는 값 자체가 말한다는
 * 규칙이고, 그 규칙을 지키려면 라벨이 필요한 값은 화면에서 빼거나 다른
 * 방법으로 보여야 한다. 커밋 수는 눈금이 대신 말하고, 파일 수는 뺐다.
 * 알아야 할 이유가 있는 사람은 저장소를 열면 된다.
 *
 * 숫자에는 색을 얹지 않는다. +와 −라는 부호가 이미 어느 쪽인지 말하고,
 * 이 공간에서 색은 글자로 넘어오지 않는다.
 */

/**
 * 눈금을 그릴 만한 커밋 수인지.
 *
 * 두 개 미만이면 나눌 것이 없고, 너무 많으면 눈금이 서로 붙어 막대가
 * 그물처럼 보인다. 그 바깥에서는 자르지 않은 한 줄로 둔다 — 커밋이 아주
 * 많다는 사실은 이 막대가 말해야 할 것이 아니다.
 */
const CUT_MIN = 2
const CUT_MAX = 40

export function Stat({ repo, revision, diff, variant }: Props) {
  if (!revision && !diff) return null

  const total = diff ? diff.added + diff.removed : 0
  const added = total > 0 && diff ? diff.added / total : 0
  const cuts = diff && diff.commits >= CUT_MIN && diff.commits <= CUT_MAX ? diff.commits : 0

  return (
    <div className={styles.stat} data-variant={variant}>
      {revision ? (
        /*
         * 어디에서 어디까지.
         *
         * 두 해시 사이의 선이 그 사이를 뜻한다. 화살표를 그리지 않는 이유는
         * 왼쪽에서 오른쪽으로 읽는다는 사실이 이미 방향이기 때문이다.
         */
        <p className={`mono ${styles.range}`}>
          {repo ? <span className={styles.repo}>{repo}</span> : null}
          <span className={styles.from}>{revision.from}</span>
          <span className={styles.span} aria-hidden="true" />
          <span className={styles.to}>{revision.to}</span>
        </p>
      ) : null}

      {diff ? (
        <div className={styles.figures}>
          {/* 낭독에는 옆의 숫자가 그대로 있으므로 이 막대는 읽지 않는다. */}
          <span
            className={styles.bar}
            aria-hidden="true"
            style={{ '--added': added, '--cuts': cuts } as CSSProperties}
          >
            <span className={styles.added} />
            <span className={styles.removed} />
            {cuts > 0 ? <span className={styles.ticks} /> : null}
          </span>

          <p className={`mono ${styles.lines}`}>
            <span>+{diff.added.toLocaleString('en-US')}</span>
            <span>−{diff.removed.toLocaleString('en-US')}</span>
          </p>
        </div>
      ) : null}
    </div>
  )
}
