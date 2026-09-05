import { Closing } from '../components/Closing'
import { Stat } from '../components/code/Stat'
import { Opening } from '../components/session/Opening'
import { findCode } from '../content/code'
import { useViewport } from '../layout/useViewport'
import { path } from '../router'
import { NotFound } from './NotFound'
import styles from './CodeEntry.module.css'

type Props = {
  slug: string
}

/**
 * 코드 기록 한 편.
 *
 * 세션의 stage 배치를 그대로 쓴다. 한동안 이쪽만 좁은 칼럼으로 두고 «코드의
 * 변경에는 형식이 내용의 일부가 되는 경우가 드물다»고 적어 두었는데, 그
 * 판단이 틀렸다. 이 공간에 있는 여섯 편의 세션이 전부 stage이고 칼럼 배치는
 * 아무도 쓰지 않는다 — 이 사이트의 지면 문법은 사실상 stage 하나다.
 *
 * 그래서 CODE만 칼럼으로 두자 이 게시판은 사이트에서 가장 빽빽한 페이지가
 * 됐다. 글자 하나에 세로 2.7px, 세션은 3.1에서 19.4px 사이. 침묵이 절반인
 * 공간에 침묵이 0인 문서 하나가 끼어 있었던 것이고, 어색함의 원인은 장치의
 * 수도 색도 아니라 그것이었다.
 *
 * 머리는 세션과 같은 Opening이다. 표지 자리에 사진 대신 이번 변경의 크기가
 * 앉는다 — 다가가야 무엇인지 드러나는 것이 한쪽은 사진이고 한쪽은 막대다.
 */
export function CodeEntry({ slug }: Props) {
  const code = findCode(slug)
  const viewport = useViewport()

  if (!code) return <NotFound />

  /* 좁은 화면에 다른 배치가 있으면 그것을 쓴다. 내용은 같고 장면 수만 다르다. */
  const arrangement = viewport === 'compact' && code.compact ? code.compact : code.body

  return (
    <article className={styles.stage}>
      <Opening
        path={path.code(code.slug)}
        title={code.title}
        subtitle={code.subtitle}
        meta={code.meta}
        figure={<Stat repo={code.repo} revision={code.revision} diff={code.diff} variant="cover" />}
      />

      {arrangement}

      <div className="shell">
        <Closing to={path.codeIndex} label={path.codeIndex} />
      </div>
    </article>
  )
}
