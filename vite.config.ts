import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
      output: {
        // 모션·스크롤 라이브러리를 분리해 두면 카피만 고쳐 배포할 때
        // 방문자 캐시에 남아 있는 청크를 그대로 재사용할 수 있다.
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
