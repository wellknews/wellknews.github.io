import type { Material } from '../content/types'
import styles from './Ambient.module.css'

type Props = {
  /** 지금 지면이 어느 소재 쪽으로 기울어 있는지. 홈은 어느 쪽도 아니다. */
  material?: Material | null
}

/**
 * 판면의 공기.
 *
 * 카테고리마다 다른 색을 주지 않는다(§12). 팔레트는 하나이고, 달라지는 것은
 * 소재의 강도뿐이다 — SKIN에서는 종이가 맑아지고(transparency), PLAY에서는
 * 젤이 번지고(gel), AGE에서는 차가운 빛이 한 번 스친다(chrome).
 *
 * 사용자가 의식적으로 «색이 바뀌었다»고 알아차릴 정도로 벌리지 않는다.
 * 알아차리게 되는 순간 이것은 공기가 아니라 배경 그래픽이 된다.
 *
 * 깊이로는 Level 0이다. 그림자도 경계도 없고, 판면 뒤에 깔려 있기만 하다.
 */
export function Ambient({ material = null }: Props) {
  return (
    <div className={styles.field} data-material={material ?? 'mixed'} aria-hidden="true">
      <span className={styles.gel} />
      <span className={styles.clean} />
      <span className={styles.chrome} />
    </div>
  )
}
