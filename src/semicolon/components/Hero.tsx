import { semicolon } from '../content/site'
import { BASE } from '../router'
import styles from './Hero.module.css'

const { hero } = semicolon

/**
 * ';' 한 글자와 문장, 그리고 흐름 안에 삽입된 구간 하나.
 *
 * 생성 이미지는 실제 SESSION의 기록이나 증거가 아니라 이 공간의 개념을 재료로
 * 옮긴 편집 오브제다. 글자와 이미지를 분리해 사진 위에 설명을 얹지 않는다.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`shell ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={`mono ${styles.kicker}`}>
            <span>{semicolon.name}</span>
            <span>{BASE}</span>
          </p>

          <div className={styles.statement}>
            {/* 글자가 아니라 그래픽으로 쓰이므로 낭독에서는 건너뛴다. */}
            <p className={styles.mark} aria-hidden="true">
              {semicolon.mark}
            </p>

            <h1 className={styles.line}>
              {hero.line.map((row, line) => (
                <span key={row} className={styles.row}>
                  {/* 줄이 나뉘어 있어도 한 문장으로 낭독되게 한다. */}
                  {line > 0 ? ' ' : null}
                  {row}
                </span>
              ))}
            </h1>
          </div>
        </div>

        <picture className={styles.visual}>
          <source
            media="(max-width: 899px)"
            srcSet="/media/semicolon-interval-mobile.webp"
            width="900"
            height="1125"
          />
          <img
            src="/media/semicolon-interval.webp"
            alt=""
            width="1536"
            height="1024"
            decoding="async"
            fetchPriority="high"
          />
        </picture>
      </div>
    </section>
  )
}
