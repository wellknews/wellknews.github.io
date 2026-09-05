import { semicolon } from '../content/site'
import { Link, path, routeKey, type Route } from '../router'
import styles from './Header.module.css'

type Props = {
  route: Route
}

/**
 * 왼쪽에 ';' 하나, 오른쪽에 세 개의 개념.
 *
 * 지금 있는 자리의 경로는 여기 적지 않는다. 각 페이지가 자기 머리에서 이미
 * 같은 주소를 크게 적고 있어서, 헤더에까지 두면 한 화면에 같은 문자열이
 * 두 번 나온다.
 *
 * 왼쪽의 ';'는 로고가 아니라 이 공간의 기본 인터랙션 단위다. 여기서는 페이지가
 * 바뀔 때마다 한 번 다시 찍혀, 방금 다른 자리로 넘어왔다는 사실을 문장 없이 남긴다.
 *
 * ABOUT이나 ARCHIVE 같은 메뉴는 만들지 않는다. 필요해지기 전에 만든 메뉴는
 * 콘텐츠가 아니라 구조를 설명하게 되고, 이 공간은 설명으로 이해시키지 않는다.
 * 복수형(SESSIONS)을 쓰지 않는 것도 같은 이유다 — 게시판 이름이 아니라
 * 이 공간이 무엇을 다루는지에 대한 선언이다.
 *
 * 순서는 홈과 같다 — 끝이 있는 것 둘을 먼저, 끝나지 않은 것을 마지막에.
 * 헤더에서만 다른 차례로 적으면 두 화면이 서로 다른 사이트 구조를 말하게 된다.
 */
export function Header({ route }: Props) {
  /** 목록에 있으면 'page', 그 아래의 글 한 편에 있으면 'location'. */
  const at = (index: Route['kind'], entry: Route['kind']) =>
    route.kind === index ? 'page' : route.kind === entry ? 'location' : undefined

  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <Link
          to={path.home}
          className={styles.mark}
          aria-label={`${semicolon.name} 홈`}
          current={route.kind === 'home'}
        >
          {/*
            key가 바뀔 때마다 React가 이 span을 새로 붙이고, 그때 잉크가 한 번
            다시 앉는다. 전환을 알리는 별도의 장치를 두지 않는 이유는 기호가
            이미 그 일을 할 수 있기 때문이다.
          */}
          <span key={routeKey(route)} className={styles.ink}>
            {semicolon.mark}
          </span>
        </Link>

        <nav className={styles.nav} aria-label="주요 메뉴">
          <Link
            to={path.sessionIndex}
            className={`mono ${styles.link}`}
            current={at('session-index', 'session')}
          >
            {semicolon.session.label}
          </Link>

          <Link
            to={path.codeIndex}
            className={`mono ${styles.link}`}
            current={at('code-index', 'code')}
          >
            {semicolon.code.label}
          </Link>

          <Link
            to={path.threadIndex}
            className={`mono ${styles.link}`}
            current={at('thread-index', 'thread')}
          >
            {semicolon.thread.label}
          </Link>
        </nav>
      </div>
    </header>
  )
}
