import styles from './Candidates.module.css'

type Props = {
  /** 검토했던 것들. 순서대로 화면에 놓인다. */
  options: readonly string[]
  /** 그중 실제로 만든 것. 나머지는 스크롤을 따라 물러난다. */
  chosen: string
}

/**
 * 검토했다가 만들지 않은 것들.
 *
 * «여러 후보를 검토한 결과 업체 컨택이 쉬워서 티셔츠를 선택했다»고 적지 않는다.
 * 네 개의 단어를 놓고 스크롤하면 세 개가 물러난다. 그것으로 충분하다.
 *
 * 물러난 단어를 지우거나 투명하게 만들지는 않는다. 실제로 그 후보들을 생각했던
 * 것은 사실이고, 화면에서 사라지면 그 사실도 함께 사라진다. 색만 한 단계
 * 물리고 자리는 그대로 둔다 — 읽을 수 있는 상태로 남기는 편이 정확하다.
 */
export function Candidates({ options, chosen }: Props) {
  return (
    <ul className={styles.candidates} role="list">
      {options.map((option, index) => (
        <li
          key={option}
          className={`mono ${styles.option}`}
          data-chosen={option === chosen}
          /* 물러나는 순서를 CSS가 알아야 하나씩 흐려진다. */
          style={{ '--order': index } as React.CSSProperties}
        >
          {option}
        </li>
      ))}
    </ul>
  )
}
