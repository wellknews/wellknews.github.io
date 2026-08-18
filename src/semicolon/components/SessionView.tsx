import { semicolon } from '../content/semicolon'
import { findSession, type SessionBlock } from '../content/sessions'
import styles from './SessionView.module.css'

const { session } = semicolon

type Props = {
  slug: string
}

/**
 * 본문 블록.
 *
 * 어휘를 좁게 유지한다. 문단, 소제목, 따로 세우는 문장, 사진. 글마다 필요한 구조가
 * 다르더라도 이 네 가지를 조합해 만들고, 부족하면 어휘를 늘리기 전에 정말 필요한지 묻는다.
 */
function Block({ block }: { block: SessionBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className={styles.heading} lang="ko">
          {block.value}
        </h2>
      )

    case 'quote':
      return (
        <blockquote className={styles.quote}>
          <p lang="ko">{block.value}</p>
        </blockquote>
      )

    case 'image':
      return (
        <figure className={styles.figure}>
          {/*
            사진은 방문 인증이 아니라 근거다. 그래서 caption은 분위기를 적는 자리가
            아니라 이 장면이 무엇을 뒷받침하는지 적는 자리다.
          */}
          <img
            src={block.src}
            alt={block.alt}
            width={block.width}
            height={block.height}
            loading="lazy"
            decoding="async"
          />

          {block.caption ? (
            <figcaption className={styles.caption} lang="ko">
              {block.caption}
            </figcaption>
          ) : null}
        </figure>
      )

    case 'text':
      return (
        <p className={styles.paragraph} lang="ko">
          {block.value}
        </p>
      )
  }
}

export function SessionView({ slug }: Props) {
  const item = findSession(slug)

  if (!item) {
    return (
      <div className={`sc-shell ${styles.inner}`}>
        <p className={styles.missing} lang="ko">
          이 주소에 해당하는 글이 없습니다.
        </p>

        <a className={`sc-path ${styles.back}`} href={session.href}>
          {session.path}
        </a>
      </div>
    )
  }

  return (
    <article className={`sc-shell ${styles.inner}`}>
      <header className={styles.head}>
        <h1 className={styles.title} lang="ko">
          {item.title}
        </h1>

        {item.subtitle ? (
          <p className={styles.subtitle} lang="ko">
            {item.subtitle}
          </p>
        ) : null}
      </header>

      {/*
        메타는 글마다 다르다. 모든 글이 같은 항목을 가질 필요가 없고, 값이 없는 항목을
        채우려고 없는 정보를 만들지 않는다. 그래서 항목이 하나도 없으면 영역 자체를 그리지 않는다.
      */}
      {item.date || item.meta?.length ? (
        <dl className={`sc-mono ${styles.meta}`}>
          {item.date ? (
            <div className={styles.metaRow}>
              <dt className={styles.metaTerm}>Date</dt>
              <dd className={styles.metaValue}>{item.date}</dd>
            </div>
          ) : null}

          {item.meta?.map((entry) => (
            <div key={entry.term} className={styles.metaRow}>
              <dt className={styles.metaTerm}>{entry.term}</dt>
              <dd className={styles.metaValue}>{entry.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className={styles.body}>
        {item.lead ? (
          <p className={styles.lead} lang="ko">
            {item.lead}
          </p>
        ) : null}

        {/*
          본문에는 스크롤 리빌을 걸지 않는다. 읽는 동안 화면이 계속 움직이면
          이 공간이 말하려는 속도와 정반대가 된다.
        */}
        {item.body.map((block, index) => (
          // 본문 블록은 손으로 쓴 정적 배열이라 순서가 바뀌지 않는다. 인덱스가 곧 정체성이다.
          // oxlint-disable-next-line react/no-array-index-key
          <Block key={`${block.type}-${index}`} block={block} />
        ))}

        <a className={`sc-path ${styles.back}`} href={session.href}>
          {session.path}
        </a>
      </div>
    </article>
  )
}
