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
 * 스크롤 타임라인이 없거나 움직임을 줄이기로 한 화면에서는 이미 뻗은 채로
 * 서 있는다. 쥐고 있는 상태가 결론이다.
 */
export function Bridge({ from, to }: Props) {
  return (
    <div className={styles.bridge}>
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
