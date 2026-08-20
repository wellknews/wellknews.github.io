import { motion, useReducedMotion, type Variants } from 'motion/react'
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

/** 배경 이미지는 인트로가 걷힌 뒤 아주 천천히 제자리를 찾는다. */
const artworkVariants: Variants = {
  hidden: { opacity: 0, scale: 1.035 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Hero({ ready }: Props) {
  const prefersReduced = useReducedMotion()

  const state = ready ? 'visible' : 'hidden'
  // 감소 모션 환경에서는 인트로 상태 전환을 기다리지 않고 최종 프레임을 즉시 그린다.
  const animationState = prefersReduced ? 'visible' : state

  return (
    <section className={styles.hero} id="top">
      <motion.div
        className={styles.artwork}
        variants={artworkVariants}
        initial={prefersReduced ? false : 'hidden'}
        animate={animationState}
        aria-hidden="true"
      >
        <picture>
          <source media="(max-width: 639px)" srcSet="/media/hero-newsroom-mobile.webp" />
          <img
            src="/media/hero-newsroom.webp"
            alt=""
            width={1536}
            height={1024}
            className={styles.artworkImage}
            fetchPriority="high"
            decoding="async"
          />
        </picture>
      </motion.div>

      <div className={`shell ${styles.inner}`}>
        <div className={styles.topRail}>
          <motion.div
            className={styles.mark}
            variants={markVariants}
            initial={prefersReduced ? false : 'hidden'}
            animate={animationState}
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

          <motion.p
            className={styles.signal}
            variants={positioningVariants}
            initial={prefersReduced ? false : 'hidden'}
            animate={animationState}
            aria-hidden="true"
          >
            <span className={styles.signalDot} />
            VERIFY&nbsp;&nbsp;·&nbsp;&nbsp;CONTEXT&nbsp;&nbsp;·&nbsp;&nbsp;RECORD
          </motion.p>
        </div>

        <div className={styles.bottom}>
          <h1 className={styles.headline}>
            <SplitText lines={site.hero.headline} delay={0.35} play={ready} />
          </h1>

          <div className={styles.aside}>
            <motion.p
              className={styles.positioning}
              lang="ko"
              variants={positioningVariants}
              initial={prefersReduced ? false : 'hidden'}
              animate={animationState}
            >
              {site.hero.positioning}
            </motion.p>

            <a
              className={styles.cue}
              href="#report"
              aria-label={`${site.hero.scrollCue} — ${site.report.label} 섹션으로 이동`}
            >
              {site.hero.scrollCue}
              <span className={styles.cueLine} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
