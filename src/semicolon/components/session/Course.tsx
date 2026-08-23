import styles from './Course.module.css'

type Props = {
  /** 하나였을 때의 이름. */
  whole: string
  /** 그것을 이루는 작은 단위들. */
  parts: readonly string[]
  /**
   * 방향.
   *
   *   split   기본. 하나가 여럿으로 갈라진다.
   *   gather  흩어져 있던 여럿이 하나의 이름으로 모인다.
   *
   * 같은 장치를 반대로 한 번 더 쓰는 것이 이 기록의 형식이다. 처음에는
   * 한 잔이 세 잔이 되고, 마지막에는 아무 관계도 없던 네 가지가 한 코스가 된다.
   */
  direction?: 'split' | 'gather'
}

/**
 * 하나와 그것을 이루는 작은 단위들.
 *
 * 메뉴판을 그리지 않는다. 가격도 설명도 없다. 여기서 보여 주는 것은 «이것이
 * 몇 개로 나뉘어 있는가»뿐이고, 각각이 무엇이었는지는 뒤의 문단이 말한다.
 *
 * 번호는 붙인다. 순서가 이 형식의 절반이기 때문이다 — 같은 세 잔이라도
 * 순서가 바뀌면 다른 경험이 된다.
 *
 * 기본은 다 갈라져 있는 상태다. 스크롤 타임라인이 없거나 움직임을 줄이기로 한
 * 화면에서도 몇 개로 나뉘는지는 그대로 읽힌다.
 */
export function Course({ whole, parts, direction = 'split' }: Props) {
  return (
    <div className={styles.course} data-direction={direction}>
      <p className={`mono ${styles.whole}`}>{whole}</p>

      <ol className={styles.parts}>
        {parts.map((part, index) => (
          <li key={part} style={{ '--order': index } as React.CSSProperties}>
            <span className={`mono ${styles.index}`}>{String(index + 1).padStart(2, '0')}</span>
            <span className={`mono ${styles.name}`}>{part}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
