import { useState } from 'react'

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
 */
export function StoryImage({ image, priority = false, className }: Props) {
  const [failed, setFailed] = useState(false)
  const gloss = useGloss<HTMLDivElement>()

  if (failed) return null

  return (
    <div
      ref={gloss.ref}
      onPointerMove={gloss.onPointerMove}
      onPointerLeave={gloss.onPointerLeave}
      className={`gloss ${styles.frame}${className ? ` ${className}` : ''}`}
    >
      <img
        className={styles.image}
        src={image.url}
        alt={image.alt ?? ''}
        width={image.width ?? 1600}
        height={image.height ?? 1000}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
