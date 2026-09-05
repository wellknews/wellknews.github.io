import { notOnTheList } from './code/not-on-the-list'
import type { Code } from './types'

/**
 * CODE 목록.
 *
 * SESSION과 같은 방식이다 — CMS도 에디터도 없고, 파일 하나가 기록 하나다.
 * 다만 이유는 조금 다르다. 세션은 «형식이 매번 달라야 해서» 손으로 짜지만,
 * 코드 기록은 «머리가 매번 같아야 해서» 손으로 짠다. 어디에서 어디까지
 * 갔는지는 지어낼 수 없는 값이라, 넘겨받은 숫자를 그대로 옮겨 적는 일이
 * 자동화보다 정확하다.
 *
 * 새 기록을 쓰려면 code/_template.tsx를 복사해 파일을 만들고 여기 맨 앞에 넣는다.
 * 순서는 최신 순으로 직접 정렬한다.
 */
export const codes: readonly Code[] = [notOnTheList]

export function findCode(slug: string): Code | undefined {
  return codes.find((code) => code.slug === slug)
}
