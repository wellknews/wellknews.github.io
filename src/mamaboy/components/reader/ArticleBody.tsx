import { mamaboy } from '../../content/site'
import { body, isHealth, summary } from '../../services/present'
import type { Article } from '../../content/types'
import styles from './Reader.module.css'

type Props = {
  article: Article
  /** 'ko'면 번역문을, 'original'이면 원문을 읽는다. */
  mode: 'ko' | 'original'
}

/**
 * 본문(§15).
 *
 * 이 지면이 어디까지 실을 수 있는지는 데이터가 정한다.
 *
 *   full     전문
 *   summary  요약까지. 그 사실을 한 줄로 밝힌다
 *   link     제목과 출처까지. 본문은 원 사이트에 있다
 *
 * RSS가 전문을 준다고 해서 전문을 싣지 않는다. 여기서 판단을 내리지 않고
 * 수집 단계에서 정해 둔 값을 그대로 따르는 이유는, 화면이 판단하기 시작하면
 * 같은 규칙이 여러 곳에 흩어지기 때문이다.
 */
export function ArticleBody({ article, mode }: Props) {
  const full = body(article)
  const lead = summary(article)

  const paragraphs =
    full && (mode === 'ko' || !article.bodyOriginal)
      ? full
      : full && article.bodyOriginal
        ? { paragraphs: article.bodyOriginal, lang: article.language }
        : null

  const leadText =
    mode === 'original' && article.summaryOriginal
      ? { text: article.summaryOriginal, lang: article.language }
      : lead

  return (
    <div className={styles.body}>
      {leadText ? (
        <p className={styles.lead} lang={leadText.lang}>
          {leadText.text}
        </p>
      ) : null}

      {paragraphs
        ? paragraphs.paragraphs.map((paragraph) => (
            <p key={paragraph} className={styles.paragraph} lang={paragraphs.lang}>
              {paragraph}
            </p>
          ))
        : null}

      {article.contentPolicy === 'summary' ? (
        <p className={`meta ${styles.limit}`}>{mamaboy.reader.summaryOnly}</p>
      ) : null}

      {article.contentPolicy === 'link' ? (
        <p className={`meta ${styles.limit}`}>{mamaboy.reader.linkOnly}</p>
      ) : null}

      {/* 건강 정보에는 성격을 한 줄로 밝힌다. 연구를 조언으로 읽게 두지 않는다(§33). */}
      {isHealth(article) ? (
        <p className={`meta ${styles.limit}`}>{mamaboy.reader.healthNote}</p>
      ) : null}
    </div>
  )
}
