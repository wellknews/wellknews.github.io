import { useEffect, useRef } from 'react'

import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Temperature } from './components/Temperature'
import { findArticle } from './content/feed'
import { axisOf, mamaboy } from './content/site'
import { title as titleOf } from './services/present'
import { ArticlePage } from './pages/ArticlePage'
import { CategoryPage } from './pages/CategoryPage'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { SourcesPage } from './pages/SourcesPage'
import { routeKey, useRoute, type Route } from './router'
import type { Axis } from './content/types'

function render(route: Route) {
  switch (route.kind) {
    case 'home':
      return <Home />
    case 'category':
      return <CategoryPage category={route.category} />
    case 'article':
      return <ArticlePage slug={route.slug} />
    case 'sources':
      return <SourcesPage />
    case 'not-found':
      return <NotFound />
  }
}

/** 탭 제목. 이름을 뒤에 붙여 앞쪽에 지금 보고 있는 것이 오게 한다. */
function documentTitle(route: Route): string {
  const suffix = ` — ${mamaboy.name}`

  switch (route.kind) {
    case 'home':
      return mamaboy.hero.documentTitle
    case 'category':
      return mamaboy.categories[route.category].title + suffix
    case 'sources':
      return mamaboy.sources.title + suffix
    case 'article': {
      const article = findArticle(route.slug)

      return (article ? titleOf(article).text : mamaboy.notFound.title) + suffix
    }
    case 'not-found':
      return mamaboy.notFound.title + suffix
  }
}

/**
 * 지금 지면이 기울어 있는 쪽(§39).
 *
 * 홈은 어느 쪽도 아니다 — 두 축의 공존이 이 매거진의 정체성이라 첫 화면에서
 * 한쪽으로 기울면 안 된다.
 */
function axisOfRoute(route: Route): Axis | null {
  if (route.kind === 'category') return axisOf(route.category)

  if (route.kind === 'article') {
    const article = findArticle(route.slug)

    return article ? axisOf(article.category) : null
  }

  return null
}

export default function App() {
  const route = useRoute()
  const key = routeKey(route)
  const previousRoute = useRef(key)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = documentTitle(route)
  }, [route])

  /*
   * SPA 안에서 링크를 따라가면 눌렀던 링크에 초점이 남는다. 그 링크가 새 화면에서
   * 사라지면 스크린리더와 키보드 사용자는 어디로 이동했는지 알기 어렵다.
   * 첫 진입 때는 초점을 빼앗지 않고, 실제 전환 뒤에만 본문 시작점으로 옮긴다.
   */
  useEffect(() => {
    if (previousRoute.current === key) return

    previousRoute.current = key

    const frame = window.requestAnimationFrame(() => {
      mainRef.current?.focus({ preventScroll: true })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [key])

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>

      <Temperature axis={axisOfRoute(route)} />

      <Header route={route} />

      <main id="main" ref={mainRef} tabIndex={-1} key={key}>
        {render(route)}
      </main>

      <Footer />
    </>
  )
}
