import { Link, path } from '../router'
import { summary, title } from '../services/present'
import { CategoryTag, ContentTypeTag } from './Tag'
import { SourceLine } from './SourceLine'
import { StoryImage } from './StoryImage'
import type { Article } from '../content/types'
import styles from './Story.module.css'

type Props = {
  article: Article
  /** 첫 화면의 첫 FEATURE에만 준다. 이 이미지 하나만 즉시 로드된다. */
  priority?: boolean
}

/**
 * 기사는 카드가 아니라 조판이다(§19).
 *
 * 세 가지 무게가 같은 틀에 크기만 다르게 들어가면 그것은 결국 카드 목록이다.
 * 그래서 무게마다 조판 자체를 다르게 짠다 — FEATURE는 제목과 이미지가 어긋나게
 * 놓이고, STANDARD는 이미지가 위로 가거나 옆으로 붙고, BRIEF는 번호와 제목만
 * 남는다. 지면의 리듬은 크기가 아니라 이 차이가 만든다.
 */

/**
 * FEATURE.
 *
 * 그날의 지면을 여는 자리다. 제목과 이미지를 같은 선에 맞추지 않는다 — 이미지가
 * 위로 올라가고 제목이 그 아래에서 시작하면서 판면에 어긋남이 생긴다.
 * 요약문이 붙는 유일한 조판이기도 하다.
 */
export function FeatureStory({ article, priority = false }: Props) {
  const heading = title(article)
  const lead = summary(article)

  return (
    <article className={styles.feature}>
      <Link to={path.article(article.slug)} className={`pressable ${styles.featureLink}`}>
        {article.image ? (
          <StoryImage image={article.image} priority={priority} className={styles.featureImage} />
        ) : null}

        <div className={styles.featureText}>
          <p className={styles.tags}>
            <CategoryTag category={article.category} />
            <ContentTypeTag type={article.contentType} />
          </p>

          <h2 className={styles.featureTitle} lang={heading.lang}>
            {heading.text}
          </h2>

          {lead ? (
            <p className={styles.lead} lang={lead.lang}>
              {lead.text}
            </p>
          ) : null}

          <SourceLine article={article} />
        </div>
      </Link>
    </article>
  )
}

type StandardProps = Props & {
  /**
   * 이 기사가 지면을 어떻게 쓰는지.
   *
   *   stacked  이미지가 위, 글이 아래
   *   side     이미지가 왼쪽, 글이 오른쪽
   *
   * 어느 쪽인지는 지면(EditorialFeed)이 정한다. 기사 자신은 모른다 —
   * 같은 기사라도 앞뒤에 무엇이 오느냐에 따라 조판이 달라져야 하기 때문이다.
   */
  composition?: 'stacked' | 'side'
}

export function StandardStory({ article, composition = 'stacked' }: StandardProps) {
  const heading = title(article)

  return (
    <article className={styles.standard} data-composition={composition}>
      <Link to={path.article(article.slug)} className={`pressable ${styles.standardLink}`}>
        {article.image ? (
          <StoryImage image={article.image} className={styles.standardImage} />
        ) : null}

        <div className={styles.standardText}>
          <p className={styles.tags}>
            <CategoryTag category={article.category} />
            <ContentTypeTag type={article.contentType} />
          </p>

          <h2 className={styles.standardTitle} lang={heading.lang}>
            {heading.text}
          </h2>

          <SourceLine article={article} />
        </div>
      </Link>
    </article>
  )
}

type BriefProps = Props & {
  /** 지면에서 몇 번째 BRIEF인지. 활자만 남은 조판에서 이 숫자가 이미지 자리를 대신한다. */
  index?: number
}

/**
 * BRIEF.
 *
 * 이미지 없이 제목만으로 서는 줄. 빈 자리를 placeholder로 채우지 않고, 대신
 * 큰 번호 하나를 놓는다 — 활자와 숫자만으로도 지면이 성립한다는 것이 이 조판의
 * 주장이다(§15, §28).
 */
export function BriefStory({ article, index }: BriefProps) {
  const heading = title(article)

  return (
    <article className={styles.brief}>
      <Link to={path.article(article.slug)} className={`pressable ${styles.briefLink}`}>
        {index === undefined ? null : (
          <span className={styles.briefIndex} aria-hidden="true">
            {`${index}`.padStart(2, '0')}
          </span>
        )}

        <span className={styles.briefBody}>
          <span className={`label ${styles.briefCategory}`}>
            <CategoryTag category={article.category} />
          </span>

          <h2 className={styles.briefTitle} lang={heading.lang}>
            {heading.text}
          </h2>

          <SourceLine article={article} />
        </span>
      </Link>
    </article>
  )
}
