import { semicolon } from '../content/site'
import { BASE } from '../router'
import { Rift } from './Rift'
import styles from './Hero.module.css'

/**
 * 거의 빈 화면.
 *
 * 여기에 필요한 것은 세 가지뿐이다 — 이름, ';', 그리고 사람이 손을 댈 자리.
 * 슬로건도, 정물 사진도, 이 공간을 소개하는 문장도 두지 않는다. 화면에 큰
 * 글자를 세우지 않는 것 자체가 이 공간이 말하는 방식이다.
 *
 * 문장을 지우는 것과 없애는 것은 다르다. 이 공간이 무엇인지는 숨은 제목으로
 * 한 번 남아 낭독과 검색에 그대로 전해진다. 화면에서만 비운다.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`shell ${styles.inner}`}>
        {/* 선 없이 양끝의 정보만 남긴다. 두 항목의 거리 자체가 한 행을 만든다. */}
        <p className={`mono ${styles.kicker}`}>
          <span>{semicolon.name}</span>
          <span>{BASE}</span>
        </p>

        <h1 className="visually-hidden">
          {semicolon.name} — {semicolon.hero.statement}
        </h1>

        <div className={styles.stage}>
          <Rift />
        </div>

        {/* 아래에 더 있다는 표시. 거의 빈 화면에서는 이것이 유일한 안내다. */}
        <p className={`mono ${styles.cue}`} aria-hidden="true">
          ↓
        </p>
      </div>
    </section>
  )
}
