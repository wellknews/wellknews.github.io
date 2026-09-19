import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
} from 'react'

import type { Cover } from '../../content/types'
import { useInView } from '../../motion/useInView'
import styles from './ContactSheet.module.css'

type Props = {
  shots: readonly Cover[]
  /** 이 시트가 무엇의 기록인지. 낭독과 크게 보기의 이름에 쓰인다. */
  label: string
}

/** 밀도가 올라가는 구간의 칸 수. 한 장, 두 장, 네 장. */
const RAMP = [1, 2, 4] as const

/** 넘긴 것으로 치는 손가락의 거리. 이보다 짧으면 사진을 만진 것이다. */
const SWIPE = 48

/**
 * 기록의 모양이 달라지는 자리.
 *
 * 여기까지 이 기록은 사진 한 장에 글 하나였다. 지하로 들어간 뒤로는 그 방식이
 * 성립하지 않는다 — 찍은 것이 갑자기 많아졌기 때문이다. 그래서 판면의 규칙을
 * 여기서 처음 푼다. 본문 폭을 지키던 것이 좌우로 퍼지고, 한 장씩 소중하게
 * 놓이던 사진이 화면을 덮는다.
 *
 * 설명을 붙이지 않는다. «여기서부터 사진이 많습니다»라고 적을 필요가 없다.
 * 앞의 스무 화면에서 사진이 한 장씩 나왔기 때문에, 갑자기 격자가 채워지는
 * 것만으로 정보량이 달라졌다는 사실이 전해진다.
 *
 * 처음부터 격자를 다 보여 주지 않는다.
 *
 * 한 장, 그다음 두 장, 그다음 네 장, 그러고 나서 시트 전체. 사진이 날아오지
 * 않고 새 사진이 빈자리를 채우며 늘어난다. 기록량이 폭발하는 과정 자체가
 * 보여야 하므로, 다 차 있는 격자를 한 번에 놓으면 그 과정이 없어진다.
 *
 * masonry로 짜지 않는다. 벽돌처럼 맞물린 배치는 사진첩이 아니라 피드의
 * 문법이고, 그 순간 이 구간은 «많이 찍었다»가 아니라 «잘 배열했다»가 된다.
 * 여기서 필요한 것은 인화지 한 장에 늘어놓은 규칙적인 칸이다.
 *
 * 사진마다 다른 패럴랙스를 주지 않는다. 시트가 처음 판면에 들어올 때 칸들이
 * 아주 짧은 시차로 차례차례 인화될 뿐이다.
 */
export function ContactSheet({ shots, label }: Props) {
  const [at, setAt] = useState<number | null>(null)
  const box = useRef<HTMLDialogElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const swipeFrom = useRef<number | null>(null)

  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.12, replay: true })

  const open = useCallback((index: number) => {
    returnTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setAt(index)
  }, [])

  const close = useCallback(() => setAt(null), [])

  const step = useCallback(
    (delta: number) => {
      setAt((current) => {
        if (current === null) return current

        /* 끝에서 처음으로 돌지 않는다. 넘겨 본 사진이 다시 나오면 몇 장인지 알 수 없다. */
        const next = current + delta

        return next < 0 || next >= shots.length ? current : next
      })
    },
    [shots.length],
  )

  /*
   * 크게 보는 동안.
   *
   * 브라우저가 가진 대화상자를 그대로 쓴다. 초점이 이 안에 갇히는 것도, Esc로
   * 닫히는 것도, 뒤의 지면이 읽히지 않게 되는 것도 전부 <dialog>가 이미 하는
   * 일이다. 같은 것을 손으로 다시 만들면 반드시 한 가지를 빠뜨린다.
   */
  useEffect(() => {
    const dialog = box.current

    if (!dialog) return

    if (at === null) {
      if (dialog.open) dialog.close()

      return
    }

    if (!dialog.open) dialog.showModal()

    /* 뒤의 지면이 따라 움직이지 않는다. 한 장을 보는 동안에는 그 한 장뿐이다. */
    const body = document.body
    const kept = body.style.overflow

    body.style.overflow = 'hidden'

    return () => {
      body.style.overflow = kept
    }
  }, [at])

  /* Esc는 <dialog>가 닫는다. 닫힌 뒤에 원래 있던 자리로 초점을 돌려주는 것만 한다. */
  const onClose = useCallback(() => {
    setAt(null)
    returnTo.current?.focus()
  }, [])

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDialogElement>) => {
      if (event.key === 'ArrowRight') step(1)
      if (event.key === 'ArrowLeft') step(-1)
    },
    [step],
  )

  const onPointerDown = useCallback((event: PointerEvent<HTMLDialogElement>) => {
    swipeFrom.current = event.clientX
  }, [])

  const onPointerUp = useCallback(
    (event: PointerEvent<HTMLDialogElement>) => {
      const from = swipeFrom.current

      swipeFrom.current = null

      if (from === null) return

      const moved = event.clientX - from

      if (Math.abs(moved) < SWIPE) return

      step(moved < 0 ? 1 : -1)
    },
    [step],
  )

  /* 사진이 아직 없는 기록에서는 아무것도 그리지 않는다. 빈 격자는 자리가 아니라 고장이다. */
  if (shots.length === 0) return null

  /*
   * 칸마다 제 번호를 들고 다닌다.
   *
   * 나중에 배열에서 자기 자리를 다시 찾게 하지 않는다. 같은 사진이 두 번
   * 들어오면 그 방법은 틀린 칸을 열고, 칸이 늘어날수록 찾는 일도 같이 늘어난다.
   */
  const placed = shots.map((shot, index) => ({ shot, index }))
  const runs: (typeof placed)[] = []
  let cut = 0

  for (const size of RAMP) {
    if (cut >= placed.length) break

    runs.push(placed.slice(cut, cut + size))
    cut += size
  }

  const sheet = placed.slice(cut)
  const showing = at === null ? null : shots[at]

  return (
    <div className={styles.contact} ref={ref} data-printed={inView}>
      {runs.map((run, index) => (
        <div key={`run-${run[0]?.shot.src ?? index}`} className={styles.run} data-of={run.length}>
          {run.map(({ shot, index: place }) => (
            <Cell key={shot.src} shot={shot} index={place} onOpen={open} label={label} />
          ))}
        </div>
      ))}

      {sheet.length > 0 ? (
        <div className={styles.sheet}>
          {sheet.map(({ shot, index: place }) => (
            <Cell key={shot.src} shot={shot} index={place} onOpen={open} label={label} />
          ))}
        </div>
      ) : null}

      <dialog
        className={styles.lightbox}
        ref={box}
        aria-label={label}
        onClose={onClose}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        {showing ? (
          <>
            <div className={styles.shown}>
              <img
                src={showing.src}
                alt={showing.alt}
                width={showing.width}
                height={showing.height}
                decoding="async"
              />
            </div>

            <div className={styles.controls}>
              <button
                type="button"
                className={`mono ${styles.control}`}
                onClick={() => step(-1)}
                disabled={at === 0}
              >
                <span aria-hidden="true">←</span>
                <span className="visually-hidden">이전</span>
              </button>

              <p className={`mono ${styles.count}`}>
                {(at ?? 0) + 1} / {shots.length}
              </p>

              <button
                type="button"
                className={`mono ${styles.control}`}
                onClick={() => step(1)}
                disabled={at === shots.length - 1}
              >
                <span aria-hidden="true">→</span>
                <span className="visually-hidden">다음</span>
              </button>
            </div>

            <button type="button" className={`mono ${styles.close}`} onClick={close} autoFocus>
              <span aria-hidden="true">×</span>
              <span className="visually-hidden">닫기</span>
            </button>
          </>
        ) : null}
      </dialog>
    </div>
  )
}

type CellProps = {
  shot: Cover
  index: number
  label: string
  onOpen: (index: number) => void
}

/**
 * 시트의 한 칸.
 *
 * 칸의 크기는 전부 같고 사진은 그 안에서 제 비율을 지킨다. 칸에 맞춰 잘라내면
 * 세로 사진과 가로 사진이 한 모양이 되고, 그러면 무엇을 어떻게 찍었는지가
 * 사라진다. 인화지 위에 늘어놓은 필름이 원래 그렇게 생겼다.
 *
 * 다가간다고 확대되지 않는다. 사진마다 커지는 격자는 볼 것이 아니라 만질
 * 것을 만들고, 열두 칸이 전부 그러면 화면이 쉬지 않는다.
 */
function Cell({ shot, index, label, onOpen }: CellProps) {
  return (
    <button
      type="button"
      className={styles.cell}
      style={{ '--cell': index } as CSSProperties}
      onClick={() => onOpen(index)}
    >
      <img
        src={shot.src}
        alt={shot.alt}
        width={shot.width}
        height={shot.height}
        decoding="async"
        loading="lazy"
      />

      <span className="visually-hidden">{`${label} — 크게 보기`}</span>
    </button>
  )
}
