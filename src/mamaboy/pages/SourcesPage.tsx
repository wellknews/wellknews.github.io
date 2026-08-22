import { useMemo } from 'react'

import { PrototypeNote } from '../components/PrototypeNote'
import { articles } from '../content/feed'
import { sources } from '../data/sources'
import { mamaboy } from '../content/site'
import styles from './SourcesPage.module.css'
import pageStyles from './Page.module.css'

/**
 * 콘텐츠가 어디서 오는지(§34).
 *
 * MAMABOY는 기사를 쓰지 않는다. 그렇다면 이 지면에 걸린 글이 누구의 것인지
 * 한 화면에서 확인할 수 있어야 한다. 출처 표기를 카드 구석의 작은 글자로만
 * 두지 않고 목록으로 한 번 더 두는 이유다.
 *
 * 아직 켜지 않은 소스도 감추지 않는다. 이 지면이 무엇을 보고 있고 무엇을 아직
 * 보지 않기로 했는지가 함께 드러나는 편이 정확하다.
 *
 * 매체마다 지금 몇 건이 걸려 있는지를 함께 적는다. 이름만 늘어놓으면 명단이지만
 * 건수가 붙으면 현황이 된다 — 켜 두고도 한 건도 들어오지 않는 소스가 있다는
 * 사실이 이 목록에서 바로 보여야 한다.
 */
/** 켜져 있는지, 켜져 있다면 지금 몇 건이 걸려 있는지. 한 줄에 그것만 적는다. */
function state(enabled: boolean, count: number): string {
  if (!enabled) return mamaboy.sources.disabled

  return count > 0 ? mamaboy.sources.onPage(count) : mamaboy.sources.onPageNone
}

export function SourcesPage() {
  const counts = useMemo(() => {
    const map = new Map<string, number>()

    for (const article of articles)
      map.set(article.sourceName, (map.get(article.sourceName) ?? 0) + 1)

    return map
  }, [])

  return (
    <div className="page">
      <header className={`shell ${pageStyles.head}`}>
        <p className={`label ${pageStyles.label}`}>{mamaboy.sources.label}</p>
        <h1 className={pageStyles.title}>{mamaboy.sources.title}</h1>
        <p className={pageStyles.definition}>{mamaboy.sources.definition}</p>
      </header>

      <div className={`shell ${styles.notice}`}>
        <PrototypeNote />
      </div>

      <div className="shell">
        <ul className={styles.list} role="list">
          {sources.map((source) => (
            <li key={source.id} className={styles.item} data-enabled={source.enabled}>
              <p className={styles.name}>
                <a
                  className="touchable"
                  href={source.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.name}
                </a>
              </p>

              <p className={`meta ${styles.detail}`}>
                <span className="label">
                  {source.categories
                    .map((category) => mamaboy.categories[category].label)
                    .join(' · ')}
                </span>
                <span className="label">{mamaboy.contentTypes[source.trustType].label}</span>
                <span>{source.language.toUpperCase()}</span>
              </p>

              <p className={`meta ${styles.state}`}>
                {state(source.enabled, counts.get(source.name) ?? 0)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
