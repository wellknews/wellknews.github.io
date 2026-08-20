import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll } from 'motion/react'
import { site } from '../content/site'
import { useHeaderState } from '../hooks/useHeaderState'
import styles from './Header.module.css'

/**
 * 뷰포트 상단보다 조금 아래의 읽기 기준선에 걸린 섹션을 현재 위치로 본다.
 * 헤더가 고정돼 있어 실제 화면 맨 위를 기준으로 삼으면 활성 상태가 너무 빨리 바뀐다.
 */
function useActiveNavHref(): string | null {
  const [activeHref, setActiveHref] = useState<string | null>(null)

  useEffect(() => {
    const sections = site.nav.flatMap((item) => {
      const section = document.querySelector<HTMLElement>(item.href)
      return section ? [{ href: item.href, section }] : []
    })

    let frame = 0

    const read = () => {
      frame = 0
      const readingLine = Math.min(window.innerHeight * 0.35, 320)
      const current = sections.find(({ section }) => {
        const rect = section.getBoundingClientRect()
        return rect.top <= readingLine && rect.bottom > readingLine
      })

      setActiveHref((previous) => (previous === current?.href ? previous : (current?.href ?? null)))
    }

    const scheduleRead = () => {
      if (frame) return
      frame = window.requestAnimationFrame(read)
    }

    window.addEventListener('scroll', scheduleRead, { passive: true })
    window.addEventListener('resize', scheduleRead, { passive: true })
    read()

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleRead)
      window.removeEventListener('resize', scheduleRead)
    }
  }, [])

  return activeHref
}

export function Header() {
  const { direction, atTop, pastHero } = useHeaderState()
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const activeHref = useActiveNavHref()

  const hidden = !prefersReduced && direction === 'down' && !atTop

  return (
    <motion.header
      className={styles.header}
      data-solid={!atTop}
      animate={{ y: hidden ? '-101%' : '0%' }}
      transition={
        prefersReduced ? { duration: 0 } : { duration: 0.55, ease: [0.65, 0, 0.35, 1] as const }
      }
    >
      <div className={`shell ${styles.inner}`}>
        {/*
          히어로에 큰 로고가 떠 있는 동안에는 숨긴다. 같은 로고를 한 화면에 두 번
          보여주지 않기 위한 것이고, 스크롤로 히어로를 지나면 그 자리를 이어받는다.
        */}
        <a
          href="#top"
          className={styles.brand}
          data-visible={pastHero}
          aria-label={`${site.name} 맨 위로`}
          aria-hidden={!pastHero}
          tabIndex={pastHero ? 0 : -1}
        >
          <img src="/logo.svg" alt="" width={512} height={512} className={styles.brandLogo} />
        </a>

        <nav className={styles.nav} aria-label="주요 메뉴">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.navLink}
              aria-current={activeHref === item.href ? 'location' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      {/*
        헤더 하단 경계선이 곧 읽은 분량 표시다. 진행 바를 따로 얹지 않으려고
        원래 있어야 할 선 하나에 두 가지 역할을 겹쳐 놓았다.
      */}
      <motion.span
        className={styles.progress}
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
    </motion.header>
  )
}
