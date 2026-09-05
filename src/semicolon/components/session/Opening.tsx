import type { ReactNode } from 'react'

import type { Meta } from '../../content/types'
import { MetaLine } from '../MetaLine'
import styles from './Opening.module.css'

type Props = {
  /** 이 기록의 실제 주소 */
  path: string
  title: string
  subtitle?: string | undefined
  meta?: Meta | undefined
  /**
   * 제목 앞에 서는 한 장.
   *
   * 세션은 다가가야 무엇인지 드러나는 사진을 놓고, 코드는 이번 변경의 크기를
   * 놓는다. 무엇이 여기 앉는지가 어느 게시판에 있는지를 말한다 — 머리의
   * 생김새는 같고 이 자리만 다르다.
   */
  figure?: ReactNode
}

/**
 * 판면을 통째로 쓰는 기록의 머리.
 *
 * 제목을 먼저 크게 세우지 않는다. 첫 화면에는 아직 무엇인지 알 수 없는 것이
 * 한 장 있고, 사람이 다가가거나 스크롤해서 내려와야 제목이 들어선다.
 *
 * 순서를 이렇게 두는 이유는, 제목이 먼저 나오면 그 앞의 것이 제목의 삽화가
 * 되기 때문이다. 세션에서 표지 사진은 삽화가 아니라 사건의 출발점이고,
 * 코드에서 diffstat은 이 글이 다루는 범위 그 자체다. 둘 다 제목보다 먼저
 * 와야 «무엇에 대한 글인가»가 «어디까지의 글인가»보다 앞서지 않는다.
 *
 * 두 게시판이 이 머리를 함께 쓴다. 지면의 문법을 게시판마다 새로 만들면
 * 세 자리가 한 공간이라는 사실이 첫 화면에서 사라진다.
 */
export function Opening({ path, title, subtitle, meta, figure }: Props) {
  return (
    <header className={styles.opening}>
      <div className={`shell ${styles.inner}`}>
        <p className={`mono ${styles.path}`}>
          <span>{path}</span>
        </p>

        {figure ? <div className={styles.cover}>{figure}</div> : null}

        <div className={styles.title}>
          <h1 className={styles.headline}>{title}</h1>

          {subtitle ? <p className={`mono ${styles.subtitle}`}>{subtitle}</p> : null}

          <MetaLine meta={meta} className={styles.meta} />
        </div>
      </div>
    </header>
  )
}
