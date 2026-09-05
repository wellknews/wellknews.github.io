import { useEffect, useState } from 'react'
import { useCampaignMotion } from './useCampaignMotion'
import { EkataHeader } from './components/EkataHeader'
import { EkataStoryCard } from './components/EkataStoryCard'
import { CaseDetails } from './components/CaseDetails'
import { ReportSection } from './components/ReportSection'
import { AboutEkata } from './components/AboutEkata'
import { EkataFooter } from './components/EkataFooter'
import { PolicyPage } from './components/PolicyPage'
import { sampleOptions } from './data/sampleCases'
import { caseProvider } from './lib/caseProvider'
import { currentCase, OFFICIAL_URL } from './lib/caseAdapter'
import type { MissingChildCase } from './types/missingChild'

export default function App() {
  const root = useCampaignMotion()
  const policy = window.location.pathname.startsWith('/ekata/policy')
  const [selected, setSelected] = useState(
    () => new URLSearchParams(location.search).get('sample') || '',
  )
  const [record, setRecord] = useState<MissingChildCase>()
  const [error, setError] = useState('')
  const [now, setNow] = useState(Date.now)
  useEffect(() => {
    if (policy) return
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
  }, [selected, policy])
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    const refresh = () => setNow(Date.now())
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearInterval(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  useEffect(() => {
    const sync = () => setSelected(new URLSearchParams(location.search).get('sample') || '')
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])
  const item = record ? currentCase(record, now) : undefined
  const show = item && (item.status === 'sample' || item.status === 'active')
  function select(id: string) {
    setSelected(id)
    const url = new URL(location.href)
    url.searchParams.set('sample', id)
    history.pushState(null, '', url)
  }
  return (
    <div ref={root} className="ekata-page">
      <div className="reading-line" aria-hidden="true" />
      <a className="skip-link" href="#main">
        본문으로 이동
      </a>
      <EkataHeader policy={policy} />
      <main id="main" className="page-width">
        {policy ? (
          <PolicyPage />
        ) : (
          <>
            <section className="featured-case" aria-labelledby="featured-title">
              <div className="featured-heading" data-reveal>
                <h1 id="featured-title">함께 찾습니다.</h1>
                <div className="sample-picker">
                  <label htmlFor="sample-select">개발용 예시 · 실제 인물이 아닙니다</label>
                  <select
                    id="sample-select"
                    value={selected || 'sample-a'}
                    onChange={(event) => select(event.target.value)}
                  >
                    {sampleOptions.map((option) => (
                      <option value={option.id} key={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {show ? (
                <div className="case-spread">
                  <div className="story-frame">
                    <EkataStoryCard key={item.id} record={item} />
                  </div>
                  <CaseDetails record={item} />
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
            <ReportSection />
            <AboutEkata />
          </>
        )}
      </main>
      <EkataFooter />
    </div>
  )
}
