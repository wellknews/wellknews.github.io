import { useRef } from 'react'

import type { Cover } from '../../content/types'
import { usePointerLight } from '../../motion/usePointerLight'
import styles from './Plate.module.css'

type Props = {
  image: Cover
  /** 사진 아래에 붙는 아주 짧은 한마디. 설명문이 아니다. */
  note?: string
  /**
   * 손을 대기 전의 상태.
   *
   *   faded  기본. 채도와 대비가 한 단계 내려가 있다.
   *   full   내려가지 않는다. 사진에 찍힌 색 자체가 그 기록의 내용일 때.
   *
   * 이 값이 생긴 이유는 어느 하루의 사실 때문이다. 성수의 기록에서 사진이
   * 가라앉아 있는 것은 «그날 종일 흐렸고 사람은 지쳐 있었다»는 사실이지
   * 이 공간의 사진 양식이 아니다. 기차의 기록에서 마지막에 놓이는 접시는
   * 반대다 — 먹는 도중에 흰 크림과 자주색과 녹색이 섞여 버린 그 색이
   * 그 장면의 전부라, 채도를 내리면 사진이 말하려던 것이 먼저 내려간다.
   *
   * 어느 쪽이든 사람이 보고 있는 자리가 제 색을 낸다는 것은 같다. 달라지는
   * 것은 손을 대기 전이 어디에서 시작하는가뿐이다.
   */
  tone?: 'faded' | 'full'
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
 *
 * 사진은 가만히 있지 않는다.
 *
 * 이날은 종일 흐렸고 사람은 지쳐 있었다. 그래서 사진도 기본은 조금 가라앉아
 * 있고, 사람이 보고 있는 자리만 제 색을 낸다. 표지의 Materialize가 «아직
 * 물건이 아닌 것»을 말한다면 여기서 말하는 것은 시선이다 — 하루 종일 눈에
 * 들어온 것은 실제로 바라본 자리뿐이었다.
 *
 * 지우는 것이 아니라 가라앉히는 것이다. 손을 대지 않아도 무엇이 찍혀 있는지는
 * 다 보인다. 사진을 못 보게 만들면서 반응을 얻는 것은 거래가 맞지 않는다.
 */
export function Plate({ image, note, tone = 'faded' }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const light = usePointerLight(hostRef)

  return (
    <figure className={styles.plate} data-tone={tone}>
      <div className={styles.frame} ref={hostRef} data-lit="false" {...light}>
        <img
          className={styles.base}
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          decoding="async"
          loading="lazy"
        />

        {/* 보고 있는 자리. 같은 사진이 제 색으로 한 겹 더 놓인다. */}
        <img
          className={styles.seen}
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          aria-hidden="true"
          decoding="async"
          loading="lazy"
        />
      </div>

      {note ? <figcaption className={`mono ${styles.note}`}>{note}</figcaption> : null}
    </figure>
  )
}
