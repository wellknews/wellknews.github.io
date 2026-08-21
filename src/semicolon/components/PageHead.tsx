import { KindMark } from './KindMark'
import styles from './PageHead.module.css'

type Props = {
  kind: 'session' | 'thread'
  /** 'SESSION' 같은 개념 이름 */
  label: string
  /** '/;/session' — 이 페이지의 실제 경로 */
  path: string
  /** 그 개념이 무엇인지 한 줄로 밝힌다 */
  definition: string
}

/**
 * 목록 페이지의 머리. SESSION은 왼쪽 축에, THREAD는 오른쪽 축에 앉는다.
 * 화면을 가로지르는 선 없이 위치와 기호만으로 정형과 비정형의 차이를 남긴다.
 *
 * 이 개념이 무엇인지 문장으로 밝히는 자리는 사이트 전체에서 여기 한 곳뿐이다.
 * 그래서 그 문장 옆에 기호를 나란히 세워 둔다 — 다른 화면에서 기호만 보게 될
 * 때 그것이 무슨 뜻이었는지 여기서 한 번 배우면 된다.
 */
export function PageHead({ kind, label, path, definition }: Props) {
  const ongoing = kind === 'thread'

  return (
    <header className={styles.head} data-kind={kind}>
      <p className={`mono ${styles.path}`}>
        <span>{path}</span>
      </p>

      <h1 className={styles.label}>{label}</h1>

      {/* 기호와 문장을 한 줄에 나란히 둔다. 이 한 번으로 둘이 같은 뜻이 된다. */}
      <p className={styles.definition}>
        {ongoing ? null : <KindMark kind={kind} />}
        <span>{definition}</span>
        {ongoing ? <KindMark kind={kind} /> : null}
      </p>
    </header>
  )
}
