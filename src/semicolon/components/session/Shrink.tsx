import type { Cover } from '../../content/types'
import styles from './Shrink.module.css'

type Props = {
  image: Cover
  /** 사진 아래에 붙는 아주 짧은 한마디. 설명문이 아니다. */
  note?: string
}

/**
 * 사진에 할당된 지면이 줄어든다.
 *
 * 사진을 흐리게 만들거나 지우지 않는다. 음식이 사라지는 것이 아니라 그 사진이
 * 쓰던 자리가 줄어드는 것이다. 가운데 크롭은 그대로 유지되므로 무엇이 찍혀
 * 있는지는 끝까지 보인다.
 *
 * 얼마나 남겼는지를 비율로 그리지 않는다. 남은 양을 화면에 재현하려면 그
 * 숫자를 알아야 하는데, 그날 아무도 그것을 재지 않았다. 지어낸 비율을 그리면
 * 없던 사실이 생긴다. 여기서 줄어드는 것은 음식의 양이 아니라 지면이고,
 * 지면이 줄었다는 것은 이 기록이 실제로 한 일이라 지어낸 것이 아니다.
 *
 * 움직임을 줄이기로 한 화면에서는 사진이 제 높이로 서 있는다.
 */
export function Shrink({ image, note }: Props) {
  return (
    <figure className={styles.shrink}>
      <div className={styles.frame}>
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          decoding="async"
          loading="lazy"
        />
      </div>

      {note ? <figcaption className={`mono ${styles.note}`}>{note}</figcaption> : null}
    </figure>
  )
}
