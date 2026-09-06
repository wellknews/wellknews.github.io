import { useRef, useState } from 'react'
import type { MissingChildCase } from '../types/missingChild'
import { caseDate, verificationTime } from '../lib/caseAdapter'

export function CaseDetails({ record }: { record: MissingChildCase }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [photoFailed, setPhotoFailed] = useState(false)
  const fields = [
    [
      '실종 당시',
      (record.ageAtMissing !== undefined ? record.ageAtMissing + '세' : '나이 정보 없음') +
        ' · ' +
        (record.sex || '성별 정보 없음'),
    ],
    ...(record.currentAge !== undefined ? [['현재 추정 연령', record.currentAge + '세']] : []),
    ['실종일', caseDate(record.missingDate)],
    ['발생지역', record.missingArea],
    [
      '신체특징',
      [record.height, record.weight, record.physicalFeatures].filter(Boolean).join(' · '),
    ],
    ['당시 착의', record.clothing],
  ]
  return (
    <>
      <button className="text-link" type="button" onClick={() => dialog.current?.showModal()}>
        정보 자세히 보기 <span aria-hidden="true">＋</span>
      </button>
      <dialog ref={dialog} className="case-dialog" aria-labelledby="case-dialog-title">
        <div className="dialog-heading">
          <h2 id="case-dialog-title">{record.name}</h2>
          <button type="button" onClick={() => dialog.current?.close()}>
            닫기 <span aria-hidden="true">×</span>
          </button>
        </div>
        {record.status === 'sample' && (
          <p className="dialog-sample">개발용 예시 · 실제 인물이 아닙니다</p>
        )}
        {record.status === 'active' && record.photoUrl && !photoFailed && (
          <img
            className="dialog-photo"
            src={record.photoUrl}
            alt={record.name + ' 공식 공개 사진'}
            onError={() => setPhotoFailed(true)}
          />
        )}
        <dl className="case-fields">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || '정보 없음'}</dd>
            </div>
          ))}
        </dl>
        <p className="case-source">
          자료 출처: {record.sourceLabel}
          {record.status !== 'sample' && (
            <>
              <br />
              공식정보 확인 {verificationTime(record.verifiedAt)}
            </>
          )}
        </p>
      </dialog>
    </>
  )
}
