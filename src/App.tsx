import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
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

/**
 * 관성 스크롤을 켤지 판단한다. 마운트 시점에 한 번만 정한다.
 *
 * 터치 기기에서는 켜지 않는다. 모바일 OS는 이미 손가락 속도와 감속이 정교하게 맞춰진
 * 관성 스크롤을 제공하는데, 그 위에 자바스크립트 관성을 한 겹 더 얹으면 손가락과 화면이
 * 어긋나면서 "스크롤이 말을 안 듣는" 느낌이 된다. 모바일은 네이티브 스크롤을 그대로 쓴다.
 */
function useSmoothScrollEnabled(): boolean {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false

    // Only enable smooth (Lenis) scrolling when the primary input is a fine pointer
    // and the device has no touch points. Some tablets/phones can report '(pointer: fine)'
    // while still supporting touch which causes poor touch/scroll behavior when Lenis
    // is active. Also respect prefers-reduced-motion.
    const pointerFine = window.matchMedia('(pointer: fine)').matches
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasTouch = (navigator && 'maxTouchPoints' in navigator && (navigator as any).maxTouchPoints > 0) || ('ontouchstart' in window)

    return pointerFine && !prefersReduced && !hasTouch
  })
  return enabled
}

type ScrollProviderProps = {
  enabled: boolean
  lenisRef: React.RefObject<LenisRef | null>
  children: ReactNode
}

/** 데스크톱에서만 Lenis를 마운트한다. 모바일에서는 아예 개입하지 않는다. */
function ScrollProvider({ enabled, lenisRef, children }: ScrollProviderProps) {
  if (!enabled) return children

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        // 값이 작을수록 더 오래 미끄러진다. 브랜드 톤에 맞춰 무겁게 잡았다.
        lerp: 0.08,
        wheelMultiplier: 0.9,
        // 터치 입력은 이 경로로 들어오지 않지만, 하이브리드 기기를 위해 명시해 둔다.
        syncTouch: false,
        anchors: { offset: -96 },
      }}
    >
      {children}
    </ReactLenis>
  )
}

export default function App() {
  const lenisRef = useRef<LenisRef>(null)
  const smoothScroll = useSmoothScrollEnabled()
  const [introDone, setIntroDone] = useState(false)

  const handleIntroFinish = useCallback(() => setIntroDone(true), [])

  // 인트로가 도는 동안에는 관성 스크롤도 멈춘다. CSS만으로는 Lenis가 계속 스크롤을 처리한다.
  // 모바일에는 Lenis가 없고, 스크롤 잠금은 Preloader가 직접 관리한다.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis
    if (!lenis) return
    if (introDone) lenis.start()
    else lenis.stop()
  }, [introDone, smoothScroll])

  return (
    <ScrollProvider enabled={smoothScroll} lenisRef={lenisRef}>
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
    </ScrollProvider>
  )
}
