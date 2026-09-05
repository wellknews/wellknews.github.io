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
 * 부재다. 칸이 비어 있는 것이 그 사실을 가장 정확하게 말한다.
 *
 * 항목마다 선이 시작하다 만다. 이 공간에서 이미 «아직 이어지는 중»이라는
 * 뜻으로 쓰는 모양이다(THREAD의 기호). 코드에도 같은 것이 있고, 그것을
 * 다른 이름으로 부를 이유가 없다.
 */
export function Open({ items }: Props) {
  return (
    <ul className={`device ${styles.open}`} role="list">
      {items.map((item) => (
        <li key={item.what} className={styles.item}>
          {/* 값이 앉았을 칸. 비어 있는 것이 이 장치의 내용이다. */}
          <span className={styles.blank} aria-hidden="true">
            <span className={styles.stub} />
            <span className={styles.dots}>
              <span />
              <span />
              <span />
            </span>
          </span>

          <p className={styles.what}>{item.what}</p>
          <p className={styles.why}>{item.why}</p>
        </li>
      ))}
    </ul>
  )
}
