import type { CSSProperties } from 'react'

import styles from './Gate.module.css'

type Passed = {
  /** 검사의 이름. 실제로 돌린 명령을 그대로 적는다. */
  name: string
  /** 그 검사가 세어 준 것. 없으면 비운다. */
  note?: string
}

type Props = {
  passed: readonly Passed[]
  /** 관문이 없는 자리의 이름. */
  absent: string
  /** 그 자리에서 실제로 무너진 것들. */
  fell: readonly string[]
}

/**
 * 통과한 관문들, 그리고 관문이 없는 자리.
 *
 * 검사 목록을 ✓로 채운 표가 아니다. 그런 표는 «전부 통과했다»만 말하는데,
 * 이 장치가 말해야 하는 것은 그 반대다 — 전부 통과했는데도 무너졌다는 것,
 * 그리고 무너진 자리에는 애초에 관문이 없었다는 것.
 *
 * 그래서 통과한 줄에는 끝까지 닿는 선을 긋고, 마지막 줄에는 선을 긋지 않는다.
 * 시작하다 만 선과 그 뒤의 점들 — 이 공간에서 «아직 닫히지 않았다»는 뜻으로
 * 이미 쓰고 있는 모양이다(THREAD의 기호). 여기서는 그것이 «여기를 검사하는
 * 것은 아무것도 없다»는 뜻이 된다.
 *
 * 선은 위에서부터 차례로 그어진다. 마지막 줄에서 선이 끊기는 것을 보려면
 * 그 앞의 선들이 끝까지 가는 것을 먼저 봐야 하기 때문이다. 움직임을 줄이기로
 * 한 화면에서는 처음부터 다 그어진 채로 서 있는다.
 */
export function Gate({ passed, absent, fell }: Props) {
  return (
    <div className={styles.gate}>
      <ul className={styles.checks} role="list">
        {passed.map((check, index) => (
          <li
            key={check.name}
            className={styles.pass}
            style={{ '--order': index } as CSSProperties}
          >
            <p className={`mono ${styles.name}`}>{check.name}</p>
            <span className={styles.rule} aria-hidden="true" />
            {check.note ? <p className={styles.note}>{check.note}</p> : null}
          </li>
        ))}

        {/*
          관문이 없는 자리.

          이름만 있고 그 옆은 비어 있다. 짧은 선도 점도 그리지 않는다 —
          없는 것을 그리는 순간 그것은 «없음»이라는 이름의 무언가가 되고,
          여기서 말해야 하는 것은 정말로 아무것도 없다는 쪽이다. 위의 세 줄이
          끝까지 가는 선을 갖고 있어서, 이 줄의 빈 자리는 그 자체로 읽힌다.
        */}
        <li className={styles.miss}>
          <p className={`${styles.name} ${styles.thing}`}>{absent}</p>
        </li>
      </ul>

      {/* 관문이 없는 자리에서 실제로 무너진 것. 검사의 바깥이므로 목록 밖에 앉는다. */}
      <div className={styles.fell}>
        <ul role="list">
          {fell.map((what) => (
            <li key={what}>{what}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
