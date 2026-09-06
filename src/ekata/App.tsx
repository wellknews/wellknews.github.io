import { useEffect, useState } from 'react'
import { useCampaignMotion } from './useCampaignMotion'
import { EkataHeader } from './components/EkataHeader'
import { EkataStoryCard } from './components/EkataStoryCard'
import { ReportSection } from './components/ReportSection'
import { EkataFooter } from './components/EkataFooter'
import { PolicyPage } from './components/PolicyPage'
import { WhyPage } from './components/WhyPage'
import { caseProvider } from './lib/caseProvider'
import { currentCase, OFFICIAL_URL } from './lib/caseAdapter'
import type { MissingChildCase } from './types/missingChild'

export default function App() {
  const root = useCampaignMotion()
  const pathname = window.location.pathname
  const page =
    pathname === '/ekata/why' || pathname.startsWith('/ekata/why/')
      ? 'why'
      : pathname === '/ekata/policy' || pathname.startsWith('/ekata/policy/')
        ? 'policy'
        : 'campaign'
  const [selected, setSelected] = useState(
    () => new URLSearchParams(location.search).get('sample') || '',
  )
  const [record, setRecord] = useState<MissingChildCase>()
  const [error, setError] = useState('')
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (page !== 'campaign') return
    let cancelled = false
    setRecord(undefined)
    setError('')
    const request = selected ? caseProvider.getCase(selected) : caseProvider.getFeaturedCase()
    void request
      .then((value) => {
        if (!cancelled) setRecord(value)
      })
      .catch(() => {
        if (!cancelled) setError('정보를 불러올 수 없습니다.')
      })
    return () => {
      cancelled = true
    }
  }, [selected, page])
  useEffect(() => {
    if (page !== 'campaign') return
    const expires = Date.parse(record?.expiresAt || '')
    const timer =
      Number.isFinite(expires) && expires > Date.now()
        ? window.setTimeout(
            () => setNow(Date.now()),
            Math.min(expires - Date.now() + 1, 2147483647),
          )
        : undefined
    const refresh = () => setNow(Date.now())
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [record, now, page])
  useEffect(() => {
    if (page !== 'campaign') return
    const sync = () => setSelected(new URLSearchParams(location.search).get('sample') || '')
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [page])
  const item = record ? currentCase(record, now) : undefined
  const show = item && (item.status === 'sample' || item.status === 'active')
  return (
    <div ref={root} className="ekata-page">
      <div className="reading-line" aria-hidden="true" />
      <a className="skip-link" href="#main">
        본문으로 이동
      </a>
      <EkataHeader page={page} />
      <main id="main" className="page-width">
        {page === 'policy' ? (
          <PolicyPage />
        ) : page === 'why' ? (
          <WhyPage />
        ) : (
          <section className="featured-case" aria-labelledby="featured-title">
            <div className="featured-heading" data-reveal>
              <p className="featured-kicker">
                안전Dream 공개정보
                {show && item.status === 'sample' && <em>개발용 예시</em>}
              </p>
              <h1 id="featured-title">실종아동을 찾습니다</h1>
            </div>
            {show ? (
              <div className="case-spread">
                <figure className="story-device" data-reveal>
                  <div className="story-shell">
                    {/* Decorative device chrome. It sits in the Story safe zones, never in the export. */}
                    <div className="story-chrome" aria-hidden="true">
                      <div className="chrome-progress">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="chrome-account">
                        <span className="chrome-avatar" />
                        <strong>wellknews</strong>
                        <small>지금</small>
                        <span className="chrome-more">···</span>
                      </div>
                      <div className="chrome-reply">메시지 보내기</div>
                    </div>
                    <div className="story-frame">
                      <EkataStoryCard key={item.id} record={item} />
                    </div>
                  </div>
                  <figcaption>
                    인스타그램 스토리로 게시되는 형태입니다. 실제 게시물이 아닙니다.
                  </figcaption>
                </figure>
                <ReportSection key={item.id} record={item} />
              </div>
            ) : (
              <div className="case-unavailable" aria-live="polite">
                <h2>
                  {error
                    ? '정보를 불러올 수 없습니다.'
                    : !item
                      ? '정보를 불러오고 있습니다.'
                      : item.status === 'stale'
                        ? '최신 정보를 확인하고 있습니다.'
                        : '현재 공개정보를 확인할 수 없습니다.'}
                </h2>
                <p>안전Dream에서 현재 공개된 실종아동 정보를 확인해 주세요.</p>
                <a className="primary-link" href={OFFICIAL_URL} target="_blank" rel="noreferrer">
                  안전Dream 공식정보 ↗<span className="sr-only"> (새 창)</span>
                </a>
              </div>
            )}
          </section>
        )}
      </main>
      <EkataFooter />
    </div>
  )
}
