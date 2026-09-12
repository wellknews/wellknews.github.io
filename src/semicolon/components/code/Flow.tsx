import styles from './Flow.module.css'

type Step = {
  /** 이 자리에서 무슨 일이 일어나는가. 부품 이름이 아니라 일어나는 일로 적는다. */
  at: string
  /** 한 줄 설명. 앱을 쓰는 사람이 아는 말로 적는다. */
  note: string
  /** 이번 변경이 손댄 자리인가. 한 흐름에 하나나 둘까지가 읽힌다. */
  mark?: boolean
}

type Props = {
  steps: readonly Step[]
  /** 표시된 칸 위에 붙는 한 낱말. 기본은 «바뀐 자리». */
  markLabel?: string
}

/**
 * 무엇이 어디를 거쳐 오는가.
 *
 * 이 게시판의 다른 장치는 전부 잰 값을 그린다. 이것만 «순서»를 그린다.
 *
 * 필요해진 이유가 있다. 읽는 쪽에서 «앱만 알고 내부는 모르는 사람이 읽으면
 * 무슨 말인지 모르겠다»는 말이 나왔는데, 그런 자리의 대부분이 «어디에서
 * 어디로 가는 중간에 무엇이 끼어들었는가»를 문장으로만 적은 대목이었다.
 * 기사가 화면에 서기까지 네 자리를 거친다는 사실은 한 줄로 그리면 끝나는데,
 * 문장으로 쓰면 네 문단이 되고 그 네 문단은 순서를 담지 못한다.
 *
 * 바뀐 자리를 하나만 표시한다. 둘 이상을 칠하면 «이번에 무엇을 건드렸는가»가
 * 아니라 «이 흐름이 몇 단계인가»를 보여 주는 그림이 되고, 그것은 이 게시판이
 * 할 일이 아니다.
 *
 * 화살표 글리프를 쓰지 않는 이유는 module.css에 적어 두었다.
 */
export function Flow({ steps, markLabel = '바뀐 자리' }: Props) {
  return (
    <ol className={styles.flow}>
      {steps.map((step, index) => (
        <li key={step.at} className={`${styles.step} ${step.mark ? styles.mark : ''}`}>
          {/*
            차례 숫자에만 고정폭을 준다. 한글에 .mono의 자간(0.14em)을 그대로
            주면 낱글자가 흩어져 «바 뀐 자 리»로 읽힌다. Delta가 단위 낱말에서
            같은 함정을 먼저 밟았고 거기 적어 둔 것을 여기서도 따른다.
          */}
          {step.mark ? (
            <span className={styles.markNote}>{markLabel}</span>
          ) : (
            <span className={`mono ${styles.order}`}>{String(index + 1).padStart(2, '0')}</span>
          )}
          <p className={styles.at}>{step.at}</p>
          <p className={styles.note}>{step.note}</p>
        </li>
      ))}
    </ol>
  )
}
