import { mamaboy } from '../content/site'
import { Link, path } from '../router'
import styles from './NotFound.module.css'

/** 없는 주소. 숫자 세 자리와 돌아가는 길 하나면 충분하다. */
export function NotFound() {
  return (
    <div className={`shell page ${styles.wrap}`}>
      <p className={styles.code}>{mamaboy.notFound.code}</p>
      <h1 className={styles.title}>{mamaboy.notFound.title}</h1>

      <Link to={path.home} className={`label ${styles.back}`}>
        <span aria-hidden="true">←</span> {mamaboy.notFound.back}
      </Link>
    </div>
  )
}
