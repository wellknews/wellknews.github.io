import type { CSSProperties } from 'react'

import styles from './Drift.module.css'

type Props = {
  /** 'BAC' — 무엇을 재는 척하는지. */
  label: string
  /** '0.00%' */
  value: string
  /** 그 옆을 지나가는 상태들. 재는 값이 아니라 그때 몸에 있던 것들이다. */
  states: readonly string[]
}

/**
 * 목적지 없이 걷던 구간.
 *
 * 계기판이 아니다. 혈중알코올농도를 실제로 계산하지 않고, 계산할 생각도 없다.
 * 공연이 끝난 뒤의 상태가 «취했다»에 가까웠는데 술은 한 방울도 마시지 않았다는
 * 것, 그 어긋남 하나가 이 장치의 전부다. 그러니까 농담이다.
 *
 * 위쪽의 낱말들은 그때 실제로 몸에 있던 것들이라 숫자와 같은 크기로 두지
 * 않는다. 지나가는 동안 하나씩 떠올랐다 가라앉는다 — 걷는 동안 생각이
 * 정리되지 않고 그냥 스쳐 가는 상태가 그랬다.
 *
 * 움직임을 줄이기로 한 화면에서는 셋 다 가만히 떠 있는다. 무엇이 있었는지는
 * 낱말 자체가 말하고, 떠올랐다 가라앉는 것은 그 위에 얹은 리듬일 뿐이다.
 */
export function Drift({ label, value, states }: Props) {
  return (
    <div className={styles.drift}>
      <p className={`mono ${styles.states}`}>
        {states.map((word, index) => (
          <span key={word} style={{ '--step': index } as CSSProperties}>
            {word}
          </span>
        ))}
      </p>

      <p className={styles.meter}>
        <span className={`mono ${styles.label}`}>{label}</span>
        <span className={styles.value}>{value}</span>
      </p>
    </div>
  )
}
