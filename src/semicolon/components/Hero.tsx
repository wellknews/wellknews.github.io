import { semicolon } from '../content/site'
import { BASE } from '../router'
import styles from './Hero.module.css'

const { hero } = semicolon

/**
 * ';' 한 글자와 문장 하나.
 *
 * 모든 것을 화면 중앙에 맞추면 패션 브랜드의 첫 화면이 된다. 그래서 글자는 왼쪽
 * 기둥에, 문장은 그 오른쪽 아래에 붙여 축을 어긋나게 둔다.
 *
 * ';' 뒤로는 같은 글자가 두 겹 어긋나 겹친다. 인쇄가 살짝 밀린 자리에서 나오는
 * 색이고, 이 공간에서 색이 등장하는 유일한 방식이다. 글자 자체는 끝까지 검정이라
 * 색을 빼도 인상이 무너지지 않는다.
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

        <p className={`mono ${styles.foot}`}>
          <span>{hero.subline}</span>
          <span className="rule" aria-hidden="true" />
          <span className={styles.cue} aria-hidden="true">
            ↓
          </span>
        </p>
      </div>
    </section>
  )
}
