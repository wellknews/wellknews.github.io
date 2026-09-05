import type { ReactNode } from 'react'

import { CodeList } from '../components/CodeList'
import { Hero } from '../components/Hero'
import { KindMark, type Kind } from '../components/KindMark'
import { Seam } from '../components/Seam'
import { SessionList } from '../components/SessionList'
import { ThreadList } from '../components/ThreadList'
import { codes } from '../content/code'
import { semicolon } from '../content/site'
import { sessions } from '../content/sessions'
import { threads } from '../content/threads'
import { useTouchReveal } from '../motion/useTouchReveal'
import { Link, path } from '../router'
import styles from './Home.module.css'

/**
 * 첫 화면에 걸어 둘 분량 — 세 자리 모두 가장 최근 한 편씩.
 *
 * 홈은 목록이 아니라 문이다. 여기에 여러 편을 펼치면 홈이 곧 목록이 되고,
 * 그러면 SESSION과 THREAD와 CODE라는 자리가 따로 있을 이유가 없어진다.
 *
 * 세션은 한동안 세 편까지 걸어 두고 있었는데, 기록이 두 편이 되자 홈에 전부
 * 나와 버려서 «/;/session에 가도 새로운 것이 없는» 상태가 됐다. 목록으로 가는
 * 문 옆에 그 목록을 통째로 펼쳐 두면 문이 문처럼 보이지 않는다.
 *
 * 그래서 셋에 같은 규칙을 쓴다. 홈에는 가장 최근 것 하나씩만 있고, 나머지는
 * 각자의 주소에 있다.
 */
const HOME_SESSIONS = 1
const HOME_THREADS = 1
const HOME_CODES = 1

type BlockProps = {
  id: string
  kind: Kind
  label: string
  to: string
  children: ReactNode
}

/**
 * 기호, 개념 이름, 그 주소를 하나의 행으로 묶는다.
 *
 * 무엇을 다루는 자리인지 설명하는 문장은 여기 두지 않는다. 세 기호가 한
 * 화면에 차례로 놓이고, 다가가면 하나는 벽에 부딪혀 멈추고 하나는 판을 넘어
 * 흘러 나가고 하나는 눈금 사이를 건너뛴다. 그 차이가 곧 정의다. 문장이 필요한
 * 사람은 주소를 눌러 그 개념의 페이지로 가면 된다.
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
          className={`kindGate ${styles.head}`}
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

/**
 * 세 자리, 두 개의 이음매.
 *
 * 순서는 SESSION · CODE · THREAD다. 끝이 있는 것 둘을 먼저 놓고, 끝나지 않은
 * 것을 마지막에 둔다. 그러면 이 페이지 자체가 세미콜론처럼 끝난다 —
 * 마지막 블록이 닫히지 않은 채로 아래로 이어진다.
 *
 * 실용적인 이유도 같은 쪽을 가리킨다. THREAD는 목록에서도 전문이 그대로
 * 보이므로(ThreadList) 블록 하나가 화면 여러 개만큼 길어질 수 있다. 그 뒤에
 * 무언가를 두면 그것은 사실상 없는 자리가 된다. 긴 것을 마지막에 두는 것은
 * 배치의 문제가 아니라 «있는가 없는가»의 문제다.
 *
 * 두 개의 세미콜론이 셋을 잇는다. 하나였을 때보다 이쪽이 이 공간의 이름에
 * 더 맞다 — 세미콜론은 끝내지 않고 잇는 기호이고, 이을 것이 많을수록 자주 온다.
 */
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

      <Block id="home-code" kind="code" label={semicolon.code.label} to={path.codeIndex}>
        <CodeList codes={codes.slice(0, HOME_CODES)} empty={semicolon.code.empty} />
      </Block>

      <div className="shell">
        <Seam />
      </div>

      <Block id="home-thread" kind="thread" label={semicolon.thread.label} to={path.threadIndex}>
        <ThreadList threads={threads.slice(0, HOME_THREADS)} empty={semicolon.thread.empty} />
      </Block>
    </>
  )
}
