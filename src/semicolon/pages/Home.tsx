import type { ReactNode } from 'react'

import { Hero } from '../components/Hero'
import { KindMark } from '../components/KindMark'
import { SessionList } from '../components/SessionList'
import { ThreadList } from '../components/ThreadList'
import { semicolon } from '../content/site'
import { sessions } from '../content/sessions'
import { threads } from '../content/threads'
import { Link, path } from '../router'
import styles from './Home.module.css'

/**
 * 첫 화면에 걸어 둘 분량.
 *
 * 스레드는 목록에서도 전문이 보이므로 한 편만 둔다. 여기서 여러 편을 펼치면
 * 홈이 곧 목록이 되고, 그러면 THREAD라는 자리가 따로 있을 이유가 없어진다.
 */
const HOME_SESSIONS = 3
const HOME_THREADS = 1

type BlockProps = {
  id: string
  kind: 'session' | 'thread'
  label: string
  to: string
  children: ReactNode
}

/**
 * 기호, 개념 이름, 그 주소를 하나의 행으로 묶는다.
 *
 * 두 블록의 머리는 같은 모양이다. 한쪽 괘선만 흘려보내 차이를 준 적이 있는데,
 * 그 정도의 차이는 의도로 읽히지 않고 어긋난 것으로 읽혔다. 두 개념의 차이는
 * 줄 맨 앞의 기호가 이미 말하고 있다.
 *
 * 무엇을 다루는 자리인지 설명하는 문장은 여기 두지 않는다. 두 블록이 한 화면에
 * 나란히 놓이므로 기호만으로 전해진다. 문장이 필요한 사람은 주소를 눌러
 * 그 개념의 페이지로 가면 된다.
 *
 * 이름 쪽을 링크로 만들지 않는 이유는 같은 목적지로 가는 문을 한 줄에 두 개
 * 두지 않기 위해서다. 문은 경로가 적힌 자리 하나뿐이다.
 */
function Block({ id, kind, label, to, children }: BlockProps) {
  return (
    <section className={styles.block} aria-labelledby={id}>
      <div className="shell">
        <div className={styles.head}>
          <KindMark kind={kind} />

          <h2 className={`mono ${styles.label}`} id={id}>
            {label}
          </h2>

          <span className="rule" aria-hidden="true" />

          <Link to={to} className={`mono ${styles.more}`}>
            {to} <span aria-hidden="true">→</span>
          </Link>
        </div>

        {children}
      </div>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />

      <Block
        id="home-session"
        kind="session"
        label={semicolon.session.label}
        to={path.sessionIndex}
      >
        <SessionList sessions={sessions.slice(0, HOME_SESSIONS)} empty={semicolon.session.empty} />
      </Block>

      <Block id="home-thread" kind="thread" label={semicolon.thread.label} to={path.threadIndex}>
        <ThreadList threads={threads.slice(0, HOME_THREADS)} empty={semicolon.thread.empty} />
      </Block>
    </>
  )
}
