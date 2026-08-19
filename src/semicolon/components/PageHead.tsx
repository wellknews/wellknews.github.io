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
 * 목록 페이지의 머리.
 *
 * 경로를 먼저 적고 이름을 크게 세운다. 주소가 곧 개념의 이름인 공간이라
 * 그 둘을 같은 자리에 붙여 둔다.
 *
 * 두 개념의 차이는 여기서 만들지 않는다. SESSION 쪽 머리를 왼쪽에, THREAD 쪽을
 * 오른쪽에 놓아 본 적이 있는데, 두 페이지가 서로 다른 축을 갖게 되면서 어느
 * 쪽에도 기준선이 남지 않았다. 차이는 기호가 말하고, 목록에서 글이 앉는
 * 방식이 말한다. 머리는 두 페이지에서 같은 자리에 있어야 한다.
 *
 * 이 개념이 무엇인지 문장으로 밝히는 자리는 사이트 전체에서 여기 한 곳뿐이다.
 * 그래서 그 문장 옆에 기호를 나란히 세워 둔다 — 다른 화면에서 기호만 보게 될
 * 때 그것이 무슨 뜻이었는지 여기서 한 번 배우면 된다.
 */
export function PageHead({ kind, label, path, definition }: Props) {
  return (
    <header className={styles.head}>
      <p className={`mono ${styles.path}`}>
        <span>{path}</span>
        <span className="rule" aria-hidden="true" />
      </p>

      <h1 className={styles.label}>{label}</h1>

      {/* 기호와 문장을 한 줄에 나란히 둔다. 이 한 번으로 둘이 같은 뜻이 된다. */}
      <p className={styles.definition}>
        <KindMark kind={kind} />
        <span>{definition}</span>
      </p>
    </header>
  )
}
