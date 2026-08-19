import { useEffect } from 'react'

import { Footer } from './components/Footer'
import { Frame } from './components/Frame'
import { Header } from './components/Header'
import { semicolon } from './content/site'
import { findSession } from './content/sessions'
import { findThread } from './content/threads'
import { Home } from './pages/Home'
import { NotFound } from './pages/NotFound'
import { SessionEntry } from './pages/SessionEntry'
import { SessionIndex } from './pages/SessionIndex'
import { ThreadEntry } from './pages/ThreadEntry'
import { ThreadIndex } from './pages/ThreadIndex'
import { useRoute, type Route } from './router'

function render(route: Route) {
  switch (route.kind) {
    case 'home':
      return <Home />
    case 'session-index':
      return <SessionIndex />
    case 'session':
      return <SessionEntry slug={route.slug} />
    case 'thread-index':
      return <ThreadIndex />
    case 'thread':
      return <ThreadEntry slug={route.slug} />
    case 'not-found':
      return <NotFound />
  }
}

/** 탭 제목. 이름을 뒤에 붙여 앞쪽에 지금 보고 있는 것이 오게 한다. */
function titleOf(route: Route): string {
  const suffix = ` — ${semicolon.name}`

  switch (route.kind) {
    case 'home':
      return semicolon.name
    case 'session-index':
      return semicolon.session.label + suffix
    case 'thread-index':
      return semicolon.thread.label + suffix
    case 'session': {
      const session = findSession(route.slug)
      return session ? session.title + suffix : semicolon.notFound.title + suffix
    }
    case 'thread': {
      const thread = findThread(route.slug)
      if (!thread) return semicolon.notFound.title + suffix
      return (thread.title ?? thread.date) + suffix
    }
    case 'not-found':
      return semicolon.notFound.title + suffix
  }
}

/** 페이드를 다시 재생시키기 위한 키. 같은 페이지 안에서는 바뀌지 않는다. */
function keyOf(route: Route): string {
  return 'slug' in route ? `${route.kind}/${route.slug}` : route.kind
}

export default function App() {
  const route = useRoute()

  useEffect(() => {
    document.title = titleOf(route)
  }, [route])

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>

      <Frame />

      <Header route={route} />

      {/*
        페이지가 바뀔 때만 짧게 페이드된다. 화려한 전환을 두지 않는 이유는
        전환 자체가 눈에 띄는 순간 이 공간이 표현하려던 속도가 사라지기 때문이다.
      */}
      <main id="main" tabIndex={-1} key={keyOf(route)} className="fade">
        {render(route)}
      </main>

      <Footer />
    </>
  )
}
