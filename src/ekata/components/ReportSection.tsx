import type { MissingChildCase } from '../types/missingChild'
import { Arrow } from './Publisher'
import { officialCaseUrl, caseShareUrl, verificationTime } from '../lib/caseAdapter'
import { CaseDetails } from './CaseDetails'
import { ShareButton } from './ShareButton'

export function ReportSection({ record }: { record: MissingChildCase }) {
  return (
    <aside className="case-actions" id="report" aria-label="제보와 정보 확인">
      <div className="report-main" data-reveal>
        <a className="telephone" href="tel:182" aria-label="실종아동 제보 182 전화 연결">
          <span className="phone-label">실종아동 제보</span>
          <span className="phone-number">
            182
            <Arrow />
          </span>
        </a>
        <p className="report-intro">
          기억나는 단서가 있다면
          <br />
          공식 창구로 전해주세요.
        </p>
        <a
          className="primary-link"
          href={officialCaseUrl(record.officialUrl)}
          target="_blank"
          rel="noreferrer"
        >
          안전Dream 공식정보 <Arrow />
          <span className="sr-only"> (새 창)</span>
        </a>
        <details className="report-help">
          <summary>제보 안내</summary>
          <p>
            목격한 시간과 장소, 기억나는 특징을 전해주세요. 긴급한 상황은 <a href="tel:112">112</a>
            로 신고해 주세요. 에카타는 제보를 대신 접수하지 않습니다.
          </p>
        </details>
      </div>
      <div className="case-utilities">
        <CaseDetails record={record} />
        <ShareButton
          url={caseShareUrl(record)}
          title={
            record.status === 'sample'
              ? 'EKATA 개발용 예시 · 실제 인물이 아닙니다'
              : 'EKATA · ' + record.name + ' 실종 정보'
          }
        />
      </div>
      <div className="case-provenance">
        <dl>
          <div>
            <dt>자료 출처</dt>
            <dd>{record.sourceLabel}</dd>
          </div>
          {record.status !== 'sample' && (
            <div>
              <dt>공식정보 확인</dt>
              <dd>{verificationTime(record.verifiedAt)}</dd>
            </div>
          )}
        </dl>
        <p>
          에카타는 제보를 대신 접수하지 않습니다. 공개된 정보를 한 번 더 전하고 공식 창구로
          안내합니다.
        </p>
        <a href="/ekata/policy/">
          운영 원칙 보기 <Arrow diagonal={false} />
        </a>
      </div>
    </aside>
  )
}
