import styles from './EmptyState.module.css'

type Props = {
  children: string
}

/**
 * 아직 아무것도 없는 자리. 큰 빈 상자와 장식만 남기지 않고 현재 상태를 짧게
 * 보여 준다. 없는 콘텐츠를 채우지 않으면서도 미완성 화면처럼 보이지 않게 한다.
 */
export function EmptyState({ children }: Props) {
  return (
    <div className={styles.empty}>
      <p className={styles.message}>{children}</p>

      <span className={styles.mark} aria-hidden="true">
        ;
      </span>
    </div>
  )
}
