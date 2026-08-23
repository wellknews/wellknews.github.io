import { useState, type CSSProperties } from 'react'

import styles from './Breakdown.module.css'

/**
 * 이름이 떨어진 뒤에도 더 나눌 수 있는 횟수.
 *
 * 무한히 열어 두지 않는다. 어딘가에서는 더 나눌 수 없게 되는 것이 이 습관의
 * 진짜 모습이고, 눌러도 아무 일이 없어지는 그 지점이 이 장치가 말하려는
 * 마지막이다.
 */
const FLOOR = 4

type Props = {
  /** 큰 것에서 작은 것으로. 마지막이 손에 집히는 크기다. */
  steps: readonly string[]
}

/**
 * 충분히 작아질 때까지 나누는 일.
 *
 * 나무를 그리지 않는다. 갈라지는 화살표도, 상자도, 노드도 없다. 단계마다
 * 선이 절반으로 짧아지고 글자가 한 단계 작아진다. 그 줄어듦 자체가 나누는
 * 일이고, 여기서 필요한 설명은 그것뿐이다.
 *
 * 폭발하거나 튀지 않는다. 조용히 선이 생기고 공간이 나뉘는 정도다 —
 * 나누는 일이 격렬하게 보이면 이 글이 말하려는 습관과 어긋난다.
 *
 * 더 나눌 수 있다.
 *
 * 제일 아래의 짧은 선은 눌린다. 누르면 그보다 더 짧은 선이 하나 생긴다.
 * 이름은 더 이상 붙지 않는다 — 그쯤 되면 부를 이름이 없어서다. 몇 번을
 * 더 눌러도 결국 더 나눌 수 없는 자리에 닿고, 거기서 이 장치는 멈춘다.
 *
 * 그 «한 번 더»가 이 글의 뒷면이다. 강점이 강박이 되는 자리가 정확히
 * 거기이고, 읽는 사람이 직접 눌러 보는 편이 문장으로 적는 것보다 정확하다.
 *
 * 기본은 이름이 붙은 단계까지 다 나뉜 상태다. 움직임을 줄이기로 한 사람도,
 * 한 번도 누르지 않은 사람도 몇 단계로 내려가는지 그대로 읽는다.
 */
export function Breakdown({ steps }: Props) {
  const [further, setFurther] = useState(0)

  const atFloor = further >= FLOOR

  return (
    <div className={styles.breakdown}>
      <ol className={styles.stack} role="list">
        {steps.map((step, index) => (
          <li key={step} style={{ '--order': index, '--half': 2 ** index } as CSSProperties}>
            <span className={`mono ${styles.name}`}>{step}</span>
            <span className={styles.rule} aria-hidden="true" />
          </li>
        ))}

        {/* 이름이 떨어진 다음의 단계들. 선만 남는다. */}
        {Array.from({ length: further }, (_, extra) => (
          <li
            key={`further-${extra}`}
            data-unnamed="true"
            style={
              {
                '--order': steps.length + extra,
                '--half': 2 ** (steps.length + extra),
              } as CSSProperties
            }
          >
            <span className={styles.rule} aria-hidden="true" />
          </li>
        ))}
      </ol>

      {/*
        더 나누는 자리.
        이름을 붙이지 않는다. 제일 짧은 선 하나가 그대로 누를 수 있는 자리다.
      */}
      <button
        type="button"
        className={styles.further}
        /* 다음에 나뉠 선. 누를 때마다 이것도 절반이 된다. */
        style={{ '--half': 2 ** (steps.length + further) } as CSSProperties}
        onClick={() => setFurther((n) => Math.min(n + 1, FLOOR))}
        disabled={atFloor}
        aria-label={atFloor ? '더 나눌 수 없다' : '한 번 더 나눈다'}
      >
        <span className={styles.rule} aria-hidden="true" />
      </button>
    </div>
  )
}
