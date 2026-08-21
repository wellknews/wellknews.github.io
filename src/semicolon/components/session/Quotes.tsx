import styles from './Quotes.module.css'

export type Quote = {
  text: string
  /** 물어본 쪽인지 답한 쪽인지. 자리만 다르게 앉는다. */
  from: 'me' | 'maker'
}

type Props = {
  quotes: readonly Quote[]
}

/**
 * 주고받은 말에서 남은 것.
 *
 * 대화 캡처를 세로로 늘어놓지 않는다. 그렇게 하면 이 페이지가 메신저 백업처럼
 * 보이고, 읽는 사람은 기록이 아니라 남의 대화창을 넘기게 된다.
 *
 * 실제로 기억에 남는 것은 문장 몇 개뿐이다. 그 몇 개만 큰 여백 위에 놓는다.
 * 말풍선도 프로필 사진도 시간도 그리지 않는다 — 누가 물었고 누가 답했는지는
 * 문장이 앉은 자리가 이미 말한다.
 */
export function Quotes({ quotes }: Props) {
  return (
    <div className={styles.quotes}>
      {quotes.map((quote, index) => (
        <p
          key={quote.text}
          className={styles.quote}
          data-from={quote.from}
          style={{ '--order': index } as React.CSSProperties}
        >
          {quote.text}
        </p>
      ))}
    </div>
  )
}
