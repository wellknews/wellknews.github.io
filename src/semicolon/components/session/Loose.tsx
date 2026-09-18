import type { CSSProperties } from 'react'

import styles from './Loose.module.css'

type Props = {
  /** 가능한 이유들. 답이 아니라 후보다. */
  lines: readonly string[]
}

/**
 * 원인을 하나로 정렬하지 않는 배치.
 *
 * 세 문장을 한 문단으로 붙이면 마지막 문장이 결론이 된다. 목록으로 만들면
 * 셋 중 하나를 고르는 화면이 된다. 어느 쪽도 그날 일어난 일이 아니다 —
 * 왜 남겼는지는 지금도 모른다.
 *
 * 그래서 각 문장이 서로 다른 x축에 선다. 어느 것도 강조하지 않고, 번호도
 * 기호도 붙이지 않는다. 정렬되지 않은 배치 자체가 «정렬되지 않았다»는 말이다.
 *
 * 마지막 문장 뒤에는 답을 만들지 않고 여백만 둔다. 이 공간에서 여백은
 * 아직 안 채운 자리가 아니라 채우지 않기로 한 자리다.
 */
export function Loose({ lines }: Props) {
  return (
    <div className={styles.loose}>
      {lines.map((line, index) => (
        <p key={line} style={{ '--slot': index } as CSSProperties}>
          {line}
        </p>
      ))}
    </div>
  )
}
