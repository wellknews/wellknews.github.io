import { Closing } from '../components/Closing'
import { ThreadItem } from '../components/ThreadItem'
import { findThread } from '../content/threads'
import { path } from '../router'
import { NotFound } from './NotFound'
import styles from './ThreadEntry.module.css'

type Props = {
  slug: string
}

export function ThreadEntry({ slug }: Props) {
  const thread = findThread(slug)

  if (!thread) return <NotFound />

  return (
    <div className={`shell page ${styles.wrap}`}>
      {/* 이미 이 글의 주소에 있으므로 날짜를 다시 링크로 걸지 않는다. */}
      <ThreadItem thread={thread} level={1} linked={false} endmark={false} />

      <Closing to={path.threadIndex} label={path.threadIndex} />
    </div>
  )
}
