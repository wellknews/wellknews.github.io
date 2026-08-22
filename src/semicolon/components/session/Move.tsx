import styles from './Move.module.css'

type Props = {
  from: string
  to: string
  /**
   * 아주 작게 놓을지.
   *
   * 동네가 바뀌는 것과 옆 건물로 옮기는 것은 같은 크기로 적을 수 없다.
   * 78번지에서 76번지로 가는 일까지 판면 가운데 크게 세우면, 그 이동이
   * 하루의 사건처럼 읽힌다.
   */
  quiet?: boolean
}

/**
 * 자리를 옮겼다는 것.
 *
 * 지도도 경로선도 그리지 않는다. 떠난 곳과 닿은 곳을 위아래로 놓고 그 사이에
 * 화살표 하나를 둔다. 이동에 걸린 시간이나 방법은 대부분 이야기의 일부가
 * 아니고, 여기서 필요한 것은 «장면이 바뀐다»는 신호뿐이다.
 */
export function Move({ from, to, quiet = false }: Props) {
  return (
    <p className={`mono ${styles.move}`} data-quiet={quiet}>
      <span>{from}</span>
      <span className={styles.arrow}>↓</span>
      <span>{to}</span>
    </p>
  )
}
