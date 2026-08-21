import { machineDate, shortAge } from '../services/time'
import type { Article } from '../content/types'
import styles from './SourceLine.module.css'

/**
 * 출처와 시간(§28).
 *
 * 이 줄은 장식이 아니라 시스템 요구사항이다. MAMABOY는 이 글을 쓰지 않았고,
 * 사용자가 그 사실을 혼동하면 안 된다. 그래서 카드에서 가장 먼저 지워지는
 * 요소(요약문·이미지)가 있어도 이 줄은 남는다.
 */
export function SourceLine({ article }: { article: Article }) {
  return (
    <p className={`meta ${styles.line}`}>
      <span className={styles.source}>{article.sourceName}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={machineDate(article.publishedAt)}>{shortAge(article.publishedAt)}</time>
    </p>
  )
}
