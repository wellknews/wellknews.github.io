# EKATA One Story — 첫 구현

작성: jippy · 2026-09-06

## 범위

P0·P1·P2 기본형이다. 첫 화면에 실종정보 Story를 배치하고, 캠페인 포스터는 ABOUT으로 이동했다.
현재 공급하는 다섯 건은 모두 가상 데이터이며 인물 사진은 사용하지 않는다.
실제 Safe182 API, 서버 프록시, PNG 내보내기, Instagram 게시·게시 이력은 아직 구현하지 않았다.
운영 원칙은 실제 문서 경로인 `/ekata/policy/`에 배치했다.

## 데이터 경계

`CaseProvider → caseAdapter → MissingChildCase → EkataStoryCard / CaseDetails`

- 공급자 선택은 `lib/caseProvider.ts` 한 곳에서 한다.
- 현재 `sampleCaseProvider`가 기본 예시 또는 ID에 해당하는 예시를 비동기로 공급한다.
- `caseAdapter`는 프런트엔드 정규화 계약 검증이다. 실제 Safe182 응답을 흉내 낸 필드 매핑이 아니다.
- 인증된 응답을 확보한 후 서버에 Safe182 전용 adapter를 구현하고 이 계약으로 내려보낸다.
- 서버는 `verifiedAt`, `expiresAt`을 제공해야 한다. 확인 시각이 없거나 미래이거나 유효시간이 끝난 active 데이터는 stale로 바꾸고 식별 정보를 제거한다.
- stale/unavailable에서는 사건 카드를 숨긴다. 발견·귀가 상태를 추론하지 않는다.
- API 키는 서버 환경변수에만 둔다. 기존 인증 probe는 그대로 유지한다.

## 동일한 Story 원본

`components/EkataStoryCard.tsx`와 `style.css`의 `story-*` 영역이 유일한 Story 디자인이다.
기존 브랜드 포스터는 `CampaignPoster`와 `campaign-poster`로 분리했다.

- 부모 `.story-frame`이 inline-size container다. 출력 시 부모 너비를 1080px로 지정하면 카드가 1080×1920이 된다.
- 안전영역 토큰은 `--story-safe-top`, `--story-safe-bottom`, `--story-horizontal-padding`이다.
- 길이에 따라 글자 크기만 조정하며 문장을 요약하거나 말줄임하지 않는다.
- 글자 수 상한과 실제 DOM 넘침 검사를 함께 사용한다. 초과하면 전체 웹 상세를 남기고 Story를 검수 대상으로 보류한다.
- 사진은 `object-fit: contain`이며 필터·크롭·기울기를 적용하지 않는다. 로딩 실패는 실루엣으로 대체한다.
- 실제 게시용 export는 사진 로딩, 폰트 로딩, 최신 상태, 보류 여부를 확인하고 사람이 검수한 뒤 진행해야 한다.
- 샘플은 공식 데이터로 오인하지 않도록 카드 안에 개발용 표시와 가상 자료 출처를 넣는다.

## 웹 행동

- 샘플별 주소는 `/ekata/?sample=sample-a` 형식이다. GitHub Pages에서 직접 열 수 있고 뒤로가기에도 선택이 복원된다.
- 공유는 Web Share → URL 복사 → 수동 복사 순이다. 공유창을 취소한 경우 자동으로 클립보드를 덮어쓰지 않는다.
- 공식정보는 안전Dream HTTPS 도메인만 허용한다. 샘플에는 실제 사건 상세주소를 꾸며 넣지 않는다.
- 182·112는 전화 링크다. 사이트는 제보 내용을 수집하지 않는다.
- reveal, 읽기 위치 표시, 링크 반응은 유지한다. 포인터 빛과 tilt는 ABOUT 포스터에만 적용한다.

## 검증

- `node --test scripts/ekata-check.test.mjs`: 샘플 계약, 상태 만료·식별정보 제거, URL 검증, 공유·취소·복사 실패 분기.
- `npm run check`, `npm run build`.
- 브라우저에서 320·360·390·430·768·1024·1440px × 5개 샘플의 9:16 비율, 가로 넘침, 행별 넘침, 샘플 표시 확인.
- 로컬 전용 검증 화면에서 이미지 실패와 수동 복사 UI, 키보드 포커스·주소 선택을 확인했다.
- reduced-motion 분기에서 포스터 포인터와 스크롤 업데이트가 설치되지 않는 것을 모의 설정으로 확인했다. CSS는 실제 운영체제 미디어 설정을 따른다.

## 후속 구현

P3에서는 서버 프록시·실제 응답 매핑·캐시·유효시간을 구현한다.
P5에서는 하루 한 사건 선정, 1080×1920 이미지 export, 사람 검수, 게시 이력과 공개 종료 정리를 연결한다.
현재 웹 구현만으로 Instagram 게시나 공개 종료 시 SNS 삭제가 자동으로 이루어지지는 않는다.
