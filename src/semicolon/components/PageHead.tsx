import { useTouchReveal } from '../motion/useTouchReveal'
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
 * 이 개념이 무엇인지 말하는 것은 문장이 아니라 선이다. 다가가면 한쪽 점은
 * 벽에 부딪혀 멈추고 다른 쪽 점들은 판을 넘어 흘러 나간다. 그 움직임을
 * 먼저 놓고, 문장은 그 아래에 작게 남긴다.
 *
 * 문장을 없애지는 않는다. 기호만 보고 무슨 뜻인지 알 수 없었던 사람이
 * 한 번은 확인할 자리가 있어야 하고, 사이트 전체에서 그 자리는 여기뿐이다.
 */
export function PageHead({ kind, label, path, definition }: Props) {
  const touch = useTouchReveal()

  return (
    <header className={styles.head} data-kind={kind}>
      <p className={`mono ${styles.path}`}>
        <span>{path}</span>
      </p>

      <h1 className={styles.label}>{label}</h1>

      <div
        className={styles.figure}
        data-touched={touch.active}
        onPointerDown={touch.onPointerDown}
      >
        <KindMark kind={kind} />
      </div>

      <p className={styles.definition}>{definition}</p>
    </header>
  )
}
