import styles from './Miss.module.css'

type Aimed = {
  /** 무겁다고 의심한 것 */
  at: string
  /** 왜 빗나갔는지 */
  why: string
}

type Props = {
  aimed: readonly Aimed[]
  /** 실제로 거기 있던 것. 목록에 없었다. */
  found: Aimed
}

/**
 * 겨눈 곳과, 실제로 있던 곳.
 *
 * 의심한 것들에는 줄이 그어져 있다. 지운 것이 아니라 빗나간 것이라 글자는
 * 그대로 읽힌다 — 무엇을 의심했는지가 이 기록에서 가장 중요한 정보이기
 * 때문이다. 지워 버리면 «틀린 적이 없는 사람»의 기록이 된다.
 *
 * 줄이 그어진 항목은 눌러 볼 수 있다. 쥐고 있는 동안 줄이 물러나고, 그러면
 * 그때의 목록이 그대로 나온다 — 확인하기 전에는 저것이 맞는 답이었다.
 * 손을 떼면 줄이 돌아온다. 이 장치가 만질 수 있는 이유가 그것이다.
 * 진단이 빗나갔다는 문장은 결과만 말하고, 빗나갔다는 사실이 나중에 붙었다는
 * 것은 말하지 못한다.
 *
 * 마지막 항목은 목록 바깥에 앉는다. 줄도 그어져 있지 않고 눌리지도 않는다.
 * 겨눈 적이 없어서 빗나갈 수도 없었던 것이고, 그 자리가 이 기록의 제목이다.
 */
export function Miss({ aimed, found }: Props) {
  return (
    <div className={styles.miss}>
      <ul className={styles.aimed} role="list">
        {aimed.map((item) => (
          <li key={item.at}>
            <button type="button" className={styles.shot}>
              <span className={styles.at}>
                {item.at}
                <span className={styles.strike} aria-hidden="true" />
              </span>

              <span className={styles.why}>{item.why}</span>
            </button>
          </li>
        ))}
      </ul>

      {/*
        목록 밖.
        여백 한 칸을 두고 떨어져 앉는다. 그 여백이 «여기 없었다»는 뜻이다.
      */}
      <div className={styles.found}>
        <p className={styles.at}>{found.at}</p>
        <p className={styles.why}>{found.why}</p>
      </div>
    </div>
  )
}
