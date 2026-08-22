import { useState } from 'react'

import { mamaboy } from '../../content/site'
import { title } from '../../services/present'
import { StoryImage } from '../StoryImage'
import { ArticleBody } from './ArticleBody'
import { ArticleHeader } from './ArticleHeader'
import { OriginalLink } from './OriginalLink'
import { SourceAttribution } from './SourceAttribution'
import type { Article } from '../../content/types'
import styles from './Reader.module.css'

type Mode = 'ko' | 'original'

/**
 * 기사 상세(§29).
 *
 * 메인이 편집 지면이라면 여기는 읽는 자리다. 지면의 리듬을 그대로 가져오지
 * 않고, 한 단으로 좁혀 정적으로 만든다.
 *
 * 언어 전환(§30)의 동작은 콘텐츠 권한이 정한다.
 *   - 원문 전문을 실을 수 있는 글이면 ORIGINAL은 같은 화면에서 원문으로 바꾼다.
 *   - 그렇지 않으면 ORIGINAL은 원 사이트로 나가는 링크가 된다.
 * 버튼의 생김새가 아니라 동작이 자동으로 결정된다.
 */
export function ArticleReader({ article }: { article: Article }) {
  const [mode, setMode] = useState<Mode>('ko')

  const translated = Boolean(article.titleKo) && article.language !== 'ko'
  const canReadOriginalHere = article.contentPolicy === 'full' && Boolean(article.bodyOriginal)

  const heading =
    mode === 'original' ? { text: article.titleOriginal, lang: article.language } : title(article)

  return (
    <article className={`shell ${styles.reader}`}>
      <ArticleHeader article={article} heading={heading} />

      {translated ? (
        <fieldset className={styles.languages}>
          <legend className="visually-hidden">언어</legend>

          <button
            type="button"
            className={`label pressable ${styles.language}`}
            onClick={() => setMode('ko')}
            aria-pressed={mode === 'ko'}
          >
            {mamaboy.reader.korean}
          </button>

          {canReadOriginalHere ? (
            <button
              type="button"
              className={`label pressable ${styles.language}`}
              onClick={() => setMode('original')}
              aria-pressed={mode === 'original'}
            >
              {mamaboy.reader.original}
            </button>
          ) : (
            <a
              className={`label pressable ${styles.language}`}
              href={article.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {mamaboy.reader.original}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </fieldset>
      ) : null}

      {article.image ? (
        <StoryImage image={article.image} priority className={styles.cover} />
      ) : null}

      <ArticleBody article={article} mode={mode} />

      <div className={styles.exit}>
        <OriginalLink href={article.originalUrl} sourceName={article.sourceName} />
      </div>

      <SourceAttribution article={article} />
    </article>
  )
}
