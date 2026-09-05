import { Link } from '../router'
import styles from './BackLink.module.css'

type Props = {
  to: string
  /** 돌아갈 곳의 경로를 그대로 적는다. 이름보다 주소가 더 정확한 안내다. */
  label: string
}

/**
 * 한 단계 위로 돌아가는 링크.
 *
 * 자리는 놓는 쪽이 정한다. 글의 끝에서는 매듭 한 줄의 오른쪽에 앉고(Closing),
 * 없는 주소에서는 혼자 선다. 여백까지 여기서 정해 두면 두 자리 중 한쪽이
 * 반드시 그 여백을 다시 지워야 한다.
 */
export function BackLink({ to, label }: Props) {
  return (
    <Link to={to} className={`mono ${styles.link}`}>
      <span aria-hidden="true">←</span> {label}
    </Link>
  )
}
