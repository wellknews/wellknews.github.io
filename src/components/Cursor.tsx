import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import styles from './Cursor.module.css'

const BASE_SIZE = 10
const HOVER_SIZE = 56

/**
 * 커스텀 커서.
 *
 * `mix-blend-mode: difference`로 배경을 반전시키기 때문에 검은 면 위에서는 흰 점,
 * 흰 면(채널 링크 호버)에서는 검은 점이 되어 어디서든 보인다.
 *
 * 마우스 같은 정밀 포인터에서만 켜지고, 모션 최소화 설정이면 렌더하지 않는다.
 */
export function Cursor() {
  const prefersReduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  // 커서를 살짝 늦게 따라오게 해서 무게감을 준다. 감쇠가 크면 '떠다니는' 느낌이 나므로 억제한다.
  const springX = useSpring(x, { stiffness: 700, damping: 45, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 700, damping: 45, mass: 0.4 })

  useEffect(() => {
    if (prefersReduced) return
    const media = window.matchMedia('(pointer: fine)')
    const sync = () => setEnabled(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [prefersReduced])

  useEffect(() => {
    if (!enabled) return

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      const target = event.target
      setHovering(target instanceof Element && target.closest('a, button') !== null)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled, x, y])

  if (!enabled) return null

  const size = hovering ? HOVER_SIZE : BASE_SIZE

  return (
    <motion.div
      className={styles.cursor}
      aria-hidden="true"
      style={{ x: springX, y: springY }}
      animate={{ width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    />
  )
}
