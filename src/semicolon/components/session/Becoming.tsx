import type { Cover } from '../../content/types'
import styles from './Becoming.module.css'

type Props = {
  /** 화면 안에 있던 것 */
  from: Cover
  /** 손에 들어온 것 */
  to: Cover
}

/**
 * 이미지가 물건이 되는 구간. 이 SESSION의 핵심이다.
 *
 * 시안과 실물을 나란히 놓고 «이렇게 나왔습니다»라고 하지 않는다. 두 장을 같은
 * 자리에 겹쳐 두고, 스크롤한 만큼 한쪽이 다른 쪽이 되게 한다. 읽는 사람이
 * 직접 굴려서 변화시키는 것이 이 기록의 내용 그 자체이기 때문이다.
 *
 * 단순한 crossfade로 두지 않는다. 앞의 이미지는 흐려지면서 물러나고, 뒤의
 * 사진은 초점이 맞으면서 도착한다. 렌더링이 사진으로 바뀌는 것이 아니라
 * 화면 안의 것이 손에 잡히는 것으로 보여야 한다.
 *
 * 스크롤 타임라인이 없거나 움직임을 줄이기로 한 화면에서는 두 장이 그냥
 * 위아래로 놓인다. 순서만으로도 같은 이야기가 전해진다.
 */
export function Becoming({ from, to }: Props) {
  return (
    <div className={styles.becoming}>
      <figure className={`${styles.frame} ${styles.from}${from.onPaper ? ` ${styles.paper}` : ''}`}>
        <img
          src={from.src}
          alt={from.alt}
          width={from.width}
          height={from.height}
          loading="lazy"
          decoding="async"
        />
      </figure>

      <figure className={`${styles.frame} ${styles.to}${to.onPaper ? ` ${styles.paper}` : ''}`}>
        <img
          src={to.src}
          alt={to.alt}
          width={to.width}
          height={to.height}
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>
  )
}
