import type { ReactNode } from 'react'

import { useVisit, type VisitState } from './PlanStage'
import styles from './Cue.module.css'

/** 자리 옆에 붙는 말. 계획표 안의 말보다 길다 — 여기에는 폭이 있다. */
const SAID: Record<Exclude<VisitState, 'planned'>, string> = {
  visited: 'VISITED',
  closed: 'CLOSED',
  passed: 'PASSED',
  skipped: 'SKIPPED',
  'turned-back': 'TURNED BACK',
  short: 'SHORT VISIT',
}

type Props = {
  /** 계획표의 어느 줄인지. 그날 즉흥으로 정한 자리는 비운다. */
  item?: string
  state: Exclude<VisitState, 'planned'>
  /** 'MONDAY' — 결과보다 먼저 도착하는 이유. */
  reason?: string
  /** 'COFFEE ALREADY TAKEN' — 결과 뒤에 붙는 조건. */
  because?: string
  /**
   * 결과가 도착하는 속도.
   *
   *   sequential  자리를 읽고, 이유를 읽고, 결과를 읽는다. 처음 한 번.
   *   quick       읽을 시간만 주고 바로 붙는다. 두 번째.
   *   foretold    이유가 자리보다 먼저 온다. 세 번째.
   *
   * 같은 «CLOSED»가 세 번 나오는데 세 번 다 같은 속도로 오면 그것은 반복이
   * 아니라 형식이 된다. 실제로 그날 세 번째 휴무를 만났을 때는 간판을 읽기도
   * 전에 결과를 알고 있었고, 그 차이가 이 세 값의 전부다.
   */
  pace?: 'sequential' | 'quick' | 'foretold'
  /**
   * 처음에는 다른 말이 서 있었던 자리.
   *
   * 더커피는 «가는 곳»으로 화면에 섰다가 «안 간 곳»이 된다. 글자를 갈아
   * 끼우지 않고 두 말을 같은 자리에 겹쳐 둔 다음 앞의 것을 물린다 — 바뀐 것이
   * 아니라 앞의 판단이 아직 거기 있는 채로 덮인 것이기 때문이다.
   */
  from?: string
  /** 이 자리의 Place. */
  children: ReactNode
}

/**
 * 한 자리에서 실제로 일어난 일.
 *
 * 결과를 화면 가운데에 크게 세우지 않는다. 주소 옆에 붙여서 메타데이터의
 * 한 조각으로 읽히게 한다. «CLOSED»가 판면을 덮으면 그 하루의 사건이 되지만,
 * 실제로 그것은 간판에 붙은 종이 한 장이었다.
 *
 * 여기서 하는 일이 하나 더 있다. 이 자리를 지날 때 위쪽의 계획표에 같은
 * 사실이 적힌다. 두 층이 따로 노는 것이 아니라 아래에서 일어난 일이 위에
 * 쌓이는 것이 이 기록의 형식이다.
 */
export function Cue({ item, state, reason, because, pace = 'sequential', from, children }: Props) {
  const ref = useVisit<HTMLDivElement>(item, state)

  return (
    <div className={styles.cue} ref={ref} data-state={state} data-pace={pace}>
      {/* 세 번째 휴무에서만, 이유가 이름보다 먼저 도착한다. */}
      {pace === 'foretold' && reason ? (
        <p className={`mono ${styles.reason}`} data-ahead="true">
          {reason}
        </p>
      ) : null}

      <div className={styles.stop}>{children}</div>

      <div className={styles.said}>
        {pace !== 'foretold' && reason ? <p className={`mono ${styles.reason}`}>{reason}</p> : null}

        <p className={`mono ${styles.state}`} data-swap={from !== undefined}>
          {from ? (
            <span className={styles.before} aria-hidden="true">
              {from}
            </span>
          ) : null}

          <span className={styles.after}>{SAID[state]}</span>
        </p>

        {because ? <p className={`mono ${styles.because}`}>{because}</p> : null}
      </div>
    </div>
  )
}
