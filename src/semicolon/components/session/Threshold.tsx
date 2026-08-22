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
 * 마지막에 이 숫자가 다시 나올 때는 잉크가 한 단계 물러난다. 사라지지는
 * 않는다 — 규칙을 버린 것이 아니라 원래 뜻으로 되돌린 것이기 때문이다.
 * 그 농도는 Weight가 정하고, 여기서는 크기와 자리만 정한다.
 */
export function Threshold({ value }: Props) {
  return <p className={styles.threshold}>{value}</p>
}
