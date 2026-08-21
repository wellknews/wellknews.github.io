import { site } from '../content/site'
import { useMagnetic } from '../hooks/useMagnetic'
import { ArrowUpRight } from './Arrow'
import { Reveal } from './Reveal'
import { Section } from './Section'
import { SplitText } from './SplitText'
import styles from './Report.module.css'

const { report } = site

type Props = {
  /** 제보 링크가 향할 곳. 접수 창구가 정해지기 전까지는 비워둘 수 있다. */
  href: string | null
}

export function Report({ href }: Props) {
  const magneticRef = useMagnetic<HTMLSpanElement>({ strength: 0.22 })

  return (
    <Section id="report" index={report.index} label={report.label}>
      <div className={styles.intro}>
        <h3 className={styles.heading} lang="ko">
          <SplitText lines={report.heading} />
        </h3>

        <Reveal className={styles.meta} delay={0.12}>
          <p className={styles.body} lang="ko">
            {report.body}
          </p>
        </Reveal>
      </div>

      <div className={styles.feature}>
        <Reveal className={styles.visual} delay={0.16}>
          <figure>
            <img
              src="/media/report-evidence.webp"
              alt=""
              width={1600}
              height={700}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </Reveal>

        <Reveal className={styles.rail} delay={0.22}>
          <div>
            <p className={styles.railIndex} aria-hidden="true">
              INTAKE / 01—04
            </p>

            {/* 무엇을 보낼 수 있는지 — 본문이 말하지 않는 정보만 담는다. */}
            <ul className={styles.types} role="list" aria-label="제보 가능한 자료">
              {report.types.map((type, index) => (
                <li key={type} className={styles.type}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                  {type}
                </li>
              ))}
            </ul>
          </div>

          {href === null ? (
            <p className={styles.pending} lang="ko">
              제보 창구 준비 중
            </p>
          ) : (
            <a
              className={styles.cta}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={report.cta + ' (새 창)'}
            >
              <span className={styles.ctaLabel} lang="ko">
                {report.cta}
              </span>
              <span className={styles.ctaArrow} ref={magneticRef}>
                <ArrowUpRight />
              </span>
            </a>
          )}
        </Reveal>
      </div>
    </Section>
  )
}
