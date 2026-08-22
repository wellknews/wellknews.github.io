import { useMemo } from 'react'

import { ArticleReader } from '../components/reader/ArticleReader'
import { BriefStory } from '../components/Story'
import { articles, findArticle } from '../content/feed'
import { mamaboy } from '../content/site'
import { Link, path } from '../router'
import { relatedTo } from '../services/related'
import { NotFound } from './NotFound'
import styles from './ArticlePage.module.css'

/**
 * 기사 화면.
 *
 * 아래에 이어 붙이는 세 줄은 같은 카테고리의 최신순이 아니다. 낱말이 겹치는
 * 정도와 축의 관계, 출처의 다양성을 함께 본다(services/related). 스킨케어를 읽고
 * 나온 사람에게 스킨케어를 세 개 더 보여주는 것은 이 매거진이 하려는 일이
 * 아니다 — 몸을 돌보다가 호기심 쪽으로 넘어가는 순간이 브랜드의 한가운데다.
 */
export function ArticlePage({ slug }: { slug: string }) {
  const article = findArticle(slug)

  const next = useMemo(() => (article ? relatedTo(article, articles) : []), [article])

  if (!article) return <NotFound />

  return (
    <div className="page">
      <ArticleReader article={article} />

      {next.length > 0 ? (
        <section className={`shell ${styles.next}`}>
          <h2 className={`label ${styles.nextLabel}`}>{mamaboy.reader.next}</h2>

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
