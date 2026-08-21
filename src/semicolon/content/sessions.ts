import { wellknews1k } from './sessions/wellknews-1k'
import type { Session } from './types'

/**
 * SESSION 목록.
 *
 * CMS도 에디터도 두지 않는다. 임시방편이 아니라 지금 이 공간의 성격에 맞는 방식이다.
 * 어떤 세션은 사진이 중심이고 어떤 세션은 문장이 중심이라, 하나의 템플릿에
 * 억지로 맞추는 순간 분석하려던 것을 잃는다.
 *
 * 새 세션을 쓰려면 sessions/_template.tsx를 복사해 파일을 만들고 여기에 추가한다.
 * 순서는 최신 순으로 직접 정렬한다 — 자동 정렬 규칙을 만들 만큼 많지 않다.
 */
export const sessions: readonly Session[] = [wellknews1k]

export function findSession(slug: string): Session | undefined {
  return sessions.find((session) => session.slug === slug)
}
