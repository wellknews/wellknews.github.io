/**
 * 어느 화면을 그릴지는 HTML이 정한다.
 *
 * 클라이언트 라우터를 두지 않는 이유는 두 가지다. 정적 호스팅에서 깊은 링크가
 * 그대로 열려야 하고, 페이지마다 title·description을 따로 써야 하기 때문이다.
 * 그래서 각 진입점 HTML이 #root에 data-route(그리고 필요하면 data-slug)를 적어 둔다.
 */

export type Route =
  | { kind: 'home' }
  | { kind: 'session-index' }
  | { kind: 'session'; slug: string }
  | { kind: 'thread-index' }

export function readRoute(dataset: DOMStringMap): Route {
  const kind = dataset['route'] ?? 'home'

  switch (kind) {
    case 'home':
      return { kind: 'home' }

    case 'session-index':
      return { kind: 'session-index' }

    case 'thread-index':
      return { kind: 'thread-index' }

    case 'session': {
      const slug = dataset['slug']

      if (!slug) {
        throw new Error('data-route="session"에는 data-slug가 함께 필요합니다.')
      }

      return { kind: 'session', slug }
    }

    // 오타를 조용히 홈으로 흘려보내면 잘못된 화면이 배포된다. 바로 드러나게 둔다.
    default:
      throw new Error(`알 수 없는 data-route 값입니다: ${kind}`)
  }
}
