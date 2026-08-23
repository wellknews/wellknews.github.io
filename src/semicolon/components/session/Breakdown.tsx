import type { CSSProperties } from 'react'

import styles from './Breakdown.module.css'

type Props = {
  /** 큰 것에서 작은 것으로. 마지막이 손에 집히는 크기다. */
  steps: readonly string[]
}

/**
 * 충분히 작아질 때까지 나누는 일.
 *
 * 나무를 그리지 않는다. 갈라지는 화살표도, 상자도, 노드도 없다. 단계마다
 * 선이 절반으로 짧아지고 글자가 한 단계 작아진다. 그 줄어듦 자체가 나누는
 * 일이고, 여기서 필요한 설명은 그것뿐이다.
 *
 * 폭발하거나 튀지 않는다. 조용히 선이 생기고 공간이 나뉘는 정도다 —
 * 나누는 일이 격렬하게 보이면 이 글이 말하려는 습관과 어긋난다.
 *
 * 기본은 다 나뉜 상태다. 움직임을 줄이기로 한 사람도 몇 단계로 내려가는지
 * 그대로 읽는다.
 */
export function Breakdown({ steps }: Props) {
  return (
    <ol className={styles.breakdown}>
      {steps.map((step, index) => (
        <li
          key={step}
          /* 선의 폭은 단계마다 실제로 절반이 된다. CSS에서 거듭제곱을 쓸 수 없어 여기서 넘긴다. */
          style={{ '--order': index, '--half': 2 ** index } as CSSProperties}
        >
          <span className={`mono ${styles.name}`}>{step}</span>
          <span className={styles.rule} aria-hidden="true" />
        </li>
      ))}
    </ol>
  )
}
