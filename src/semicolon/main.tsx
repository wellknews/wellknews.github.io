import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
 * 웹폰트
 *
 * Serif — 읽는 것 전부. Noto Serif KR은 유니코드 구간별로 쪼개져 있어
 *         실제 화면에 쓰인 글자에 필요한 조각만 내려받는다.
 * Mono  — 날짜, 경로, 라벨. 라틴 문자와 숫자에만 쓰므로 latin 400 하나면 된다.
 */
import '@fontsource-variable/noto-serif-kr'
import '@fontsource/ibm-plex-mono/latin-400.css'

/*
 * 전역 스타일
 *
 * 순서 주의:
 * tokens → reset → base 순서로 불러와야 한다.
 * reset은 WELLKNEWS와 공유하지만, 색과 타이포그래피는 이 사이트의 것을 쓴다.
 */
import './styles/tokens.css'
import '../styles/reset.css'
import './styles/base.css'

import { App } from './App'
import { readRoute } from './route'

const container = document.getElementById('root')

if (!container) {
  throw new Error('마운트 지점(#root)을 찾지 못했습니다.')
}

const route = readRoute(container.dataset)

createRoot(container).render(
  <StrictMode>
    <App route={route} />
  </StrictMode>,
)
