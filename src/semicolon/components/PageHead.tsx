import { useTouchReveal } from '../motion/useTouchReveal'
import { KindMark, type Kind } from './KindMark'
import styles from './PageHead.module.css'

type Props = {
  kind: Kind
  /** 'SESSION' 같은 개념 이름 */
  label: string
  /** '/;/session' — 이 페이지의 실제 경로 */
  path: string
  /** 그 개념이 무엇인지 한 줄로 밝힌다 */
  definition: string
}

/**
 * 목록 페이지의 머리. 세 개념이 판면의 서로 다른 자리에 앉는다.
 *
 *   SESSION  왼쪽 끝
 *   CODE     한 칸 들여쓴 자리
 *   THREAD   오른쪽 끝
 *
 * 선 하나 긋지 않고 위치만으로 셋을 구분한다. 코드가 들여쓰기 자리에 앉는
 * 것은 설명이 필요 없는 농담이면서, 동시에 사실이다 — 코드는 늘 무언가의
 * 안쪽에 있다.
 *
 * 이 개념이 무엇인지 말하는 것은 문장이 아니라 선이다. 다가가면 세션의 점은
 * 벽에 부딪혀 멈추고, 스레드의 점들은 판을 넘어 흘러 나가고, 코드의 점은
 * 눈금 사이를 건너뛴다. 그 움직임을 먼저 놓고, 문장은 그 아래에 작게 남긴다.
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
        className={`kindGate ${styles.figure}`}
        data-touched={touch.active}
        onPointerDown={touch.onPointerDown}
      >
        <KindMark kind={kind} />
      </div>

      <p className={styles.definition}>{definition}</p>
    </header>
  )
}
