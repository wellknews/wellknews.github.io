import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'

import { categoryOrder } from './content/site'
import type { Category } from './content/types'

/** 이 공간의 뿌리(§43). SEMICOLON과 같은 «독립 프로젝트» 원칙을 따른다. */
export const BASE = '/mamaboy'

export type Route =
  | { kind: 'home' }
  | { kind: 'category'; category: Category }
  | { kind: 'article'; slug: string }
  | { kind: 'sources' }
  | { kind: 'not-found' }

/** pushState는 popstate를 발생시키지 않으므로 직접 알린다. */
const NAVIGATE_EVENT = 'mb:navigate'

function decode(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    // 잘못된 퍼센트 인코딩이 섞여 있어도 라우팅은 계속되어야 한다.
    return value
  }
}

function isCategory(value: string): value is Category {
  return (categoryOrder as readonly string[]).includes(value)
}

/** 경로 하나를 라우트로 옮긴다. 이 함수 밖에서는 경로 문자열을 해석하지 않는다. */
export function parse(pathname: string): Route {
  const path = decode(pathname).replace(/\/+$/, '')

  if (path !== BASE && !path.startsWith(`${BASE}/`)) {
    return { kind: 'not-found' }
  }

  const segments = path.slice(BASE.length).split('/').filter(Boolean)

  if (segments.length === 0) return { kind: 'home' }

  const [head, tail] = segments

  if (segments.length === 1 && head) {
    if (isCategory(head)) return { kind: 'category', category: head }
    if (head === 'sources') return { kind: 'sources' }
  }

  if (segments.length === 2 && head === 'article' && tail) {
    return { kind: 'article', slug: tail }
  }

  return { kind: 'not-found' }
}

/** 라우트별 경로. 링크 주소를 문자열로 조립하는 곳은 여기 한 군데뿐이다. */
export const path = {
  home: `${BASE}/`,
  category: (category: Category) => `${BASE}/${category}`,
  article: (slug: string) => `${BASE}/article/${slug}`,
  sources: `${BASE}/sources`,
}

/**
 * 라우트 하나를 가리키는 문자열.
 *
 * 화면이 실제로 바뀔 때만 값이 바뀐다. 전환에 맞춰 다시 그려야 하는 곳에서
 * 이 값을 key로 쓴다.
 */
export function routeKey(route: Route): string {
  if (route.kind === 'category') return `category/${route.category}`
  if (route.kind === 'article') return `article/${route.slug}`

  return route.kind
}

export function navigate(to: string) {
  if (to === window.location.pathname) return

  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
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
 * 정적 호스팅에서 깊은 주소로 바로 들어온 방문자를 되돌린다.
 *
 * GitHub Pages에는 `/mamaboy/article/...`에 해당하는 파일이 없어 404.html이 뜨고,
 * 그 페이지가 원래 경로를 `?p=`에 실어 이곳으로 보낸다. 주소창만 되돌려 놓으면
 * 나머지는 평소의 라우팅과 같다.
 */
export function restoreDeepLink() {
  const target = new URLSearchParams(window.location.search).get('p')

  if (!target) return

  // 경로 부분만 디코딩해야 query/hash 안의 `%26` 같은 값이 구분자로 바뀌지 않는다.
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
  current?: boolean | 'page' | 'location' | undefined
  onNavigate?: (() => void) | undefined
  'aria-label'?: string | undefined
}

/**
 * 같은 문서 안에서만 움직이는 링크.
 *
 * 새 탭으로 열기, 가운데 클릭, 수식키 조합은 브라우저에 그대로 넘긴다.
 * 주소가 진짜 href로 들어 있어야 그 동작들이 살아 있다.
 */
export function Link({ to, children, className, current, onNavigate, ...rest }: LinkProps) {
  const ariaCurrent = current === true ? 'page' : current

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented) return
    if (event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    event.preventDefault()
    onNavigate?.()
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
