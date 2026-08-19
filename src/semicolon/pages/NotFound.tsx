import { BackLink } from '../components/BackLink'
import { semicolon } from '../content/site'
import { BASE, currentPath, path } from '../router'
import styles from './NotFound.module.css'

export function NotFound() {
  return (
    <div className="shell page">
      <div className={styles.head}>
        {/* 없는 주소를 그대로 보여준다. 무엇이 없는지가 곧 안내다. */}
        <p className={`mono ${styles.path}`}>{currentPath()}</p>

        <h1 className={styles.title}>{semicolon.notFound.title}</h1>

        <p className={styles.body}>{semicolon.notFound.body}</p>
      </div>

      <BackLink to={path.home} label={BASE} />
    </div>
  )
}
