import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { FacingApiError, requestFacingAnalysis } from '../services/facingApi'
import type { FacingSignal } from '../services/facingPrompt'
import {
  loadTodayFacingRecord,
  saveFacingRecord,
  type FacingAiResult,
} from '../services/facingResult'
import styles from './FacingCheck.module.css'

type FacingNode = {
  id: string
  label: string
  children?: readonly FacingNode[]
}

type VisibleNode = {
  node: FacingNode
  depth: number
}

const ROOTS: readonly FacingNode[] = [
  {
    id: 'acne',
    label: '여드름',
    children: [
      { id: 'acne-pustular', label: '화농성' },
      {
        id: 'acne-comedonal',
        label: '좁쌀·화이트헤드',
        children: [
          { id: 'acne-comedonal-forehead', label: '이마' },
          { id: 'acne-comedonal-cheek', label: '볼' },
          { id: 'acne-comedonal-chin', label: '턱' },
          { id: 'acne-comedonal-nose', label: '코 주변' },
        ],
      },
      { id: 'acne-red', label: '붉은 여드름' },
      { id: 'acne-marks', label: '자국이 신경 쓰임' },
    ],
  },
  {
    id: 'blackheads',
    label: '블랙헤드',
    children: [
      { id: 'blackheads-nose', label: '코' },
      { id: 'blackheads-chin', label: '턱' },
      { id: 'blackheads-forehead', label: '이마' },
      { id: 'blackheads-cheek', label: '볼' },
    ],
  },
  {
    id: 'pores',
    label: '모공',
    children: [
      { id: 'pores-nose', label: '코' },
      { id: 'pores-cheek', label: '볼' },
      { id: 'pores-visible', label: '유독 도드라짐' },
      { id: 'pores-sagging', label: '늘어진 느낌' },
    ],
  },
  {
    id: 'oiliness',
    label: '유분',
    children: [
      { id: 'oiliness-tzone', label: 'T존' },
      { id: 'oiliness-nose', label: '코 주변' },
      { id: 'oiliness-whole', label: '얼굴 전체' },
      { id: 'oiliness-fast', label: '세안 후 금방 번들거림' },
    ],
  },
  {
    id: 'redness',
    label: '홍조',
    children: [
      { id: 'redness-cheek', label: '볼' },
      { id: 'redness-nose', label: '코 주변' },
      { id: 'redness-whole', label: '얼굴 전체' },
      { id: 'redness-hot', label: '화끈거리거나 따가움' },
    ],
  },
  {
    id: 'texture',
    label: '피부결',
    children: [
      { id: 'texture-rough', label: '거칠어 보임' },
      { id: 'texture-bumpy', label: '오돌토돌함' },
      { id: 'texture-uneven', label: '고르지 않아 보임' },
      { id: 'texture-makeup', label: '메이크업이 들뜸' },
    ],
  },
  {
    id: 'pigmentation',
    label: '잡티·톤',
    children: [
      { id: 'pigmentation-acne-marks', label: '여드름 자국' },
      { id: 'pigmentation-brown-spots', label: '갈색 반점·잡티' },
      { id: 'pigmentation-dull', label: '전체적으로 칙칙함' },
      { id: 'pigmentation-uneven', label: '톤이 고르지 않음' },
    ],
  },
  {
    id: 'red-eyes',
    label: '충혈',
    children: [
      { id: 'red-eyes-both', label: '양쪽' },
      { id: 'red-eyes-one', label: '한쪽만' },
      { id: 'red-eyes-dry', label: '뻑뻑하고 건조함' },
      { id: 'red-eyes-itchy', label: '가려움' },
    ],
  },
  {
    id: 'fine-lines',
    label: '잔주름',
    children: [
      { id: 'fine-lines-eye', label: '눈가' },
      { id: 'fine-lines-forehead', label: '이마' },
      { id: 'fine-lines-mouth', label: '입가' },
      { id: 'fine-lines-neck', label: '목' },
    ],
  },
  {
    id: 'puffiness',
    label: '붓기',
    children: [
      { id: 'puffiness-eye', label: '눈 주변' },
      { id: 'puffiness-face', label: '얼굴 전체' },
      { id: 'puffiness-jaw', label: '턱선' },
      { id: 'puffiness-one-side', label: '한쪽이 더 부음' },
    ],
  },
  {
    id: 'dryness',
    label: '건조함',
    children: [
      { id: 'dryness-tight', label: '당김' },
      { id: 'dryness-flaky', label: '각질' },
      { id: 'dryness-mouth', label: '입가' },
      { id: 'dryness-eye', label: '눈가' },
    ],
  },
  {
    id: 'dark-circles',
    label: '다크서클',
    children: [
      { id: 'dark-circles-blue', label: '푸른빛' },
      { id: 'dark-circles-brown', label: '갈색빛' },
      { id: 'dark-circles-hollow', label: '꺼져 보임' },
      { id: 'dark-circles-puffy', label: '붓기도 있음' },
    ],
  },
  {
    id: 'shaving',
    label: '면도자극',
    children: [
      { id: 'shaving-sting', label: '따가움' },
      { id: 'shaving-red', label: '붉어짐' },
      { id: 'shaving-breakout', label: '트러블' },
      { id: 'shaving-ingrown', label: '인그로운 헤어' },
    ],
  },
  {
    id: 'hair-loss',
    label: '탈모',
    children: [
      { id: 'hair-loss-m', label: 'M자' },
      { id: 'hair-loss-crown', label: '정수리' },
      { id: 'hair-loss-part', label: '가르마가 넓어짐' },
      { id: 'hair-loss-sudden', label: '갑자기 많이 빠짐' },
    ],
  },
  {
    id: 'tired',
    label: '피곤해 보임',
    children: [
      { id: 'tired-sleep', label: '잠이 부족했음' },
      { id: 'tired-alcohol', label: '어제 술을 마심' },
      { id: 'tired-late-meal', label: '야식 먹음' },
      { id: 'tired-unknown', label: '이유를 모르겠음' },
    ],
  },
]

const CORE_ROOT_IDS = new Set([
  'acne',
  'blackheads',
  'pores',
  'oiliness',
  'redness',
  'dryness',
  'fine-lines',
  'dark-circles',
  'puffiness',
  'hair-loss',
])

function visibleNodes(
  nodes: readonly FacingNode[],
  selected: ReadonlySet<string>,
  depth = 0,
): VisibleNode[] {
  const visible: VisibleNode[] = []

  for (const node of nodes) {
    visible.push({ node, depth })

    if (node.children && selected.has(node.id)) {
      visible.push(...visibleNodes(node.children, selected, depth + 1))
    }
  }

  return visible
}

function removeBranch(node: FacingNode, selected: Set<string>) {
  selected.delete(node.id)
  node.children?.forEach((child) => removeBranch(child, selected))
}

function collectFacingSignals(
  nodes: readonly FacingNode[],
  selected: ReadonlySet<string>,
  parents: readonly FacingNode[] = [],
): FacingSignal[] {
  const signals: FacingSignal[] = []

  for (const node of nodes) {
    if (!selected.has(node.id)) continue

    const path = [...parents, node]
    const childSignals = node.children ? collectFacingSignals(node.children, selected, path) : []

    if (childSignals.length > 0) {
      signals.push(...childSignals)
    } else {
      signals.push({
        ids: path.map((item) => item.id),
        labels: path.map((item) => item.label),
      })
    }
  }

  return signals
}

/**
 * 매일 아침 거울 앞에서 발견한 상태를 눌러 좁혀 가는 보드.
 *
 * 화면을 설문 단계로 교체하지 않는다. 선택한 버튼 바로 뒤에 하위 선택지가 끼어들고,
 * 원래 있던 버튼은 같은 흐름 안에서 옆이나 다음 줄로 밀려난다.
 */
export function FacingCheck() {
  const [boot] = useState(() => {
    const record = loadTodayFacingRecord()
    return {
      selected: new Set<string>(record?.signals.flatMap((signal) => signal.ids) ?? []),
      result: record?.result ?? null,
      savedAt: record?.savedAt ?? null,
    }
  })
  const [selected, setSelected] = useState<Set<string>>(() => new Set(boot.selected))
  const [aiNotice, setAiNotice] = useState(boot.result ? '오늘 기록을 불러왔어.' : '')
  const [aiResult, setAiResult] = useState<FacingAiResult | null>(boot.result)
  const [savedAt, setSavedAt] = useState<string | null>(boot.savedAt)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState('')
  const [showAllConcerns, setShowAllConcerns] = useState(() =>
    ROOTS.some((root) => !CORE_ROOT_IDS.has(root.id) && boot.selected.has(root.id)),
  )
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const beforeRects = useRef(new Map<string, DOMRect>())
  const resultRef = useRef<HTMLElement | null>(null)

  const rootsForBoard = useMemo(
    () =>
      ROOTS.filter(
        (root) => showAllConcerns || CORE_ROOT_IDS.has(root.id) || selected.has(root.id),
      ),
    [selected, showAllConcerns],
  )
  const visible = useMemo(() => visibleNodes(rootsForBoard, selected), [rootsForBoard, selected])
  const signals = useMemo(() => collectFacingSignals(ROOTS, selected), [selected])

  const captureLayout = () => {
    const snapshot = new Map<string, DOMRect>()

    buttons.current.forEach((button, id) => {
      if (button.isConnected) snapshot.set(id, button.getBoundingClientRect())
    })

    beforeRects.current = snapshot
  }

  const resetAnalysis = () => {
    setAiNotice('')
    setAiResult(null)
    setAiError('')
    setAiBusy(false)
    setSavedAt(null)
  }

  const toggle = (node: FacingNode) => {
    captureLayout()
    resetAnalysis()

    setSelected((current) => {
      const next = new Set(current)

      if (next.has(node.id)) removeBranch(node, next)
      else next.add(node.id)

      return next
    })
  }

  const clear = () => {
    if (selected.size === 0) return
    captureLayout()
    resetAnalysis()
    setSelected(new Set<string>())
  }

  const moveToResult = () => {
    window.requestAnimationFrame(() => {
      const result = resultRef.current
      if (!result) return
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      result.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
      result.focus({ preventScroll: true })
    })
  }

  const askFacing = async () => {
    if (aiBusy || signals.length === 0) return

    setAiBusy(true)
    setAiError('')
    setAiNotice('Facing AI가 오늘 고른 신호만 보고 있어.')

    try {
      const response = await requestFacingAnalysis(signals)
      const record = saveFacingRecord(signals, response.result, response.provider)

      setAiResult(response.result)
      setSavedAt(record?.savedAt ?? null)
      setAiNotice(
        record ? '오늘의 note를 저장했어.' : '결과는 만들었지만 이 브라우저에는 저장하지 못했어.',
      )
      moveToResult()
    } catch (error) {
      const message =
        error instanceof FacingApiError ? error.message : '지금은 Facing AI에 연결하지 못했어.'
      setAiError(message)
      setAiNotice('')
    } finally {
      setAiBusy(false)
    }
  }

  const askAgain = () => {
    setAiResult(null)
    setAiError('')
    setAiNotice('같은 선택으로 다시 볼 수 있어.')
  }

  useLayoutEffect(() => {
    if (beforeRects.current.size === 0) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!reduceMotion) {
      const motion = getComputedStyle(document.documentElement)
      const duration = Number.parseFloat(motion.getPropertyValue('--dur-micro-slow'))
      const easing = motion.getPropertyValue('--ease-soft').trim()

      for (const { node } of visible) {
        const button = buttons.current.get(node.id)
        const before = beforeRects.current.get(node.id)

        if (!button || !before) continue

        const after = button.getBoundingClientRect()
        const dx = before.left - after.left
        const dy = before.top - after.top

        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue

        button.getAnimations().forEach((animation) => animation.cancel())
        button.animate(
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
          { duration, easing },
        )
      }
    }

    beforeRects.current.clear()
  }, [visible])

  return (
    <section className={`shell ${styles.facing}`} aria-labelledby="facing-title">
      <div className={styles.heading}>
        <div>
          <p className={`label ${styles.kicker}`}>MORNING CHECK</p>
          <h2 id="facing-title" className={styles.title}>
            Facing AI
          </h2>
        </div>
        <p className={styles.question}>오늘 아침, 거울에서 뭐가 걸렸어?</p>
      </div>

      <div className={styles.board}>
        {visible.map(({ node, depth }) => {
          const active = selected.has(node.id)
          const expandable = Boolean(node.children?.length)

          return (
            <button
              key={node.id}
              ref={(button: HTMLButtonElement | null) => {
                if (button) buttons.current.set(node.id, button)
                else buttons.current.delete(node.id)
              }}
              type="button"
              className={`pressable ${styles.chip} ${active ? styles.active : ''}`}
              data-depth={depth}
              aria-pressed={active}
              aria-expanded={expandable ? active : undefined}
              onClick={() => toggle(node)}
            >
              <span>{node.label}</span>
              {expandable && (
                <span className={styles.mark} aria-hidden="true">
                  {active ? '−' : '›'}
                </span>
              )}
            </button>
          )
        })}

        <button
          type="button"
          className={`pressable ${styles.moreConcerns}`}
          aria-expanded={showAllConcerns}
          onClick={() => {
            captureLayout()
            setShowAllConcerns((current) => !current)
          }}
        >
          {showAllConcerns ? '덜 보기' : '다른 게 걸렸어'}
        </button>
      </div>

      <div className={styles.status} aria-live="polite">
        <span>
          {signals.length > 0 ? `오늘 ${signals.length}가지가 걸렸어.` : '거울에 보이는 것만 골라.'}
        </span>
        {selected.size > 0 && (
          <button type="button" className={`pressable ${styles.clear}`} onClick={clear}>
            처음부터
          </button>
        )}
      </div>

      {signals.length > 0 && !aiResult && (
        <section className={styles.aiPanel} aria-labelledby="facing-ai-title">
          <div className={styles.aiHeading}>
            <div>
              <p className={`label ${styles.aiKicker}`}>TODAY</p>
              <h3 id="facing-ai-title" className={styles.aiTitle}>
                거울에서 본 것
              </h3>
            </div>
            <p className={styles.aiIntro}>
              고른 것만 Facing AI가 읽고, 답도 이 페이지 안에서 받아.
            </p>
          </div>

          <ul className={styles.signalList} aria-label="오늘 고른 상태">
            {signals.map((signal) => (
              <li key={signal.ids.join('/')} className={styles.signal}>
                {signal.labels.join(' · ')}
              </li>
            ))}
          </ul>

          <div className={styles.nativeFlow}>
            <div>
              <p className={`label ${styles.nativeLabel}`}>FACING AI</p>
              <p className={styles.nativeHint}>
                선택한 관찰만 보내. 다른 사이트로 이동하거나 텍스트를 복사할 필요 없어.
              </p>
            </div>
            <button
              type="button"
              className={`pressable ${styles.nativeButton}`}
              disabled={aiBusy}
              aria-busy={aiBusy}
              onClick={() => void askFacing()}
            >
              {aiBusy ? '보고 있어…' : '같이 볼게'}
            </button>
          </div>

          {aiBusy && (
            <output className={styles.thinking} aria-live="polite">
              <span className={styles.thinkingDot} aria-hidden="true" />
              <span>Facing AI가 오늘 고른 신호만 정리하고 있어.</span>
            </output>
          )}

          {aiError && !aiBusy && (
            <div className={styles.aiError} role="alert">
              <div>
                <p className={styles.errorTitle}>지금은 연결이 매끄럽지 않아.</p>
                <p className={styles.errorReason}>{aiError}</p>
              </div>
              <button
                type="button"
                className={`pressable ${styles.retryButton}`}
                onClick={() => void askFacing()}
              >
                다시 보기
              </button>
            </div>
          )}

          <span className={styles.aiNotice} aria-live="polite">
            {aiNotice}
          </span>
        </section>
      )}

      {aiResult && (
        <section
          ref={resultRef}
          tabIndex={-1}
          className={styles.resultPanel}
          aria-labelledby="facing-result-title"
        >
          <header className={styles.resultHeader}>
            <div>
              <p className={`label ${styles.resultKicker}`}>MORNING NOTE</p>
              <h3 id="facing-result-title" className={styles.resultTitle}>
                오늘은 이렇게 가자
              </h3>
            </div>
            <div className={styles.resultHeaderActions}>
              <p className={styles.recordState}>{savedAt ? '오늘 기록됨' : '이번 화면에서만'}</p>
              <button type="button" className={`pressable ${styles.reask}`} onClick={askAgain}>
                다시 물어보기
              </button>
            </div>
          </header>

          <p className={styles.summary}>{aiResult.summary}</p>

          <ResultSkincareIngredients items={aiResult.ingredients} />

          <ResultList title="TODAY ROUTINE" items={aiResult.care} emphasis="primary" />

          <ResultNutrients items={aiResult.nutrients} />

          <div className={styles.resultNotes}>
            <ResultList title="LIFESTYLE" items={aiResult.lifestyle} />
            <ResultList title="AVOID" items={aiResult.avoid} />
            <ResultList title="WATCH" items={aiResult.watch} />
          </div>

          {aiResult.getHelp && <ResultList title="GET HELP" items={[aiResult.getHelp]} urgent />}
        </section>
      )}
    </section>
  )
}

function ResultList({
  title,
  items,
  urgent = false,
  emphasis = 'secondary',
}: {
  title: string
  items: readonly string[]
  urgent?: boolean
  emphasis?: 'primary' | 'secondary'
}) {
  if (items.length === 0) return null

  return (
    <section
      className={`${styles.resultSection} ${emphasis === 'primary' ? styles.resultPrimary : ''} ${urgent ? styles.urgent : ''}`}
    >
      <h4>{title}</h4>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

function ResultSkincareIngredients({ items }: { items: FacingAiResult['ingredients'] }) {
  if (items.length === 0) return null

  return (
    <section className={`${styles.resultSection} ${styles.shoppingSection}`}>
      <div className={styles.sectionHeading}>
        <h4>SKINCARE INGREDIENTS</h4>
        <p className={styles.sectionHint}>제품명 말고, 마스크팩·세럼·크림 성분표에서 찾아봐.</p>
      </div>
      <dl className={styles.adviceList}>
        {items.map((item) => (
          <div key={`${item.name}:${item.target}`} className={styles.adviceItem}>
            <dt className={styles.adviceName}>
              <span>{item.name}</span>
              <span className={styles.adviceTarget}>{item.target}</span>
            </dt>
            <dd className={styles.adviceBody}>
              <p className={styles.adviceEasy}>{item.easy}</p>
              <p className={styles.adviceMeta}>
                <strong>어디서</strong>
                <span>{item.lookFor}</span>
              </p>
              <p className={styles.adviceMeta}>
                <strong>주의</strong>
                <span>{item.caution}</span>
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function ResultNutrients({ items }: { items: FacingAiResult['nutrients'] }) {
  if (items.length === 0) return null

  return (
    <section className={`${styles.resultSection} ${styles.nutrientSection}`}>
      <div className={styles.sectionHeading}>
        <h4>NUTRIENTS TO CHECK</h4>
        <p className={styles.sectionHint}>
          영양제 제품명이 아니라, 필요할 때 확인해볼 영양 성분이야.
        </p>
      </div>
      <dl className={styles.adviceList}>
        {items.map((item) => (
          <div key={`${item.name}:${item.why}`} className={styles.adviceItem}>
            <dt className={styles.adviceName}>
              <span>{item.name}</span>
            </dt>
            <dd className={styles.adviceBody}>
              <p className={styles.adviceEasy}>{item.easy}</p>
              <p className={styles.adviceMeta}>
                <strong>왜</strong>
                <span>{item.why}</span>
              </p>
              <p className={styles.adviceMeta}>
                <strong>확인</strong>
                <span>{item.guidance}</span>
              </p>
              <p className={styles.adviceMeta}>
                <strong>주의</strong>
                <span>{item.caution}</span>
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
