import { useEffect, useState } from 'react'

import { categoryOrder, mamaboy } from '../content/site'
import { Link, path, type Route } from '../router'
import { SearchOverlay } from './SearchOverlay'
import { Wordmark } from './Wordmark'
import styles from './Header.module.css'

type Props = {
  route: Route
}

/**
 * 헤더(§25).
 *
 * 최소한으로 구성한다 — 이름, 다섯 개의 카테고리, 검색. 그 밖의 메뉴는 두지 않는다.
 *
 * 모바일에서는 카테고리를 전부 고정 노출하지 않는다. 12px 대문자 라벨 다섯 개는
 * 320px 화면의 가로 폭을 넘기고, 넘긴 것을 줄이려고 글자를 더 작게 만들면
 * 접근성 하한을 깨게 된다. 그래서 이름과 두 개의 버튼만 남기고 카테고리는
 * 눌렀을 때 펼친다.
 */
export function Header({ route }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // 다른 화면으로 넘어가면 펼쳐 둔 메뉴는 닫는다.
  useEffect(() => {
    setMenuOpen(false)
  }, [route])

  return (
    <>
      <header className={styles.header} data-open={menuOpen}>
        <div className={`shell ${styles.inner}`}>
          <Link
            to={path.home}
            className={styles.brand}
            aria-label={mamaboy.name}
            current={route.kind === 'home'}
          >
            <Wordmark className={styles.mark} />
          </Link>

          <nav className={styles.nav} aria-label="카테고리">
            <ul className={styles.list} role="list">
              {categoryOrder.map((category) => (
                <li key={category}>
                  <Link
                    to={path.category(category)}
                    className={`label ${styles.link}`}
                    current={route.kind === 'category' && route.category === category}
                  >
                    {mamaboy.categories[category].label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <button
              type="button"
              className={`label ${styles.action}`}
              onClick={() => setSearchOpen(true)}
              aria-label={mamaboy.search.open}
            >
              {mamaboy.search.label}
            </button>

            <button
              type="button"
              className={`label ${styles.action} ${styles.menuButton}`}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mamaboy-menu"
              aria-label={menuOpen ? mamaboy.menu.close : mamaboy.menu.open}
            >
              {menuOpen ? mamaboy.menu.closeLabel : mamaboy.menu.label}
            </button>
          </div>
        </div>

        {/*
          펼친 카테고리. 데스크톱의 nav와 같은 목록이지만 같은 DOM을 옮겨 쓰지
          않는다 — 두 자리의 동작이 다르고, 하나를 미디어 쿼리로 접었다 폈다
          하면 접힌 쪽이 스크린리더에 그대로 남는다.
        */}
        <div id="mamaboy-menu" className={styles.panel} hidden={!menuOpen}>
          <ul className={`shell ${styles.panelList}`} role="list">
            {categoryOrder.map((category) => (
              <li key={category}>
                <Link
                  to={path.category(category)}
                  className={styles.panelLink}
                  current={route.kind === 'category' && route.category === category}
                >
                  <span className="label">{mamaboy.categories[category].label}</span>
                  <span className={`meta ${styles.panelTitle}`}>
                    {mamaboy.categories[category].title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
