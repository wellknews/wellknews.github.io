import { useEffect, useRef, useState, type CSSProperties } from 'react'

import type { Cover } from '../../content/types'
import styles from './VerticalFeed.module.css'

/**
 * 한 장씩 보는 자리에 들어가는 것.
 *
 * note는 사진 설명이 아니라 그때 든 생각이다. 무엇이 찍혀 있는지는 사진이
 * 말하고 alt가 적는다. 모든 장에 붙이지 않는다 — 전부 붙으면 사진마다
 * 해설이 달린 것이 되고, 그러면 보는 일이 읽는 일로 바뀐다.
 */
export type FeedShot = Cover & {
  note?: string
}

type Props = {
  shots: readonly FeedShot[]
  /** 이 피드가 무엇의 기록인지. 낭독에 쓰인다. */
  label: string
}

/** 01 / 09. 한 자리 숫자를 두 자리로 맞춘다 — 자리가 흔들리면 숫자가 아니라 표시가 된다. */
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
 * 무엇을 가져오는가.
 *
 * 큰 사진이 하나씩 지나가는 것은 숏폼이 아니다. 그건 그냥 큰 사진이다.
 * 처음에 그렇게 만들었다가 다시 만들었다 — 한 장이 한 화면을 갖게 해 두었는데,
 * 사진이 화면을 통과해서 지나갈 뿐이라 «사진을 크게 놓은 글»이 되었다.
 *
 * 숏폼에서 실제로 일어나는 일은 이것이다. **판이 고정되어 있고 그 안에서
 * 내용이 교체된다.** 손가락이 움직이면 화면이 넘어가는 것이 아니라 같은
 * 자리에 다음 사람이 와 있다. 그래서 여기서도 사진이 앉는 판을 화면 한가운데
 * 붙박아 두고, 스크롤한 만큼 그 안의 사진만 바뀐다.
 *
 * 무엇을 가져오지 않는가.
 *
 * 휴대폰 테두리도, 검은 베젤도, 좋아요·댓글·공유 같은 가짜 버튼도, 진행
 * 막대도 두지 않는다. 그런 것을 그리는 순간 이 구간은 «틱톡처럼 보이는 화면»이
 * 되고, 그러면 그날의 인상이 아니라 그림이 된다. 가져오는 것은 모양이 아니라
 * 동작 하나뿐이다.
 *
 * 스크롤을 붙잡지도 않는다. 한 장에 딱 맞춰 멈추는 snap을 쓰면 손가락이
 * 페이지의 주인이 아니게 되고, 이 지면은 스크롤을 시간의 축으로 쓰고 있어서
 * 그 축을 다른 부품이 가져가면 안 된다. 멈추는 자리는 없고, 지나간 만큼
 * 바뀔 뿐이다.
 *
 * 스크롤 상자를 따로 만들지 않는 이유도 같다. 페이지 안에 또 하나의 스크롤이
 * 생기면 손가락이 어느 쪽을 미는지 알 수 없게 된다. 넘기는 것은 페이지가 한다.
 *
 * 바뀌는 것은 «지금 몇 번째인가» 하나다. 연속이 아니라 불연속이라 스크롤
 * 타임라인이 아니라 관찰자가 맡는다(이 저장소의 규칙). 판면 한가운데를
 * 지나가는 눈금이 바뀔 때 사진이 교체된다.
 *
 * 움직임을 줄이기로 한 화면에서는 붙박이가 풀리고 사진이 그냥 세로로
 * 늘어선다. 한 장도 빠지지 않는다 — 모션은 내용이 아니다.
 */
export function VerticalFeed({ shots, label }: Props) {
  const [at, setAt] = useState(0)
  const rail = useRef<HTMLDivElement>(null)

  /*
   * 지금 몇 번째인가.
   *
   * 판면 한가운데에 얇은 선 하나를 그어 두고, 그 선을 지나가는 눈금이 곧
   * 지금 보이는 사진이다. 위아래를 50%씩 잘라내면 관찰 영역이 그 선 하나만
   * 남는다 — 눈금은 한 화면보다 크므로 그 선에 걸리는 것은 언제나 하나뿐이다.
   *
   * 스크롤을 직접 세지 않는다. 몇 픽셀인지는 이 부품이 알아야 할 일이 아니고,
   * 알기 시작하면 화면 높이가 바뀔 때마다 그 셈을 다시 맞춰야 한다.
   */
  useEffect(() => {
    const node = rail.current

    if (!node) return

    const steps = [...node.children]

    const watch = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue

          const index = steps.indexOf(entry.target)

          if (index >= 0) setAt(index)
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    for (const step of steps) watch.observe(step)

    return () => watch.disconnect()
  }, [shots.length])

  /* 사진이 아직 없는 기록에서는 아무것도 그리지 않는다. 빈 피드는 자리가 아니라 고장이다. */
  if (shots.length === 0) return null

  return (
    <div className={styles.feed} style={{ '--count': shots.length } as CSSProperties}>
      {/*
        붙박인 판.

        화면 한가운데에 자리를 잡고 이 구간이 끝날 때까지 움직이지 않는다.
        움직이는 것은 이 안의 사진이다.
      */}
      <div className={styles.stage}>
        <ol className={styles.slides} aria-label={label}>
          {shots.map((shot, index) => (
            <li
              className={styles.slide}
              key={shot.src}
              /* 지나간 것은 위로, 올 것은 아래에서. 지금 것만 제자리에 선다. */
              data-state={index === at ? 'now' : index < at ? 'past' : 'next'}
            >
              <div className={styles.frame}>
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
              </div>

              <div className={styles.said}>
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
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/*
        눈금.

        아무것도 그리지 않는다. 이 구간이 얼마나 긴지를 정하고, 판면 한가운데를
        지나갈 때 사진을 교체하라고 알리는 자리다. 한 칸이 한 장이고, 한 칸의
        높이가 곧 한 장을 보는 시간이다.
      */}
      <div className={styles.rail} ref={rail} aria-hidden="true">
        {shots.map((shot) => (
          <div key={shot.src} />
        ))}
      </div>
    </div>
  )
}
