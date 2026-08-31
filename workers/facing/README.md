# Facing AI Worker — free-only

Mamaboy **Facing AI**가 사이트 안에서 Morning Note를 만들기 위한 Cloudflare Worker다.

## 비용 원칙

- OpenAI / Gemini / Claude 유료 API를 호출하지 않는다.
- Cloudflare Workers AI의 Free allocation만 사용한다.
- 모델은 `@cf/meta/llama-3.1-8b-instruct-fast`로 코드에 고정되어 있다.
- 무료 일일 할당을 소진하면 요청을 실패시키며, 유료 모델/API로 fallback하지 않는다.
- Cloudflare 계정을 Workers Paid로 업그레이드하지 않는 것이 이 프로젝트의 운영 원칙이다.

## 배포

```bash
cd workers/facing
npx wrangler deploy
```

API key/secret은 필요 없다. `wrangler.jsonc`의 `ai.binding = "AI"`가 Workers AI를 연결한다.

배포 후 나온 Worker URL의 `/facing`을 프론트 빌드 환경변수로 지정한다.

```text
VITE_FACING_API_URL=https://mamaboy-facing-ai.<account>.workers.dev/facing
```

로컬 Vite 개발 서버는 기본 allowlist에 `http://localhost:5173`가 포함되어 있다.
