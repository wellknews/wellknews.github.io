import { PageHead } from '../components/PageHead'
import { ThreadList } from '../components/ThreadList'
import { semicolon } from '../content/site'
import { threads } from '../content/threads'
import { path } from '../router'

export function ThreadIndex() {
  return (
    <div className="shell page">
      <PageHead
        kind="thread"
        label={semicolon.thread.label}
        path={path.threadIndex}
        definition={semicolon.thread.definition}
      />

      <ThreadList threads={threads} empty={semicolon.thread.empty} />
    </div>
  )
}
