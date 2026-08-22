import { useEffect, useMemo, useRef, useState } from 'react'

import { articles } from '../content/feed'
import { mamaboy } from '../content/site'
import { Link, path } from '../router'
import { search } from '../services/search'
import { title } from '../services/present'
import { shortAge } from '../services/time'
import styles from './SearchOverlay.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

/**
 * 검색(§31).
 *
 * 별도의 검색 페이지를 만들지 않는다. 지면을 떠나지 않은 채 화면 위에서 열리고,
 * 닫으면 보고 있던 자리로 그대로 돌아온다. 필드는 상단에서 아래로 펼쳐진다 —
 * 헤더의 SEARCH를 누른 자리에서 그대로 자라 나오는 것처럼 보이게 하기 위해서다.
 *
 * 브라우저의 <dialog>를 쓴다. 초점 가두기, Escape로 닫기, 뒤쪽 내용의 비활성화를
 * 직접 구현하는 것보다 정확하고, 그 세 가지는 직접 만들면 거의 항상 어딘가 샌다.
 *
 * 결과는 최대 20건까지만 그린다. 더 정확히 좁히는 편이 스크롤보다 빠르다.
 */
export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => search(articles, query).slice(0, 20), [query])

  useEffect(() => {
    const dialog = dialogRef.current

    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      inputRef.current?.focus()
    }

    if (!open && dialog.open) dialog.close()
  }, [open])

  // 닫을 때 질의를 비운다. 다음에 열었을 때 지난 검색이 남아 있지 않게 한다.
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className={styles.overlay}
      aria-label={mamaboy.search.label}
      // Escape로 닫혔을 때도 열림 상태를 들고 있는 쪽이 그 사실을 알아야 한다.
      onClose={onClose}
      onCancel={onClose}
    >
      <div className={`shell ${styles.panel}`}>
        <div className={styles.field}>
          <label className="visually-hidden" htmlFor="mamaboy-search">
            {mamaboy.search.scope}
          </label>

          <input
            id="mamaboy-search"
            ref={inputRef}
            className={styles.input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={mamaboy.search.placeholder}
            autoComplete="off"
            spellCheck={false}
          />

          <button
            type="button"
            className={`label pressable ${styles.close}`}
            onClick={onClose}
            aria-label={mamaboy.search.close}
          >
            CLOSE
          </button>
        </div>

        <p className={`meta ${styles.scope}`} aria-live="polite">
          {query.trim() ? mamaboy.search.resultCount(results.length) : mamaboy.search.scope}
        </p>

        {query.trim() && results.length === 0 ? (
          <p className={styles.empty}>{mamaboy.search.empty}</p>
        ) : null}

        <ul className={styles.results} role="list">
          {results.map((article) => {
            const heading = title(article)

            return (
              <li key={article.id}>
                <Link
                  to={path.article(article.slug)}
                  className={`pressable ${styles.result}`}
                  onNavigate={onClose}
                >
                  <span className={`label ${styles.resultCategory}`}>
                    {mamaboy.categories[article.category].label}
                  </span>

                  <span className={styles.resultTitle} lang={heading.lang}>
                    {heading.text}
                  </span>

                  <span className={`meta ${styles.resultMeta}`}>
                    {article.sourceName} · {shortAge(article.publishedAt)}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </dialog>
  )
}
