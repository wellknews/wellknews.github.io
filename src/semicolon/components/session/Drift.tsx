import { useCallback, useState, type CSSProperties, type PointerEvent } from 'react'

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
 * 눌러 볼 수 있다. 그런데 눌러도 숫자는 움직이지 않는다.
 *
 * 대신 위의 낱말들이 제 잉크로 올라온다. 그날 몸에 있던 것은 알코올이 아니라
 * 이 셋이었고, 계기를 아무리 눌러 봐도 그 사실은 이 숫자 쪽에 나타나지
 * 않는다. 답이 눌린 자리가 아니라 그 위에서 나오는 것이 이 농담의 요령이다.
 *
 * 손을 떼면 낱말들은 스스로 다시 물러난다. 붙잡고 있는 동안에만 또렷하다.
 *
 * 숫자는 언제나 읽힌다. 낱말도 물러난 자리에서 종이 대비 6:1을 넘는다 —
 * 읽는 데 필요한 것을 인터랙션의 대가로 걸지 않는다.
 */
export function Drift({ label, value, states }: Props) {
  const [held, setHeld] = useState(false)

  const take = useCallback(() => setHeld(true), [])
  const release = useCallback(() => setHeld(false), [])

  /* 커서는 지나가는 동안 쥐고 있는 것으로 본다. 손가락은 찍고 있는 동안이다. */
  const onPointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch') setHeld(true)
  }, [])

  return (
    <div className={styles.drift} data-held={held}>
      <p className={`mono ${styles.states}`}>
        {states.map((word, index) => (
          <span key={word} style={{ '--step': index } as CSSProperties}>
            {word}
          </span>
        ))}
      </p>

      <p
        className={styles.meter}
        onPointerEnter={onPointerEnter}
        onPointerDown={take}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
      >
        <span className={`mono ${styles.label}`}>{label}</span>
        <span className={styles.value}>{value}</span>
      </p>
    </div>
  )
}
