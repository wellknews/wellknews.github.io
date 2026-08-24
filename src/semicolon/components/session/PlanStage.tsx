import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

import { Scene } from './Scene'
import styles from './PlanStage.module.css'

/**
 * 한 자리에 대해 그날 남은 사실.
 *
 * 좋았는지 나빴는지가 아니라 그 자리에 실제로 무슨 일이 있었는지만 적는다.
 * 문이 닫혀 있던 것과 내가 안 들어간 것과 앞까지 갔다가 돌아선 것은 전부
 * «못 갔다»로 뭉뚱그릴 수 있지만, 뭉뚱그리는 순간 그날의 형태가 사라진다.
 *
 *   planned      아직 아무 일도 일어나지 않은 상태. 아침의 모든 줄이 여기다.
 *   visited      들어갔다.
 *   closed       문이 닫혀 있었다. 내 선택이 아니다.
 *   passed       열려 있었는데 지나쳤다.
 *   skipped      가려던 곳인데 내가 앞선 행동으로 이유를 없앴다.
 *   turned-back  앞까지 갔다가 돌아섰다. 가게에는 아무 문제가 없었다.
 *   short        들르기는 했는데 오래 있지 않았다.
 */
export type VisitState =
  'planned' | 'visited' | 'closed' | 'passed' | 'skipped' | 'turned-back' | 'short'

/** 계획표 한 줄에 적히는 말. 옆에 붙는 말보다 짧다 — 표는 표의 폭을 지켜야 한다. */
const NOTED: Record<Exclude<VisitState, 'planned'>, string> = {
  visited: 'DONE',
  closed: 'CLOSED',
  passed: 'PASSED',
  skipped: 'SKIP',
  'turned-back': 'TURNED BACK',
  short: 'SHORT',
}

type Board = {
  items: readonly string[]
  from: string
  to: string
  states: Readonly<Record<string, VisitState>>
  /** 이 자리를 지나가면 계획표에 적어 달라고 맡긴다. 돌려받는 것은 취소하는 함수다. */
  watch: (node: HTMLElement, item: string, state: VisitState) => () => void
}

const PlanContext = createContext<Board | null>(null)

type Props = {
  /** 아침에 적어 둔 순서. 화면에 나오는 그대로. */
  items: readonly string[]
  /** '10:00 CHECKOUT' — 하루가 시작되는 자리. */
  from: string
  /** '17:28 SEOUL' — 하루가 끝나기로 되어 있는 자리. */
  to: string
  children: ReactNode
}

/**
 * 아침에 세운 계획과, 그 안에서 실제로 일어난 하루.
 *
 * 이 기록에는 층이 두 개 있다. 하나는 아침에 적어 둔 순서고 다른 하나는
 * 실제로 지나간 순서다. 둘을 따로 보여 주면 «계획»과 «후기»라는 두 편의 글이
 * 되고, 그러면 이 하루에서 유일하게 흥미로운 것 — 둘이 어긋나는 방식 — 이
 * 사라진다. 그래서 계획표를 먼저 세워 두고 그 안에서 하루가 지나가게 한다.
 *
 * 계획표는 지워지지 않는다.
 *
 * 어느 자리를 지날 때마다 그 줄에 무슨 일이 있었는지가 적히고, 한 번 적힌
 * 것은 되돌아가지 않는다. 끝까지 읽고 맨 위로 다시 올라가면 아침의 계획표에
 * 하루치 수정 이력이 그대로 남아 있다. 계획이 취소된 것이 아니라 계획 위에
 * 실제가 덧쓰인 것이고, 그날 일어난 일이 정확히 그것이었다.
 *
 * 아침의 계획표는 이 컴포넌트가 직접 세운다. 여는 화면에서 계획이 먼저
 * 서 있어야 뒤에 오는 모든 어긋남이 어긋남으로 읽힌다.
 */
export function PlanStage({ items, from, to, children }: Props) {
  const [states, setStates] = useState<Readonly<Record<string, VisitState>>>({})

  /*
   * 아직 지나가지 않은 자리들.
   *
   * 자리마다 관찰자를 붙이지 않고 한 곳에서 모아 본다. 관찰자는 «지금 화면에
   * 걸쳐 있는가»를 알려 주는데, 스크롤을 한 번에 크게 던지면 그 사이의 자리는
   * 화면에 걸친 적이 없는 채로 지나가 버린다. 그러면 끝까지 내려가서 본
   * 계획표에 하루의 절반이 비어 있다.
   *
   * 그래서 «걸쳐 있는가»가 아니라 «지나갔는가»를 묻는다. 한 번 위로 올라간
   * 자리는 얼마나 빨리 지나갔든 지나간 것이라, 던지든 천천히 내리든 같은
   * 하루가 남는다.
   */
  const pending = useRef(new Map<HTMLElement, { item: string; state: VisitState }>())

  const watch = useCallback((node: HTMLElement, item: string, state: VisitState) => {
    pending.current.set(node, { item, state })
    return () => pending.current.delete(node)
  }, [])

  useEffect(() => {
    let queued = false

    const sweep = () => {
      queued = false

      /* 판면의 3분의 2를 넘어 올라온 자리는 읽고 지나간 것으로 본다. */
      const line = window.innerHeight * 0.65
      const passed: { item: string; state: VisitState }[] = []

      for (const [node, visit] of pending.current) {
        if (node.getBoundingClientRect().top > line) continue

        passed.push(visit)
        pending.current.delete(node)
      }

      if (passed.length === 0) return

      setStates((current) => {
        const next = { ...current }

        /* 한 번 적힌 것은 다시 쓰지 않는다. 되감기는 계획표가 아니라 기억의 조작이다. */
        for (const { item, state } of passed) if (!next[item]) next[item] = state

        return next
      })
    }

    const onScroll = () => {
      if (queued) return

      queued = true
      requestAnimationFrame(sweep)
    }

    /* 새로고침으로 페이지 가운데에 떨어진 사람에게도 그때까지의 하루가 있어야 한다. */
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const board = useMemo(
    () => ({ items, from, to, states, watch }),
    [items, from, to, states, watch],
  )

  return (
    <PlanContext.Provider value={board}>
      {/*
        아침의 표는 자기 장면을 갖는다. 이 아래로 오는 모든 것이 이 표에
        일어난 일이라, 표와 하루 사이는 다른 어디보다 크게 비워 둔다.
      */}
      <Scene air>
        <Plan />
      </Scene>

      {children}
    </PlanContext.Provider>
  )
}

/**
 * 계획표 그 자체.
 *
 * 판면은 자기가 놓인 장면에서 받는다. 스스로 판면을 잡으면 장면 안에 놓였을
 * 때 여백이 두 번 들어가 이 표만 안쪽으로 밀린다.
 *
 * 여는 화면에 한 번, 성수로 돌아온 자리에 한 번 선다. 두 번 다 같은 표이고
 * 같은 상태를 읽는다 — 다시 만났을 때 «아까 그 표»로 알아보게 하려면 모양이
 * 달라서는 안 된다. 달라진 것은 표가 아니라 그 사이에 지나간 하루다.
 *
 * 표의 아래 모서리에 열차 시각이 있다. 하루가 채워질수록 그 줄의 잉크가
 * 짙어진다 — 떠다니는 시계를 따로 두지 않는 이유가 그것이다. 열차 시각은
 * 화면 위에 얹힌 알림이 아니라 아침에 적은 계획의 마지막 줄이었다.
 *
 * 한 줄을 붙잡을 수 있다.
 *
 * 붙잡고 있는 동안 그 줄만 아침의 잉크로 돌아온다. 문이 닫혔던 곳도, 내가
 * 들어가지 않은 곳도, 붙잡고 있는 동안에는 아직 갈 수 있는 자리로 서 있는다.
 * 손을 떼면 실제로 일어난 일로 다시 내려앉는다. 계획을 붙잡고 있는 것과
 * 계획대로 되는 것은 다른 일이라는 말을, 문장 대신 이 동작이 한다.
 */
export function Plan() {
  const board = useContext(PlanContext)
  const [held, setHeld] = useState<string | null>(null)
  const [near, setNear] = useState<string | null>(null)

  const attending = held ?? near

  const hold = useCallback(
    (item: string) => setHeld((current) => (current === item ? null : item)),
    [],
  )

  const approach = useCallback((item: string, pointerType: string) => {
    /* 손가락은 지나가지 않는다. 찍는 것만 붙잡는 것으로 친다. */
    if (pointerType !== 'touch') setNear(item)
  }, [])

  if (!board) return null

  /*
   * 열차 시각이 얼마나 가까워졌는가.
   *
   * 스크롤 위치로 재지 않는다. 그날 시간이 다가온 것은 화면을 얼마나 내렸기
   * 때문이 아니라 일정이 하나씩 끝났기 때문이고, 그래서 계획표에 적힌 줄의
   * 수로 잰다. 네 단으로 끊어서 짙어지고 그 사이에는 아무 일도 없다 —
   * 실제로는 한참 잊고 있다가 문득 한 번씩 생각났다.
   *
   * 크기도 자리도 변하지 않는다. 시간이 가까워질 때 글자가 커지면 그것은
   * 시간이 아니라 경고가 된다. 제일 옅은 단에서도 종이 대비 6.85:1이라
   * 처음부터 읽을 수 있다.
   */
  const noted = board.items.filter((item) => board.states[item]).length
  const closeness = Math.min(3, Math.floor((noted / board.items.length) * 4))

  return (
    <div className={styles.plan} data-attending={attending !== null} data-closeness={closeness}>
      <p className={`mono ${styles.edge}`}>{board.from}</p>

      <div className={styles.track} onPointerLeave={() => setNear(null)}>
        <ol className={styles.items} role="list">
          {board.items.map((item) => {
            const state = board.states[item] ?? 'planned'

            return (
              <li key={item} data-state={state} data-attending={attending === item}>
                <button
                  type="button"
                  className={`mono ${styles.name}`}
                  aria-pressed={held === item}
                  onPointerEnter={(event) => approach(item, event.pointerType)}
                  onClick={() => hold(item)}
                >
                  {item}
                </button>

                <span className={`mono ${styles.state}`}>
                  {state === 'planned' ? '' : NOTED[state]}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <p className={`mono ${styles.edge} ${styles.to}`}>{board.to}</p>
    </div>
  )
}

/**
 * 어느 자리를 지났다는 사실을 계획표에 적는다.
 *
 * 화면에 들어오자마자 적지 않는다. 판면의 위쪽으로 올라갔을 때 — 그러니까
 * 읽는 사람이 그 자리를 실제로 지났을 때 — 계획표가 바뀐다. 아직 화면 아래에
 * 걸쳐 있는 장면 때문에 위쪽 표가 먼저 바뀌면, 읽기 전에 결과부터 아는 일이
 * 생긴다.
 *
 * 계획에 없던 자리는 적지 않는다. 그날 즉흥으로 정한 곳까지 아침의 표에
 * 끼워 넣으면 그 표는 더 이상 아침에 적은 것이 아니게 된다.
 *
 * motion/useInView를 쓰지 않는 이유가 여기 있다. 그 훅은 «지금 화면에 얼마나
 * 보이는가»를 묻는데, 여기서 물어야 하는 것은 «지나갔는가»다. 두 질문은
 * 스크롤을 한 번에 크게 던졌을 때 갈린다 — 화면에 걸친 적이 없어도 지나간
 * 것은 지나간 것이다.
 */
export function useVisit<T extends HTMLElement>(item: string | undefined, state: VisitState) {
  const board = useContext(PlanContext)
  const ref = useRef<T>(null)
  const watch = board?.watch

  useEffect(() => {
    const node = ref.current

    if (!node || !item || !watch) return

    return watch(node, item, state)
  }, [item, state, watch])

  return ref
}
