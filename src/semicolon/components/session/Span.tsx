import styles from './Span.module.css'

type Props = {
  from: string
  to: string
}

/**
 * 걸린 시간.
 *
 * 배송 조회 화면을 만들지 않는다. 단계도, 날짜도, 아이콘도 두지 않는다.
 * 짧은 선 하나와 그 위를 빠르게 지나가는 점이면 «금방 왔다»는 사실이 전해진다.
 *
 * 점이 빠른 것 자체가 정보다. 이 구간이 화면을 지나가는 짧은 동안에 끝까지
 * 가 버리도록 범위를 좁게 잡는다.
 */
export function Span({ from, to }: Props) {
  return (
    <div className={styles.span}>
      <span className={`mono ${styles.label}`}>{from}</span>

      <span className={styles.track} aria-hidden="true">
        <span className={styles.rule} />
        <span className={styles.runner} />
      </span>

      <span className={`mono ${styles.label}`}>{to}</span>
    </div>
  )
}
