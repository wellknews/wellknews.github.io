import type { Thread } from '../content/types'
import { EmptyState } from './EmptyState'
import { ThreadItem } from './ThreadItem'
import styles from './ThreadList.module.css'

type Props = {
  threads: readonly Thread[]
  empty: string
}

/**
 * 스레드는 목록에서도 전문이 그대로 보인다.
 *
 * 제목만 걸어두고 클릭을 요구하면 '완성된 글'처럼 보이게 되는데, 이건 이어지는
 * 중인 생각이다. 제목이 없는 글도 있어서 애초에 목록으로 접을 수도 없다.
 */
export function ThreadList({ threads, empty }: Props) {
  if (threads.length === 0) {
    return <EmptyState>{empty}</EmptyState>
  }

  return (
    <div className={styles.list}>
      {threads.map((thread) => (
        <ThreadItem key={thread.slug} thread={thread} level={2} linked />
      ))}
    </div>
  )
}
