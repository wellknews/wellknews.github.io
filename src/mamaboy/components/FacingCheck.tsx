import { useLayoutEffect, useMemo, useRef, useState } from 'react'

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
        label: '좁쌀',
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
    id: 'pores',
    label: '모공',
    children: [
      { id: 'pores-nose', label: '코' },
      { id: 'pores-cheek', label: '볼' },
      { id: 'pores-sebum', label: '피지가 많음' },
      { id: 'pores-sagging', label: '늘어진 느낌' },
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

/**
 * 매일 아침 거울 앞에서 발견한 상태를 눌러 좁혀 가는 보드.
 *
 * 화면을 설문 단계로 교체하지 않는다. 선택한 버튼 바로 뒤에 하위 선택지가 끼어들고,
 * 원래 있던 버튼은 같은 흐름 안에서 옆이나 다음 줄로 밀려난다.
 */
export function FacingCheck() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set<string>())
  const buttons = useRef(new Map<string, HTMLButtonElement>())
  const beforeRects = useRef(new Map<string, DOMRect>())

  const visible = useMemo(() => visibleNodes(ROOTS, selected), [selected])

  const captureLayout = () => {
    const snapshot = new Map<string, DOMRect>()

    buttons.current.forEach((button, id) => {
      if (button.isConnected) snapshot.set(id, button.getBoundingClientRect())
    })

    beforeRects.current = snapshot
  }

  const toggle = (node: FacingNode) => {
    captureLayout()

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
    setSelected(new Set<string>())
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
              ref={(button) => {
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
                  {active ? '−' : '+'}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className={styles.status} aria-live="polite">
        <span>{selected.size > 0 ? `${selected.size}개 체크됨` : '거울에 보이는 것만 골라.'}</span>
        {selected.size > 0 && (
          <button type="button" className={`pressable ${styles.clear}`} onClick={clear}>
            다시 고르기
          </button>
        )}
      </div>
    </section>
  )
}
