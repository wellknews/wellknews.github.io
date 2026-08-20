import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react'
import { site } from '../content/site'
import { SplitText } from './SplitText'
import styles from './Hero.module.css'

type Props = {
  /** 인트로가 끝났는지. 끝나기 전에는 히어로 시퀀스를 재생하지 않는다. */
  ready: boolean
}

/** 로고는 아주 살짝 축소되며 자리를 잡는다. 이동이 아니라 정착으로 읽히게 폭을 좁게 잡았다. */
const markVariants: Variants = {
  hidden: { opacity: 0, scale: 1.04 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
}

/** 국문 포지셔닝은 헤드라인이 다 올라온 뒤에 조용히 켜진다. 움직이지 않는다. */
const positioningVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: 'linear', delay: 1.15 },
  },
}

export function Hero({ ready }: Props) {
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll()

  // 스크롤을 시작하면 안내가 할 일을 다했으므로 사라진다.
  const cueOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0])
  const state = ready ? 'visible' : 'hidden'

  return (
    <section className={styles.hero} id="top">
      <div className={`shell ${styles.inner}`}>
        <motion.div
          className={styles.mark}
          variants={markVariants}
          initial={prefersReduced ? false : 'hidden'}
          animate={state}
        >
          <img
            src="/logo.svg"
            alt=""
            width={512}
            height={512}
            className={styles.logo}
            fetchPriority="high"
            decoding="async"
          />
          <span className={styles.wordmark}>{site.name}</span>
        </motion.div>

        <div className={styles.bottom}>
          <h1 className={styles.headline}>
            <SplitText lines={site.hero.headline} delay={0.35} play={ready} />
          </h1>

          <motion.p
            className={styles.positioning}
            lang="ko"
            variants={positioningVariants}
            initial={prefersReduced ? false : 'hidden'}
            animate={state}
          >
            {site.hero.positioning}
          </motion.p>

          <motion.span className={styles.cue} style={{ opacity: prefersReduced ? 1 : cueOpacity }}>
            {site.hero.scrollCue}
            <span className={styles.cueLine} aria-hidden="true" />
          </motion.span>
        </div>
      </div>
    </section>
  )
}
