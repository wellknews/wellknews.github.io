import { useEffect, useRef, useState, type RefObject } from 'react'

type Options = {
  /** 이 비율만큼 보이면 들어온 것으로 친다. */
  amount?: number
  /**
   * 장면이 화면에서 완전히 벗어났을 때 처음 상태로 되돌릴지.
   *
   * 기본은 되돌리지 않는다. 되돌려야 하는 것은 «사건»으로 만든 장면이다.
   * 999가 1,000이 되는 것처럼 변화 자체가 내용인 장면은, 한 번 지나가고 나면
   * 다시 볼 방법이 없어진다 — 관성 스크롤로 빠르게 지나간 사람은 바뀐 뒤의
   * 숫자만 보고 무슨 일이 일어났는지 모른 채로 남는다. 그런 장면은 되감아
   * 올렸을 때 다시 처음이 되어야 한다.
   */
  replay?: boolean
}

type InView<T> = {
  ref: RefObject<T | null>
  inView: boolean
}

/**
 * 화면에 들어왔는지만 알려 준다.
 *
 * 스크롤을 따라 연속으로 변하는 것(색면이 밀리고, 이미지가 서서히 바뀌는 것)은
 * CSS의 스크롤 타임라인이 맡는다. 여기서 쓰는 것은 상태가 딱 한 번 바뀌는 쪽이다 —
 * 999가 1000이 되고, 마침표가 세미콜론이 되는 것처럼.
 *
 * 연속적인 것은 타임라인, 불연속적인 것은 관찰자. 둘을 섞지 않는다.
 */
export function useInView<T extends HTMLElement>({
  amount = 0.5,
  replay = false,
}: Options = {}): InView<T> {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        if (entry.intersectionRatio >= amount) {
          setInView(true)

          // 다시 열릴 일이 없으면 계속 지켜볼 이유도 없다.
          if (!replay) observer.disconnect()

          return
        }

        /*
         * 되돌리는 것은 장면이 화면에서 완전히 사라졌을 때뿐이다.
         *
         * 들어온 기준(amount)에서 그대로 되돌리면, 경계에 걸쳐 놓고 조금씩
         * 움직이는 동안 999와 1,000이 번갈아 나타난다. 그러면 사건이 아니라
         * 깜빡이는 숫자가 된다. 다시 보려면 장면을 실제로 지나쳤다가 돌아와야 한다.
         */
        if (replay && !entry.isIntersecting) setInView(false)
      },
      /* 0은 «완전히 벗어났다»를 알기 위한 것이고, amount는 «들어왔다»를 알기 위한 것이다. */
      { threshold: [0, amount] },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [amount, replay])

  return { ref, inView }
}
