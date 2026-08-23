import { useCallback, useState, type CSSProperties, type PointerEvent } from 'react'

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
 * 한 번에 하나씩만 붙잡을 수 있다.
 *
 * 어느 하나에 다가가면 그것만 제 잉크로 남고 나머지는 물러난다. 이 기록이
 * 말하려는 것이 정확히 그것이다 — 작게 나눈 다음 하나씩 집요하게 붙잡는 것.
 * 두 개를 동시에 붙잡을 수는 없어서, 다른 것으로 옮기면 앞의 것은 놓인다.
 *
 * 물러난 쪽도 지우지 않는다. 색만 한 단계 물리므로 끝까지 읽을 수 있다.
 * 집중한다고 나머지가 없어지는 것은 아니기 때문이다.
 */
export function Course({ whole, parts, direction = 'split' }: Props) {
  /* 눌러서 붙잡아 둔 것. 커서로 지나가는 것과 구분한다. */
  const [held, setHeld] = useState<number | null>(null)
  const [near, setNear] = useState<number | null>(null)

  const active = held ?? near

  const hold = useCallback(
    (index: number) => setHeld((current) => (current === index ? null : index)),
    [],
  )

  const approach = useCallback((index: number, event: PointerEvent<HTMLElement>) => {
    /* 손가락은 지나가지 않는다. 찍는 것만 붙잡는 것으로 친다. */
    if (event.pointerType !== 'touch') setNear(index)
  }, [])

  return (
    <div className={styles.course} data-direction={direction} data-attending={active !== null}>
      <p className={`mono ${styles.whole}`}>{whole}</p>

      <ol className={styles.parts} role="list" onPointerLeave={() => setNear(null)}>
        {parts.map((part, index) => (
          <li key={part} style={{ '--order': index } as CSSProperties}>
            <span className={`mono ${styles.index}`}>{String(index + 1).padStart(2, '0')}</span>

            <button
              type="button"
              className={`mono ${styles.name}`}
              data-active={active === index}
              aria-pressed={held === index}
              onPointerEnter={(event) => approach(index, event)}
              onClick={() => hold(index)}
            >
              {part}
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}
