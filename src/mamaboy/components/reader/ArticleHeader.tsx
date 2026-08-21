import { mamaboy } from '../../content/site'
import { formatDate, machineDate } from '../../services/time'
import { CategoryTag, ContentTypeTag } from '../Tag'
import { TranslationBadge } from './TranslationBadge'
import type { Article } from '../../content/types'
import styles from './Reader.module.css'

type Props = {
  article: Article
  /** 화면에 보여줄 제목. 언어 전환에 따라 달라진다. */
  heading: { text: string; lang: string }
}

/**
 * 기사의 머리(§29).
 *
 * 목록보다 훨씬 정적이다. 여기서부터는 읽는 행위가 최우선이므로 장식적인
 * 인터랙션을 두지 않는다. 남는 것은 이 글이 무엇이고, 누구의 것이고,
 * 언제 나왔고, 우리가 손을 댔는지뿐이다.
 */
export function ArticleHeader({ article, heading }: Props) {
  return (
    <header className={styles.head}>
      <p className={styles.tags}>
        <CategoryTag category={article.category} />
        <ContentTypeTag type={article.contentType} />
        <TranslationBadge status={article.translationStatus} />
      </p>

      <h1 className={styles.title} lang={heading.lang}>
        {heading.text}
      </h1>

      {/*
        번역문을 읽고 있을 때 원문 제목을 함께 남긴다. 번역 결과로 원문을 덮어쓰지
        않는다는 원칙(§12)이 화면에서도 그대로 보여야 한다. 원문을 보고 있을 때는
        같은 문장이 두 번 나오므로 사라진다.
      */}
      {article.titleOriginal !== heading.text ? (
        <p className={styles.originalTitle} lang={article.language}>
          {article.titleOriginal}
        </p>
      ) : null}

      <p className={`meta ${styles.byline}`}>
        <a
          className={styles.source}
          href={article.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {article.sourceName}
        </a>
        {article.author ? <span>{article.author}</span> : null}
        <time dateTime={machineDate(article.publishedAt)}>{formatDate(article.publishedAt)}</time>
      </p>

      {article.translationStatus === 'done' ? (
        <p className={`meta ${styles.note}`}>{mamaboy.reader.translatedNote}</p>
      ) : null}
    </header>
  )
}
