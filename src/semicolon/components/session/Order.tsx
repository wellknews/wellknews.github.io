import styles from './Order.module.css'

type Props = {
  /** 'BOWL' — 무엇을 시켰는지. */
  head: string
  /** 그 안에 들어간 것. 고른 순서 그대로. */
  items: readonly string[]
}

/**
 * 주문 내역.
 *
 * 메뉴판이 아니다. 값도 수량도 적지 않고 사진도 붙이지 않는다. 여기 있는 것은
 * 그날 카운터에서 하나씩 짚은 순서 그대로의 목록이고, 그 목록이 짧다는 사실이
 * 이 장면의 내용이다 — 과카몰리도 음료도 없다.
 *
 * 한 줄에 하나씩 쌓는다. 쉼표로 이어 붙이면 문장이 되고, 문장이 되면 그것은
 * 무엇을 먹었는지에 대한 설명이 된다. 여기서 필요한 것은 설명이 아니라 항목이다.
 */
export function Order({ head, items }: Props) {
  return (
    <div className={styles.order}>
      <p className={`mono ${styles.head}`}>{head}</p>

      <ul className={`mono ${styles.items}`} role="list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
