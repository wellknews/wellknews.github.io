import { site } from '../content/site'
import { Reveal } from './Reveal'
import { Section } from './Section'
import { SplitText } from './SplitText'
import styles from './About.module.css'

const { about } = site

export function About() {
  return (
    <Section id="about" index={about.index} label={about.label}>
      {/*
        브랜드명과 슬로건은 히어로에서 이미 한 번 나왔다. 여기서는 반복하지 않고
        편집 기준 자체를 본문으로 삼는다 — 뉴스 브랜드에서 신뢰를 만드는 것은
        이름을 한 번 더 보여주는 일이 아니라 무엇을 어떻게 다루는지 밝히는 일이다.
      */}
      <h3 className={styles.lead} lang="ko">
        <SplitText lines={about.lead} />
      </h3>

      <dl className={styles.principles}>
        {about.principles.map((principle, index) => (
          <Reveal key={principle.term} className={styles.row} delay={0.1 + index * 0.08}>
            <dt className={styles.term} lang="ko">
              {principle.term}
            </dt>
            <dd className={styles.description} lang="ko">
              {principle.description}
            </dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
