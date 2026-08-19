import { Link } from '../router'
import styles from './BackLink.module.css'

type Props = {
  to: string
  /** 돌아갈 곳의 경로를 그대로 적는다. 이름보다 주소가 더 정확한 안내다. */
  label: string
}

export function BackLink({ to, label }: Props) {
  return (
    <div className={styles.wrap}>
      <Link to={to} className={`mono ${styles.link}`}>
        <span aria-hidden="true">←</span> {label}
      </Link>
    </div>
  )
}
