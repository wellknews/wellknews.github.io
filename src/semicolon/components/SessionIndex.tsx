import { semicolon } from '../content/semicolon'
import { listedSessions } from '../content/sessions'
import { Concept } from './Concept'
import { Fade } from './Fade'
import styles from './SessionIndex.module.css'

const { session } = semicolon

/**
 * 번호를 붙이지 않는다.
 *
 * 001, 002 같은 고정 자릿수는 에디토리얼처럼 보이려고 만든 규칙일 뿐이고,
 * 순서에 의미가 없는 글까지 줄 세운다. 순서는 이 목록의 배열 순서가 정한다.
 */
export function SessionIndex() {
  return (
    <>
      <Concept label={session.label} concept={session.concept} definition={session.definition} />

      <div className={`sc-shell ${styles.inner}`}>
        {listedSessions.length === 0 ? (
          <p className={styles.empty} lang="ko">
            {session.empty}
          </p>
        ) : (
          <ul className={styles.list} role="list">
            {listedSessions.map((item, index) => (
              <li key={item.slug}>
                <Fade delay={index * 60}>
                  <a className={styles.row} href={`${session.href}${item.slug}/`}>
                    <span className={styles.main}>
                      <span className={styles.title} lang="ko">
                        {item.title}
                      </span>

                      {item.subtitle ? (
                        <span className={styles.subtitle} lang="ko">
                          {item.subtitle}
                        </span>
                      ) : null}
                    </span>

                    <span className={styles.aside}>
                      {item.draft ? <span className={`sc-mono ${styles.draft}`}>Draft</span> : null}

                      {item.date ? (
                        <span className={`sc-mono ${styles.date}`}>{item.date}</span>
                      ) : null}
                    </span>
                  </a>
                </Fade>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
