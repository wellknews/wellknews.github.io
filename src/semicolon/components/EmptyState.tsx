import styles from './EmptyState.module.css'

type Props = {
  children: string
}

/**
 * 아직 아무것도 없는 자리.
 *
 * 한 줄만 덩그러니 놓으면 '만들다 만 화면'으로 읽힌다. 목록이 놓일 자리만큼
 * 높이를 잡아 두고, 여백 칼럼에는 이 공간의 글자를 아주 옅게 앉힌다.
 * 비어 있다는 사실 자체를 판면으로 만들어 두는 것이다.
 */
export function EmptyState({ children }: Props) {
  return (
    <div className={styles.empty}>
      <span className={styles.mark} aria-hidden="true">
        ;
      </span>

      <p className={styles.text}>{children}</p>
    </div>
  )
}
