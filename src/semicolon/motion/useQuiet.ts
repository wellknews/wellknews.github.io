import { useEffect } from 'react'

/**
 * 지금 색을 빼 두라고 요청한 구간의 수.
 *
 * 두 구간이 겹쳐 있어도 마지막 하나가 끝나야 색이 돌아온다. 하나가 끝날 때마다
 * 지워 버리면, 겹친 구간에서 색이 깜빡인다.
 */
let holders = 0

/**
 * 이 구간을 읽는 동안 판면 뒤의 색을 뺀다.
 *
 * 감정을 표현하려고 애니메이션을 더하지 않는다. 반대로 뺀다. 앞 구간 내내
 * 움직이던 색면이 여기서 조용해지고, 그 정적 자체가 대비가 된다. 문장으로
 * «여기서부터 개인적인 이야기입니다»라고 적는 것보다 이쪽이 정확하다.
 *
 * 색면은 화면에 고정된 전역 층이므로 문서 루트에 표시를 남긴다. 이 구간을
 * 벗어나면 색은 천천히 제자리로 돌아온다.
 */
export function useQuiet(active: boolean) {
  useEffect(() => {
    if (!active) return

    holders += 1
    document.documentElement.dataset.quiet = 'true'

    return () => {
      holders = Math.max(0, holders - 1)

      if (holders === 0) delete document.documentElement.dataset.quiet
    }
  }, [active])
}
