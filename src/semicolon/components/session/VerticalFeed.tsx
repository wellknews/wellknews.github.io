import type { Cover } from '../../content/types'
import styles from './VerticalFeed.module.css'

/**
 * 한 장씩 보는 자리에 들어가는 것.
 *
 * note는 사진 설명이 아니라 그때 든 생각이다. 무엇이 찍혀 있는지는 사진이
 * 말하고 alt가 적는다. 모든 장에 붙이지 않는다 — 전부 붙으면 사진마다
 * 해설이 달린 것이 되고, 그러면 보는 일이 읽는 일로 바뀐다.
 *
 * 이 타입은 이 부품이 들고 있는다. 한동안 media.ts에 사진과 영상을 함께
 * 받는 Shot을 두고 두 부품이 나눠 썼는데, 이 저장소에 영상은 한 번도 들어온
 * 적이 없다. 없는 것을 위해 만든 자리는 «나중에 쓸 것»이 아니라 아무도
 * 지나가 보지 않은 길이다. 필요해지는 날 그때 만든다.
 */
export type FeedShot = Cover & {
  note?: string
}

type Props = {
  shots: readonly FeedShot[]
  /** 이 피드가 무엇의 기록인지. 낭독에 쓰인다. */
  label: string
}

/** 01 / 07. 한 자리 숫자를 두 자리로 맞춘다 — 자리가 흔들리면 숫자가 아니라 표시가 된다. */
function pad(value: number) {
  return String(value).padStart(2, '0')
}

/**
 * 한 장씩 보는 자리.
 *
 * ContactSheet와 반대다. 저쪽은 «한 번에 많이»여서 사진의 양 자체가 내용이고,
 * 이쪽은 «한 장씩»이어서 한 장이 화면을 다 쓴다. 두 부품이 따로 있는 이유가
 * 그것이다 — 같은 사진을 어느 문법으로 보여 주느냐가 그 사진을 본 방식이다.
 *
 * 이 자리에 이 문법이 온 근거는 «사진이 많다»가 아니다. 무대에 선 사람들의
 * 첫인상이 숏폼 플랫폼에서 보던 얼굴에 가까웠다는 것이고, 그래서 그 사진을
 * 보는 방식도 그쪽의 문법을 잠깐 가져온다.
 *
 * 다만 앱을 흉내 내지 않는다.
 *
 * 휴대폰 테두리도, 검은 베젤도, 좋아요·댓글·공유 같은 가짜 버튼도 두지
 * 않는다. 그런 것을 그리는 순간 이 구간은 «틱톡처럼 보이는 화면»이 되고,
 * 그러면 인상이 아니라 그림이 된다. 가져오는 것은 모양이 아니라 «한 번에
 * 한 장씩 세로로 지나간다»는 감각 하나뿐이다.
 *
 * 스크롤 상자를 따로 만들지 않는다.
 *
 * 이 공간은 이미 페이지의 세로 스크롤을 시간과 서사의 축으로 쓰고 있다.
 * 그 안에 또 하나의 스크롤을 넣으면 손가락이 어느 쪽을 미는지 알 수 없게
 * 되고, 두 축이 같은 화면에서 다른 시간을 가진다. 여기서 하는 일은 한 장이
 * 한 화면을 갖게 하는 것뿐이고, 넘기는 것은 페이지가 한다.
 *
 * 붙박이로 쌓지 않는 이유도 하나 있다. 겹쳐 쌓으려면 각 장이 뒤를 가리는
 * 불투명한 판을 가져야 하는데, 이 공간의 판면 뒤에는 색면이 깔려 있어서
 * 그 판이 색을 잘라 낸다. 한 장이 한 화면을 갖는 것만으로 «한 번에 하나»는
 * 이미 성립한다.
 *
 * 스크롤 타임라인이 없거나 움직임을 줄이기로 한 화면에서는 사진이 그냥
 * 세로로 늘어선다. 하나도 빠지지 않는다 — 모션은 내용이 아니다.
 */
export function VerticalFeed({ shots, label }: Props) {
  /* 사진이 아직 없는 기록에서는 아무것도 그리지 않는다. 빈 피드는 자리가 아니라 고장이다. */
  if (shots.length === 0) return null

  return (
    <ol className={styles.feed} aria-label={label}>
      {shots.map((shot, index) => (
        <li className={styles.slot} key={shot.src}>
          <figure className={styles.card}>
            <img
              className={styles.media}
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              decoding="async"
              /* 첫 장만 미리 받는다. 이 구간에 닿기 전에 나머지를 받을 이유가 없다. */
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            <figcaption className={styles.said}>
              <p className={`mono ${styles.count}`}>
                {/* 읽어 주는 쪽에는 셈이 아니라 말로 간다. */}
                <span className="visually-hidden">
                  {label} {shots.length}장 중 {index + 1}번째
                </span>

                <span aria-hidden="true">
                  {pad(index + 1)} / {pad(shots.length)}
                </span>
              </p>

              {shot.note ? <p className={styles.note}>{shot.note}</p> : null}
            </figcaption>
          </figure>
        </li>
      ))}
    </ol>
  )
}
