import styles from './Choice.module.css'

type Props = {
  /** 실제로 한 쪽. */
  taken: string
  /** 늘 하던 쪽. */
  passed: string
}

/**
 * 문 앞에서의 몇 초.
 *
 * 고르는 화면이 아니다. 누를 수도 없고, 누른다고 달라지는 것도 없다. 이미
 * 들어갔기 때문이다. 여기서 하는 일은 그때 두 가지가 같은 무게였다는 사실을
 * 잠깐 보여 주고, 그중 하나가 조용히 옅어지는 것을 지나가게 두는 것뿐이다.
 *
 * 선택지처럼 보이게 만들면 안 된다. 테두리도, 배경도, 손가락 커서도 두지
 * 않는다. 셋 중 하나만 있어도 읽는 사람은 누를 것을 찾기 시작하고, 그 순간
 * 이 장면은 그날의 기억이 아니라 게임의 한 화면이 된다.
 *
 * 지나간 쪽도 지우지 않는다. 옅어질 뿐 끝까지 읽힌다 — 하지 않은 쪽이
 * 있었다는 것까지가 이 장면의 내용이다.
 */
export function Choice({ taken, passed }: Props) {
  return (
    <p className={styles.choice}>
      <span className={styles.taken}>{taken}</span>
      <span className={styles.passed}>{passed}</span>
    </p>
  )
}
