import type { ReactNode } from 'react'

import { Hero } from '../components/Hero'
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
  label: string
  to: string
  definition: string
  children: ReactNode
}

/**
 * 개념 이름과 그 주소를 하나의 행으로 묶는다.
 *
 * 이름 쪽을 링크로 만들지 않는 이유는 같은 목적지로 가는 문을 한 줄에 두 개
 * 두지 않기 위해서다. 문은 경로가 적힌 오른쪽 끝 하나뿐이다.
 */
function Block({ id, label, to, definition, children }: BlockProps) {
  return (
    <section className={styles.block} aria-labelledby={id}>
      <div className="shell">
        <div className={styles.head}>
          <h2 className={`mono ${styles.label}`} id={id}>
            {label}
          </h2>

          <span className="rule" aria-hidden="true" />

          <Link to={to} className={`mono ${styles.more}`}>
            {to} <span aria-hidden="true">→</span>
          </Link>
        </div>

        <p className={styles.definition}>{definition}</p>

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
        label={semicolon.session.label}
        to={path.sessionIndex}
        definition={semicolon.session.definition}
      >
        <SessionList sessions={sessions.slice(0, HOME_SESSIONS)} empty={semicolon.session.empty} />
      </Block>

      <Block
        id="home-thread"
        label={semicolon.thread.label}
        to={path.threadIndex}
        definition={semicolon.thread.definition}
      >
        <ThreadList threads={threads.slice(0, HOME_THREADS)} empty={semicolon.thread.empty} />
      </Block>
    </>
  )
}
