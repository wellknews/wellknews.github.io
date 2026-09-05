import styles from './Open.module.css'

type Item = {
  /** 잴 수 없었거나 하지 않은 것 */
  what: string
  /** 왜 */
  why: string
}

type Props = {
  items: readonly Item[]
}

/**
 * 아직 닫히지 않은 것.
 *
 * 못 잰 것과 안 한 것을 한 장치에 둔다. 둘은 다른 일처럼 들리지만 지면에서는
 * 같은 자리에 있어야 한다 — 어느 쪽이든 이 기록이 답하지 못하는 것이고,
 * 답한 것 옆에 나란히 놓여 있어야 앞의 숫자들이 정직해진다.
 *
 * 값이 들어갈 칸을 비운 채로 남긴다. '—'나 'N/A'로 채우지 않는다. 그런
 * 기호는 «없음»이라는 값이 되어 버리고, 여기 있는 것은 값이 아니라 값의
 * 부재다.
 *
 * 그 칸에 남는 것은 밑줄 하나뿐이다. 기호가 아니라 «값이 앉았을 자리»이고,
 * 빈칸을 그리는 방법 중 가장 적게 그리는 쪽이다. 처음에는 여기에 짧은 선과
 * 점 세 개를 놓았었다 — THREAD의 기호를 빌린 것이었는데, 그러면 한 화면
 * 안에서 같은 모양이 «이어지는 중»과 «못 쟀다»를 동시에 뜻하게 된다.
 * 기호 하나가 두 가지를 말하기 시작하면 그때부터 아무것도 말하지 않는다.
 */
export function Open({ items }: Props) {
  return (
    <ul className={styles.open} role="list">
      {items.map((item) => (
        <li key={item.what} className={styles.item}>
          {/* 값이 앉았을 자리. 비어 있는 것이 이 장치의 내용이다. */}
          <span className={styles.blank} aria-hidden="true" />

          <p className={styles.what}>{item.what}</p>
          <p className={styles.why}>{item.why}</p>
        </li>
      ))}
    </ul>
  )
}
