import { Arrow } from './Publisher'
import { OFFICIAL_URL } from '../lib/caseAdapter'
export function ReportSection() {
  return (
    <section className="report-strip" id="report" aria-labelledby="report-title">
      <div className="report-heading" data-reveal>
        <h2 id="report-title">실종아동 제보</h2>
      </div>
      <div className="report-content" data-reveal>
        <p>
          목격한 시간과 장소, 기억나는 특징을
          <br className="desktop-break" /> 공식 창구로 직접 전해주세요.
        </p>
        <div className="report-links">
          <a className="telephone" href="tel:182" aria-label="실종아동 찾기 182 전화 연결">
            <span className="phone-label">실종아동 찾기</span>
            <span className="phone-number">
              182
              <Arrow diagonal />
            </span>
          </a>
          <div className="report-secondary">
            <a href={OFFICIAL_URL} target="_blank" rel="noreferrer">
              안전Dream 방문 <Arrow diagonal />
              <span className="sr-only"> (새 창)</span>
            </a>
            <p>
              긴급한 상황은{' '}
              <a href="tel:112" aria-label="긴급 신고 112 전화 연결">
                112
              </a>
            </p>
          </div>
        </div>
        <small>에카타는 제보를 대신 접수하지 않습니다.</small>
      </div>
    </section>
  )
}
