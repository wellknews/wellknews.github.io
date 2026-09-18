import type { Cover } from '../../content/types'
import styles from './Aperture.module.css'

type Props = {
  image: Cover
}

/**
 * 사진을 보는 것이 아니라 공간이 열리는 것.
 *
 * 처음에는 세로로 3할쯤만 열려 있다. 스크롤하면 이미지가 확대되는 것이 아니라
 * 담긴 자리가 아래 방향으로 열린다. 위쪽 모서리는 처음부터 끝까지 같은 자리에
 * 있고, 아래로 계속 더 보인다.
 *
 * 확대와 다른 점이 그것이다. 확대하면 이미 다 보이는 것을 크게 보는 일이
 * 되는데, 계단을 내려갈 때 일어난 일은 앞에 있던 것이 아래에서부터 나타난
 * 것이었다.
 *
 * 세로 사진을 쓴다. 가로 사진을 세로로 열면 열리는 동안 보이는 것이 전부
 * 천장과 바닥이라, 공간이 열리는 대신 띠가 넓어진다.
 *
 * 움직임을 줄이기로 한 화면에서는 처음부터 전체가 보인다.
 */
export function Aperture({ image }: Props) {
  return (
    <figure className={styles.aperture}>
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
    </figure>
  )
}
