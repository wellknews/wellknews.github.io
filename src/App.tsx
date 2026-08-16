import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'

import { About } from './components/About'
import { Channels } from './components/Channels'
import { Cursor } from './components/Cursor'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Preloader } from './components/Preloader'
import { Report } from './components/Report'

/**
 * 제보 접수 창구.
 *
 * 지금은 인스타그램 DM으로 바로 연결한다. 전용 폼(구글 폼, Formspree 등)이 생기면
 * 이 값만 바꾸면 된다. null로 두면 REPORT 섹션이 죽은 버튼 대신 '준비 중' 표기를
 * 렌더한다 — 눌러도 아무 일이 없는 링크는 뉴스 브랜드의 신뢰를 가장 크게 깎는다.
 */
const REPORT_HREF: string | null = 'https://ig.me/m/wellknews'

export default function App() {
  const lenisRef = useRef<LenisRef>(null)
  const [introDone, setIntroDone] = useState(false)

  const handleIntroFinish = useCallback(() => setIntroDone(true), [])

  // 인트로가 도는 동안에는 관성 스크롤도 멈춘다.
  // CSS overflow만으로는 Lenis가 계속 스크롤을 처리하기 때문이다.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    if (!lenis) return
    if (introDone) lenis.start()
    else lenis.stop()
  }, [introDone])

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        // 값이 작을수록 더 오래 미끄러진다. 브랜드 톤에 맞춰 무겁게 잡았다.
        lerp: 0.08,
        wheelMultiplier: 0.9,
        anchors: { offset: -96 },
      }}
    >
      <Preloader onFinish={handleIntroFinish} />
      <Cursor />

      <a className="skip-link" href="#main">
        본문으로 건너뛰기
      </a>

      <Header />

      <main id="main" tabIndex={-1}>
        <Hero ready={introDone} />
        <Report href={REPORT_HREF} />
        <Channels />
        <About />
      </main>

      <Footer />
    </ReactLenis>
  )
}
