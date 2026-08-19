import { semicolon } from '../content/site'
import { BASE } from '../router'
import { Stream } from './Stream'
import styles from './Hero.module.css'

const { hero } = semicolon

/**
 * ';' 한 글자와 문장 하나.
 *
 * 모든 것을 화면 중앙에 맞추면 패션 브랜드의 첫 화면이 된다. 그래서 글자는 왼쪽
 * 기둥에, 문장은 그 오른쪽 아래에 붙여 축을 어긋나게 둔다.
 *
 * 아래에 놓인 눈금 줄은 이 공간이 무엇을 말하는지 문장 대신 손으로 알려 준다.
 * 영문 슬로건을 한 줄 적어 두는 것보다 그쪽이 짧고 정확하다.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <span className={styles.wash} aria-hidden="true" />

      <div className={`shell ${styles.inner}`}>
        <p className={`mono ${styles.kicker}`}>
          <span>{semicolon.name}</span>
          <span className="rule" aria-hidden="true" />
          <span>{BASE}</span>
        </p>

        <div className={styles.stage}>
          {/* 글자가 아니라 그래픽으로 쓰이므로 낭독에서는 건너뛴다. */}
          <p className={styles.mark} aria-hidden="true">
            {semicolon.mark}
          </p>

          <h1 className={styles.line}>
            {hero.line.map((row) => (
              <span key={row} className={styles.row}>
                {row}
              </span>
            ))}
          </h1>
        </div>

        <div className={styles.foot}>
          <Stream />

          <span className={`mono ${styles.cue}`} aria-hidden="true">
            ↓
          </span>
        </div>
      </div>
    </section>
  )
}
