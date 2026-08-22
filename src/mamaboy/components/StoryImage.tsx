import { useRef, useState } from 'react'

import { useGloss } from '../motion/useGloss'
import type { ArticleImage } from '../content/types'
import styles from './StoryImage.module.css'

type Props = {
  image: ArticleImage
  /** 첫 화면의 FEATURE만 즉시 로드한다. 나머지는 전부 지연 로드다(§36). */
  priority?: boolean
  className?: string | undefined
}

/**
 * 외부에서 온 대표 이미지.
 *
 * RSS의 이미지는 언제든 사라진다(§37). 그래서 실패했을 때 회색 placeholder를
 * 넣는 대신 이미지를 통째로 없앤다 — 그 기사는 그 자리에서 타이포그래피 중심
 * 카드로 바뀐다. 잡지의 리듬은 오히려 그렇게 만들어진다.
 *
 * width/height를 미리 적어 두는 이유는 이미지가 늦게 도착해도 지면이 밀리지
 * 않게 하기 위해서다. 값을 모르는 이미지에는 기본 비율을 준다.
 *
 * 기다리는 동안 회색 상자를 깔지 않는다(§43). 자리는 크림 종이 그대로 두고
 * 그 면이 아주 조금 밝아졌다가, 도착하면 이미지가 그 위로 스며든다. 회색
 * skeleton은 «아직 아무것도 없다»고 말하지만, 밝아지는 종이는 «오는 중»이라고
 * 말한다 — 이 지면에서 기다림도 소재의 일부다.
 */
export function StoryImage({ image, priority = false, className }: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  const gloss = useGloss<HTMLDivElement>()

  /*
   * 캐시에서 즉시 그려진 이미지는 onLoad가 오지 않을 수 있다. ref가 붙는
   * 순간 complete를 한 번 확인해 두지 않으면 그런 이미지는 계속 «오는 중»으로
   * 남는다.
   */
  const settle = (element: HTMLImageElement | null) => {
    imageRef.current = element

    if (element?.complete && element.naturalWidth > 0) setLoaded(true)
  }

  if (failed) return null

  return (
    <div
      ref={gloss.ref}
      onPointerMove={gloss.onPointerMove}
      onPointerDown={gloss.onPointerDown}
      onPointerUp={gloss.onPointerUp}
      onPointerLeave={gloss.onPointerLeave}
      className={`gloss ${styles.frame}${className ? ` ${className}` : ''}`}
      data-loaded={loaded}
    >
      <img
        ref={settle}
        className={styles.image}
        src={image.url}
        alt={image.alt ?? ''}
        width={image.width ?? 1600}
        height={image.height ?? 1000}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </div>
  )
}
