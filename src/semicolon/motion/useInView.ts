import { useEffect, useRef, useState, type RefObject } from 'react'

type Options = {
  /** 이 비율만큼 보이면 들어온 것으로 친다. */
  amount?: number
  /** 한 번 들어오면 그대로 둘지. 되감아 올렸을 때 다시 닫히길 원하면 false. */
  once?: boolean
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
  once = true,
}: Options = {}): InView<T> {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return

        if (entry.isIntersecting) {
          setInView(true)
          // 다시 닫힐 일이 없으면 계속 지켜볼 이유도 없다.
          if (once) observer.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold: amount },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [amount, once])

  return { ref, inView }
}
