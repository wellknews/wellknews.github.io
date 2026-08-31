import { useEffect, useMemo, useState } from 'react'

import {
  clearFacingMemory,
  deleteFacingRecord,
  FACING_MEMORY_UPDATED_EVENT,
  initializeFacingMemory,
  listFacingRecords,
  summarizeFacingMemory,
  type FacingRecord,
  type FacingSignalCount,
} from '../services/facingMemory'
import { downloadFacingMemoryWorkbook } from '../services/facingWorkbook'
import styles from './FacingMemory.module.css'

function trendLabel(item: FacingSignalCount): string {
  if (item.trend === 'new') return '이번 주 새로'
  const delta = item.current7 - item.previous7
  if (delta > 0) return `지난 7일보다 +${delta}`
  if (delta < 0) return `지난 7일보다 ${delta}`
  return '지난 7일과 같음'
}

function recordLabel(record: FacingRecord): string {
  return record.signals.map((signal) => signal.labels.join(' › ')).join(' · ')
}

export function FacingMemory() {
  const [records, setRecords] = useState<FacingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true

    const refresh = async () => {
      try {
        await initializeFacingMemory()
        const next = await listFacingRecords()
        if (active) setRecords(next)
      } catch {
        if (active) setNotice('이 브라우저에서 기록 저장소를 열지 못했어.')
      } finally {
        if (active) setLoading(false)
      }
    }

    const onChanged = () => void refresh()
    void refresh()
    window.addEventListener(FACING_MEMORY_UPDATED_EVENT, onChanged)
    return () => {
      active = false
      window.removeEventListener(FACING_MEMORY_UPDATED_EVENT, onChanged)
    }
  }, [])

  const summary = useMemo(() => summarizeFacingMemory(records), [records])

  const exportWorkbook = () => {
    try {
      const filename = downloadFacingMemoryWorkbook(records)
      setNotice(`${filename}로 내보냈어.`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Excel 파일을 만들지 못했어.')
    }
  }

  const removeRecord = async (record: FacingRecord) => {
    if (!window.confirm(`${record.date} 기록을 이 브라우저에서 지울까?`)) return
    await deleteFacingRecord(record.date)
    setNotice(`${record.date} 기록을 지웠어.`)
  }

  const clearAll = async () => {
    if (
      !window.confirm('Facing AI 기록을 이 브라우저에서 전부 지울까? 이 작업은 되돌릴 수 없어.')
    ) {
      return
    }
    await clearFacingMemory()
    setNotice('이 브라우저의 Facing AI 기록을 모두 지웠어.')
  }

  return (
    <section className={styles.memory} aria-labelledby="facing-memory-title">
      <header className={styles.header}>
        <div>
          <p className={`label ${styles.kicker}`}>DAILY FACE MEMORY</p>
          <h3 id="facing-memory-title" className={styles.title}>
            내 기록
          </h3>
        </div>
        <p className={styles.privacy}>이 브라우저 안에만 저장 · 서버 저장 없음</p>
      </header>

      {loading ? (
        <p className={styles.empty}>기록을 불러오는 중이야.</p>
      ) : records.length === 0 ? (
        <p className={styles.empty}>첫 Morning Note가 생기면 날짜별 기록이 여기 쌓여.</p>
      ) : (
        <>
          <div className={styles.snapshot}>
            <p className={styles.countLine}>
              <strong>{summary.totalDays}일</strong> 저장 · 최근 7일{' '}
              <strong>{summary.days7}일</strong> 체크
            </p>
            {summary.top30.length > 0 && (
              <ul className={styles.topSignals} aria-label="최근 30일 자주 고른 신호">
                {summary.top30.slice(0, 4).map((item) => (
                  <li key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.days30}회</strong>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={styles.actions}>
            <button type="button" className={`pressable ${styles.export}`} onClick={exportWorkbook}>
              Excel (.xlsx)
            </button>
            <button
              type="button"
              className={`pressable ${styles.historyToggle}`}
              aria-expanded={expanded}
              onClick={() => setExpanded((current) => !current)}
            >
              {expanded ? '기록 접기' : '기록 자세히'}
            </button>
          </div>

          {expanded && (
            <div className={styles.expanded}>
              <div className={styles.periods}>
                <MemoryPeriod
                  label="7 DAYS"
                  days={summary.days7}
                  items={summary.top7.slice(0, 4)}
                  showTrend
                />
                <MemoryPeriod
                  label="30 DAYS"
                  days={summary.days30}
                  items={summary.top30.slice(0, 5)}
                />
              </div>

              <div className={styles.history}>
                <p className={styles.historyIntro}>
                  화면에는 최근 30일 핵심만 보여줘. 전체 루틴과 성분 기록은 Excel에 모두 들어가.
                </p>
                {records.slice(0, 30).map((record) => (
                  <article key={record.date} className={styles.record}>
                    <div className={styles.recordTop}>
                      <time dateTime={record.date}>{record.date}</time>
                      <button
                        type="button"
                        className={`pressable ${styles.delete}`}
                        onClick={() => void removeRecord(record)}
                      >
                        삭제
                      </button>
                    </div>
                    <p className={styles.recordSignals}>{recordLabel(record)}</p>
                    <p className={styles.recordSummary}>{record.result.summary}</p>
                    {(record.result.ingredients.length > 0 ||
                      record.result.nutrients.length > 0) && (
                      <p className={styles.recordIngredients}>
                        {[...record.result.ingredients, ...record.result.nutrients]
                          .map((item) => item.name)
                          .join(' · ')}
                      </p>
                    )}
                  </article>
                ))}
                <button
                  type="button"
                  className={`pressable ${styles.clearAll}`}
                  onClick={() => void clearAll()}
                >
                  전체 기록 삭제
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <span className={styles.notice} aria-live="polite">
        {notice}
      </span>
    </section>
  )
}

function MemoryPeriod({
  label,
  days,
  items,
  showTrend = false,
}: {
  label: string
  days: number
  items: readonly FacingSignalCount[]
  showTrend?: boolean
}) {
  return (
    <section className={styles.period}>
      <div className={styles.periodHead}>
        <p className={`label ${styles.periodLabel}`}>{label}</p>
        <p className={styles.periodDays}>{days}일 기록</p>
      </div>
      {items.length === 0 ? (
        <p className={styles.periodEmpty}>아직 반복해서 고른 신호가 없어.</p>
      ) : (
        <ol className={styles.signalRanks}>
          {items.map((item) => (
            <li key={item.label}>
              <span className={styles.signalName}>{item.label}</span>
              <span className={styles.signalCount}>
                {showTrend ? `${item.current7}회 · ${trendLabel(item)}` : `${item.days30}회`}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
