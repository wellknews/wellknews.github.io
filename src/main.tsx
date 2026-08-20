import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
 * 웹폰트
 *
 * Pretendard Dynamic Subset은 실제 사용된 문자에 필요한
 * 폰트 조각만 내려받도록 구성되어 있다.
 */
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/ibm-plex-mono/400.css'

/* Lenis 기본 스타일 */
import 'lenis/dist/lenis.css'

/*
 * 전역 스타일
 *
 * 순서 주의:
 * tokens → reset → global 순서로 불러와야 한다.
 */
import './styles/tokens.css'
import './styles/reset.css'
import './styles/global.css'

import App from './App'

const container = document.getElementById('root')

if (!container) {
  throw new Error('마운트 지점(#root)을 찾지 못했습니다.')
}

/**
 * body에 남아 있을 수 있는 스크롤 잠금을 제거한다.
 *
 * Preloader가 비정상적으로 종료되거나 특정 모바일 브라우저에서
 * lifecycle이 예상과 다르게 동작했을 경우
 *
 * data-scroll-locked="true"
 *
 * 또는
 *
 * style="overflow: hidden"
 *
 * 상태가 남아 페이지 전체의 스크롤이 막힐 수 있다.
 */
function clearScrollLock() {
  if (document.body.dataset['scrollLocked']) {
    delete document.body.dataset['scrollLocked']
  }

  if (document.body.style.overflow === 'hidden') {
    document.body.style.overflow = ''
  }
}

/**
 * 앱 초기 실행 시 혹시 이전 상태가 남아 있으면 우선 제거한다.
 */
try {
  clearScrollLock()

  /**
   * 모바일에서 첫 터치가 들어왔는데 스크롤 잠금이 남아 있는 경우
   * 즉시 제거한다.
   *
   * 한 번 실행한 뒤 이벤트 리스너도 제거한다.
   */
  const unlockOnTouch = () => {
    clearScrollLock()

    window.removeEventListener('touchstart', unlockOnTouch)
  }

  window.addEventListener('touchstart', unlockOnTouch, {
    passive: true,
  })

  /**
   * 첫 진입 시에는 main.tsx 실행 이후 Preloader가
   * data-scroll-locked를 다시 설정할 수도 있다.
   *
   * 따라서 초기 몇 초 동안만 안전장치로 상태를 확인한다.
   */
  const guardInterval = window.setInterval(() => {
    try {
      const hasDatasetLock = Boolean(document.body.dataset['scrollLocked'])
      const hasOverflowLock = document.body.style.overflow === 'hidden'

      if (hasDatasetLock || hasOverflowLock) {
        clearScrollLock()
      }
    } catch {
      // 방어 코드이므로 오류가 발생해도 앱 실행은 계속한다.
    }
  }, 200)

  /**
   * 무한 polling이 되지 않도록 초기 로딩 구간이 지나면 종료한다.
   */
  window.setTimeout(() => {
    window.clearInterval(guardInterval)
  }, 3500)
} catch {
  // 스크롤 잠금 안전장치에서 오류가 발생해도 React 앱은 정상적으로 실행한다.
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
