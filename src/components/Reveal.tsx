import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string | undefined
  /** 시작 지연(초) */
  delay?: number | undefined
}

/**
 * 뷰포트 진입 시 한 번만 재생되는 리빌.
 *
 * 이동 거리를 10px대로 묶어두는 것이 핵심이다. 거리를 키우면 곧바로 슬라이드쇼처럼
 * 읽히므로, 인상은 불투명도와 타이밍으로 만든다.
 */
export function Reveal({ children, className, delay = 0 }: Props) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
