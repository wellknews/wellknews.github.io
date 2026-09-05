import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url))

/**
 * GitHub Pages에서는 공용 404가 `/;/...`와 `/mamaboy/...`의 깊은 주소를 각자의
 * 문서로 되돌린다. Vite 개발 서버는 기본 fallback이 루트 index.html이라 같은
 * 주소에서 WELLKNEWS를 보여 주므로, 개발 중에만 해당 문서를 선택한다.
 * 주소창은 건드리지 않는다.
 */
function projectDevFallback(...prefixes: string[]): Plugin {
  return {
    name: 'project-dev-fallback',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const url = request.url

        if (!url) return next()

        const queryAt = url.indexOf('?')
        const rawPath = queryAt === -1 ? url : url.slice(0, queryAt)
        const search = queryAt === -1 ? '' : url.slice(queryAt)

        let pathname: string

        try {
          pathname = decodeURIComponent(rawPath)
        } catch {
          return next()
        }

        for (const prefix of prefixes) {
          const document = `${prefix}/index.html`

          if (pathname !== document && (pathname === prefix || pathname.startsWith(`${prefix}/`))) {
            request.url = `${document}${search}`
            break
          }
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [projectDevFallback('/;', '/mamaboy'), react()],
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
      /*
       * 프로젝트별 문서를 만든다.
       *
       *   /          WELLKNEWS — 입구
       *   /;         SEMICOLON — 입구에서 갈라져 나온 첫 번째 가지
       *   /mamaboy   MAMABOY   — 두 번째 가지
       *   /ekata     EKATA     — 실종아동 찾기 캠페인 지원
       *
       * 라우터로 한 앱 안에서 갈라놓지 않는 이유는 세 공간이 색·타이포·모션·폰트까지
       * 공유하는 것이 없기 때문이다. 문서를 나누면 방문자는 자기가 보는 쪽의 자산만
       * 내려받고, 한쪽의 디자인 토큰이 다른 쪽에 새어 들어갈 일도 없다.
       *
       * 출력 경로는 입력 경로를 그대로 따라간다 — `;/index.html` → `dist/;/index.html`.
       */
      input: {
        main: entry('index.html'),
        semicolon: entry('./;/index.html'),
        mamaboy: entry('./mamaboy/index.html'),
        ekata: entry('./ekata/index.html'),
        ekataPolicy: entry('./ekata/policy/index.html'),
      },
      output: {
        /*
         * 세 문서가 함께 쓰는 것은 react뿐이므로 그것만 공용 청크로 뺀다.
         *
         * motion·lenis도 이름 있는 청크로 떼어 봤지만, 그렇게 하면 react의 CJS
         * 래퍼가 그 청크에 묻어 들어가면서 모션을 전혀 쓰지 않는 /;까지
         * 150kB를 내려받게 된다. 지금은 두 라이브러리가 입구 엔트리 안에 남고,
         * /;와 /mamaboy는 자기 코드와 react만 받는다.
         */
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'react'
          }
          return undefined
        },
      },
    },
  },
})
