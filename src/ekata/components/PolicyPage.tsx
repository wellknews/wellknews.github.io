import { OFFICIAL_URL } from '../lib/caseAdapter'

export function PolicyPage() {
  return (
    <article className="policy-page">
      <h1>정보 출처 및 운영 원칙</h1>
      <p className="policy-intro">
        EKATA는 WELLKNEWS의 실종아동 찾기 캠페인을 지원합니다. 공식 공개정보를 알아보고 기억할 수
        있도록 전달하며, 제보는 담당 기관으로 직접 연결합니다.
      </p>
      <section>
        <h2>현재 제공하는 정보</h2>
        <p>
          현재 화면은 개발용 예시입니다. 이름·날짜·지역·특징은 레이아웃 확인을 위한 가상 데이터이며
          실제 인물이나 사건이 아닙니다. 실루엣은 인물 사진을 대신하는 개발용 도형입니다. 예시의
          공유 주소에도 같은 표시가 유지됩니다.
        </p>
      </section>
      <section>
        <h2>자료 출처와 기관 관계</h2>
        <p>
          실제 서비스의 데이터 공급 대상으로 경찰청 안전Dream을 준비하고 있습니다. 현재 공식 API
          데이터는 연결하지 않았습니다. 자료 이용 범위와 기관 관계는 확정된 내용에 따라 이 페이지에
          표시하며, 현재 기관과의 제휴나 승인을 주장하지 않습니다.
        </p>
      </section>
      <section>
        <h2>표시할 정보</h2>
        <p>
          공식적으로 공개된 사진, 이름, 실종 당시 나이, 성별, 실종일, 발생지역, 신체특징과
          착의사항을 표시합니다. 자료 출처와 최근 공식정보 확인 시각을 함께 안내합니다. 공식 자료에
          없는 특징을 추론하거나 사건 설명을 창작하지 않습니다.
        </p>
      </section>
      <section>
        <h2>갱신과 공개 종료</h2>
        <p>
          실데이터 연동 시 서버가 정한 유효시간을 지난 정보나 더 이상 확인할 수 없는 정보는 사건
          카드로 노출하지 않고 공식 사이트로 안내합니다. API에서 항목이 사라졌다는 이유만으로
          발견·귀가를 선언하지 않습니다. 인증키와 운영 로그는 공개 웹페이지에 포함하지 않습니다.
        </p>
        <p>
          웹과 SNS의 게시물 정리, 게시 이력, 운영자 검수 절차는 실제 게시 운영에 앞서 준비할 후속
          범위입니다. 현재 자동 게시·자동 삭제 시스템이 가동 중인 것은 아닙니다.
        </p>
      </section>
      <section>
        <h2>사진과 Story 제작</h2>
        <p>
          공식 사진은 원래 비율을 유지합니다. 얼굴 생성·보정, 색 필터, 특징 변경, 인물 식별을
          방해하는 크롭을 적용하지 않습니다. 한 사건은 한 장의 Story에 담고, 담을 수 없는 분량은
          임의 요약하지 않고 운영자 검수 대상으로 남깁니다.
        </p>
      </section>
      <section>
        <h2>정정·삭제와 제보</h2>
        <p>
          공식 기록의 정정이나 실종아동 제보는 안전Dream 또는 182를 이용해 주세요. EKATA 게시물의
          표시 문제는 WELLKNEWS Instagram 프로필의 연락 수단으로 알려주실 수 있습니다. EKATA 웹은
          제보 내용이나 민감한 개인정보를 수집하지 않습니다. 긴급상황은 112로 신고해 주세요.
        </p>
        <div className="policy-links">
          <a href={OFFICIAL_URL} target="_blank" rel="noreferrer">
            안전Dream 공식정보 ↗<span className="sr-only"> (새 창)</span>
          </a>
          <a href="tel:182">182 전화 연결</a>
          <a href="tel:112">긴급상황 112</a>
          <a href="https://www.instagram.com/wellknews/" target="_blank" rel="noreferrer">
            WELLKNEWS Instagram ↗<span className="sr-only"> (새 창)</span>
          </a>
        </div>
      </section>
      <a className="primary-link" href="/ekata/">
        캠페인으로 돌아가기 →
      </a>
    </article>
  )
}
