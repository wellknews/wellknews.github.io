import { useEffect, useRef } from 'react'

import { Field } from './components/Field'
import { Footer } from './components/Footer'
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
import { routeKey, useRoute, type Route } from './router'

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

export default function App() {
  const route = useRoute()
  const key = routeKey(route)
  const previousRoute = useRef(key)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    document.title = titleOf(route)
  }, [route])

  /*
   * SPA 안에서 링크를 따라가면 눌렀던 링크에 초점이 남는다. 그 링크가 새 화면에서
   * 사라지는 경우 스크린리더와 키보드 사용자는 어디로 이동했는지 알기 어렵다.
   * 첫 진입 때는 초점을 빼앗지 않고, 실제 라우트 전환 뒤에만 새 본문 시작점으로 옮긴다.
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

      {/* 판면 뒤에 깔린 색. 이 공간의 재료이자, 사람이 움직일 때 반응하는 유일한 배경. */}
      <Field />

      <Header route={route} />

      {/*
        페이지가 바뀔 때만 짧게 페이드된다. 화려한 전환을 두지 않는 이유는
        전환 자체가 눈에 띄는 순간 이 공간이 표현하려던 속도가 사라지기 때문이다.
      */}
      <main id="main" ref={mainRef} tabIndex={-1} key={key} className="fade">
        {render(route)}
      </main>

      <Footer />
    </>
  )
}
