import styles from './Amount.module.css'

type Props = {
  value: string
  currency: string
}

/**
 * 낸 돈.
 *
 * 숨길 이유가 없다. 오히려 이 숫자가 이 기록을 현실적으로 만든다 — 화면 안의
 * 것이 물건이 되는 데 든 값이 정확히 이만큼이었다는 사실이 그렇다.
 *
 * 가격표처럼 그리지 않는다. 숫자 자체를 하나의 시각 요소로 놓는다.
 */
export function Amount({ value, currency }: Props) {
  return (
    <p className={styles.amount}>
      <span className={styles.value}>{value}</span>
      <span className={`mono ${styles.currency}`}>{currency}</span>
    </p>
  )
}
