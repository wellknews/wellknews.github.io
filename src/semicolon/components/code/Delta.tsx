import type { CSSProperties } from 'react'

import styles from './Delta.module.css'

type Row = {
  /** 무엇을 쟀는가. 지표 이름이 아니라 사람이 하는 일로 적는다. */
  label: string
  before: number
  after: number
  /** 'ms', 'MB', '프레임'처럼 값에 붙는 것. */
  unit: string
  /** 소수 자리. 80.6MB처럼 필요한 값에만 준다. */
  fraction?: number
}

type Props = {
  rows: readonly Row[]
}

/** 1,884 · 80.6 — 자릿점은 넣고 소수 자리는 값이 정한다. */
function format(value: number, fraction: number): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fraction,
    maximumFractionDigits: fraction,
  })
}

/**
 * 전과 후.
 *
 * 막대그래프가 아니다. 축도 눈금도 격자도 없고, 두 줄의 길이만 있다. 위가
 * 재기 전이고 아래가 재고 난 뒤이며, 두 길이의 차이가 이 업데이트다.
 *
 * 여기서 중요한 것은 «몇 퍼센트»가 아니라 «얼마나 줄었는지 눈에 보이는가»다.
 * 그래서 여러 항목을 한 장치 안에 나란히 놓는다. 크게 줄어든 것 옆에 거의
 * 줄지 않은 것을 두면, 어느 쪽이 진짜 성과인지 문장으로 적을 필요가 없다.
 * 과장하지 않는 가장 쉬운 방법은 과장할 수 없는 형태로 그리는 것이다.
 *
 * 퍼센트는 계산해서 적는다. 넘겨받은 숫자와 화면의 숫자가 어긋날 자리를
 * 처음부터 만들지 않기 위해서다.
 *
 * 아래 줄이 위 줄의 길이에서 제 길이로 줄어드는 것이 이 장치의 유일한
 * 움직임이고, 사람이 여기까지 스크롤해서 왔을 때만 일어난다. 스크롤
 * 타임라인이 없거나 움직임을 줄이기로 한 화면에서는 이미 줄어든 채로
 * 서 있는다 — 줄어든 상태가 곧 읽어야 할 상태이기 때문이다.
 */
export function Delta({ rows }: Props) {
  return (
    <ul className={`device ${styles.delta}`} role="list">
      {rows.map((row) => {
        const fraction = row.fraction ?? 0
        const span = Math.max(row.before, row.after)
        const change = Math.round(((row.after - row.before) / row.before) * 100)

        return (
          <li
            key={row.label}
            className={styles.row}
            style={
              {
                '--before': span > 0 ? row.before / span : 0,
                '--after': span > 0 ? row.after / span : 0,
              } as CSSProperties
            }
          >
            <div className={styles.head}>
              <p className={styles.label}>{row.label}</p>

              <p className={`mono ${styles.change}`}>
                {change > 0 ? '+' : '−'}
                {Math.abs(change)}%
              </p>
            </div>

            {/*
              숫자는 고정폭, 단위는 본문 글자.
              '프레임'이나 '회'에 .mono의 자간(0.14em)을 그대로 주면 낱글자가
              흩어진다. 오른쪽 맞춤이라 두 글자체가 섞여도 줄은 맞는다.
            */}
            <p className={`mono ${styles.was}`}>
              {format(row.before, fraction)}
              <span className={styles.unit}>{row.unit}</span>
            </p>
            <span className={`${styles.bar} ${styles.barWas}`} aria-hidden="true" />

            <p className={`mono ${styles.now}`}>
              {format(row.after, fraction)}
              <span className={styles.unit}>{row.unit}</span>
            </p>
            <span className={`${styles.bar} ${styles.barNow}`} aria-hidden="true" />
          </li>
        )
      })}
    </ul>
  )
}
