import { semicolon } from '../content/semicolon'
import { Fade } from './Fade'
import styles from './Home.module.css'

const { home } = semicolon

type DoorProps = {
  label: string
  href: string
  path: string
  concept: string
  definition: string
}

/**
 * 콘텐츠로 들어가는 문.
 *
 * 최근 글을 미리 보여주지 않는다. 홈은 목록이 아니라 이 공간이 무엇인지 밝히는
 * 자리이고, 목록은 문 너머에 이미 있다.
 */
function Door({ label, href, path, concept, definition }: DoorProps) {
  return (
    <a className={styles.door} href={href}>
      <span className={styles.doorHead}>
        <span className={styles.doorLabel}>{label}</span>
        <span className={`sc-path ${styles.doorPath}`}>{path}</span>
      </span>

      <span className={`sc-mono ${styles.doorConcept}`}>{concept}</span>

      <span className={styles.doorDefinition} lang="ko">
        {definition}
      </span>
    </a>
  )
}

export function Home() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`sc-shell ${styles.heroInner}`}>
          {/* 이름 자체와 이 한 글자가 이 공간의 유일한 그래픽 자산이다. */}
          <p className={styles.mark} aria-hidden="true">
            {semicolon.mark}
          </p>

          <h1 className={styles.headline} lang="ko">
            {home.headline.map((line) => (
              <span key={line} className={styles.headlineLine}>
                {line}
              </span>
            ))}
          </h1>
        </div>
      </section>

      <section className={styles.statement}>
        <div className={`sc-shell ${styles.statementInner}`}>
          <Fade className={styles.column}>
            {home.statement.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph} lang="ko">
                {paragraph}
              </p>
            ))}
          </Fade>
        </div>
      </section>

      <section className={styles.principle}>
        <div className={`sc-shell ${styles.principleInner}`}>
          <Fade className={styles.principleColumn}>
            <p className={styles.principleLine} lang="ko">
              {home.principle}
            </p>
          </Fade>
        </div>
      </section>

      <section aria-label="콘텐츠">
        <div className={`sc-shell ${styles.doorList}`}>
          <Fade>
            <Door
              label={semicolon.session.label}
              href={semicolon.session.href}
              path={semicolon.session.path}
              concept={semicolon.session.concept}
              definition={semicolon.session.definition}
            />
          </Fade>

          <Fade delay={80}>
            <Door
              label={semicolon.thread.label}
              href={semicolon.thread.href}
              path={semicolon.thread.path}
              concept={semicolon.thread.concept}
              definition={semicolon.thread.definition}
            />
          </Fade>
        </div>
      </section>
    </>
  )
}
