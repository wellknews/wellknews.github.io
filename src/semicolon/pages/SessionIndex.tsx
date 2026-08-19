import { PageHead } from '../components/PageHead'
import { SessionList } from '../components/SessionList'
import { semicolon } from '../content/site'
import { sessions } from '../content/sessions'
import { path } from '../router'

export function SessionIndex() {
  return (
    <div className="shell page">
      <PageHead
        kind="session"
        label={semicolon.session.label}
        path={path.sessionIndex}
        definition={semicolon.session.definition}
      />

      <SessionList sessions={sessions} empty={semicolon.session.empty} />
    </div>
  )
}
