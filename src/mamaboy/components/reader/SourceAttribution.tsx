import { mamaboy } from '../../content/site'
import type { Article } from '../../content/types'
import styles from './Reader.module.css'

/**
 * 출처 표기(§15).
 *
 * 디자인 요소가 아니라 시스템 요구사항이다. MAMABOY는 이 글의 작성자가 아니며,
 * 사용자가 그것을 혼동할 여지를 남기지 않는다. 그래서 이 블록은 어떤 형태의
 * 기사에서도 생략되지 않는다.
 *
 * 원문으로 가는 버튼은 바로 위(exit)에 이미 있으므로 여기서 반복하지 않는다.
 * 대신 매체의 홈으로 가는 길을 둔다 — 이 글 하나가 아니라 그 매체를 찾아갈 수
 * 있어야 출처 표기가 제 역할을 한다.
 */
export function SourceAttribution({ article }: { article: Article }) {
  return (
    <aside className={styles.attribution}>
      <p className={`label ${styles.attributionLabel}`}>{mamaboy.sources.label}</p>

      <p className={styles.attributionName}>
        <a className="touchable" href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
          {article.sourceName}
        </a>
        {article.author ? <span className={styles.attributionAuthor}>{article.author}</span> : null}
      </p>
    </aside>
  )
}
