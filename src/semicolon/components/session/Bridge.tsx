import { useCallback, useState, type PointerEvent } from 'react'

import styles from './Bridge.module.css'

type Props = {
  /** 'NOW' — 아직 서 있는 자리. */
  from: string
  /** 'NEXT' — 아직 건너가지 않은 자리. */
  to: string
}

/**
 * 다음 것을 미리 붙잡은 상태.
 *
 * Span과 모양이 비슷하지만 하는 말이 반대다. Span에서는 점이 끝까지 가고,
 * 여기서는 점이 끝까지 가지 않는다. 점은 처음 자리에 그대로 서 있고, 거기서
 * 뻗어 나간 선만 반대편에 닿는다.
 *
 * 건너간 것이 아니라 붙잡은 것이다. 그 차이가 이 장면의 전부다 — 아직 이쪽
 * 다리에 있는데 다음 건널다리를 이미 쥐고 있는 것. 점까지 같이 건너가 버리면
 * 그냥 «다음 단계로 넘어갔다»가 되고, 그러면 이 기록이 하려던 말이 사라진다.
 *
 * 실제로 쥐어 볼 수 있다.
 *
 * 스크롤로 지나가면 손이 반대편까지 뻗지만 힘은 들어가 있지 않다. 그때 손을
 * 얹으면 선이 제 힘을 얻는다. 놓으면 다시 느슨해진다 — 쥐고 있는 동안에만
 * 쥔 것이고, 그것이 이 문단이 말하는 «꽉 잡는다»의 실제 모양이다.
 *
 * 점은 무엇을 하든 움직이지 않는다. 쥔다고 건너가지는 않는다.
 */
export function Bridge({ from, to }: Props) {
  const [held, setHeld] = useState(false)

  const take = useCallback(() => setHeld(true), [])
  const release = useCallback(() => setHeld(false), [])

  /* 커서는 지나가는 동안 쥐고 있는 것으로 본다. 손가락은 찍고 있는 동안이다. */
  const onPointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'touch') setHeld(true)
  }, [])

  return (
    <div
      className={styles.bridge}
      data-held={held}
      onPointerEnter={onPointerEnter}
      onPointerDown={take}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      <span className={`mono ${styles.label}`}>{from}</span>

      <span className={styles.track} aria-hidden="true">
        <span className={styles.rule} />
        <span className={styles.reach} />
        <span className={styles.here} />
      </span>

      <span className={`mono ${styles.label}`}>{to}</span>
    </div>
  )
}
