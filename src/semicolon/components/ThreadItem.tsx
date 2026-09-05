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
  /**
   * 글 끝의 ';'를 이 글이 직접 찍을지.
   *
   * 목록에서는 글마다 자기 끝을 찍어야 한 편이 어디서 끝났는지 보인다.
   * 한 편만 있는 페이지에서는 그 글의 끝이 곧 페이지의 끝이라, 기호는
   * 아래의 매듭 한 줄(Closing)이 대신 찍는다. 둘 다 찍으면 ';'가 두 번 나온다.
   */
  endmark: boolean
}

/**
 * 생각 한 편.
 *
 * 어디에 어떻게 앉을지는 글이 고른다(Thread.form). 기본은 날짜가 본문 옆
 * 여백 칼럼에 앉는 방주(旁註) 형태이고, 한 문장짜리 생각은 판면 전체를 크게
 * 쓰고, 곁가지는 오른쪽 안쪽으로 물러난다. 목록을 훑으면 글마다 다른 모양이
 * 나오는데, 이어지는 중인 생각에 한 가지 틀을 강제하지 않기 위해서다.
 *
 * 제목이 없어도 된다. 완성된 분석이 아니라 이어지는 중인 생각이라서,
 * 이름을 붙여야 할 만큼 정리되지 않은 것도 그대로 남긴다.
 * 대신 날짜는 늘 있고, 그 날짜가 이 글의 주소다.
 */
export function ThreadItem({ thread, level, linked, endmark }: Props) {
  const Heading = level === 1 ? 'h1' : 'h2'
  const to = path.thread(thread.slug)
  const accessibleTitle = `${thread.date} — ${thread.title ?? thread.slug}`

  return (
    <article className={styles.item} data-form={thread.form ?? 'note'} data-linked={linked}>
      <div className={styles.aside}>
        {linked ? (
          <Link to={to} className={`mono ${styles.date}`} aria-label={accessibleTitle}>
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
          <Heading className="visually-hidden">{accessibleTitle}</Heading>
        )}

        <Prose>{thread.body}</Prose>

        {/* 여기서 문장이 잠시 멈춘다는 표시 */}
        {endmark ? (
          <span className="endmark" aria-hidden="true">
            ;
          </span>
        ) : null}
      </div>
    </article>
  )
}
