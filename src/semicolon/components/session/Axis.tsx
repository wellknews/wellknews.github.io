import styles from './Axis.module.css'

type Props = {
  /** 원래 좋아하던 자리. */
  familiar: string
  /** 그 위로 한 단계 올라간 곳. */
  up: string
  /** 위도 아래도 아닌, 옆으로 벌어진 곳. */
  across: string
}

/**
 * 취향이 놓인 자리.
 *
 * 차트가 아니다. 축 이름도 눈금도 숫자도 없다. 여기 있는 것은 얇은 선 하나와
 * 세 개의 지명뿐이고, 그 배치가 말하는 것은 «하나는 위로 갔고 하나는 옆으로
 * 갔다»는 것 하나다.
 *
 * 좌표계를 그리면 취향이 측정된 값처럼 보인다. 실제로는 하루치 인상이고,
 * 그 인상이 잠깐 공간을 차지한 정도로만 보여야 한다.
 *
 * 위아래는 낫고 못함이 아니다. 옆으로 간 쪽이 낮은 것도 아니다. 그래서
 * 아래쪽 자리는 비워 두고 아무것도 놓지 않는다.
 */
export function Axis({ familiar, up, across }: Props) {
  return (
    <div className={styles.axis}>
      <p className={`mono ${styles.up}`}>{up}</p>

      <span className={styles.rise} aria-hidden="true" />

      <p className={`mono ${styles.familiar}`}>{familiar}</p>

      <span className={styles.reach} aria-hidden="true" />

      <p className={`mono ${styles.across}`}>{across}</p>
    </div>
  )
}
