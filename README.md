# WELLKNEWS

숏폼으로 소식을 전하는 뉴스 채널 WELLKNEWS의 공식 사이트이자, 여기서 갈라져 나온
개인 프로젝트들이 함께 사는 루트.

```
wellknews.github.io
│
├── /            WELLKNEWS   입구. 검정, 디지털, 빠름
│
└── /;           SEMICOLON   바쁜 삶 속에 삽입하는 여유. 백색, 에디토리얼, 느림
```

두 공간은 같은 브랜드의 테마 변형이 아니다. 디자인 토큰도 번들도 완전히 분리되어
있고, 입구인 WELLKNEWS는 끝까지 자기 언어를 쓴다. 문을 통과한 다음부터 각 프로젝트의
언어가 시작된다.

## 실행

```bash
npm install
npm run dev
```

| 스크립트          | 설명                                      |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | 개발 서버                                 |
| `npm run build`   | 배포용 빌드 (`dist/`)                     |
| `npm run preview` | 빌드 결과 미리보기                        |
| `npm run check`   | 포맷 · 린트 · 타입 검사 일괄 실행         |
| `npm run format`  | 코드 포맷 적용                            |
| `npm run assets`  | `public/logo.png`, `public/og.png` 재생성 |

## 구조

```
index.html            WELLKNEWS 진입점
;/                    SEMICOLON 진입점 (경로마다 실제 HTML 파일)
  index.html            /;
  session/index.html    /;/session
  session/*/index.html  /;/session/<slug>
  thread/index.html     /;/thread

src/
  content/site.ts     WELLKNEWS의 모든 카피와 링크
  styles/             tokens → reset → global 순으로 적용
  components/         컴포넌트 + 같은 이름의 CSS Module
  hooks/              스크롤·포인터 관련 동작
  semicolon/          Semicolon 전용. WELLKNEWS와 공유하는 것은 reset.css뿐이다.
    content/            카피와 글(Session·Thread)
    styles/             tokens → base
    components/
    route.ts            HTML의 data-route를 읽어 어느 화면을 그릴지 정한다
scripts/              이미지 자산 생성 (원본이 바뀔 때만 수동 실행)
assets/               로고 벡터 원본 (배포되지 않음)
```

문구를 고칠 일은 대부분 `src/content/site.ts`(WELLKNEWS) 또는
`src/semicolon/content/`(Semicolon) 안에서 끝난다.

라우터 라이브러리를 쓰지 않는다. 경로마다 HTML 파일이 실제로 존재하고
(`vite.config.ts`의 `input` 목록), 각 HTML이 `#root`에 `data-route`를 적어 둔다.
정적 호스팅에서 깊은 링크가 그대로 열리고, 페이지마다 title·설명·공유 카드를 따로 쓸
수 있기 때문이다.

## 디자인 규칙

이 사이트는 아래 규칙을 지키는 것을 전제로 만들어졌다. 요소를 추가하기 전에 확인할 것.

1. **같은 정보를 두 번 넣지 않는다.**
   브랜드명·슬로건·행동 유도 문구는 페이지 전체에서 각각 한 번만 등장한다.
   헤더 로고가 히어로를 지나야 나타나는 것도, 푸터에 워드마크가 저작권 표기 한 곳에만
   있는 것도 이 규칙 때문이다.

2. **새 정보를 담지 못하는 요소는 넣지 않는다.**
   채널 목록에 플랫폼 로고를 붙이지 않은 이유는 바로 옆에 이름이 적혀 있기 때문이다.

3. **모션의 이동 거리는 짧게 유지한다.**
   리빌은 10px대만 움직이고 나머지 인상은 불투명도와 타이밍이 만든다.
   거리를 키우면 곧바로 슬라이드쇼처럼 읽힌다.

4. **검은 색면이 화면을 장악하게 둔다.**
   장식을 더하는 대신 면을 뒤집는다. 채널 링크 호버가 그 예다.

5. **모든 모션은 `prefers-reduced-motion`을 존중한다.**
   토큰(`--dur-*`)이 일괄 0으로 떨어지고, 각 컴포넌트도 애니메이션 없는 경로를 갖는다.

## Semicolon (`/;`)

두 종류의 글만 있다. 길이로 나뉘지 않는다.

| SESSION                 | THREAD                                |
| ----------------------- | ------------------------------------- |
| 경험한 것을 분석한다    | 생각하고 있는 것을 이어간다           |
| 경계를 가진 하나의 경험 | 아직 끝나지 않은 생각                 |
| 낱개 페이지             | 한 화면에 흐름으로 쌓임 (앵커로 링크) |

### Session 추가

1. `src/semicolon/content/sessions.ts`의 `sessions` 배열 **맨 앞**에 항목을 추가한다.
   배열 순서가 곧 노출 순서다 — 날짜로 정렬하지 않으므로 날짜 없는 글도 놓을 수 있다.
2. `;/session/<slug>/index.html`을 만든다. `;/session/template/index.html`을 복사한 뒤
   `data-slug`, title, description, canonical, og:url만 고치면 된다.
3. `vite.config.ts`의 `input`에 그 HTML을 등록한다.

필수 항목은 사실상 `title` 하나다. `date`, `subtitle`, `meta`는 그 경험에 실제로 있는
정보일 때만 적는다. 없는 값을 만들지 않고, 비어 있으면 화면에 그 영역 자체가 그려지지 않는다.

본문은 네 가지 블록을 조합해 만든다 — `text`, `heading`, `quote`, `image`.
사진은 방문 인증이 아니라 근거이므로 `caption`에는 분위기가 아니라 그 장면이 무엇을
뒷받침하는지 적는다.

### Thread 추가

`src/semicolon/content/threads.ts`의 `threads` 배열 맨 앞에 추가한다. HTML은 만들지
않는다 — Thread는 `/;/thread` 한 화면에 쌓이고 `id`가 앵커가 된다. `id`는 한 번 정하면
바꾸지 않는다. 바꾸면 링크가 끊긴다.

### 초안

`draft: true`인 글은 개발 서버(`npm run dev`)에서만 목록에 오르고 배포본 목록에는
나오지 않는다. `sessions.ts`와 `threads.ts`에 들어 있는 `template` 항목이 그 예이며,
형식을 눈으로 확인하기 위한 것이므로 **첫 글을 쓸 때 지운다.**

### 디자인 원칙

이 공간의 미니멀리즘은 스타일이 아니라 의사결정 방식이다. 요소를 더하기 전에
«무엇을 추가할까»가 아니라 «이것이 반드시 존재해야 하는가»를 먼저 묻는다.

- 색은 사실상 흑백뿐이다. 색은 콘텐츠에 들어 있는 사진이 가져온다.
- Serif는 읽는 것 전부, Mono는 날짜·경로·라벨. 코드 에디터를 흉내 내지 않는다.
- 가짜 터미널, 콘솔 연출, STATUS·VERSION 표기 같은 개발자 장식을 넣지 않는다.
  개발자의 흔적은 장식이 아니라 구조(`/;`, `/;/session/...`, SESSION·THREAD)에서 나온다.
- 스크롤 모션은 짧은 페이드 하나뿐이고 본문에는 걸지 않는다. 여유를 표현하려고
  화면을 계속 움직이지 않는다.
- `001`, `002` 같은 고정 자릿수 번호를 붙이지 않는다. 순서에 의미가 없으면 번호도 없다.
- ABOUT·ARCHIVE·카테고리는 필요성이 생기기 전까지 만들지 않는다.

### 표식

`public/semicolon.svg`(파비콘)와 `public/semicolon-og.png`(공유 카드)는
`scripts/build-assets.mjs` 안의 도형 하나에서 생성된다. 글꼴에 기대지 않으려고
도형으로 그렸으므로 모양을 고칠 일이 생기면 `SEMICOLON_MARK` 상수만 고치고
`npm run assets`를 다시 돌린다.

## 접근성 기준

- 본문 색 대비는 검정 배경 기준 최소 6:1 (WCAG AA 4.5:1 상회)
- 최소 글자 크기 12px, 인터랙티브 요소 최소 높이 44px
- 헤드라인 글자 분할 애니메이션은 스크린리더에 원문을 한 번만 노출
- 키보드 포커스에도 호버와 동일한 상태를 표시

## 배포

`main` 브랜치에 push하면 GitHub Actions가 포맷·린트·타입 검사를 먼저 돌리고,
통과한 경우에만 빌드해서 GitHub Pages로 배포한다. 검사가 실패하면 배포되지 않는다.

## 남은 작업

- 제보 접수 창구: 현재 인스타그램 DM으로 연결된다. 전용 폼을 쓰려면
  `src/App.tsx`의 `REPORT_HREF` 값만 교체하면 된다.
- Semicolon 첫 글: `sessions.ts`와 `threads.ts`의 `template` 항목을 실제 글로 교체한다.
  그때까지 배포본의 SESSION·THREAD 목록은 비어 있는 상태로 보인다.
- 주소를 공유할 때는 `wellknews.github.io/;/` 처럼 끝에 슬래시를 붙인다. 메신저나
  일부 앱이 문장 끝의 `;`를 주소에서 잘라내는 경우가 있다.
