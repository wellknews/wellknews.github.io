import type { MissingChildCase } from '../types/missingChild'
import { caseDate, caseShareUrl, officialCaseUrl, verificationTime } from '../lib/caseAdapter'
import { ShareButton } from './ShareButton'
import { Arrow } from './Publisher'

export function CaseDetails({ record }: { record: MissingChildCase }) {
  const sample = record.status === 'sample'
  const fields = [
    ['실종일', caseDate(record.missingDate)],
    ['발생지역', record.missingArea],
    [
      '신체특징',
      [record.height, record.weight, record.physicalFeatures].filter(Boolean).join(' · '),
    ],
    ['당시 착의', record.clothing],
  ]
  return (
    <div className="case-details">
      <div className="case-heading">
        <h2>{record.name}</h2>
        <p>
          실종 당시{' '}
          {record.ageAtMissing !== undefined ? record.ageAtMissing + '세' : '나이 정보 없음'} ·{' '}
          {record.sex || '성별 정보 없음'}
        </p>
        {record.currentAge !== undefined && <p>현재 추정 연령 {record.currentAge}세</p>}
      </div>
      <dl className="case-fields">
        {fields.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value || '정보 없음'}</dd>
          </div>
        ))}
      </dl>
      <div className="case-actions">
        <a
          className="primary-link"
          href={officialCaseUrl(record.officialUrl)}
          target="_blank"
          rel="noreferrer"
        >
          {sample ? '안전Dream 공식정보' : '공식정보 확인'}
          <Arrow />
          <span className="sr-only"> (새 창)</span>
        </a>
        <a className="text-link" href="tel:182">
          실종아동 제보 182 <Arrow />
        </a>
        <ShareButton
          key={record.id}
          url={caseShareUrl(record)}
          title={
            sample
              ? 'EKATA 개발용 예시 · 실제 인물이 아닙니다'
              : 'EKATA · ' + record.name + ' 실종 정보'
          }
        />
      </div>
      <p className="case-source">
        {sample
          ? '개발용 가상 데이터입니다. 실제 사건의 제보 대상이 아닙니다.'
          : '자료 출처: ' +
            record.sourceLabel +
            ' · 공식정보 확인 ' +
            verificationTime(record.verifiedAt)}
      </p>
    </div>
  )
}
