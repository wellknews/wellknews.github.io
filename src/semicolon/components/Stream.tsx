import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'

import { semicolon } from '../content/site'
import styles from './Stream.module.css'

/** 눈금 사이 간격(px). 화면 폭이 달라져도 이 간격은 유지된다. */
const SPACING = 15

/** 화면이 아주 좁아도 줄로 읽히려면 이만큼은 필요하다. */
const MIN_TICKS = 20

/** 갈라지며 열리는 폭(px). 좁은 화면에서는 줄 폭에 비례해 줄인다. */
const MAX_GAP = 76
const GAP_RATIO = 0.18

/** 손가락으로 찍었을 때 열린 자리가 머무는 시간(ms). */
const HOLD = 1800

/** 처음 들어온 사람에게 이 줄이 무엇을 하는지 한 번 보여 주는 시점(ms). */
const HINT_AT = 1200
const HINT_FOR = 1600
const HINT_RATIO = 0.38

/**
 * 이어지는 줄, 그리고 그 사이에 삽입되는 자리.
 *
 * 이 공간이 무엇을 말하는지 문장으로 설명하는 대신 손으로 만지게 한다.
 * 눈금은 끊기지 않고 이어지는 흐름이고, 커서를 얹으면 그 자리가 갈라지면서
 * ';'가 들어선다. 손을 떼면 줄은 다시 닫히고 흐름은 이어진다.
 *
 * 커서 모양을 글자 입력 모양(text)으로 두는 것도 같은 이유다 — 여기에
 * 무언가를 끼워 넣을 수 있다는 사실을 설명 없이 알린다.
 *
 * 화면이 저절로 움직이지는 않는다. 처음 한 번, 이 줄이 무엇을 하는지
 * 보여 주는 시연을 제외하면 모든 동작은 사람이 시작한다.
 */
export function Stream() {
  const railRef = useRef<HTMLDivElement>(null)
  const holdRef = useRef<number | undefined>(undefined)
  const touchedRef = useRef(false)

  const [width, setWidth] = useState(0)
  const [index, setIndex] = useState<number | null>(null)

  /* 눈금 수는 폭에서 나온다. 어느 화면에서든 같은 간격의 줄로 보이게 한다. */
  const count = Math.max(MIN_TICKS, Math.round(width / SPACING))
  const gap = Math.min(MAX_GAP, width * GAP_RATIO)

  useEffect(() => {
    const rail = railRef.current

    if (!rail) return

    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width)
    })

    observer.observe(rail)

    return () => observer.disconnect()
  }, [])

  const clearHold = useCallback(() => {
    if (holdRef.current !== undefined) {
      window.clearTimeout(holdRef.current)
      holdRef.current = undefined
    }
  }, [])

  useEffect(() => {
    // 모션을 줄이기로 한 사람에게는 시연도 하지 않는다.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const open = window.setTimeout(() => {
      // 그 사이에 직접 만져 봤다면 시연할 이유가 없다.
      if (touchedRef.current) return

      // 폭은 상태가 아니라 이 순간의 판면에서 읽는다. 시연은 한 번뿐이라
      // 이 효과가 폭 변화를 따라 다시 돌 이유가 없다.
      const ticks = Math.max(MIN_TICKS, Math.round((railRef.current?.clientWidth ?? 0) / SPACING))
      setIndex(Math.round(ticks * HINT_RATIO))

      holdRef.current = window.setTimeout(() => {
        if (!touchedRef.current) setIndex(null)
      }, HINT_FOR)
    }, HINT_AT)

    return () => {
      window.clearTimeout(open)
      clearHold()
    }
  }, [clearHold])

  const openAt = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const ratio = (event.clientX - rect.left) / rect.width

      touchedRef.current = true
      clearHold()
      setIndex(Math.min(count - 1, Math.max(0, Math.round(ratio * (count - 1)))))
    },
    [clearHold, count],
  )

  const handleMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === 'touch') return
      openAt(event)
    },
    [openAt],
  )

  /** 손가락에는 hover가 없다. 찍은 자리를 잠깐 열어 두고 스스로 닫는다. */
  const handleDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      openAt(event)

      if (event.pointerType !== 'touch') return

      holdRef.current = window.setTimeout(() => setIndex(null), HOLD)
    },
    [openAt],
  )

  const handleLeave = useCallback(() => {
    clearHold()
    setIndex(null)
  }, [clearHold])

  /* 폭이 줄면 눈금 수도 줄어든다. 열려 있던 자리가 줄 밖으로 나가지 않게 한다. */
  const at = index === null ? null : Math.min(index, count - 1)

  /*
   * 갈라진 자리의 한가운데. 눈금 k와 k+1 사이가 열리므로 글자는 그 둘의
   * 가운데, 즉 반 칸 오른쪽에 놓여야 가운데로 보인다.
   */
  const markAt = (((at ?? Math.round(count * HINT_RATIO)) + 0.5) / (count - 1)) * 100

  return (
    <div
      className={styles.stream}
      onPointerMove={handleMove}
      onPointerDown={handleDown}
      onPointerLeave={handleLeave}
      onPointerCancel={handleLeave}
      aria-hidden="true"
    >
      <div className={styles.rail} ref={railRef}>
        {Array.from({ length: count }, (_, tick) => (
          <span
            key={tick}
            className={styles.tick}
            style={{
              left: `${(tick / (count - 1)) * 100}%`,
              transform:
                at === null ? undefined : `translateX(${tick <= at ? -gap / 2 : gap / 2}px)`,
            }}
          />
        ))}

        <span className={styles.mark} data-open={at !== null} style={{ left: `${markAt}%` }}>
          {semicolon.mark}
        </span>
      </div>
    </div>
  )
}
