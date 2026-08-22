import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

/*
 * 웹폰트
 *
 * 두 벌이고, 역할이 다르다.
 *   Plus Jakarta Sans — 기사 제목과 라벨. 현대적인 grotesk이면서 종단이 약간
 *                       부드러워 레터링의 둥근 성격과 한 식구로 읽힌다.
 *                       라틴만 필요하므로 가변 굵기 한 파일이면 끝난다.
 *   Pretendard        — 본문. 한국어 장문 가독성이 이 글꼴을 고른 유일한 이유다.
 *                       Dynamic Subset이라 실제로 쓰인 글자 조각만 내려받는다.
 *
 * 로고는 서체가 아니라 그려 둔 레터링이다(components/Wordmark). 그래서 여기에
 * 디스플레이용 글꼴을 따로 두지 않는다.
 */
import '@fontsource-variable/plus-jakarta-sans/wght.css'
import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'

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
