import styles from './Tension.module.css'

type Props = {
  /** 마주 놓을 말들. 왼쪽과 오른쪽이 한 쌍이다. */
  pairs: readonly (readonly [string, string])[]
}

/**
 * 서로 당기는 두 말.
 *
 * 목록이 아니다. 왼쪽 열과 오른쪽 열이 같은 높이에서 마주 보고, 그 사이의
 * 빈 자리가 둘 사이의 거리가 된다. 어느 쪽이 옳은지 표시하지 않는다 —
 * 이 장치가 하는 일은 둘 중 하나를 고르는 것이 아니라, 한 사람의 작업 안에
 * 두 가지가 동시에 있었다는 사실을 보여 주는 것이다.
 */
export function Tension({ pairs }: Props) {
  return (
    <ul className={styles.tension} role="list">
      {pairs.map(([left, right]) => (
        <li key={`${left}-${right}`}>
          <span className={styles.left}>{left}</span>
          <span className={styles.right}>{right}</span>
        </li>
      ))}
    </ul>
  )
}
