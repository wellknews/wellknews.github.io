import type { Axis } from '../content/types'
import styles from './Temperature.module.css'

type Props = {
  /** 지금 지면이 어느 쪽으로 기울어 있는지. 홈은 어느 쪽도 아니다. */
  axis?: Axis | null
}

/**
 * 지면의 색 온도(§21, §39).
 *
 * 핑크와 블루를 넓은 면으로 칠하지 않는다. 판면 뒤에서 거의 인식되지 않을
 * 정도로 깔려 있다가, 카테고리를 옮기면 카드가 날아다니는 대신 이 온도가 바뀐다.
 * SKIN·BODY·AGE로 들어가면 지면이 아주 조금 따뜻해지고, PLAY·CULTURE에서는
 * 아주 조금 차가워진다.
 *
 * 두 색을 겹쳐 두고 불투명도만 바꾸는 이유는 gradient 자체는 전환되지 않기
 * 때문이다. 경계가 보이면 색면이 아니라 도형이 되므로 반경을 화면보다 크게 잡는다.
 */
export function Temperature({ axis = null }: Props) {
  return (
    <div className={styles.field} data-axis={axis ?? 'both'} aria-hidden="true">
      <span className={styles.care} />
      <span className={styles.curiosity} />
    </div>
  )
}
