import { motion, useReducedMotion, type Variants } from 'motion/react'
import styles from './SplitText.module.css'

type Props = {
  /** 한 줄씩 나눠 담은 텍스트. 줄바꿈 위치를 디자인이 통제하기 위해 배열로 받는다. */
  lines: readonly string[]
  className?: string | undefined
  /** 전체 시퀀스 시작 지연(초) */
  delay?: number | undefined
  /**
   * 재생 시점을 밖에서 통제할 때 쓴다(예: 인트로가 끝난 뒤 히어로 재생).
   * 넘기지 않으면 뷰포트 진입 시 한 번 재생한다.
   */
  play?: boolean | undefined
}

const lineVariants: Variants = {
  hidden: {},
  visible: (delay: number) => ({
    transition: { delayChildren: delay, staggerChildren: 0.026 },
  }),
}

const charVariants: Variants = {
  hidden: { y: '108%' },
  visible: {
    y: '0%',
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
}

/**
 * 글자 단위 마스크 리빌. 각 글자가 overflow:hidden 인 상자 안에서 아래로부터 올라온다.
 * 요소가 화면을 가로질러 이동하는 것이 아니라 글자 높이만큼만 움직이므로,
 * 이동 거리는 짧게 유지하고 리듬은 타이밍(스태거)이 만든다.
 *
 * 접근성: 쪼개진 글자를 스크린리더가 한 자씩 읽지 않도록 aria-hidden 처리하고,
 * 원문은 보이지 않는 텍스트로 한 번만 노출한다.
 */
export function SplitText({ lines, className, delay = 0, play }: Props) {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return (
      <span className={className}>
        {lines.map((line) => (
          <span key={line} className={styles.line}>
            {line}
          </span>
        ))}
      </span>
    )
  }

  const controlled = play !== undefined

  return (
    <span className={className}>
      <span className="visually-hidden">{lines.join(' ')}</span>

      {lines.map((line, lineIndex) => {
        const timing = delay + lineIndex * 0.08

        return (
          <motion.span
            key={line}
            aria-hidden="true"
            className={styles.line}
            variants={lineVariants}
            custom={timing}
            initial="hidden"
            {...(controlled
              ? { animate: play ? 'visible' : 'hidden' }
              : { whileInView: 'visible', viewport: { once: true, margin: '-12%' } })}
          >
            {Array.from(line).map((char, charIndex) => (
              // 원문이 고정 상수라 글자의 위치가 곧 정체성이다. 순서가 바뀔 일이
              // 없으므로 인덱스를 키로 쓰는 편이 여기서는 정확하다.
              // oxlint-disable-next-line react/no-array-index-key
              <span key={`${lineIndex}-${charIndex}`} className={styles.charMask}>
                <motion.span className={styles.char} variants={charVariants}>
                  {char === ' ' ? ' ' : char}
                </motion.span>
              </span>
            ))}
          </motion.span>
        )
      })}
    </span>
  )
}
