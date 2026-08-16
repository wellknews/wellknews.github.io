import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import styles from './Section.module.css'

type Props = {
  id: string
  /** '01' 같은 두 자리 번호 */
  index: string
  /** 'REPORT' 같은 영문 라벨. 섹션 제목 역할을 하므로 h2로 노출한다. */
  label: string
  children: ReactNode
}

/**
 * 섹션 공통 골격. 번호 + 라벨 조합이 세 섹션에서 동일하므로 한 곳에서만 정의한다.
 *
 * 라벨은 장식이 아니라 문서 구조다. 화면에서는 작게 보이지만 h2로 마크업해
 * 스크린리더와 검색엔진이 목차로 쓸 수 있게 한다.
 */
export function Section({ id, index, label, children }: Props) {
  return (
    <section className={styles.section} id={id} aria-labelledby={`${id}-label`}>
      <div className="shell">
        <Reveal>
          <h2 className={styles.index} id={`${id}-label`}>
            <span className={styles.number}>{index}</span>
            <span className={styles.divider} aria-hidden="true" />
            <span>{label}</span>
          </h2>
        </Reveal>

        {children}
      </div>
    </section>
  )
}
