import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { categoryOrder, mamaboy } from '../content/site'
import { Link, path } from '../router'
import { useReducedMotion } from '../motion/useReducedMotion'
import type { Category } from '../content/types'
import styles from './CategoryIndex.module.css'

type Props = {
  /** 지금 보고 있는 카테고리. 홈에서는 없다. */
  current?: Category | null
  /** 지면 어디에 놓이는지. 목차의 머리 문구가 달라진다. */
  label?: string
}

/**
 * 카테고리 목차.
 *
 * 알약 버튼 다섯 개를 늘어놓지 않는다. 잡지의 목차처럼 번호를 붙이고, 지금
 * 보고 있는 장에는 주황 젤 표식이 붙는다. 다른 장으로 옮기면 그 표식이
 * 새 자리로 «이동한다» — 사라졌다 나타나는 것이 아니라 미끄러져 간다.
 *
 * 표식의 자리는 CSS로 계산할 수 없다. 항목마다 글자 폭이 다르기 때문에 실제로
 * 그려진 위치를 재서 넘긴다. 재는 일은 화면이 그려지기 전(useLayoutEffect)에
 * 끝내야 첫 프레임에서 표식이 엉뚱한 자리에 찍히지 않는다.
 *
 * 좁은 화면에서는 가로로 넘긴다. 스크롤을 가로채지 않고 브라우저의 스크롤에
 * 스냅만 얹는다 — 손가락이 하던 일을 그대로 두는 것이 이 화면의 원칙이다.
 */
export function CategoryIndex({ current = null, label }: Props) {
  const listRef = useRef<HTMLOListElement>(null)
  const activeRef = useRef<HTMLLIElement>(null)
  const [ready, setReady] = useState(false)
  const reduced = useReducedMotion()

  const place = useCallback(() => {
    const list = listRef.current
    const active = activeRef.current

    if (!list) return

    if (!active) {
      setReady(false)

      return
    }

    // 목록이 가로로 스크롤될 수 있으므로 스크롤 위치까지 더해 자리를 잡는다.
    const left = active.offsetLeft
    const width = active.offsetWidth

    list.style.setProperty('--marker-x', `${left}px`)
    list.style.setProperty('--marker-w', `${width}px`)
    setReady(true)
  }, [])

  useLayoutEffect(place, [place, current])

  useEffect(() => {
    window.addEventListener('resize', place)

    return () => window.removeEventListener('resize', place)
  }, [place])

  /*
   * 좁은 화면에서 지금 있는 장이 화면 밖에 있으면 그 자리로 데려다 놓는다.
   * 사람이 스크롤하는 중에는 건드리지 않으므로, 카테고리를 옮긴 직후에만 일어난다.
   */
  useEffect(() => {
    const active = activeRef.current

    if (!active) return

    active.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [current, reduced])

  return (
    <nav className={styles.index} aria-label="카테고리 목차">
      {label ? <p className={`label ${styles.head}`}>{label}</p> : null}

      <ol className={styles.list} ref={listRef} data-marked={ready}>
        {categoryOrder.map((category, order) => {
          const active = category === current

          return (
            <li key={category} ref={active ? activeRef : null} className={styles.item}>
              <Link
                to={path.category(category)}
                className={`pressable ${styles.link}`}
                current={active}
              >
                <span className={`meta ${styles.number}`} aria-hidden="true">
                  {`${order + 1}`.padStart(2, '0')}
                </span>

                <span className={`label ${styles.name}`}>{mamaboy.categories[category].label}</span>
              </Link>
            </li>
          )
        })}

        {/* 젤 표식. 정보가 아니라 «지금 여기»의 물성이라 낭독에서는 빠진다. */}
        <span className={styles.marker} aria-hidden="true" />
      </ol>
    </nav>
  )
}
