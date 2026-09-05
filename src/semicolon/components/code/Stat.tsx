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
   *   head  기록의 머리. 저장소·범위·개수·막대가 전부 나온다.
   *   row   목록의 한 행. 막대와 범위만 남는다.
   *
   * 목록에서 개수를 지우는 이유는 그 자리가 표지 이미지의 자리이기 때문이다.
   * 세션의 목록이 사진의 «한 조각»만 보여 주듯, 여기서는 크기의 «모양»만
   * 보여 준다 — 얼마나 컸고 지우는 쪽이었는지 더하는 쪽이었는지까지다.
   */
  variant: 'head' | 'row'
}

/**
 * 이 기록이 다룬 변경의 크기.
 *
 * 코드 기록에는 표지 사진이 없다. 대신 이것이 표지다 — 더한 줄과 지운 줄의
 * 비율로 칠해진 막대 하나. 사진처럼 분위기를 만들지 않고, 숫자처럼 읽어야
 * 알 수 있지도 않다. 길이와 두 색의 비율이 «무엇이 일어났는지»를 먼저 말한다.
 *
 * 색은 새로 들여온 것이 아니다. 히어로의 선이 갈라 놓는 위쪽 민트와 아래쪽
 * 핑크를, 막대로 쓸 수 있을 만큼만 짙게 만든 것이다. 그래서 이 막대는
 * 이 공간의 첫 화면과 같은 재료로 되어 있다.
 *
 * 숫자에는 색을 얹지 않는다. +와 −라는 부호가 이미 어느 쪽인지 말하고,
 * 이 공간에서 색은 글자로 넘어오지 않는다.
 */
export function Stat({ repo, revision, diff, variant }: Props) {
  if (!revision && !diff) return null

  const total = diff ? diff.added + diff.removed : 0
  const added = total > 0 && diff ? diff.added / total : 0

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
          {/*
            막대. 왼쪽이 더한 줄, 오른쪽이 지운 줄이고 길이는 그 비율이다.
            낭독에는 옆의 숫자가 그대로 있으므로 이 막대는 읽지 않는다.
          */}
          <span
            className={styles.bar}
            aria-hidden="true"
            style={{ '--added': added } as CSSProperties}
          >
            <span className={styles.added} />
            <span className={styles.removed} />
          </span>

          <p className={`mono ${styles.lines}`}>
            <span>+{diff.added.toLocaleString('en-US')}</span>
            <span>−{diff.removed.toLocaleString('en-US')}</span>
          </p>

          {variant === 'head' ? (
            <p className={`mono ${styles.counts}`}>
              <span>{diff.commits} COMMITS</span>
              <span>{diff.files} FILES</span>
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
