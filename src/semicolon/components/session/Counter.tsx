import { useInView } from '../../motion/useInView'
import styles from './Counter.module.css'

/**
 * 999가 1,000이 되는 순간.
 *
 * 축하하지 않는다. 폭죽도 색종이도 큰 숫자도 없다. 작은 숫자 하나가 조용히
 * 바뀌고, 그때 배경의 색이 한 번 아주 미세하게 퍼졌다가 다시 멈춘다.
 *
 * 이 기록에서 1,000은 주인공이 아니라 계기다. 여기서 크게 축하해 버리면
 * 이 SESSION은 «1,000명 달성 기념글»이 되고, 정작 하려던 이야기 — 화면
 * 안에 있던 것이 처음 물건이 된 일 — 이 그 뒤로 밀린다.
 *
 * 낭독에는 바뀐 뒤의 숫자만 남긴다. 999는 그 숫자가 방금까지 무엇이었는지
 * 보여 주는 그림이지 읽어야 할 정보가 아니다.
 */
export function Counter() {
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.6 })

  return (
    <div className={styles.counter} ref={ref} data-reached={inView}>
      <p className={styles.figure}>
        <span className={styles.before} aria-hidden="true">
          999
        </span>
        <span className={styles.after}>1,000</span>
      </p>

      {/* 숫자가 바뀐 자리에서 한 번 퍼지고 멈춘다. 반복하지 않는다. */}
      <span className={styles.pulse} aria-hidden="true" />
    </div>
  )
}
