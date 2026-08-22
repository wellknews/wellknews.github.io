import type { ReactNode } from 'react'

import { Hero } from '../components/Hero'
import { KindMark } from '../components/KindMark'
import { Seam } from '../components/Seam'
import { SessionList } from '../components/SessionList'
import { ThreadList } from '../components/ThreadList'
import { semicolon } from '../content/site'
import { sessions } from '../content/sessions'
import { threads } from '../content/threads'
import { useTouchReveal } from '../motion/useTouchReveal'
import { Link, path } from '../router'
import styles from './Home.module.css'

/**
 * 첫 화면에 걸어 둘 분량 — 양쪽 다 가장 최근 한 편씩.
 *
 * 홈은 목록이 아니라 문이다. 여기에 여러 편을 펼치면 홈이 곧 목록이 되고,
 * 그러면 SESSION과 THREAD라는 자리가 따로 있을 이유가 없어진다.
 *
 * 세션은 한동안 세 편까지 걸어 두고 있었는데, 기록이 두 편이 되자 홈에 전부
 * 나와 버려서 «/;/session에 가도 새로운 것이 없는» 상태가 됐다. 목록으로 가는
 * 문 옆에 그 목록을 통째로 펼쳐 두면 문이 문처럼 보이지 않는다.
 *
 * 그래서 양쪽에 같은 규칙을 쓴다. 홈에는 가장 최근 것 하나씩만 있고, 나머지는
 * 각자의 주소에 있다.
 */
const HOME_SESSIONS = 1
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
 * 무엇을 다루는 자리인지 설명하는 문장은 여기 두지 않는다. 두 기호가 한
 * 화면에 나란히 놓이고, 다가가면 한쪽 점은 벽에 부딪혀 멈추고 다른 쪽 점들은
 * 판을 넘어 흘러 나간다. 그 차이가 곧 정의다. 문장이 필요한 사람은 주소를
 * 눌러 그 개념의 페이지로 가면 된다.
 *
 * 이름 쪽을 링크로 만들지 않는 이유는 같은 목적지로 가는 문을 한 줄에 두 개
 * 두지 않기 위해서다. 문은 경로가 적힌 자리 하나뿐이다.
 */
function Block({ id, kind, label, to, children }: BlockProps) {
  const touch = useTouchReveal()

  return (
    <section className={styles.block} data-kind={kind} aria-labelledby={id}>
      <div className="shell">
        <div
          className={styles.head}
          data-touched={touch.active}
          onPointerDown={touch.onPointerDown}
        >
          <KindMark kind={kind} />

          <h2 className={`mono ${styles.label}`} id={id}>
            {label}
          </h2>

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

      {/* 한쪽이 끝나고 다른 쪽이 시작하는 자리. 마침표가 아니라 세미콜론이 온다. */}
      <div className="shell">
        <Seam />
      </div>

      <Block id="home-thread" kind="thread" label={semicolon.thread.label} to={path.threadIndex}>
        <ThreadList threads={threads.slice(0, HOME_THREADS)} empty={semicolon.thread.empty} />
      </Block>
    </>
  )
}
