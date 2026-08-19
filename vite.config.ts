import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const entry = (path: string) => fileURLToPath(new URL(path, import.meta.url))

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
      /*
       * 문서를 두 개 만든다.
       *
       *   /    WELLKNEWS — 입구
       *   /;   SEMICOLON — 입구에서 갈라져 나온 첫 번째 가지
       *
       * 라우터로 한 앱 안에서 갈라놓지 않는 이유는 두 공간이 색·타이포·모션·폰트까지
       * 공유하는 것이 없기 때문이다. 문서를 나누면 방문자는 자기가 보는 쪽의 자산만
       * 내려받고, 한쪽의 디자인 토큰이 다른 쪽에 새어 들어갈 일도 없다.
       *
       * 출력 경로는 입력 경로를 그대로 따라간다 — `;/index.html` → `dist/;/index.html`.
       */
      input: {
        main: entry('index.html'),
        semicolon: entry('./;/index.html'),
      },
      output: {
        /*
         * 두 문서가 함께 쓰는 것은 react뿐이므로 그것만 공용 청크로 뺀다.
         *
         * motion·lenis도 이름 있는 청크로 떼어 봤지만, 그렇게 하면 react의 CJS
         * 래퍼가 그 청크에 묻어 들어가면서 모션을 전혀 쓰지 않는 /;까지
         * 150kB를 내려받게 된다. 지금은 두 라이브러리가 입구 엔트리 안에 남고,
         * /;는 자기 코드와 react만 받는다.
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
