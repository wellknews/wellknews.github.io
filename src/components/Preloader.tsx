import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import styles from './Preloader.module.css'

type Props = {
  /** 인트로가 끝나 본문 애니메이션을 시작하고 스크롤을 열어도 될 때 호출된다. */
  onFinish: () => void
}

/** 폰트가 아무리 늦어도 이 시간이 지나면 인트로를 끝낸다. */
const MAX_WAIT_MS = 1400
/** 폰트가 즉시 준비돼도 이만큼은 보여준다. 화면이 튀는 것을 막기 위한 최소 노출. */
const MIN_SHOW_MS = 500
const SESSION_KEY = 'wk:intro-played'

/**
 * 진입 인트로.
 *
 * 장식이 아니라 기능이 있다: 헤드라인이 세리프라서 웹폰트가 늦게 오면 대체 글꼴로
 * 한 번 그려졌다가 바뀌는 것이 그대로 보인다. 이 오버레이가 `document.fonts.ready`를
 * 기다렸다가 걷히므로 그 전환이 노출되지 않는다.
 *
 * 같은 세션의 두 번째 방문부터는 재생하지 않고, 모션 최소화 설정에서는 아예 뜨지 않는다.
 *
 * 스크롤 잠금은 반드시 풀린다 — 잠금 해제를 퇴장 애니메이션 완료 콜백에 맡기지 않고
 * `finish()` 안에서 직접 처리하며, 언마운트 정리에서도 한 번 더 지운다.
 * 애니메이션이 어떤 이유로 끝나지 않아도 페이지가 잠긴 채 남지 않게 하기 위한 것이다.
 */
export function Preloader({ onFinish }: Props) {
  const prefersReduced = useReducedMotion()

  /**
   * 이번 방문에서 인트로를 재생할지. 마운트 시점에 한 번만 정하고 이후 바뀌지 않는다.
   * 이 값이 `visible`을 따라 흔들리면 퇴장 애니메이션이 시작되기도 전에
   * 컴포넌트가 사라져 정리 로직이 실행되지 않는다.
   */
  const [shouldPlay] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(SESSION_KEY) === null
  })
  const [visible, setVisible] = useState(shouldPlay)

  const active = shouldPlay && !prefersReduced

  useEffect(() => {
    if (!active) {
      onFinish()
      return
    }

    document.body.dataset['scrollLocked'] = 'true'

    let done = false
    let minTimer = 0

    const finish = () => {
      if (done) return
      done = true
      sessionStorage.setItem(SESSION_KEY, '1')
      // 잠금은 즉시 해제한다 — 퇴장 애니메이션이 실패하거나
      // 부모가 빨리 제거돼도 스크롤이 잠긴 채로 남지 않게 하기 위함.
      delete document.body.dataset['scrollLocked']
      // 트랜지션을 재생하려면 visible을 false로 바꾼 뒤,
      // AnimatePresence의 onExitComplete에서 부모에 알려준다.
      setVisible(false)
      // DO NOT call onFinish() here; that would let 부모 즉시 언마운트하여
      // exit 애니메이션이 실행되지 않을 수 있다.
    }

    const maxTimer = window.setTimeout(finish, MAX_WAIT_MS)
    void document.fonts.ready.then(() => {
      minTimer = window.setTimeout(finish, MIN_SHOW_MS)
    })

    return () => {
      window.clearTimeout(maxTimer)
      window.clearTimeout(minTimer)
      // 어떤 경로로 언마운트되더라도 페이지가 잠긴 채 남지 않게 한다.
      delete document.body.dataset['scrollLocked']
    }
  }, [active, onFinish])

  if (!active) return null

  return (
    <AnimatePresence
      onExitComplete={() => {
        // AnimatePresence가 퇴장 트랜지션을 모두 마친 뒤 부모에 알려준다.
        onFinish()
      }}
    >
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
