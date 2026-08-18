import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './Fade.module.css'

type Props = {
  children: ReactNode
  className?: string | undefined
  /** 시작 지연(ms). 목록에서 항목을 아주 조금씩 어긋나게 할 때만 쓴다. */
  delay?: number | undefined
}

/**
 * 화면에 들어올 때 한 번만 재생되는 페이드.
 *
 * 이 사이트의 유일한 스크롤 모션이다. 이동 거리를 8px로 묶어 둔 것은 여유를
 * 표현하려고 화면을 계속 움직이지 않기 위해서다 — 정지한 화면과 여백이 속도를 만든다.
 */
export function Fade({ children, className, delay }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const element = ref.current

    if (!element || shown) return

    // 모션을 끈 사용자와 IntersectionObserver가 없는 환경에서는 그냥 보여준다.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [shown])

  return (
    <div
      ref={ref}
      className={className ? `${styles.fade} ${className}` : styles.fade}
      data-shown={shown}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
