import type { CSSProperties } from 'react'

import styles from './Stairs.module.css'

type Props = {
  /** 한 계단에 한 줄. 문장을 끊은 자리가 곧 계단의 수다. */
  lines: readonly string[]
}

/**
 * 본문도 한 계단씩 내려간다.
 *
 * 줄마다 시작 자리가 조금씩 오른쪽으로 간다. 그림을 그리지 않고 문장을
 * 그 모양으로 앉히는 것뿐이라, 읽는 데는 아무 지장이 없고 계단처럼 보이기만
 * 한다.
 *
 * 너무 정확하게 만들지 않는다. 폭을 크게 벌리면 활자로 만든 계단 일러스트가
 * 되고, 그러면 문장이 아니라 그래픽이 된다. 화면이 좁을수록 한 칸을 낮춘다 —
 * 좁은 판면에서 같은 폭으로 밀면 세 번째 줄이 오른쪽 여백에 닿는다.
 */
export function Stairs({ lines }: Props) {
  return (
    <div className={styles.stairs}>
      {lines.map((line, index) => (
        <p key={line} style={{ '--step': index } as CSSProperties}>
          {line}
        </p>
      ))}
    </div>
  )
}
