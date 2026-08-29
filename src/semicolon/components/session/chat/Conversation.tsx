import { useInView } from '../../../motion/useInView'
import type { DirectMessageTurn } from '../../../content/sessions/commander-at-home.transcript'
import { Interlude } from './Interlude'
import styles from './Conversation.module.css'

type Props = {
  transcript: readonly DirectMessageTurn[]
}

/*
 * 들어온 것으로 치는 비율.
 *
 * 기본값(0.5)을 쓰면 긴 말은 영영 나타나지 않는다. 화면보다 높은 문단은
 * 절반이 보이는 순간이 아예 오지 않기 때문이다. 여기서 물어야 하는 것은
 * «다 보이는가»가 아니라 «닿았는가»여서 기준을 아주 낮게 둔다.
 */
const TOUCHED = 0.04

/**
 * 말 한 마디.
 *
 * 나타나는 방식은 글자를 한 자씩 찍는 쪽이 아니다. 그렇게 하면 읽는 사람이
 * 기계의 속도를 기다리게 되고, 이미 끝난 대화가 지금 일어나는 척을 하게 된다.
 * 여기서 하는 일은 스크롤을 따라 한 덩어리가 조용히 자리를 잡는 것뿐이다.
 */
function Message({ turn }: { turn: DirectMessageTurn }) {
  const { ref, inView } = useInView<HTMLElement>({ amount: TOUCHED })
  const mine = turn.speaker === 'me'

  return (
    <article
      ref={ref}
      className={styles.message}
      data-side={mine ? 'me' : 'tab'}
      data-arrived={inView}
    >
      <p className={`mono ${styles.speaker}`}>{mine ? 'ME' : 'TAB'}</p>

      <div className={styles.bubble}>
        {turn.paragraphs.map((paragraph, index) => (
          // 원고가 고정 상수라 문단의 자리가 곧 정체성이다. 순서가 바뀔 일이
          // 없으므로 인덱스를 키로 쓰는 편이 여기서는 정확하다.
          // oxlint-disable-next-line react/no-array-index-key
          <p key={`${turn.id}-${index}`}>{paragraph}</p>
        ))}
      </div>

      {turn.attachment ? (
        <figure className={styles.attachment}>
          <img
            src={turn.attachment.src}
            alt={turn.attachment.alt}
            width={turn.attachment.width}
            height={turn.attachment.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
      ) : null}
    </article>
  )
}

/**
 * 대화가 한 번 멈추는 자리.
 *
 * 사이에 끼워 넣은 상태 화면은 말이 아니므로 대화의 흐름에서 한 칸 물러나
 * 판면 가운데에 앉는다. 나타나는 방식은 말과 같게 두어, 이것도 스크롤을
 * 따라 도착한 무엇이지 처음부터 켜져 있던 계기판이 아니라는 것을 남긴다.
 */
function Pause({ kind }: { kind: NonNullable<DirectMessageTurn['interlude']> }) {
  const { ref, inView } = useInView<HTMLDivElement>({ amount: TOUCHED })

  return (
    <div ref={ref} className={styles.pause} data-arrived={inView}>
      <Interlude kind={kind} arrived={inView} />
    </div>
  )
}

/**
 * ME와 TAB이 주고받은 것.
 *
 * 이 기록의 본문은 대화를 옮겨 쓴 글이 아니라 대화 자체다. 그래서 문단을
 * 이어 붙인 판면 대신 좌우로 갈라진 판면을 쓴다 — 누가 말했는지가 내용의
 * 일부인 글에서, 말한 사람을 문장 앞의 이름표로만 남기면 그 사실이 조판에서
 * 사라진다.
 *
 * DM의 형태를 빌리되 그 앱의 외양을 옮겨 오지는 않는다. 남기는 것은 좌우와
 * 연속과 첨부뿐이고, 둥근 꼬리·그림자·브랜드 색은 가져오지 않는다. 이 페이지는
 * 메신저의 스크린샷이 아니라 SEMICOLON의 한 편이어야 한다.
 */
export function Conversation({ transcript }: Props) {
  return (
    <section className={styles.thread} aria-label="ME와 TAB이 나눈 대화">
      <ol className={styles.turns}>
        {transcript.map((turn) => (
          <li key={turn.id} className={styles.turn}>
            <Message turn={turn} />
            {turn.interlude ? <Pause kind={turn.interlude} /> : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
