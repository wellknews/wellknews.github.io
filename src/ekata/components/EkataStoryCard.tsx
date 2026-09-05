import { useEffect, useRef, useState } from 'react'
import type { MissingChildCase } from '../types/missingChild'
import { caseDate, currentCase, verificationTime } from '../lib/caseAdapter'

// Values are measured against the single 1080 × 1920 composition.
// CSS scales this exact composition with container units, including its safe zones.
export const STORY_CANVAS = { width: 1080, height: 1920 } as const

export function EkataStoryCard({ record }: { record: MissingChildCase }) {
  const [failedPhoto, setFailedPhoto] = useState<string>()
  const [overflow, setOverflow] = useState(false)
  const canvas = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = canvas.current
    if (!element) return
    let disposed = false
    const check = () => {
      if (disposed) return
      const rows = element.querySelectorAll<HTMLElement>('.story-content > *')
      if (
        [...rows].some(
          (row) => row.scrollHeight > row.clientHeight + 1 || row.scrollWidth > row.clientWidth + 1,
        )
      ) {
        setOverflow(true)
      }
    }
    const observer = new ResizeObserver(check)
    observer.observe(element)
    void document.fonts.ready.then(check)
    return () => {
      disposed = true
      observer.disconnect()
    }
  }, [])
  const item = currentCase(record)
  if (item.status !== 'sample' && item.status !== 'active') return null
  const sample = item.status === 'sample'
  const features =
    [item.height, item.weight, item.physicalFeatures].filter(Boolean).join(' · ') || '정보 없음'
  const length = features.length + (item.clothing?.length ?? 0) + (item.missingArea?.length ?? 0)
  // No truncation, AI summary or hidden overflow. Very large records need editorial review.
  if (overflow || length > 430 || item.name.length > 16) {
    return (
      <div className="story-hold" aria-live="polite">
        {sample && <p>개발용 예시 · 실제 인물이 아닙니다</p>}한 장에 담을 수 있는 정보량을
        넘었습니다. 전체 정보를 확인해 주세요. Story 제작에는 운영자 검수가 필요합니다.
      </div>
    )
  }
  return (
    <article
      ref={canvas}
      className={'story-card' + (length > 180 ? ' story-card--dense' : '')}
      aria-label={
        sample ? '개발용 예시 Story · 실제 인물이 아닙니다' : item.name + ' 실종 정보 Story'
      }
      data-story-canvas="1080x1920"
    >
      <div className="story-content">
        <header className="story-header">
          <span>EKATA / WELLKNEWS</span>
          <strong>함께 찾습니다</strong>
        </header>
        <div className="story-photo">
          {!sample && item.photoUrl && failedPhoto !== item.photoUrl ? (
            <img
              src={item.photoUrl}
              alt={item.name + ' 공식 공개 사진'}
              onError={() => setFailedPhoto(item.photoUrl)}
            />
          ) : (
            <>
              <svg className="story-silhouette" viewBox="0 0 240 260" aria-hidden="true">
                <circle cx="120" cy="79" r="42" />
                <path d="M34 260v-42c0-49 38-83 86-83s86 34 86 83v42z" />
              </svg>
              <span className="photo-note">
                {sample ? '개발용 실루엣' : '사진을 불러올 수 없습니다 · 공식정보를 확인해 주세요'}
              </span>
            </>
          )}
          {sample && <span className="story-sample">개발용 예시 · 실제 인물이 아닙니다</span>}
        </div>
        <div className="story-identity">
          <h3>{item.name}</h3>
          <p>
            실종 당시{' '}
            {item.ageAtMissing !== undefined ? item.ageAtMissing + '세' : '나이 정보 없음'} ·{' '}
            {item.sex || '성별 정보 없음'}
            {item.currentAge !== undefined && <span> / 현재 추정 {item.currentAge}세</span>}
          </p>
          <p>
            {caseDate(item.missingDate)}
            {item.missingDate ? ' 실종' : ' · 실종일'}
          </p>
        </div>
        <div className="story-location">
          <span>발생지역</span>
          <p>{item.missingArea || '정보 없음'}</p>
        </div>
        <div className="story-traits">
          <div>
            <span>신체특징 · 실종 당시</span>
            <p>{features}</p>
          </div>
          <div>
            <span>당시 착의</span>
            <p>{item.clothing || '정보 없음'}</p>
          </div>
        </div>
        <footer className="story-contact">
          <div className="story-call">
            <strong>182</strong>
            <span>
              실종아동 제보
              <br />
              <small>긴급상황 112</small>
            </span>
          </div>
          <p>공식정보 안내 → wellknews.github.io/ekata</p>
          <small>자료 출처: {item.sourceLabel}</small>
          <small>
            {sample
              ? 'SAMPLE DATA · 공식정보 확인 대상 아님'
              : '공식정보 확인 ' + verificationTime(item.verifiedAt)}
          </small>
        </footer>
      </div>
    </article>
  )
}
