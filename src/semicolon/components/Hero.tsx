import { useCallback, useRef, useState, type PointerEvent } from 'react'

import { semicolon } from '../content/site'
import { BASE } from '../router'
import styles from './Hero.module.css'

const { hero } = semicolon

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)

  /*
   * 간격이 열리는 조건은 CSS의 :hover와 :active다. 다만 iOS Safari는 링크나
   * 버튼이 아닌 요소에 :active를 적용하지 않는 경우가 있어, 손가락으로는
   * 아무 일도 일어나지 않을 수 있다. 눌린 상태를 직접 표시해 같은 규칙이
   * 걸리도록 한다 — 보이는 것은 :active와 완전히 같다.
   */
  const [pressed, setPressed] = useState(false)

  const press = useCallback(() => setPressed(true), [])
  const release = useCallback(() => setPressed(false), [])

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const element = heroRef.current
    if (!element) return

    const rect = element.getBoundingClientRect()

    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    element.style.setProperty('--pointer-x', `${x}%`)
    element.style.setProperty('--pointer-y', `${y}%`)

    const dx = (x - 50) / 50
    const dy = (y - 50) / 50

    element.style.setProperty('--drift-x', `${dx * 24}px`)
    element.style.setProperty('--drift-y', `${dy * 18}px`)
    element.style.setProperty('--drift-x-reverse', `${dx * -18}px`)
    element.style.setProperty('--drift-y-reverse', `${dy * -14}px`)
  }

  function handlePointerLeave() {
    setPressed(false)

    const element = heroRef.current
    if (!element) return

    element.style.setProperty('--pointer-x', '50%')
    element.style.setProperty('--pointer-y', '50%')
    element.style.setProperty('--drift-x', '0px')
    element.style.setProperty('--drift-y', '0px')
    element.style.setProperty('--drift-x-reverse', '0px')
    element.style.setProperty('--drift-y-reverse', '0px')
  }

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      data-pressed={pressed}
      onPointerMove={handlePointerMove}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={handlePointerLeave}
    >
      <div className={styles.field} aria-hidden="true">
        <span className={styles.mint} />
        <span className={styles.blush} />
        <span className={styles.light} />
      </div>

      <div className={`shell ${styles.inner}`}>
        <div className={`mono ${styles.kicker}`}>
          <span>{semicolon.name}</span>
          <span>{BASE}</span>
        </div>

        <div className={styles.stage}>
          <h1 className="visually-hidden">{hero.line.join(' ')}</h1>

          <div className={styles.symbol} aria-hidden="true">
            {semicolon.mark}
          </div>

          <div className={styles.interval} aria-hidden="true">
            <span className={styles.intervalLeft} />
            <span className={styles.intervalMark}>{semicolon.mark}</span>
            <span className={styles.intervalRight} />
          </div>
        </div>

        <div className={styles.coordinate} aria-hidden="true">
          <span />
          <span />
        </div>
      </div>
    </section>
  )
}
