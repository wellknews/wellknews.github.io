import { useGloss } from '../motion/useGloss'
import styles from './GelObject.module.css'

type Shape = 'sphere' | 'capsule' | 'blob'

type Props = {
  shape?: Shape
  /** 판면에서 차지하는 폭. 지면의 리듬을 만드는 크기이지 장식의 크기가 아니다. */
  size?: 'sm' | 'md' | 'lg'
  className?: string | undefined
}

/**
 * 주황 젤 오브젝트(§9, §21).
 *
 * 이 지면에서 유일하게 «물건»인 것. 모든 형태는 구에서 파생된다 —
 * 원 → 눌린 원 → 캡슐 → 블롭. 그래서 여러 크기와 형태가 섞여도 한 브랜드로 보인다.
 *
 * 3D 모델을 불러오지 않는다. 구의 입체감은 빛이 만들고, 빛은 그라디언트 세 겹이면
 * 충분하다 — 위쪽의 하이라이트, 아래쪽으로 도는 노란 반사, 그리고 안쪽 그림자.
 * 파일을 내려받지 않으므로 첫 화면이 무거워지지 않는다.
 *
 * 지면의 정보가 아니라 물성이므로 낭독에서는 제외한다. 대신 만질 수는 있어야
 * 해서, 포인터를 올리면 표면의 하이라이트가 따라 움직인다.
 */
export function GelObject({ shape = 'sphere', size = 'md', className }: Props) {
  const gloss = useGloss<HTMLDivElement>()

  return (
    <div
      ref={gloss.ref}
      onPointerMove={gloss.onPointerMove}
      onPointerLeave={gloss.onPointerLeave}
      className={`${styles.object}${className ? ` ${className}` : ''}`}
      data-shape={shape}
      data-size={size}
      aria-hidden="true"
    />
  )
}
