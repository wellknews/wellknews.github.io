import { useState } from 'react'
import type { DirectMessageTurn } from '../../../content/sessions/commander-at-home.transcript'
import styles from './ExportPanel.module.css'

type Props = {
  transcript: readonly DirectMessageTurn[]
}

type State = 'idle' | 'rendering' | 'done' | 'failed'

/**
 * 이 대화를 인스타그램에 올릴 수 있는 형태로 내려받는 자리.
 *
 * 마지막 말에 TAB이 대답하지 않는 이유가 여기 있다. «다운로드 버튼을 만들면
 * 재미있지 않겠냐»는 물음에 말로 답하면 그건 그냥 대화의 한 줄이 되고, 실제로
 * 눌러서 파일이 떨어지면 그것이 답이 된다. 그래서 이 자리는 말풍선이 아니라
 * 기능이다.
 *
 * 상태를 알리기 위해 따로 창을 띄우지 않는다. 스무 장 가까이 굽는 동안 무슨
 * 일이 일어나는지 말해야 하는 것은 버튼 자신이고, 그 이상은 필요 없다.
 */
export function ExportPanel({ transcript }: Props) {
  const [state, setState] = useState<State>('idle')
  const [made, setMade] = useState(0)
  const [total, setTotal] = useState(0)

  async function run() {
    if (state === 'rendering') return

    setState('rendering')
    setMade(0)
    setTotal(0)

    try {
      /*
       * 굽는 코드는 누를 때 받는다. 이 페이지를 읽기만 하는 사람이 캔버스와
       * ZIP을 먼저 내려받을 이유가 없다.
       */
      const { exportConversation } = await import('./exportConversation')

      await exportConversation(transcript, (current, count) => {
        setMade(current)
        setTotal(count)
      })

      setState('done')
    } catch {
      /*
       * 굽기가 실패해도 글은 그대로 읽힌다. 여기서 하는 일은 다시 눌러 볼 수
       * 있다고 알리는 것뿐이다.
       */
      setState('failed')
    }
  }

  const label = {
    idle: '1:1로 저장',
    rendering: `RENDERING ${String(made).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    done: '다시 저장',
    failed: '다시 시도',
  }[state]

  const note = {
    idle: 'PNG · 1080 × 1080 · ZIP',
    rendering: '카드를 굽는 중',
    done: 'DOWNLOADED',
    failed: '저장하지 못했다. 다시 눌러 본다',
  }[state]

  return (
    <section className={styles.panel} aria-labelledby="export-heading">
      <p className={`mono ${styles.kicker}`}>EXPORT</p>
      <h2 id="export-heading" className={styles.heading}>
        THIS CONVERSATION
      </h2>

      <button
        type="button"
        className={`mono ${styles.button}`}
        onClick={() => void run()}
        disabled={state === 'rendering'}
      >
        {label}
      </button>

      {/* 진행과 결과는 낭독에도 그대로 전해져야 한다. */}
      <p className={`mono ${styles.note}`} aria-live="polite" data-state={state}>
        {note}
      </p>
    </section>
  )
}
