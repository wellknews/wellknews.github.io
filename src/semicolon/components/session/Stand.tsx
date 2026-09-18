import styles from './Stand.module.css'

type Props = {
  /** 계획한 나. */
  plan: string
  /** 실행해야 하는 나. */
  now: string
}

/**
 * 계획한 나와 지금의 나.
 *
 * 카드 두 장을 만들지 않는다. 테두리도 배경도 없고, 두 쪽이 같은 활자를 쓴다.
 * 다른 것은 자리뿐이다 — 하나는 위쪽 왼편에, 하나는 아래쪽 오른편에 선다.
 *
 * 스크롤하면 계획 쪽이 판면 밖으로 밀려나고 지금 쪽만 남는다. 둘 중 하나가
 * 틀렸다는 표시는 하지 않는다. 공연을 일정에 넣은 것도 나였고 가기 싫었던
 * 것도 나였다. 다만 문 앞에 서 있는 것은 뒤쪽이었다.
 *
 * 움직임을 줄이기로 한 화면에서는 둘 다 서 있는다. 두 개의 내가 동시에
 * 있었다는 것이 이 장면의 내용이고, 밀려나는 것은 그 뒤에 일어난 일이다.
 */
export function Stand({ plan, now }: Props) {
  return (
    <div className={styles.stand}>
      <div className={styles.side} data-when="plan">
        <p className={`mono ${styles.label}`}>PLAN</p>
        <p className={styles.what}>{plan}</p>
      </div>

      <div className={styles.side} data-when="now">
        <p className={`mono ${styles.label}`}>NOW</p>
        <p className={styles.what}>{now}</p>
      </div>
    </div>
  )
}
