import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { ReactLenis, type LenisRef } from 'lenis/react'

import { About } from './components/About'
import { Channels } from './components/Channels'
import { Cursor } from './components/Cursor'
import { Elsewhere } from './components/Elsewhere'
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

    // 데스크톱처럼 정밀 포인터를 사용하는 환경에서만 Lenis를 활성화한다.
    const pointerFine = window.matchMedia('(pointer: fine)').matches

    // 접근성 설정에서 애니메이션 감소를 요청한 경우 Lenis를 사용하지 않는다.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // 스마트폰, 태블릿 및 터치 지원 하이브리드 기기에서는 네이티브 스크롤을 사용한다.
    const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window

    return pointerFine && !prefersReduced && !hasTouch
  })

  return enabled
}

type ScrollProviderProps = {
  enabled: boolean
  lenisRef: React.RefObject<LenisRef | null>
  children: ReactNode
}

/**
 * 데스크톱에서만 Lenis를 마운트한다.
 *
 * 모바일/터치 환경에서는 ReactLenis 자체를 렌더하지 않으므로
 * 브라우저의 네이티브 스크롤 동작에 개입하지 않는다.
 */
function ScrollProvider({ enabled, lenisRef, children }: ScrollProviderProps) {
  if (!enabled) return children

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        // 값이 작을수록 관성이 오래 지속된다.
        lerp: 0.08,

        // 마우스 휠 스크롤 속도를 약간 무겁게 조정한다.
        wheelMultiplier: 0.9,

        // 터치 입력에는 Lenis 관성을 적용하지 않는다.
        syncTouch: false,

        // 앵커 이동 시 고정 헤더 높이만큼 보정한다.
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

  /**
   * Preloader 애니메이션이 완전히 종료되면
   * 메인 콘텐츠와 데스크톱 Lenis 스크롤을 활성화한다.
   */
  const handleIntroFinish = useCallback(() => {
    setIntroDone(true)
  }, [])

  /**
   * 인트로가 실행되는 동안에는 데스크톱 Lenis도 정지시킨다.
   *
   * 모바일에서는 ScrollProvider가 Lenis를 마운트하지 않기 때문에
   * 이 로직은 사실상 데스크톱에만 적용된다.
   */
  useEffect(() => {
    const lenis = lenisRef.current?.lenis

    if (!lenis) return

    if (introDone) {
      lenis.start()
    } else {
      lenis.stop()
    }
  }, [introDone, smoothScroll])

  /**
   * 주소창에서 해시가 붙은 URL로 바로 들어오면 브라우저의 첫 앵커 탐색 시점에는
   * React 본문이 아직 없다. 인트로와 첫 렌더가 끝난 뒤 한 번만 위치를 복원한다.
   */
  useEffect(() => {
    if (!introDone || !window.location.hash) return

    let id: string

    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      // 외부에서 유입된 잘못된 퍼센트 인코딩은 앱 전체를 깨뜨리지 않고 무시한다.
      return
    }
    const target = document.getElementById(id)

    if (!target) return

    const frame = window.requestAnimationFrame(() => {
      const headerHeight =
        Number.parseFloat(
          window.getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
        ) || 0
      const offset = -(headerHeight + 24)
      const lenis = lenisRef.current?.lenis

      if (lenis) {
        lenis.scrollTo(target, { offset, immediate: true })
        return
      }

      const top = target.getBoundingClientRect().top + window.scrollY + offset
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [introDone])

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

        <Elsewhere />
      </main>

      <Footer />
    </ScrollProvider>
  )
}
