import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import styles from './Preloader.module.css'

type Props = {
  /** 인트로가 끝나 본문 애니메이션을 시작해도 될 때 호출된다. */
  onFinish: () => void
}

/** 폰트가 아무리 늦어도 이 시간이 지나면 인트로를 끝낸다. */
const MAX_WAIT_MS = 1400
const SESSION_KEY = 'wk:intro-played'

/**
 * 진입 인트로.
 *
 * 장식이 아니라 기능이 있다: 헤드라인이 세리프라서 웹폰트가 늦게 오면 대체 글꼴로
 * 한 번 그려졌다가 바뀌는 것이 그대로 보인다. 이 오버레이가 `document.fonts.ready`를
 * 기다렸다가 걷히므로 그 전환이 노출되지 않는다.
 *
 * 같은 세션에서 두 번째 방문부터는 재생하지 않고, 모션 최소화 설정에서는 아예 뜨지 않는다.
 */
export function Preloader({ onFinish }: Props) {
  const prefersReduced = useReducedMotion()
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(SESSION_KEY) === null
  })

  const skip = prefersReduced || !visible

  useEffect(() => {
    if (skip) {
      onFinish()
      return
    }

    document.body.dataset['scrollLocked'] = 'true'

    let done = false
    const finish = () => {
      if (done) return
      done = true
      sessionStorage.setItem(SESSION_KEY, '1')
      setVisible(false)
    }

    const timer = window.setTimeout(finish, MAX_WAIT_MS)
    void document.fonts.ready.then(() => {
      // 폰트가 일찍 준비돼도 최소 노출 시간은 지켜 화면이 튀지 않게 한다.
      window.setTimeout(finish, 600)
    })

    return () => window.clearTimeout(timer)
  }, [skip, onFinish])

  const unlockAndFinish = () => {
    delete document.body.dataset['scrollLocked']
    onFinish()
  }

  if (skip) return null

  return (
    <AnimatePresence onExitComplete={unlockAndFinish}>
      {visible && (
        <motion.div
          className={styles.overlay}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* 진행을 나타내는 선 하나. 로고나 문구를 얹으면 히어로와 중복된다. */}
          <motion.span
            className={styles.line}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: MAX_WAIT_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
