import { useState, type CSSProperties } from 'react'

import styles from './Prompt.module.css'

type Ask = {
  /** 물음 */
  ask: string
  /** 그 물음의 유일한 답 */
  answer: string
}

type Props = {
  /** 위에 쌓인 것부터. */
  asks: readonly Ask[]
  /** 물음들 뒤에 처음부터 있던 자리. */
  behind: string
}

/**
 * 답이 하나뿐인 물음.
 *
 * 마지막 세 커밋은 성능을 고친 것이 아니라 이것을 지운 것이다. 무엇을 할지
 * 이미 정해져 있는데도 한 번 더 묻던 창들. 그 창을 지우면 무슨 일이
 * 일어나는지는 문장으로 적기 어렵다 — 아무 일도 일어나지 않기 때문이다.
 * 아무 일도 일어나지 않는다는 것을 보여 주려면 실제로 눌러 보게 하는 수밖에 없다.
 *
 * 그래서 여기 진짜 창이 쌓여 있다. 뒤에는 가려던 자리가 처음부터 그대로 있고,
 * 창을 하나 지울 때마다 그 자리는 조금도 변하지 않는다. 세 번을 눌러 전부
 * 치우고 나면 남는 것은 처음부터 거기 있던 것뿐이다.
 *
 * 다시 나타나지 않는다. 되돌리는 버튼도, 지웠다는 알림도 두지 않는다.
 * 지운 뒤에 아무 표시도 남지 않는 것이 이 일의 정확한 결과다.
 *
 * 누르지 않은 사람도 잃는 것이 없다. 창이 쌓여 있는 모습과 뒤에 이미
 * 도착지가 있다는 사실은 손을 대기 전에도 그대로 보인다.
 */
export function Prompt({ asks, behind }: Props) {
  const [cleared, setCleared] = useState(0)

  const left = asks.slice(cleared)

  return (
    <div className={`device ${styles.prompt}`}>
      <div className={styles.stage} data-cleared={cleared >= asks.length}>
        {/* 물음 뒤에 처음부터 있던 자리. 창을 지워도 여기는 달라지지 않는다. */}
        <div className={styles.behind}>
          <p className={styles.place}>{behind}</p>
        </div>

        <div className={styles.pile}>
          {left.map((item, index) => (
            <div
              key={item.ask}
              className={styles.dialog}
              /* 뒤로 갈수록 조금씩 물러나 앉는다. 몇 장이 남았는지가 이것으로 보인다. */
              style={{ '--depth': index } as CSSProperties}
              data-top={index === 0}
              /* 맨 위의 창만 만질 수 있다. 뒤의 창은 아직 제 차례가 아니다. */
              {...(index === 0 ? {} : { inert: true })}
            >
              <p className={styles.ask}>{item.ask}</p>

              {/*
                답이 하나뿐이므로 버튼도 하나뿐이다. 취소도, 닫기도, 나중에도 없다.
                고를 것이 없는 물음이 물음일 수 있는지가 이 창의 질문이다.
              */}
              <button
                type="button"
                className={styles.answer}
                onClick={() => setCleared((n) => Math.min(n + 1, asks.length))}
              >
                {item.answer}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
