import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'

/**
 * 이 공간의 뿌리. 주소창에 그대로 노출되는 문자열이기도 하다.
 *
 * ';'는 URL 경로에서 인코딩이 필요 없는 문자(RFC 3986의 sub-delim)라
 * 브라우저는 이 경로를 그대로 보낸다. 다만 일부 클라이언트가 %3B로 인코딩해
 * 보내는 경우가 있어 경로를 읽을 때 한 번 디코딩한다.
 */
export const BASE = '/;'

export type Route =
  | { kind: 'home' }
  | { kind: 'session-index' }
  | { kind: 'session'; slug: string }
  | { kind: 'thread-index' }
  | { kind: 'thread'; slug: string }
  | { kind: 'code-index' }
  | { kind: 'code'; slug: string }
  | { kind: 'not-found' }

/** pushState는 popstate를 발생시키지 않으므로 직접 알린다. */
const NAVIGATE_EVENT = 'sc:navigate'

function decode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    // 잘못된 퍼센트 인코딩이 섞여 있어도 라우팅은 계속되어야 한다.
    return value
  }
}

/** 지금 주소창에 있는 경로. 잘못된 인코딩이 섞여 있어도 안전하게 읽는다. */
export function currentPath(): string {
  return decode(window.location.pathname)
}

/** 경로 하나를 라우트로 옮긴다. 이 함수 밖에서는 경로 문자열을 해석하지 않는다. */
export function parse(pathname: string): Route {
  const path = decode(pathname).replace(/\/+$/, '')

  if (path !== BASE && !path.startsWith(`${BASE}/`)) {
    return { kind: 'not-found' }
  }

  const segments = path.slice(BASE.length).split('/').filter(Boolean)

  if (segments.length === 0) return { kind: 'home' }
  if (segments.length > 2) return { kind: 'not-found' }

  const [head, slug] = segments

  if (head === 'session') return slug ? { kind: 'session', slug } : { kind: 'session-index' }
  if (head === 'thread') return slug ? { kind: 'thread', slug } : { kind: 'thread-index' }
  if (head === 'code') return slug ? { kind: 'code', slug } : { kind: 'code-index' }

  return { kind: 'not-found' }
}

/** 라우트별 경로. 링크 주소를 문자열로 조립하는 곳은 여기 한 군데뿐이다. */
export const path = {
  home: `${BASE}/`,
  sessionIndex: `${BASE}/session`,
  session: (slug: string) => `${BASE}/session/${slug}`,
  threadIndex: `${BASE}/thread`,
  thread: (slug: string) => `${BASE}/thread/${slug}`,
  codeIndex: `${BASE}/code`,
  code: (slug: string) => `${BASE}/code/${slug}`,
}

/**
 * 라우트 하나를 가리키는 문자열.
 *
 * 같은 화면 안에서는 바뀌지 않고 실제로 페이지가 바뀔 때만 바뀐다. 전환에
 * 맞춰 무언가를 다시 재생시켜야 하는 곳에서 이 값을 key로 쓴다.
 */
export function routeKey(route: Route): string {
  return 'slug' in route ? `${route.kind}/${route.slug}` : route.kind
}

export function navigate(to: string) {
  if (to === window.location.pathname) return

  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))

  // 페이지 전환 효과를 두지 않으므로 스크롤도 즉시 위로 돌린다.
  window.scrollTo(0, 0)
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parse(window.location.pathname))

  useEffect(() => {
    const sync = () => setRoute(parse(window.location.pathname))

    window.addEventListener('popstate', sync)
    window.addEventListener(NAVIGATE_EVENT, sync)

    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener(NAVIGATE_EVENT, sync)
    }
  }, [])

  return route
}

/**
 * 정적 호스팅에서 깊은 경로로 바로 들어온 방문자를 되돌린다.
 *
 * GitHub Pages에는 `/;/session/...`에 해당하는 파일이 없으므로 404.html이 뜨고,
 * 그 페이지가 원래 경로를 `?p=`에 실어 이곳으로 보낸다. 주소창만 되돌려 놓으면
 * 나머지는 평소의 라우팅과 같다.
 */
export function restoreDeepLink() {
  const target = new URLSearchParams(window.location.search).get('p')

  if (!target) return

  // `/%3B/...`로 들어온 주소도 public/404.html이 넘길 수 있다. 경로 부분만
  // 디코딩해야 query/hash 안의 `%26` 같은 값이 구분자로 바뀌지 않는다.
  const suffixAt = target.search(/[?#]/)
  const targetPath = suffixAt === -1 ? target : target.slice(0, suffixAt)
  const suffix = suffixAt === -1 ? '' : target.slice(suffixAt)
  const decodedPath = decode(targetPath)

  // 이 공간 안의 경로만 복원한다. 바깥으로 튀는 값은 홈으로 되돌린다.
  const safe =
    decodedPath.startsWith(`${BASE}/`) || decodedPath === BASE ? decodedPath + suffix : path.home

  window.history.replaceState(null, '', safe)
}

type LinkProps = {
  to: string
  children: ReactNode
  className?: string | undefined
  /** 현재 위치를 가리키는 링크인지. 메뉴에서 쓴다. */
  current?: boolean | 'page' | 'location' | undefined
  'aria-label'?: string | undefined
}

/**
 * 같은 문서 안에서만 움직이는 링크.
 *
 * 새 탭으로 열기, 가운데 클릭, 수식키 조합은 브라우저에 그대로 넘긴다.
 * 주소가 진짜 href로 들어 있어야 그 동작들이 살아 있다.
 */
export function Link({ to, children, className, current, ...rest }: LinkProps) {
  const ariaCurrent = current === true ? 'page' : current

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented) return
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    navigate(to)
  }

  return (
    <a
      href={to}
      className={className}
      onClick={handleClick}
      {...(ariaCurrent ? { 'aria-current': ariaCurrent } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
