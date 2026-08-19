import type { Thread } from '../content/types'
import { Link, path } from '../router'
import { Prose } from './Prose'
import styles from './ThreadItem.module.css'

type Props = {
  thread: Thread
  /** 제목의 문서 위계. 스레드 한 편만 있는 페이지에서는 1이다. */
  level: 1 | 2
  /** 날짜를 그 글의 주소로 걸지. 이미 그 주소에 있는 페이지에서는 걸지 않는다. */
  linked: boolean
}

/**
 * 생각 한 편.
 *
 * 날짜는 본문 옆 여백 칼럼에 앉는다. 인쇄물의 방주(旁註)와 같은 자리이고,
 * 고정폭 숫자와 명조 본문이 같은 줄에서 시작하면서 이 공간의 성격이 드러난다.
 *
 * 제목이 없어도 된다. 완성된 분석이 아니라 이어지는 중인 생각이라서,
 * 이름을 붙여야 할 만큼 정리되지 않은 것도 그대로 남긴다.
 * 대신 날짜는 늘 있고, 그 날짜가 이 글의 주소다.
 */
export function ThreadItem({ thread, level, linked }: Props) {
  const Heading = level === 1 ? 'h1' : 'h2'
  const to = path.thread(thread.slug)

  return (
    <article className={styles.item}>
      <div className={styles.aside}>
        {linked ? (
          <Link to={to} className={`mono ${styles.date}`}>
            <time dateTime={thread.date}>{thread.date}</time>
          </Link>
        ) : (
          <p className={`mono ${styles.date}`}>
            <time dateTime={thread.date}>{thread.date}</time>
          </p>
        )}
      </div>

      <div className={styles.main}>
        {thread.title ? (
          <Heading className={styles.title}>{thread.title}</Heading>
        ) : (
          /* 제목이 없는 글에도 문서 위계는 필요하다. 화면에는 날짜만 남는다. */
          level === 1 && <h1 className="visually-hidden">{thread.date}</h1>
        )}

        <Prose>{thread.body}</Prose>

        {/* 여기서 문장이 잠시 멈춘다는 표시 */}
        <span className="endmark" aria-hidden="true">
          ;
        </span>
      </div>
    </article>
  )
}
