import { useMemo } from 'react'

import { ArticleReader } from '../components/reader/ArticleReader'
import { BriefStory } from '../components/Story'
import { articles, findArticle } from '../content/feed'
import { axisOf, mamaboy } from '../content/site'
import { Link, path } from '../router'
import { scoreOf } from '../services/editorial'
import { NotFound } from './NotFound'
import styles from './ArticlePage.module.css'

/**
 * 기사 화면.
 *
 * 아래에 이어 붙이는 세 줄은 «관련 기사»가 아니라 반대쪽 축에서 골라 온 것이다.
 * 스킨케어를 읽고 나온 사람에게 스킨케어를 세 개 더 보여주는 것은 이 매거진이
 * 하려는 일이 아니다 — 몸을 돌보다가 호기심 쪽으로 넘어가는 순간이 이 브랜드의
 * 한가운데이기 때문이다(§9).
 */
export function ArticlePage({ slug }: { slug: string }) {
  const article = findArticle(slug)

  const next = useMemo(() => {
    if (!article) return []

    const axis = axisOf(article.category)

    return articles
      .filter((candidate) => candidate.id !== article.id && axisOf(candidate.category) !== axis)
      .sort((a, b) => scoreOf(b) - scoreOf(a))
      .slice(0, 3)
  }, [article])

  if (!article) return <NotFound />

  return (
    <div className="page">
      <ArticleReader article={article} />

      {next.length > 0 ? (
        <section className={`shell ${styles.next}`}>
          <h2 className={`label ${styles.nextLabel}`}>
            {mamaboy.axes[axisOf(article.category) === 'care' ? 'curiosity' : 'care'].label}
          </h2>

          <ul className={styles.nextList} role="list">
            {next.map((candidate) => (
              <li key={candidate.id}>
                <BriefStory article={candidate} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className={`shell ${styles.back}`}>
        <Link to={path.home} className={`label ${styles.backLink}`}>
          <span aria-hidden="true">←</span> {mamaboy.name}
        </Link>
      </div>
    </div>
  )
}
