import type { CSSProperties } from 'react'

import styles from './Setlist.module.css'

/**
 * 예상한 순서와 실제로 온 것.
 *
 * 예상이 아예 없던 자리는 왼쪽을 빈 문자열로 둔다. 그 빈칸이 «여기서부터는
 * 예상 자체가 없었다»는 말이다.
 */
export type Beat = readonly [expected: string, actual: string]

type Props = {
  beats: readonly Beat[]
}

/**
 * 알고 있다고 생각한 순서.
 *
 * 왼쪽에 예상한 순서가 서고, 오른쪽에 실제로 온 것이 선다. 둘을 나란히 두면
 * 무엇이 어긋났는지 문장으로 설명하지 않아도 된다.
 *
 * 어긋남은 정렬로 말한다. 오른쪽 열은 처음에 왼쪽 열과 같은 줄에서 출발했다가
 * 아래로 갈수록 조금씩 제자리에서 밀려난다. 폭발도 글리치도 없다 — 예상이
 * 깨지는 일은 그날 실제로 요란하지 않았고, 공연을 보는 중에는 무엇이 어긋나고
 * 있는지도 몰랐다. 다 끝나고 나서야 순서가 이상했다는 것을 알았다.
 *
 * 고를 수 있는 화면이 아니다. 이미 일어난 일을 다시 늘어놓는 것뿐이라,
 * 누를 것도 정할 것도 없다.
 *
 * 스크롤 타임라인이 없거나 움직임을 줄이기로 한 화면에서는 이미 밀려난 채로
 * 서 있는다. 어긋난 상태가 이 장치의 결론이다.
 */
export function Setlist({ beats }: Props) {
  return (
    <ol className={styles.setlist} role="list">
      {beats.map(([expected, actual], index) => (
        <li key={`${expected}\u2192${actual}`} style={{ '--step': index } as CSSProperties}>
          {expected ? <span className={`mono ${styles.expected}`}>{expected}</span> : null}

          <span className={`mono ${styles.actual}`}>{actual}</span>
        </li>
      ))}
    </ol>
  )
}
