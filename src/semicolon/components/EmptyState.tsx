import styles from './EmptyState.module.css'

type Props = {
  children: string
}

/**
 * 아직 아무것도 없는 자리.
 *
 * 목록이 놓일 자리만큼 높이를 잡아 두고 이 공간의 글자를 아주 옅게 앉힌다.
 * 비어 있다는 사실 자체를 판면으로 만들어 두는 것이다 — 아무것도 없는 자리에
 * '아무것도 없다'고 적으면 글자가 하나 더 늘 뿐이다.
 */
export function EmptyState({ children }: Props) {
  return (
    <div className={styles.empty}>
      <span className={styles.mark} aria-hidden="true">
        ;
      </span>

      {/* 화면에는 옅은 글자 하나만 남는다. 아무것도 없다는 사실에 문장까지 붙일 이유가 없다. */}
      <p className="visually-hidden">{children}</p>
    </div>
  )
}
