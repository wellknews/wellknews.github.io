import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
 * 웹폰트
 *
 * 두 종류만 쓴다.
 *   Newsreader     — 라틴 세리프. 제목·본문·큰 ';'. 광학 사이즈 축(opsz)이
 *                    들어 있는 파일을 쓴다. 브라우저가 글자 크기에 맞춰
 *                    획 대비를 바꿔 주므로, 히어로의 큰 글자와 12px 각주가
 *                    각자에게 맞는 형태로 그려진다.
 *   Nanum Myeongjo — 국문 세리프. 유니코드 구간별로 잘려 있어 쓰인 글자에
 *                    해당하는 조각만 내려받는다.
 *   IBM Plex Mono  — 날짜·경로·메타데이터. 라틴과 숫자만 있으면 충분하다.
 */
import '@fontsource-variable/newsreader/standard.css'
import '@fontsource-variable/newsreader/standard-italic.css'
import '@fontsource/nanum-myeongjo/400.css'
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
