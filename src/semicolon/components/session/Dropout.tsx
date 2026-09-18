import styles from './Dropout.module.css'

type Props = {
  /** 'PLAN' — 이것이 무엇의 목록인지. 한 낱말이면 된다. */
  label: string
  /** 그때까지 남아 있던 순서. 화면에 나오는 그대로. */
  items: readonly string[]
  /** 이 줄만 조용히 빠져나간다. items 안에 있는 값이어야 한다. */
  drops: string
}

/**
 * 일정에서 한 줄이 빠지는 자리.
 *
 * 취소선을 긋지 않는다. 지우지도 않는다. 줄이 통째로 사라지면 남은 순서가
 * 위로 올라붙어서 «처음부터 두 곳이었다»가 되고, 취소선을 그으면 누군가
 * 그것을 취소하는 결정을 내린 것이 된다. 그날 일어난 일은 둘 다 아니다 —
 * 아무도 취소하지 않았고, 그냥 갈 수 없게 됐다.
 *
 * 그래서 이름만 그 자리에서 옅어지고 화살표는 남는다. 순서의 뼈대는 그대로
 * 있는데 그 칸에 들어갈 것이 없어진 상태다.
 *
 * 움직임을 줄이기로 한 화면에서는 세 줄이 전부 서 있는다. 아침에 이 순서를
 * 적은 것은 사실이고, 사실이 연출의 대가로 사라지면 안 된다.
 */
export function Dropout({ label, items, drops }: Props) {
  return (
    <div className={styles.block}>
      <p className={`mono ${styles.label}`}>{label}</p>

      <ol className={styles.dropout} role="list">
        {items.map((item, index) => (
          <li key={item}>
            {index > 0 ? (
              <span className={`mono ${styles.arrow}`} aria-hidden="true">
                →
              </span>
            ) : null}

            <span className={`mono ${styles.name}`} data-drops={item === drops}>
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
