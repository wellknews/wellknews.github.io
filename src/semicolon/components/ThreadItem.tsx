import { findThread } from '../content/threads'
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
  /* 없는 글을 가리키고 있으면 아무것도 그리지 않는다. */
  const prior = thread.follows ? findThread(thread.follows) : undefined

  /*
   * 곁가지는 목록에서만 물러난다.
   *
   * aside가 하는 말은 «이 글은 본류가 아니다»인데, 그 말은 옆에 본류가 있어야
   * 성립한다. level이 1이면 이 글이 곧 그 페이지라 옆에 아무도 없고, 그때
   * 오른쪽으로 물러나면 물러난 것이 아니라 판면 절반이 그냥 빈다.
   *
   * loud는 그대로 둔다. «이 문장이 전부다»는 옆에 아무도 없어도 참이고,
   * 오히려 혼자 있을 때 더 참이다. 관계를 말하는 형식과 그 글 자체를 말하는
   * 형식의 차이다.
   */
  const form = thread.form ?? 'note'
  const seated = form === 'aside' && level === 1 ? 'note' : form

  return (
    <article className={styles.item} data-form={seated} data-linked={linked}>
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
        {/*
          이 생각이 이어져 나온 자리.

          이 게시판의 기호는 끝이 닫히지 않고 점 셋으로 흘러간다. 그 점을
          목록 머리에만 그려 두고 정작 글에서는 아무것도 이어지지 않으면,
          그것은 뜻이 아니라 모양이다. 앞 글이 있는 글에서는 점이 실제로
          그쪽에서 흘러 들어온다.

          제목 위에 놓는다. 이 글을 읽기 전에 알아야 하는 것이지 읽고 나서
          권하는 것이 아니다 — 뒤에 놓으면 «다음 글 보기»가 된다.
        */}
        {prior ? (
          <p className={`mono ${styles.trail}`}>
            <Link
              to={path.thread(prior.slug)}
              className={styles.trailLink}
              aria-label={`이어지기 전의 글 — ${prior.title ?? prior.date}`}
            >
              <span className={styles.dots} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              {/*
                앞 글의 날짜는 적지 않는다.

                이 글의 날짜가 바로 위에 있어서 두 개가 나란히 서면 어느 것이
                이 글의 것인지 알 수 없다. 앞 글이 같은 날인 경우가 실제로
                있어서 특히 그렇다. 어디서 왔는지는 제목이 말하고, 언제는
                눌러 보면 그 글이 말한다.
              */}
              <span className={styles.trailTitle}>{prior.title ?? prior.date}</span>
            </Link>
          </p>
        ) : null}

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
