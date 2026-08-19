import styles from './PageHead.module.css'

type Props = {
  /** 'SESSION' 같은 개념 이름 */
  label: string
  /** '/;/session' — 이 페이지의 실제 경로 */
  path: string
  /** 그 개념이 무엇인지 한 줄로 밝힌다 */
  definition: string
}

/**
 * 목록 페이지의 머리.
 *
 * 경로를 먼저 적고 이름을 크게 세운다. 주소가 곧 개념의 이름인 공간이라
 * 그 둘을 같은 자리에 붙여 둔다. 개발자 흉내를 내려는 장식이 아니다.
 */
export function PageHead({ label, path, definition }: Props) {
  return (
    <header className={styles.head}>
      <p className={`mono ${styles.path}`}>
        <span>{path}</span>
        <span className="rule" aria-hidden="true" />
      </p>

      <h1 className={styles.label}>{label}</h1>

      <p className={styles.definition}>{definition}</p>
    </header>
  )
}
