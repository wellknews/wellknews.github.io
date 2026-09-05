import { BackLink } from './BackLink'
import { Ending } from './Ending'
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
 * 틀렸다 — 반복되는 것은 뜻을 잃는다. 그래서 글에 속한 둘을 한 줄로 묶었다.
 * 기호는 왼쪽, 돌아가는 길은 오른쪽.
 *
 * 그런데 그 기호를 여기서 «새로» 찍은 것이 잘못이었다. 세션의 본문은 이미
 * 자기 끝에 Ending을 놓고 있었고, 확인하지 않고 하나를 더 붙이는 바람에
 * 다섯 편이 세미콜론 두 개로 끝난 채 배포되었다. 마감 기호가 두 곳에서
 * 그려지면 언젠가는 반드시 두 개가 된다.
 *
 * 그래서 기호를 그리는 자리를 여기 하나로 모으고, 그리는 것은 이 공간이
 * 원래 갖고 있던 그 장면이다 — 아래 획만 보이다가 점이 내려앉아 ';'가 되는
 * 것. 본문은 이제 자기 끝을 선언하지 않는다. 선언할 수 없으면 두 개가 될
 * 수도 없다.
 *
 * 세 게시판이 같은 매듭을 쓴다.
 */
export function Closing({ to, label }: Props) {
  return (
    <div className={styles.closing}>
      <Ending />
      <BackLink to={to} label={label} />
    </div>
  )
}
