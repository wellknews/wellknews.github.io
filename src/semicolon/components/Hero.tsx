import { semicolon } from '../content/site'
import styles from './Hero.module.css'

/**
 * ';' 한 글자와 문장 하나.
 *
 * 모든 것을 화면 중앙에 맞추면 패션 브랜드의 첫 화면이 된다. 그래서 글자와
 * 문장을 서로 다른 열에 놓아 살짝 어긋나게 둔다. 움직이는 것은 없다 —
 * 이 공간의 속도는 모션이 아니라 비어 있는 면이 만든다.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`shell ${styles.inner}`}>
        {/* 글자가 아니라 그래픽으로 쓰이므로 낭독에서는 건너뛴다. */}
        <p className={styles.mark} aria-hidden="true">
          {semicolon.mark}
        </p>

        <h1 className={styles.line}>
          {semicolon.hero.line.map((row) => (
            <span key={row} className={styles.row}>
              {row}
            </span>
          ))}
        </h1>
      </div>
    </section>
  )
}
