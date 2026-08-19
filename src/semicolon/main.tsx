import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
 * 웹폰트
 *
 * 두 벌만 쓴다.
 *   Hahmlet       — 국문과 라틴을 한 벌로 덮는 세리프. 획 대비가 낮고 종단이
 *                   평평해서, 명조이면서도 고정폭 코딩 글꼴에 가까운 골격을
 *                   갖는다. 이 공간이 노리는 자리가 정확히 그 사이다.
 *                   유니코드 구간별로 잘려 있어 쓰인 글자에 해당하는 조각만
 *                   내려받는다.
 *   IBM Plex Mono — 날짜·경로·메타데이터. 라틴과 숫자만 있으면 충분하다.
 */
import '@fontsource-variable/hahmlet/wght.css'
import '@fontsource/ibm-plex-mono/latin-400.css'

/*
 * 전역 스타일
 *
 * 순서 주의: tokens → reset → global.
 * reset은 색을 갖지 않아 입구(WELLKNEWS)와 그대로 공유한다.
 */
import './styles/tokens.css'
import '../styles/reset.css'
import './styles/global.css'

import App from './App'
import { restoreDeepLink } from './router'

const container = document.getElementById('root')

if (!container) {
  throw new Error('마운트 지점(#root)을 찾지 못했습니다.')
}

// 404.html이 넘겨준 원래 경로가 있으면 주소창을 먼저 되돌린다.
restoreDeepLink()

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
