import type { ReactNode } from 'react'
import { Foot } from './Foot'
import { Nav, type NavKey } from './Nav'
import styles from './Page.module.css'

type Props = {
  current: NavKey
  path: string
  children: ReactNode
}

/** 모든 화면이 공유하는 골격. 내비게이션, 본문, 돌아가는 길. */
export function Page({ current, path, children }: Props) {
  return (
    <>
      <a className="sc-skip-link" href="#main">
        본문으로 건너뛰기
      </a>

      <Nav current={current} path={path} />

      <main id="main" className={styles.main} tabIndex={-1}>
        {children}
      </main>

      <Foot />
    </>
  )
}
