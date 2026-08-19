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
 * 경로를 그대로 적는다. 개발자 흉내를 내려는 장식이 아니라, 이 공간에서
 * SESSION과 THREAD가 개념이자 주소라는 사실을 그대로 보여주는 것이다.
 */
export function PageHead({ label, path, definition }: Props) {
  return (
    <header className={styles.head}>
      <p className={`mono ${styles.path}`}>{path}</p>
      <h1 className={styles.label}>{label}</h1>
      <p className={styles.definition}>{definition}</p>
    </header>
  )
}
