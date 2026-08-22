import type { Cover } from '../../content/types'
import styles from './Plate.module.css'

type Props = {
  image: Cover
  /** 사진 아래에 붙는 아주 짧은 한마디. 설명문이 아니다. */
  note?: string
}

/**
 * 사진 한 장을 그대로 놓는다.
 *
 * 둥근 모서리도 그림자도 테두리도 없다. 사진을 카드로 만드는 순간 이 페이지는
 * 여행 블로그의 피드가 되고, 사진은 기록이 아니라 게시물의 썸네일이 된다.
 *
 * 설명문도 붙이지 않는다. 무엇이 찍혀 있는지는 사진이 말하고, 어디였는지는
 * 바로 아래의 Place가 말한다. 그 사이에 문장을 하나 더 끼우면 사진이 그 문장의
 * 삽화가 된다. note는 «LUNCH»처럼 사진이 말하지 못하는 한 조각에만 쓴다.
 */
export function Plate({ image, note }: Props) {
  return (
    <figure className={styles.plate}>
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        decoding="async"
        loading="lazy"
      />

      {note ? <figcaption className={`mono ${styles.note}`}>{note}</figcaption> : null}
    </figure>
  )
}
