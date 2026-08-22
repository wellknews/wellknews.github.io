import { useEffect, useMemo, useRef, useState } from 'react'

import { articles } from '../content/feed'
import { mamaboy } from '../content/site'
import { Link, path } from '../router'
import { facets, narrow, search, type Facet, type SearchFilter } from '../services/search'
import { title } from '../services/present'
import { shortAge } from '../services/time'
import type { Article, Category } from '../content/types'
import styles from './SearchOverlay.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

/** 화면에 그리는 최대 건수. 더 정확히 좁히는 편이 스크롤보다 빠르다. */
const SHOWN = 20

/** 아무것도 치지 않았을 때 건네는 최근 글의 수. */
const STARTERS = 5

const NOTHING: SearchFilter = { category: null, source: null }

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
 * 빈 상자로 열리지 않는다. 무엇을 칠지 정하지 못한 사람에게 빈 칸은 도움이 되지
 * 않으므로, 치기 전에는 방금 걸린 글을 몇 개 보여준다 — 검색은 찾는 기능이기도
 * 하고 둘러보는 입구이기도 하다.
 */
export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<SearchFilter>(NOTHING)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const typed = query.trim().length > 0

  const matches = useMemo(() => search(articles, query), [query])
  const chips = useMemo(() => facets(matches), [matches])
  const results = useMemo(() => narrow(matches, filter), [matches, filter])
  const starters = useMemo(() => articles.slice(0, STARTERS), [])

  const shown = typed ? results.slice(0, SHOWN) : starters
  const overflow = typed ? results.length - shown.length : 0

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
    if (!open) {
      setQuery('')
      setFilter(NOTHING)
    }
  }, [open])

  /*
   * 질의가 바뀌면 좁혀 둔 조건을 푼다. 새 결과에 없는 출처로 좁혀진 채로 남으면
   * 걸린 것이 있는데도 «걸리는 것이 없다»가 뜬다.
   */
  useEffect(() => {
    setFilter(NOTHING)
  }, [query])

  /**
   * 좁히는 줄 하나. 고를 것이 하나뿐이면 그리지 않는다 — 누를 수 있지만 아무것도
   * 바뀌지 않는 버튼은 없는 편이 낫다.
   */
  function chipRow(list: Facet[], active: string | null, pick: (value: string | null) => void) {
    if (list.length < 2) return null

    return (
      <fieldset className={styles.facets}>
        <legend className="visually-hidden">{mamaboy.search.narrowLabel}</legend>

        <button
          type="button"
          className={`label pressable ${styles.chip}`}
          data-active={active === null}
          onClick={() => pick(null)}
        >
          {mamaboy.search.all}
        </button>

        {list.map((facet) => (
          <button
            key={facet.value}
            type="button"
            className={`label pressable ${styles.chip}`}
            data-active={active === facet.value}
            aria-label={mamaboy.search.facetCount(facet.label, facet.count)}
            onClick={() => pick(active === facet.value ? null : facet.value)}
          >
            {facet.label}
            <span className={styles.chipCount}>{facet.count}</span>
          </button>
        ))}
      </fieldset>
    )
  }

  function row(article: Article) {
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
  }

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
          {typed
            ? mamaboy.search.resultCount(results.length)
            : `${mamaboy.search.startersLabel} · ${mamaboy.search.scope}`}
        </p>

        {typed && matches.length > 1 ? (
          <div className={styles.narrow}>
            {chipRow(chips.categories, filter.category, (value) =>
              setFilter((current) => ({ ...current, category: value as Category | null })),
            )}
            {chipRow(chips.sources, filter.source, (value) =>
              setFilter((current) => ({ ...current, source: value })),
            )}
          </div>
        ) : null}

        {typed && results.length === 0 ? (
          <p className={styles.empty}>{mamaboy.search.empty}</p>
        ) : null}

        <ul className={styles.results} role="list">
          {shown.map(row)}
        </ul>

        {overflow > 0 ? (
          <p className={`meta ${styles.overflow}`}>{mamaboy.search.more(overflow)}</p>
        ) : null}
      </div>
    </dialog>
  )
}
