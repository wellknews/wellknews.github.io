import { motion, useScroll } from 'motion/react'
import { site } from '../content/site'
import { useHeaderState } from '../hooks/useHeaderState'
import styles from './Header.module.css'

export function Header() {
  const { direction, atTop, pastHero } = useHeaderState()
  const { scrollYProgress } = useScroll()

  const hidden = direction === 'down' && !atTop

  return (
    <motion.header
      className={styles.header}
      data-solid={!atTop}
      animate={{ y: hidden ? '-101%' : '0%' }}
      transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
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
          <img src="/logo.png" alt="" width={512} height={512} className={styles.brandLogo} />
        </a>

        <nav className={styles.nav} aria-label="주요 메뉴">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
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
