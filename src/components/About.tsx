import { site } from '../content/site'
import { Reveal } from './Reveal'
import { Section } from './Section'
import { SplitText } from './SplitText'
import styles from './About.module.css'

const { about } = site

export function About() {
  return (
    <Section id="about" index={about.index} label={about.label}>
      <div className={styles.intro}>
        <h3 className={styles.lead} lang="ko">
          <SplitText lines={about.lead} />
        </h3>

        <Reveal className={styles.visual} delay={0.12}>
          <figure>
            <img
              src="/media/about-verification.webp"
              alt=""
              width={1122}
              height={1402}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </Reveal>
      </div>

      <dl className={styles.principles}>
        {about.principles.map((principle, index) => (
          <Reveal key={principle.term} className={styles.row} delay={0.1 + index * 0.08}>
            <dt className={styles.term} lang="ko">
              <span className={styles.number} aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{principle.term}</span>
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
