import { BackLink } from './BackLink'
import styles from './Closing.module.css'

type Props = {
  /** 돌아갈 곳. 이 글이 속한 목록이다. */
  to: string
  /** 그 자리의 주소 */
  label: string
}

/**
 * 글의 매듭.
 *
 * 한동안 이 자리에는 «끝»을 말하는 것이 세 개 쌓여 있었다.
 *
 *   ;              글이 끝났다
 *   ← /;/code      이 게시판의 목록으로
 *   ─────────
 *   ← WELLKNEWS    이 공간 밖으로
 *
 * 셋이 같은 축(왼쪽)에 같은 색으로 연달아 서고, 그중 둘은 같은 화살표까지
 * 썼다. 홈에서 ';'를 두 번 쓰지 않기로 한 것과 정확히 같은 이유로 이것도
 * 틀렸다 — 반복되는 것은 뜻을 잃는다. 화살표가 두 개면 그것은 «돌아가는 길»이
 * 아니라 그냥 화살표 두 개다.
 *
 * 그래서 글에 속한 둘을 한 줄로 묶는다. 기호는 왼쪽, 돌아가는 길은 오른쪽.
 * 한 줄이 되면서 «여기서 글이 끝났고, 나가는 문은 저쪽»이 한 번에 읽히고,
 * 판면 아래에 남는 화살표는 푸터의 것 하나뿐이 된다.
 *
 * 세 게시판이 같은 매듭을 쓴다. 세션의 stage 배치에는 이 표시가 아예 없어서
 * 이 공간의 기록 여섯 편이 전부 매듭 없이 끝나고 있었는데, 그것도 여기서
 * 함께 없어진다.
 */
export function Closing({ to, label }: Props) {
  return (
    <div className={styles.closing}>
      {/* 여기서 문장이 잠시 멈춘다는 표시 */}
      <span className={`endmark ${styles.mark}`} aria-hidden="true">
        ;
      </span>

      <BackLink to={to} label={label} />
    </div>
  )
}
