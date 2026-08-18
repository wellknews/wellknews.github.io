import { semicolon } from './content/semicolon'
import { Home } from './components/Home'
import { Page } from './components/Page'
import { SessionIndex } from './components/SessionIndex'
import { SessionView } from './components/SessionView'
import { ThreadIndex } from './components/ThreadIndex'
import type { Route } from './route'

type Props = {
  route: Route
}

export function App({ route }: Props) {
  switch (route.kind) {
    case 'session-index':
      return (
        <Page current="session" path={semicolon.session.path}>
          <SessionIndex />
        </Page>
      )

    case 'session':
      return (
        <Page current="session" path={`${semicolon.session.path}/${route.slug}`}>
          <SessionView slug={route.slug} />
        </Page>
      )

    case 'thread-index':
      return (
        <Page current="thread" path={semicolon.thread.path}>
          <ThreadIndex />
        </Page>
      )

    case 'home':
      return (
        <Page current="home" path={semicolon.path}>
          <Home />
        </Page>
      )
  }
}
