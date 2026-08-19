import { BackLink } from '../components/BackLink'
import { semicolon } from '../content/site'
import { BASE, currentPath, path } from '../router'
import styles from './NotFound.module.css'

/**
 * 없는 주소.
 *
 * 무엇이 없는지는 주소 자체가 말하고, 무슨 일이 일어났는지는 숫자 세 자리가
 * 말한다. 여기에 문장을 더 얹어도 알게 되는 것이 없어서 낭독에만 남긴다.
 */
export function NotFound() {
  return (
    <div className="shell page">
      <div className={styles.head}>
        <p className={`mono ${styles.path}`}>
          <span>{currentPath()}</span>
          <span className="rule" aria-hidden="true" />
        </p>

        {/* 이 화면의 제목은 숫자 세 자리다. 낭독에는 뜻을 덧붙인다. */}
        <h1 className={styles.code}>
          {semicolon.notFound.code}
          <span className="visually-hidden"> — {semicolon.notFound.title}</span>
        </h1>
      </div>

      <BackLink to={path.home} label={BASE} />
    </div>
  )
}
