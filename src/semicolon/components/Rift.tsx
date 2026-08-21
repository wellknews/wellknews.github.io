import { useCallback, useEffect, useRef, type PointerEvent } from 'react'

import { semicolon } from '../content/site'
import { clamp, damp, settled } from '../motion/damp'
import { useReducedMotion } from '../motion/useReducedMotion'
import { useSettling } from '../motion/useSettling'
import styles from './Rift.module.css'

/** 선을 몇 점으로 그릴지. 이보다 성기면 갈라지는 자리가 꺾은선으로 보인다. */
const SAMPLES = 56

/** ';'가 앉는 자리(판면 폭 대비). 정확히 가운데를 피해 축을 조금 어긋나게 둔다. */
const MARK_X = 0.46

/** ';'가 늘 벌려 두고 있는 폭(px)과 그 폭이 퍼지는 범위(px). */
const MARK_HOLD = 26
const MARK_SIGMA = 72

/** 사람이 다가왔을 때 더 열리는 폭(px). 판면이 좁으면 폭에 비례해 줄인다. */
const MAX_GAP = 64
const MAX_GAP_RATIO = 0.05

/** 열린 자리가 퍼지는 범위(px). 좁으면 구멍처럼 보이고 넓으면 아무 일도 안 한 것처럼 보인다. */
const SIGMA_MIN = 90
const SIGMA_RATIO = 0.12

/** 선에서 세로로 이만큼 떨어지면 반응이 절반이 된다(판면 높이 대비). */
const REACH = 0.42

/** 손가락으로 찍은 자리가 열린 채 머무는 시간(ms). */
const HOLD = 1800

/** 열림과 그 중심이 따라붙는 속도. 색면보다 빠르다 — 직접 만지는 것이라 늦으면 고장으로 읽힌다. */
const RATE_CENTER = 7
const RATE_OPEN = 5

/** 아무도 다가오지 않았을 때 ';'가 가진 잉크. 있지만 조용한 상태. */
const REST_INK = 0.3

/**
 * 이어지던 선, 그리고 그 선을 벌리고 있는 ';'.
 *
 * 이 공간이 무엇인지 문장으로 적지 않는다. 대신 화면이 세미콜론처럼 행동한다.
 *
 *   · 선은 끊기지 않는다. 다만 ';'가 있는 자리에서만 늘 조금 벌어져 있다.
 *     문장을 끝내지 않으면서 잠시 멈춰 세우는 것이 이 기호가 하는 일이고,
 *     여기서는 그것이 선을 벌려 두는 일로 나타난다.
 *   · 사람이 다가오면 그 자리의 두 색면이 갈라지며 틈이 커진다.
 *   · 틈이 ';'까지 닿으면 기호가 잉크를 얻는다. 멀어지면 다시 조용해지고
 *     선은 닫힌다. 설명문은 어디에도 없다.
 *
 * 저절로 움직이지 않는다. 아무도 건드리지 않는 동안 이 선은 정지해 있다.
 */
export function Rift() {
  const hostRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const upperRef = useRef<SVGPathElement>(null)
  const lowerRef = useRef<SVGPathElement>(null)
  const upperEdgeRef = useRef<SVGPathElement>(null)
  const lowerEdgeRef = useRef<SVGPathElement>(null)
  const gradientRef = useRef<SVGLinearGradientElement>(null)
  const pinkGradientRef = useRef<SVGLinearGradientElement>(null)

  const reduced = useReducedMotion()

  const size = useRef({ w: 0, h: 0 })
  const center = useRef(0)
  const centerTarget = useRef(0)
  const open = useRef(0)
  const openTarget = useRef(0)
  const holdTimer = useRef<number | undefined>(undefined)
  /* 아직 아무도 이 판을 건드리지 않았는지. 판 크기가 바뀌어도 사람이 연 자리는 지키려고 둔다. */
  const untouched = useRef(true)

  /**
   * 지금 상태를 그린다.
   *
   * React를 거치지 않고 속성을 직접 쓴다. 프레임마다 다시 렌더하면 이 정도
   * 움직임에도 화면이 버벅인다.
   */
  const draw = useCallback(() => {
    const { w, h } = size.current
    const svg = svgRef.current

    if (!svg || w <= 0 || h <= 0) return

    const mid = h / 2
    const maxGap = Math.min(MAX_GAP, w * MAX_GAP_RATIO)
    const sigma = Math.max(SIGMA_MIN, w * SIGMA_RATIO)
    const markAt = w * MARK_X

    /** 그 자리에서 선이 벌어진 폭. ';'가 늘 벌려 둔 만큼에 사람이 연 만큼을 더한다. */
    const gapAt = (x: number) => {
      const held = MARK_HOLD * Math.exp(-(((x - markAt) / MARK_SIGMA) ** 2))
      const pulled = maxGap * open.current * Math.exp(-(((x - center.current) / sigma) ** 2))

      return held + pulled
    }

    const upper: string[] = []
    const lower: string[] = []

    for (let i = 0; i <= SAMPLES; i += 1) {
      const x = (i / SAMPLES) * w
      const half = gapAt(x) / 2

      upper.push(`${x.toFixed(1)} ${(mid - half).toFixed(1)}`)
      lower.push(`${x.toFixed(1)} ${(mid + half).toFixed(1)}`)
    }

    const upperEdge = `M${upper.join('L')}`
    const lowerEdge = `M${lower.join('L')}`

    svg.setAttribute('viewBox', `0 0 ${w.toFixed(1)} ${h.toFixed(1)}`)

    /* 선 자체 — 갈라지는 것이 눈에 보이는 자리. */
    upperEdgeRef.current?.setAttribute('d', upperEdge)
    lowerEdgeRef.current?.setAttribute('d', lowerEdge)

    /* 선이 나눠 놓은 두 색면. 위는 민트, 아래는 핑크. */
    upperRef.current?.setAttribute('d', `${upperEdge}L${w.toFixed(1)} 0L0 0Z`)
    lowerRef.current?.setAttribute(
      'd',
      `${lowerEdge}L${w.toFixed(1)} ${h.toFixed(1)}L0 ${h.toFixed(1)}Z`,
    )

    /*
     * 색은 선에 붙어 있고 판면 끝으로 갈수록 사라진다. 위아래를 통째로 칠하면
     * 두 개의 큰 도형이 되고, 선이 두 면의 경계라는 사실이 보이지 않는다.
     *
     * 판면 끝까지 그라디언트를 채운다. 중간에서 시작하면 색이 시작되는 자리에
     * 눈에 보이는 선이 하나 더 생긴다 — 경계가 보이는 순간 색면은 도형이 된다.
     */
    gradientRef.current?.setAttribute('y1', '0')
    gradientRef.current?.setAttribute('y2', mid.toFixed(1))
    pinkGradientRef.current?.setAttribute('y1', h.toFixed(1))
    pinkGradientRef.current?.setAttribute('y2', mid.toFixed(1))

    /* ';'의 잉크는 그 자리가 얼마나 열렸는지에서 나온다. */
    const reach = clamp((gapAt(markAt) - MARK_HOLD) / Math.max(maxGap, 1), 0, 1)

    hostRef.current?.style.setProperty('--mark-ink', (REST_INK + (1 - REST_INK) * reach).toFixed(3))
  }, [])

  const wake = useSettling(
    useCallback(
      (dt: number) => {
        center.current = damp(center.current, centerTarget.current, RATE_CENTER, dt)
        open.current = damp(open.current, openTarget.current, RATE_OPEN, dt)

        draw()

        // 중심은 px 단위라 0.0005는 너무 촘촘하다. 반 픽셀이면 눈에 띄지 않는다.
        return (
          !settled(center.current, centerTarget.current, 0.5) ||
          !settled(open.current, openTarget.current)
        )
      },
      [draw],
    ),
  )

  /* 판면 크기는 창 크기와 글자 크기에 따라 바뀐다. 바뀔 때마다 다시 그린다. */
  useEffect(() => {
    const host = hostRef.current

    if (!host) return

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return

      const { width, height } = entry.contentRect

      size.current = { w: width, h: height }

      // 첫 측정에서는 열리는 자리의 기준을 ';'에 둔다. 사람이 오면 그 자리에서 이어진다.
      if (untouched.current) {
        centerTarget.current = width * MARK_X
        center.current = centerTarget.current
      }

      draw()
    })

    observer.observe(host)

    return () => observer.disconnect()
  }, [draw])

  useEffect(() => () => window.clearTimeout(holdTimer.current), [])

  const pull = useCallback(
    (clientX: number, clientY: number) => {
      const host = hostRef.current

      if (!host) return

      const rect = host.getBoundingClientRect()

      untouched.current = false
      centerTarget.current = clamp(clientX - rect.left, 0, rect.width)

      /* 선에서 멀리 떨어져 있으면 조금만 열린다. 가까이 올수록 크게 열린다. */
      const dy = clientY - (rect.top + rect.height / 2)
      const span = Math.max(rect.height * REACH, 1)

      openTarget.current = Math.exp(-((dy / span) ** 2))
      wake()
    },
    [wake],
  )

  const handleMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      // 터치는 누르는 순간에만 반응한다. 끄는 동안 따라다니면 스크롤을 방해한다.
      if (event.pointerType === 'touch') return

      pull(event.clientX, event.clientY)
    },
    [pull],
  )

  /** 손가락에는 hover가 없다. 찍은 자리를 잠깐 열어 두고 스스로 닫는다. */
  const handleDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      pull(event.clientX, event.clientY)

      if (event.pointerType !== 'touch') return

      window.clearTimeout(holdTimer.current)
      holdTimer.current = window.setTimeout(() => {
        openTarget.current = 0
        wake()
      }, HOLD)
    },
    [pull, wake],
  )

  const close = useCallback(() => {
    window.clearTimeout(holdTimer.current)
    openTarget.current = 0
    wake()
  }, [wake])

  /**
   * 커서가 판을 벗어나면 선이 닫힌다.
   *
   * 터치는 예외다. 손을 떼는 순간 포인터 자체가 사라지면서 leave가 곧바로
   * 따라오는데, 그 신호로 닫아 버리면 찍은 자리가 열려 있을 시간이 없다.
   * 손가락으로 연 자리는 타이머가 닫는다.
   */
  const handleLeave = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch') return

      close()
    },
    [close],
  )

  /*
   * 움직임을 줄이기로 한 사람에게는 선이 닫힌 채로 있고 ';'는 처음부터
   * 온전한 잉크를 갖는다. 다가가야 보이는 기호가 되면 안 되기 때문이다.
   */
  const still = reduced

  return (
    <div
      className={styles.rift}
      ref={hostRef}
      data-still={still}
      {...(still
        ? {}
        : {
            onPointerMove: handleMove,
            onPointerDown: handleDown,
            onPointerLeave: handleLeave,
            onPointerCancel: close,
          })}
    >
      <svg
        className={styles.canvas}
        ref={svgRef}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="rift-upper"
            ref={gradientRef}
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="0"
          >
            {/*
              stop-color는 CSS에서 준다. SVG 표현 속성 안의 var()는 브라우저마다 다르게 다룬다.

              중간 stop들이 곡선을 만든다. 두 점만 두면 농도가 일정한 비율로
              변해서, 색이 시작되는 자리가 직선으로 드러난다.
            */}
            <stop className={styles.mintStop} offset="0" stopOpacity="0" />
            <stop className={styles.mintStop} offset="0.55" stopOpacity="0.1" />
            <stop className={styles.mintStop} offset="0.82" stopOpacity="0.42" />
            <stop className={styles.mintStop} offset="1" />
          </linearGradient>

          <linearGradient
            id="rift-lower"
            ref={pinkGradientRef}
            gradientUnits="userSpaceOnUse"
            x1="0"
            x2="0"
          >
            <stop className={styles.pinkStop} offset="0" stopOpacity="0" />
            <stop className={styles.pinkStop} offset="0.55" stopOpacity="0.1" />
            <stop className={styles.pinkStop} offset="0.82" stopOpacity="0.42" />
            <stop className={styles.pinkStop} offset="1" />
          </linearGradient>
        </defs>

        <path className={styles.plane} ref={upperRef} fill="url(#rift-upper)" />
        <path className={styles.plane} ref={lowerRef} fill="url(#rift-lower)" />

        <path className={styles.edge} ref={upperEdgeRef} />
        <path className={styles.edge} ref={lowerEdgeRef} />
      </svg>

      {/* 글자가 아니라 이 공간의 기호로 놓인다. 이름은 낭독을 위해 히어로가 따로 적는다. */}
      <span className={styles.mark} style={{ left: `${MARK_X * 100}%` }} aria-hidden="true">
        {semicolon.mark}
      </span>
    </div>
  )
}
