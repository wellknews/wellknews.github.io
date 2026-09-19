import { PageHead } from '../components/PageHead'
import { SessionTerrain } from '../components/SessionTerrain'
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

      <SessionTerrain sessions={sessions} empty={semicolon.session.empty} />
    </div>
  )
}
