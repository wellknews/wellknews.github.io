import { useEffect, useRef, useState } from 'react'
import type { MissingChildCase } from '../types/missingChild'
import { currentCase, verificationTime } from '../lib/caseAdapter'

// Values are measured against the single 1080 × 1920 composition.
// CSS scales this exact composition with container units, including its safe zones.
export const STORY_CANVAS = { width: 1080, height: 1920 } as const

// The stamp sits where a WELLKNEWS card puts its issue date, so it has to read as a
// date first. The single trailing word is what stops it from being read as one.
function missingStamp(value?: string): string {
  const parts = value?.split('-')
  return parts?.length === 3 ? parts.join('. ') + '. 실종' : '실종일 정보 없음'
}

export function EkataStoryCard({ record }: { record: MissingChildCase }) {
  const [failedPhoto, setFailedPhoto] = useState<string>()
  const [failedWordmark, setFailedWordmark] = useState(false)
  const [overflow, setOverflow] = useState(false)
  const canvas = useRef<HTMLElement>(null)
  useEffect(() => {
    const element = canvas.current
    if (!element) return
    let disposed = false
    const check = () => {
      if (disposed) return
      // The grid itself is measured too. Rows size to their own content now, so a
      // card that runs out of page spills the grid, not any single row.
      const rows = element.querySelectorAll<HTMLElement>('.story-content, .story-content > *')
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
  // The photograph gives up its room first, so type only steps down when even a
  // floor-sized picture would not leave the words enough page.
  const density = length > 240 ? ' story-card--compact' : length > 150 ? ' story-card--dense' : ''
  // The name is the headline, and a headline is sized to fit its own line, not to
  // whatever else the card happens to carry.
  const naming =
    item.name.length > 9
      ? ' story-card--name-xs'
      : item.name.length > 6
        ? ' story-card--name-s'
        : item.name.length > 4
          ? ' story-card--name-m'
          : ''
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
      className={'story-card' + density + naming}
      aria-label={
        sample ? '개발용 예시 Story · 실제 인물이 아닙니다' : item.name + ' 실종 정보 Story'
      }
      data-story-canvas="1080x1920"
    >
      {/* WELLKNEWS prints its cards on a faint paper grain. Reproduced here, not imported:
          the app's texture is a 2.3MB bitmap and this is a preview, not the export. */}
      <div className="story-grain" aria-hidden="true" />
      <div className="story-content">
        <header className="story-header">
          {/* Same label grammar as every WELLKNEWS card: a red rule, then English caps
              opened up with tracking. The desk is what changes, never the form. */}
          <span className="story-desk">MISSING</span>
          {/* The campaign's mark, diagonally opposite the desk rule — the two flags at
              either end of a shared masthead. The lit square is the only campaign green
              on the card and the only thing on it that is not printed. */}
          <span className="story-seal">
            EKATA
            <span className="seal-lamp" aria-hidden="true" />
          </span>
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
              {!sample && (
                <span className="photo-note">
                  사진을 불러올 수 없습니다 · 공식정보를 확인해 주세요
                </span>
              )}
            </>
          )}
          {sample && <span className="story-sample">개발용 예시 · 실제 인물이 아닙니다</span>}
        </div>
        {/* The name takes the headline slot a WELLKNEWS card gives its one sentence.
            On a missing-child card the name is that sentence. */}
        <div className="story-identity">
          <h3>{item.name}</h3>
          <p>
            실종 당시{' '}
            {item.ageAtMissing !== undefined ? item.ageAtMissing + '세' : '나이 정보 없음'} ·{' '}
            {item.sex || '성별 정보 없음'}
            {item.currentAge !== undefined && <span> / 현재 추정 {item.currentAge}세</span>}
          </p>
        </div>
        <div className="story-facts">
          <div>
            <span>발생지역</span>
            <p>{item.missingArea || '정보 없음'}</p>
          </div>
          <div>
            <span>신체특징 · 실종 당시</span>
            <p>{features}</p>
          </div>
          <div>
            <span>당시 착의</span>
            <p>{item.clothing || '정보 없음'}</p>
          </div>
        </div>
        <div className="story-report">
          <div className="story-call">
            <strong>182</strong>
            <span>
              실종아동 제보
              <br />
              <small>긴급상황 112</small>
            </span>
          </div>
          <p>공식정보 안내 → wellknews.github.io/ekata</p>
        </div>
        <footer className="story-signature">
          {/* The issue-date chip of a WELLKNEWS card, carrying the date this card is about. */}
          <span className="story-stamp">{missingStamp(item.missingDate)}</span>
          <div className="story-brand">
            {failedWordmark ? (
              <strong className="story-wordmark story-wordmark--text">WELLKNEWS</strong>
            ) : (
              <img
                className="story-wordmark"
                src="/wellknews-wordmark.png"
                alt="WELLKNEWS"
                onError={() => setFailedWordmark(true)}
              />
            )}
            {/* Identity is the mark at the top; the working relationship is stated here,
                where a co-publishing credit belongs. */}
            <small>
              An EKATA campaign
              <br />
              자료 출처: {item.sourceLabel}
              {!sample && (
                <>
                  <br />
                  공식정보 확인 {verificationTime(item.verifiedAt)}
                </>
              )}
            </small>
          </div>
        </footer>
      </div>
    </article>
  )
}
