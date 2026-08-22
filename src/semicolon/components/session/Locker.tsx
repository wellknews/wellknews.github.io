import styles from './Locker.module.css'

type Props = {
  number: string
}

/**
 * 짐을 맡긴 자리.
 *
 * 처음 나올 때 이 숫자는 아무 의미가 없다. 하루가 끝날 무렵 다시 나오면서
 * 그제서야 돌아가야 할 곳이 된다. 그래서 처음에는 설명을 붙이지 않고,
 * 움직이게 하지도 않는다 — 눈에 띄면 복선이 아니라 예고가 된다.
 */
export function Locker({ number }: Props) {
  return (
    <div className={styles.locker}>
      <p className={`mono ${styles.label}`}>LOCKER</p>
      <p className={styles.number}>{number}</p>
    </div>
  )
}
