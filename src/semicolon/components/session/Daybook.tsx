import type { CSSProperties } from 'react'

import styles from './Daybook.module.css'

/** 아침에 적어 둔 한 줄. 시각과 그때 있기로 한 자리. */
export type Stop = readonly [at: string, where: string]

type Props = {
  stops: readonly Stop[]
}

/**
 * 하루가 시작되기 전의 표.
 *
 * 이 표의 요점은 «정확함»이다. 줄 간격이 전부 같고, 시각이 전부 같은 자리에서
 * 시작하고, 목적지가 전부 같은 자리에 선다. 잘 만들어진 여행 일정표가 실제로
 * 그렇게 생겼고, 그날 아침에 이 하루는 그 모양이었다.
 *
 * 뒤에 오는 모든 어긋남이 어긋남으로 읽히려면 기준이 먼저 있어야 한다. 이
 * 표가 그 기준이다 — 이후의 지면에서 간격이 벌어지거나 좁아지는 것은 전부
 * 이 표의 간격과 비교되는 값이지, 그 자체로 읽히는 값이 아니다.
 *
 * 지나가면 목적지가 물러난다.
 *
 * 표를 지우지 않는다. 사라지는 것이 아니라 시각만 남는다 — 그 하루에 실제로
 * 남은 것이 그것이기 때문이다. 어디에 가기로 했는지는 계획이고, 몇 시였는지는
 * 사실이다. 이 아래로 내려가면 그 시각들만 판면의 여백을 따라 따라온다(Trace).
 *
 * 스크롤 타임라인이 없거나 움직임을 줄이기로 한 화면에서는 표가 그대로 서
 * 있는다. 물러나는 것은 연출이고 표는 정보다.
 */
export function Daybook({ stops }: Props) {
  return (
    <ol className={styles.daybook} role="list">
      {stops.map(([at, where], index) => (
        <li key={at} style={{ '--step': index } as CSSProperties}>
          <span className={`mono ${styles.at}`}>{at}</span>
          <span className={`mono ${styles.where}`}>{where}</span>
        </li>
      ))}
    </ol>
  )
}
