import { useCallback, useState, type PointerEvent } from 'react'

import styles from './Threshold.module.css'

type Props = {
  value: string
}

/**
 * 승기를 잡는 최소 조건.
 *
 * 숫자 하나가 판면 가운데에 선다. 설명도 단위 라벨도 붙이지 않는다. 이 숫자가
 * 무엇인지는 앞의 문단이 이미 말했고, 여기서 필요한 것은 그 규칙이 실제로
 * 얼마나 큰 자리를 차지하고 있었는지를 한 번 보여 주는 것뿐이다.
 *
 * 붙잡을 수 있다.
 *
 * 스크롤을 따라 지나가면 잉크가 한 단계 물러난다. 그때 손을 얹으면 숫자는
 * 다시 제 잉크로 돌아온다 — 붙잡고 있는 동안에는 놓치지 않는다. 손을 떼면
 * 스스로 다시 물러나 자리를 잡는다.
 *
 * 이 기록의 마지막 문장이 그것이다. 통제하지 않는 것과 주도권을 잃는 것은
 * 같은 말이 아니다. 놓아도 숫자는 사라지지 않는다.
 *
 * 잡을 수 있는 것은 잉크뿐이고 숫자 자체는 늘 읽힌다. 읽는 데 필요한 것을
 * 인터랙션의 대가로 걸지 않는다.
 */
export function Threshold({ value }: Props) {
  const [held, setHeld] = useState(false)

  const take = useCallback(() => setHeld(true), [])
  const release = useCallback(() => setHeld(false), [])

  /* 커서는 지나가는 동안 쥐고 있는 것으로 본다. 손가락은 찍고 있는 동안이다. */
  const onPointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch') setHeld(true)
  }, [])

  return (
    <p className={styles.threshold}>
      {/* 읽어 주는 쪽에는 숫자 하나면 된다. 쥐는 일은 화면에서만 일어난다. */}
      <span className="visually-hidden">{value}</span>

      <span
        className={styles.numeral}
        data-held={held}
        aria-hidden="true"
        onPointerEnter={onPointerEnter}
        onPointerDown={take}
        onPointerUp={release}
        onPointerLeave={release}
        onPointerCancel={release}
      >
        {value}
      </span>
    </p>
  )
}
