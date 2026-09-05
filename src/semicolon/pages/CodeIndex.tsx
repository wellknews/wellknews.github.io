import { CodeList } from '../components/CodeList'
import { PageHead } from '../components/PageHead'
import { codes } from '../content/code'
import { semicolon } from '../content/site'
import { path } from '../router'

export function CodeIndex() {
  return (
    <div className="shell page">
      <PageHead
        kind="code"
        label={semicolon.code.label}
        path={path.codeIndex}
        definition={semicolon.code.definition}
      />

      <CodeList codes={codes} empty={semicolon.code.empty} />
    </div>
  )
}
