import styles from './Concept.module.css'

type Props = {
  /** SESSION / THREAD. 복수형을 쓰지 않는다 — 게시판 이름이 아니라 개념 선언이다. */
  label: string
  /** 개념의 정의 한 줄 */
  concept: string
  /** 그 개념이 실제로 하는 일 */
  definition: string
}

/** SESSION·THREAD 목록 화면이 공유하는 머리말. */
export function Concept({ label, concept, definition }: Props) {
  return (
    <header className={styles.head}>
      <div className={`sc-shell ${styles.inner}`}>
        <div className={styles.column}>
          <h1 className={styles.title}>{label}</h1>

          <p className={`sc-mono ${styles.concept}`}>{concept}</p>

          <p className={styles.definition} lang="ko">
            {definition}
          </p>
        </div>
      </div>
    </header>
  )
}
