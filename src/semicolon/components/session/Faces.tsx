import { useCallback, useRef, useState, type PointerEvent } from 'react'

import type { Cover } from '../../content/types'
import styles from './Faces.module.css'

/** 뒤집혔다고 볼 만한 최소 거리(px). 이보다 짧으면 스크롤하다 스친 것으로 본다. */
const SWIPE = 40

type Props = {
  front: Cover
  back: Cover
}

/**
 * 앞면과 뒷면.
 *
 * «앞면» «뒷면» 버튼을 그리지 않는다. 실제로 옷을 볼 때 하는 행동을 그대로 둔다 —
 * 마우스는 판 위를 가로질러 가면 반대쪽이 보이고, 손가락은 좌우로 민다.
 * 무엇을 눌러야 하는지 알려 주는 대신, 움직이면 알게 된다.
 *
 * 보이는 버튼은 없지만 진짜 버튼은 있다. 판 전체를 덮는 투명한 버튼이라
 * 화면에는 아무것도 더해지지 않으면서 키보드와 스크린리더에는 평범한 버튼으로
 * 보인다. 눌러서 뒤집을 수 없는 사람이 생기지 않게 하려는 것이다.
 *
 * 두 장 모두 설명을 달아 문서에 남긴다. 뒤집어야만 알 수 있는 정보가 있으면
 * 화면을 보지 않는 사람은 절반을 잃는다.
 */
export function Faces({ front, back }: Props) {
  const [showBack, setShowBack] = useState(false)
  const swipeFrom = useRef<number | null>(null)
  const swiped = useRef(false)

  const toggle = useCallback(() => setShowBack((shown) => !shown), [])

  const handleMove = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    // 손가락은 미는 동작으로 뒤집는다. 끄는 동안 따라가면 스크롤과 싸운다.
    if (event.pointerType === 'touch') return

    const rect = event.currentTarget.getBoundingClientRect()

    setShowBack(event.clientX - rect.left > rect.width / 2)
  }, [])

  const handleDown = useCallback((event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType !== 'touch') return

    swipeFrom.current = event.clientX
    swiped.current = false
    // 손가락이 판 밖으로 나가도 끝을 받을 수 있게 잡아 둔다.
    event.currentTarget.setPointerCapture(event.pointerId)
  }, [])

  const handleUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const from = swipeFrom.current

      swipeFrom.current = null

      if (from === null) return
      if (Math.abs(event.clientX - from) < SWIPE) return

      // 민 것으로 이미 뒤집었으므로 뒤따라오는 click은 한 번 넘긴다.
      swiped.current = true
      toggle()
    },
    [toggle],
  )

  /** 톡 누르거나 Enter를 눌렀을 때. 민 직후의 click은 두 번 뒤집지 않도록 흘려보낸다. */
  const handleClick = useCallback(() => {
    if (swiped.current) {
      swiped.current = false
      return
    }

    toggle()
  }, [toggle])

  return (
    <div className={styles.faces} data-back={showBack}>
      <img
        className={styles.face}
        src={front.src}
        alt={front.alt}
        width={front.width}
        height={front.height}
        loading="lazy"
        decoding="async"
      />

      <img
        className={`${styles.face} ${styles.reverse}`}
        src={back.src}
        alt={back.alt}
        width={back.width}
        height={back.height}
        loading="lazy"
        decoding="async"
      />

      <button
        type="button"
        className={styles.flip}
        onClick={handleClick}
        onPointerMove={handleMove}
        onPointerDown={handleDown}
        onPointerUp={handleUp}
        onPointerCancel={handleUp}
      >
        <span className="visually-hidden">{showBack ? '앞면 보기' : '뒷면 보기'}</span>
      </button>
    </div>
  )
}
