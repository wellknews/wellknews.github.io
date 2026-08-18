import { semicolon } from '../content/semicolon'
import { listedThreads } from '../content/threads'
import { Concept } from './Concept'
import { Fade } from './Fade'
import styles from './ThreadIndex.module.css'

const { thread } = semicolon

/**
 * Thread는 낱개 페이지로 나누지 않고 한 화면에 흐름으로 쌓는다.
 *
 * 이어지는 생각을 한 편씩 끊어 두면 이어진다는 성격 자체가 사라진다.
 * 대신 항목마다 앵커를 두어 하나만 가리켜야 할 때 링크할 수 있게 한다.
 */
export function ThreadIndex() {
  return (
    <>
      <Concept label={thread.label} concept={thread.concept} definition={thread.definition} />

      <div className={`sc-shell ${styles.inner}`}>
        {listedThreads.length === 0 ? (
          <p className={styles.empty} lang="ko">
            {thread.empty}
          </p>
        ) : (
          <ol className={styles.stream} role="list">
            {listedThreads.map((item) => (
              <li key={item.id} id={item.id} className={styles.item}>
                <Fade>
                  <article>
                    <p className={styles.stamp}>
                      {/* 날짜가 곧 이 생각의 주소다. 날짜가 없으면 식별자를 그대로 쓴다. */}
                      <a className={`sc-mono ${styles.permalink}`} href={`#${item.id}`}>
                        {item.date ?? `#${item.id}`}
                      </a>

                      {item.draft ? <span className={`sc-mono ${styles.draft}`}>Draft</span> : null}
                    </p>

                    {item.title ? (
                      <h2 className={styles.title} lang="ko">
                        {item.title}
                      </h2>
                    ) : null}

                    {item.body.map((paragraph) => (
                      <p key={paragraph} className={styles.paragraph} lang="ko">
                        {paragraph}
                      </p>
                    ))}
                  </article>
                </Fade>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  )
}
