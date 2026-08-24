import type { CSSProperties } from 'react'

import styles from './Grammar.module.css'

type Props = {
  /** 그 공간에서 반복해서 눈에 들어온 것들. 순서는 없다. */
  words: readonly string[]
}

/**
 * 서로 다른 브랜드가 같이 쓰고 있는 말.
 *
 * 순서를 붙이지 않는다. 이것들은 단계도 코스도 아니고, 한 공간 안에 동시에
 * 있던 것들이라 번호가 붙는 순간 없던 위계가 생긴다.
 *
 * 점수도 매기지 않는다. 무엇이 더 중요했는지는 그날 알 수 없었고, 알 필요도
 * 없었다. 여기서 하려는 말은 «이런 것들이 있었다»가 전부다.
 *
 * 이 기록에서 두 번 나온다. 한 번은 무신사에서, 한 번은 휴먼메이드 2층에서.
 * 두 번 다 같은 모양으로 나오는 것이 이 장치의 요점이다 — 전혀 다른 두
 * 브랜드의 공간에서 같은 낱말이 다시 나온다는 사실이, 그날 실제로 든 생각
 * 이었다. 설명 문장을 하나 더 쓰는 대신 같은 격자를 한 번 더 세운다.
 */
export function Grammar({ words }: Props) {
  return (
    <ul className={styles.grammar} role="list">
      {words.map((word, index) => (
        <li
          key={word}
          className={`mono ${styles.word}`}
          style={{ '--order': index } as CSSProperties}
        >
          {word}
        </li>
      ))}
    </ul>
  )
}
