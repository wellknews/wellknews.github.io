import { Link, path } from '../router'
import { summary, title } from '../services/present'
import { CategoryTag, ContentTypeTag } from './Tag'
import { SourceLine } from './SourceLine'
import { StoryImage } from './StoryImage'
import type { Article } from '../content/types'
import styles from './Story.module.css'

type Props = {
  article: Article
  /** 첫 화면의 첫 FEATURE에만 준다. 이 이미지 하나만 즉시 로드된다(§36). */
  priority?: boolean
}

/**
 * FEATURE(§17).
 *
 * 그날의 지면을 여는 자리다. 브랜드 소개 영역을 크게 만들지 않는 대신
 * 이 기사가 Hero 역할을 한다(§26). 요약문이 붙는 유일한 카드이기도 하다 —
 * 모든 카드에 요약을 붙이면 사용자가 지면의 구조를 읽지 못한다(§27).
 */
export function FeatureStory({ article, priority = false }: Props) {
  const heading = title(article)
  const lead = summary(article)

  return (
    <article className={styles.feature}>
      <Link to={path.article(article.slug)} className={styles.link}>
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

/**
 * STANDARD.
 *
 * 지면의 대부분을 차지하는 일반 기사. 이미지가 있으면 이미지가 먼저 오고,
 * 없으면 제목이 그 자리를 그대로 가져간다. 빈 자리를 placeholder로 메우지
 * 않는 이유는 §37에 적어 두었다.
 */
export function StandardStory({ article }: Props) {
  const heading = title(article)

  return (
    <article className={styles.standard}>
      <Link to={path.article(article.slug)} className={styles.link}>
        {article.image ? (
          <StoryImage image={article.image} className={styles.standardImage} />
        ) : null}

        <p className={styles.tags}>
          <CategoryTag category={article.category} />
          <ContentTypeTag type={article.contentType} />
        </p>

        <h2 className={styles.standardTitle} lang={heading.lang}>
          {heading.text}
        </h2>

        <SourceLine article={article} />
      </Link>
    </article>
  )
}

/**
 * BRIEF.
 *
 * 이미지 없이 제목만으로 서는 줄. 모든 콘텐츠를 카드화하지 않기 위해 필요한
 * 형태다(§17). 텍스트만 있는 기사와 이미지 중심 기사가 섞여야 지면에 리듬이 생긴다.
 */
export function BriefStory({ article }: Props) {
  const heading = title(article)

  return (
    <article className={styles.brief}>
      <Link to={path.article(article.slug)} className={styles.link}>
        <p className={styles.tags}>
          <CategoryTag category={article.category} />
        </p>

        <h2 className={styles.briefTitle} lang={heading.lang}>
          {heading.text}
        </h2>

        <SourceLine article={article} />
      </Link>
    </article>
  )
}
