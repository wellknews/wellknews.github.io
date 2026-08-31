import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'

import {
  buildFacingPrompt,
  buildFacingRepairPrompt,
  FACING_AI_PROVIDERS,
  type FacingAiProvider,
  type FacingProviderId,
  type FacingSignal,
} from '../services/facingPrompt'
import {
  loadTodayFacingRecord,
  parseFacingAiResponse,
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

async function copyText(text: string): Promise<boolean> {
  if (!text) return false

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()

    const copied = document.execCommand('copy')
    textarea.remove()
    return copied
  }
}

async function readClipboardText(): Promise<string | null> {
  try {
    if (!navigator.clipboard?.readText) return null
    return await navigator.clipboard.readText()
  } catch {
    return null
  }
}

function providerById(id: FacingProviderId | null): FacingAiProvider | null {
  if (!id) return null
  return FACING_AI_PROVIDERS.find((provider) => provider.id === id) ?? null
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
      provider: record?.provider ?? null,
      savedAt: record?.savedAt ?? null,
    }
  })
  const [selected, setSelected] = useState<Set<string>>(() => new Set(boot.selected))
  const [aiNotice, setAiNotice] = useState(boot.result ? '오늘 기록을 불러왔어.' : '')
  const [aiResult, setAiResult] = useState<FacingAiResult | null>(boot.result)
  const [lastProvider, setLastProvider] = useState<FacingProviderId | null>(boot.provider)
  const [savedAt, setSavedAt] = useState<string | null>(boot.savedAt)
  const [importError, setImportError] = useState('')
  const [repairPrompt, setRepairPrompt] = useState('')
  const [manualResponse, setManualResponse] = useState('')
  const [showManualImport, setShowManualImport] = useState(false)
  const [showAllConcerns, setShowAllConcerns] = useState(() =>
    ROOTS.some((root) => !CORE_ROOT_IDS.has(root.id) && boot.selected.has(root.id)),
  )
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const beforeRects = useRef(new Map<string, DOMRect>())
  const resultRef = useRef<HTMLElement | null>(null)
  const responseRef = useRef<HTMLTextAreaElement | null>(null)

  const rootsForBoard = useMemo(
    () =>
      ROOTS.filter(
        (root) => showAllConcerns || CORE_ROOT_IDS.has(root.id) || selected.has(root.id),
      ),
    [selected, showAllConcerns],
  )
  const visible = useMemo(() => visibleNodes(rootsForBoard, selected), [rootsForBoard, selected])
  const signals = useMemo(() => collectFacingSignals(ROOTS, selected), [selected])
  const prompt = useMemo(() => buildFacingPrompt(signals), [signals])

  const captureLayout = () => {
    const snapshot = new Map<string, DOMRect>()

    buttons.current.forEach((button, id) => {
      if (button.isConnected) snapshot.set(id, button.getBoundingClientRect())
    })

    beforeRects.current = snapshot
  }

  const resetRoundTrip = () => {
    setAiNotice('')
    setAiResult(null)
    setImportError('')
    setRepairPrompt('')
    setManualResponse('')
    setShowManualImport(false)
    setLastProvider(null)
    setSavedAt(null)
  }

  const toggle = (node: FacingNode) => {
    captureLayout()
    resetRoundTrip()

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
    resetRoundTrip()
    setSelected(new Set<string>())
  }

  const copyPrompt = () => {
    void copyText(prompt).then((copied) => {
      setAiNotice(
        copied
          ? 'AI에 보낼 facing 프롬프트를 복사했어.'
          : '자동 복사에 실패했어. 아래 프롬프트를 직접 복사해.',
      )
    })
  }

  const openProvider = (provider: FacingAiProvider, promptToCopy = prompt) => {
    setLastProvider(provider.id)
    const opened = window.open(provider.url, '_blank', 'noopener,noreferrer')

    void copyText(promptToCopy).then((copied) => {
      const copyMessage = copied ? '프롬프트를 복사했어.' : '프롬프트 자동 복사에 실패했어.'
      const openMessage = opened
        ? `${provider.label}를 새 탭에서 열었어.`
        : `새 탭이 막혔어. ${provider.label}를 직접 열어 줘.`

      setAiNotice(`${copyMessage} ${openMessage}`)
    })
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

  const acceptAiResponse = (raw: string) => {
    const parsed = parseFacingAiResponse(raw)

    if (!parsed.ok) {
      setAiResult(null)
      setSavedAt(null)
      setImportError(parsed.reason)
      setRepairPrompt(buildFacingRepairPrompt(prompt, raw, parsed.reason))
      setAiNotice('답을 제대로 읽지 못했어. 같은 AI에 형식만 고쳐 달라고 할 수 있어.')
      return
    }

    const record = saveFacingRecord(signals, parsed.result, lastProvider)
    setAiResult(parsed.result)
    setImportError('')
    setRepairPrompt('')
    setManualResponse('')
    setShowManualImport(false)
    setSavedAt(record?.savedAt ?? null)
    setAiNotice(
      record ? '오늘의 note를 저장했어.' : '결과는 가져왔지만 이 브라우저에는 저장하지 못했어.',
    )
    moveToResult()
  }

  const importFromClipboard = () => {
    void readClipboardText().then((copied) => {
      if (copied === null) {
        setShowManualImport(true)
        setAiNotice('클립보드를 바로 읽을 수 없어서 붙여넣기 칸을 열었어.')
        return
      }
      acceptAiResponse(copied)
    })
  }

  const copyRepairPrompt = () => {
    void copyText(repairPrompt).then((copied) => {
      setAiNotice(
        copied
          ? '교정 요청을 복사했어. 같은 AI에 붙여넣으면 돼.'
          : '교정 요청 자동 복사에 실패했어. 아래 내용을 직접 복사해.',
      )
    })
  }

  const reopenForRepair = () => {
    const provider = providerById(lastProvider)
    if (!provider) {
      copyRepairPrompt()
      return
    }
    openProvider(provider, repairPrompt)
  }

  const askAgain = () => {
    setAiResult(null)
    setImportError('')
    setRepairPrompt('')
    setManualResponse('')
    setShowManualImport(false)
    setAiNotice('같은 선택으로 다시 물어볼 수 있어.')
  }

  /*
   * 붙여넣기 칸이 열리면 그 자리로 커서를 옮긴다.
   *
   * autoFocus 속성은 화면이 그려지는 것만으로 초점을 빼앗아 가므로 쓰지 않는다.
   * 이 칸은 «직접 붙여넣기»를 누르거나 클립보드를 읽지 못했을 때만 열리고,
   * 둘 다 사용자가 방금 한 조작이라 초점이 따라가는 편이 맞다.
   */
  useEffect(() => {
    if (showManualImport) responseRef.current?.focus()
  }, [showManualImport])

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
            facing
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
            <p className={styles.aiIntro}>고른 것만 묶었어. 아직 밖으로 나간 건 없어.</p>
          </div>

          <ul className={styles.signalList} aria-label="오늘 고른 상태">
            {signals.map((signal) => (
              <li key={signal.ids.join('/')} className={styles.signal}>
                {signal.labels.join(' · ')}
              </li>
            ))}
          </ul>

          <div className={styles.providerArea}>
            <p className={`label ${styles.providerLabel}`}>ASK WITH</p>
            <div className={styles.providerActions}>
              {FACING_AI_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  type="button"
                  className={`pressable ${styles.providerButton}`}
                  aria-label={`${provider.label}에서 물어보기 — 새 탭 열림`}
                  onClick={() => openProvider(provider)}
                >
                  <span>{provider.label}</span>
                  <span className={styles.externalMark} aria-hidden="true">
                    ↗
                  </span>
                </button>
              ))}
            </div>
            <p className={styles.providerHint}>누르면 요청을 복사하고 새 탭에서 열어.</p>
          </div>

          {!aiResult && (
            <div className={styles.returnFlow}>
              <p className={styles.returnHint}>답을 복사했으면 여기서 이어가.</p>
              <div className={styles.roundTripActions}>
                <button
                  type="button"
                  className={`pressable ${styles.importButton}`}
                  onClick={importFromClipboard}
                >
                  답변 가져오기
                </button>
                <button
                  type="button"
                  className={`pressable ${styles.manualButton}`}
                  onClick={() => setShowManualImport((current) => !current)}
                >
                  직접 붙여넣기
                </button>
              </div>
            </div>
          )}

          {showManualImport && !aiResult && (
            <div className={styles.manualImport}>
              <label htmlFor="facing-ai-response" className={styles.manualLabel}>
                복사한 답
              </label>
              <textarea
                id="facing-ai-response"
                ref={responseRef}
                className={styles.responseInput}
                value={manualResponse}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                  setManualResponse(event.target.value)
                }
                placeholder="여기에 그대로 붙여넣어."
                rows={6}
              />
              <button
                type="button"
                className={`pressable ${styles.applyResponse}`}
                disabled={!manualResponse.trim()}
                onClick={() => acceptAiResponse(manualResponse)}
              >
                이 답으로 보기
              </button>
            </div>
          )}

          {importError && !aiResult && (
            <div className={styles.importError} role="alert">
              <div>
                <p className={styles.errorTitle}>답을 제대로 읽지 못했어.</p>
                <p className={styles.errorReason}>
                  같은 내용으로 다시 만들 필요는 없어. AI한테 형식만 고쳐 달라고 하면 돼.
                </p>
              </div>
              <div className={styles.errorActions}>
                <button
                  type="button"
                  className={`pressable ${styles.repairButton}`}
                  onClick={reopenForRepair}
                >
                  {lastProvider ? '같은 AI에 고쳐달라 하기' : '고치는 요청 복사'}
                </button>
                {lastProvider && (
                  <button
                    type="button"
                    className={`pressable ${styles.repairCopy}`}
                    onClick={copyRepairPrompt}
                  >
                    요청만 복사
                  </button>
                )}
              </div>
              <details className={styles.repairDetails}>
                <summary>무슨 문제가 있었는지 보기</summary>
                <p className={styles.technicalReason}>{importError}</p>
              </details>
            </div>
          )}

          <details className={styles.utilityDetails}>
            <summary>직접 쓰기</summary>
            <div className={styles.utilityBody}>
              <button
                type="button"
                className={`pressable ${styles.copyPrompt}`}
                onClick={copyPrompt}
              >
                요청문 복사
              </button>
              <details className={styles.promptDetails}>
                <summary>요청 내용 보기</summary>
                <pre>{prompt}</pre>
              </details>
            </div>
          </details>

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

          <ResultList title="CARE" items={aiResult.care} emphasis="primary" />

          <div className={styles.resultNotes}>
            <ResultIngredients items={aiResult.ingredients} />
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

function ResultIngredients({ items }: { items: FacingAiResult['ingredients'] }) {
  if (items.length === 0) return null

  return (
    <section className={styles.resultSection}>
      <h4>INGREDIENTS</h4>
      <dl className={styles.ingredients}>
        {items.map((item) => (
          <div key={`${item.name}:${item.reason}`}>
            <dt>{item.name}</dt>
            <dd>{item.reason}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
