import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/* 웹폰트 — 유니코드 범위별로 쪼개져 있어 실제로 쓰인 글자가 든 조각만 내려받는다. */
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@fontsource/instrument-serif/400.css'

import 'lenis/dist/lenis.css'

/* 순서 주의 — 토큰이 먼저 정의돼야 리셋과 전역 스타일이 참조할 수 있다. */
import './styles/tokens.css'
import './styles/reset.css'
import './styles/global.css'

import App from './App'

const container = document.getElementById('root')

if (!container) {
  throw new Error('마운트 지점(#root)을 찾지 못했습니다.')
}

// Safety: remove any leftover scroll lock that could prevent mobile scrolling.
// Some environments or interrupted preloader logic may leave `data-scroll-locked` set
// or `body.style.overflow = 'hidden'`. Remove them proactively so touch scrolling works.
if (typeof document !== 'undefined') {
  try {
    if (document.body.dataset && document.body.dataset['scrollLocked']) {
      delete document.body.dataset['scrollLocked']
    }

    if (document.body.style && document.body.style.overflow === 'hidden') {
      document.body.style.overflow = ''
    }

    const unlockOnTouch = () => {
      if (document.body.dataset && document.body.dataset['scrollLocked']) {
        delete document.body.dataset['scrollLocked']
      }
      if (document.body.style && document.body.style.overflow === 'hidden') {
        document.body.style.overflow = ''
      }
      window.removeEventListener('touchstart', unlockOnTouch, { passive: true })
    }

    window.addEventListener('touchstart', unlockOnTouch, { passive: true })
  } catch (err) {
    // swallow any errors — this is a defensive fix only
  }
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
