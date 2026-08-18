import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * 페이지 진입점.
 *
 * wellknews.github.io는 하나의 사이트가 아니라 여러 프로젝트가 붙는 루트다.
 * 그래서 클라이언트 라우터를 두지 않고 경로마다 실제 HTML 파일을 만든다.
 *
 *   · 정적 호스팅에서 깊은 링크(/;/session/...)가 그대로 열린다
 *   · 프로젝트마다 번들과 디자인 토큰이 완전히 분리된다
 *     — WELLKNEWS의 검은 스타일이 Semicolon 페이지에 섞여 들어오지 않는다
 *   · 페이지마다 title·description·OG를 따로 쓸 수 있다
 *
 * Session을 하나 추가할 때는 콘텐츠(src/semicolon/content/sessions.ts)와
 * HTML 진입점을 함께 만들고 이 목록에 한 줄을 더한다.
 */
const input = {
  main: 'index.html',

  // Semicolon — /;
  semicolon: ';/index.html',
  'semicolon-session': ';/session/index.html',
  'semicolon-session-template': ';/session/template/index.html',
  'semicolon-thread': ';/thread/index.html',
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  css: {
    modules: {
      // 개발 중 DevTools에서 어느 컴포넌트의 클래스인지 바로 읽히도록 한다.
      generateScopedName: '[name]__[local]__[hash:base64:5]',
    },
  },
  build: {
    // 소스맵이 있어야 배포본에서 난 오류를 원본 위치로 되짚을 수 있다.
    sourcemap: true,
    rollupOptions: {
      input,
      output: {
        // 모션·스크롤 라이브러리를 분리해 두면 카피만 고쳐 배포할 때
        // 방문자 캐시에 남아 있는 청크를 그대로 재사용할 수 있다.
        // Semicolon은 두 라이브러리를 쓰지 않으므로 이 청크를 내려받지 않는다.
        manualChunks(id) {
          if (id.includes('node_modules/motion') || id.includes('node_modules/lenis')) {
            return 'motion'
          }
          return undefined
        },
      },
    },
  },
})
