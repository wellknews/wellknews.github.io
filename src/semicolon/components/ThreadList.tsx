import type { Thread } from '../content/types'
import { EmptyState } from './EmptyState'
import { ThreadItem } from './ThreadItem'
import styles from './ThreadList.module.css'

const DAY = 24 * 60 * 60 * 1000

/**
 * 두 날짜 사이의 날수. 'YYYY-MM-DD'만 받는다.
 *
 * UTC 자정으로 고정해서 뺀다. 지역 시간으로 파싱하면 서머타임이 걸린 구간에서
 * 하루가 23시간이나 25시간이 되고, 반올림이 하루씩 어긋난다.
 */
function daysBetween(newer: string, older: string): number {
  const gap = (Date.parse(`${newer}T00:00:00Z`) - Date.parse(`${older}T00:00:00Z`)) / DAY

  /* 날짜가 잘못 적혔거나 순서가 뒤집혔으면 0으로 둔다. 목록이 깨지는 것보다 낫다. */
  return Number.isFinite(gap) ? Math.max(0, Math.round(gap)) : 0
}

/**
 * 더 벌어지지 않는 날수.
 *
 * 열흘이 넘으면 «오래 비었다» 하나로 읽히지 열흘인지 석 달인지로는 읽히지
 * 않는다. 여기서 멈추지 않으면 언젠가 한 번 오래 쉰 자리가 목록을 둘로
 * 잘라 놓는다.
 */
const FAR = 10

type Props = {
  threads: readonly Thread[]
  empty: string
}

/**
 * 스레드는 목록에서도 전문이 그대로 보인다.
 *
 * 제목만 걸어두고 클릭을 요구하면 '완성된 글'처럼 보이게 되는데, 이건 이어지는
 * 중인 생각이다. 제목이 없는 글도 있어서 애초에 목록으로 접을 수도 없다.
 *
 * 글 사이의 빈 자리는 그 사이에 흐른 시간이다. 같은 날 쓴 것들은 붙어 있고,
 * 한 주를 쉬었으면 한 주만큼 비어 있다. 날짜는 이미 글마다 적혀 있으니
 * 이 여백은 새로운 정보가 아니라 이미 있는 정보의 다른 모습이다 — 세어서
 * 아는 것과 훑다가 느끼는 것의 차이.
 */
export function ThreadList({ threads, empty }: Props) {
  if (threads.length === 0) {
    return <EmptyState>{empty}</EmptyState>
  }

  return (
    <div className={styles.list}>
      {threads.map((thread, index) => {
        /*
         * 첫 글 위에는 잰 시간이 없다. 0일이 아니라 아예 없는 것이라 주지
         * 않는다 — «0일 지났다»와 «위에 아무 글도 없다»는 다른 말이고,
         * 그 자리를 여는 것은 목록 머리다.
         */
        const above = threads[index - 1]

        return (
          <ThreadItem
            key={thread.slug}
            thread={thread}
            level={2}
            linked
            endmark
            since={above ? Math.min(FAR, daysBetween(above.date, thread.date)) : undefined}
          />
        )
      })}
    </div>
  )
}
