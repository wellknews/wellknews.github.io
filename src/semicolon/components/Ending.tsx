import { semicolon } from '../content/site'
import { useInView } from '../motion/useInView'
import styles from './Ending.module.css'

/**
 * 기록이 끝나는 자리.
 *
 * 이 공간에서 글의 끝을 말하는 기호는 이것 하나다. 한동안 세션의 본문이
 * 각자 이 장면을 놓고, 그와 별개로 페이지의 매듭이 작은 ';'를 하나 더
 * 찍고 있었다 — 다섯 편의 세션이 세미콜론 두 개로 끝난 채 배포되어 있었다.
 * 마감 기호를 그리는 자리를 매듭 한 곳(Closing)으로 모으고, 본문에서는
 * 걷어냈다. 콘텐츠가 스스로 끝을 선언할 수 없으면 두 개가 될 수도 없다.
 *
 * 처음에는 아래쪽 획만 보인다. 문장이 여기서 끝났다는 표시처럼 읽힌다.
 * 조금 더 내리면 위쪽 점이 자리에 들어서면서 그 표시가 ';'가 된다.
 *
 * 끝났지만 끝난 것이 아니라는 말을 문장으로 적지 않는다. 마지막 기호가
 * 그 말을 대신한다. «THE END»도 «다음 글»도 두지 않는 이유가 그것이다.
 *
 * 한 글자를 잘라서 쓴다. 마침표와 세미콜론 두 글자를 겹쳐 바꾸면 두 글자의
 * 아래 획이 서로 어긋나 뭉개진다. 같은 글자의 위쪽만 가렸다 여는 편이
 * 훨씬 깨끗하고, 실제로 일어나는 일도 그쪽에 가깝다.
 */
export function Ending() {
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.8, replay: true })

  return (
    <div className={styles.ending} ref={ref} data-open={inView}>
      <span className={styles.mark} aria-hidden="true">
        {semicolon.mark}
      </span>
    </div>
  )
}
