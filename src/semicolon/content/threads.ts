/**
 * THREAD — 아직 끝나지 않은 생각.
 *
 * Session과 길이로 나뉘지 않는다. Session은 경험한 것을 분석하고, Thread는
 * 생각하고 있는 것을 이어간다. 그래서 제목이 없어도 되고 사진이 없어도 된다.
 *
 * 낱개 페이지를 만들지 않고 한 화면에 흐름으로 쌓는다. 이어지는 생각을 한 편씩
 * 끊어 두면 이어진다는 성격 자체가 사라지기 때문이다. 각 항목의 id가 앵커가 된다.
 */

export type Thread = {
  /** 앵커에 쓰인다. 한 번 정하면 바꾸지 않는다 — 링크가 끊긴다. */
  id: string
  /** 필요할 때만 붙인다. */
  title?: string
  date?: string
  /** 문단 단위. 한 문장짜리 Thread도 문단 하나로 적는다. */
  body: string[]
  /** 초안. 개발 서버에서만 보인다. */
  draft?: boolean
}

export const threads: Thread[] = [
  {
    id: 'template',
    draft: true,
    date: '2026',
    body: [
      'Thread는 완성되지 않아도 된다. 정리되면 Session이 되고, 정리되지 않으면 그대로 남는다.',
      '이 항목은 형식을 확인하기 위한 초안이며 실제 글이 들어오면 지운다.',
    ],
  },
]

export const listedThreads: Thread[] = threads.filter(
  (thread) => !thread.draft || import.meta.env.DEV,
)
