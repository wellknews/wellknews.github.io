import type { ReactNode } from 'react'
import styles from './Prose.module.css'

type Props = {
  children: ReactNode
}

/**
 * 본문의 공통 문법.
 *
 * 콘텐츠마다 구조를 새로 짤 수 있어야 하므로 템플릿을 강제하지 않는다.
 * 대신 이 안에 놓인 p, h3, blockquote, figure가 늘 같은 리듬을 갖게 한다.
 * 콘텐츠는 평범한 JSX로 쓰고, 필요한 구조만 그때그때 만든다.
 *
 * 사진은 본문 폭(--measure)을 벗어나 단 전체를 쓴다. 사진이 분위기 전달용이
 * 아니라 주장의 근거이기 때문에, 글과 같은 폭으로 줄여 걸지 않는다.
 */
export function Prose({ children }: Props) {
  return <div className={styles.prose}>{children}</div>
}
