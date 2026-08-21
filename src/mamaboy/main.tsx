import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
 * 웹폰트
 *
 * 두 벌이지만 한 목소리다.
 *   Schibsted Grotesk — 라틴. 기하학적 그로테스크이면서 종단이 약간 부드럽다.
 *                       로고의 둥근 리듬과 같은 가족으로 읽히되, 본문에서는
 *                       장난기를 반복하지 않는 정도의 거리를 둔다.
 *   Noto Sans KR      — 국문. 유니코드 구간별로 잘려 있어 실제로 쓰인 글자에
 *                       해당하는 조각만 내려받는다.
 *
 * 로고는 서체가 아니라 그려 둔 레터링이다(components/Wordmark). 그래서 여기에
 * 디스플레이용 글꼴을 따로 두지 않는다.
 */
import '@fontsource-variable/schibsted-grotesk/wght.css'
import '@fontsource-variable/noto-sans-kr/wght.css'

/*
 * 전역 스타일
 *
 * 순서 주의: tokens → reset → global.
 * reset은 색을 갖지 않아 다른 두 공간과 그대로 공유한다.
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
