import { useCallback, useId, useState, type ReactNode } from 'react'

import styles from './ReadingGuide.module.css'

type Props = {
  children: ReactNode
  /** 처음부터 펼쳐 둘지. 기본은 접힘 — 읽기를 강요하지 않는다. */
  defaultOpen?: boolean
}

/**
 * 읽기 전에 덧붙이는 배경.
 *
 * 이 공간의 기록은 쓴 사람의 생각을 따라간다. 쓴 사람에게는 앞뒤가 이어져
 * 있는데, 처음 읽는 사람에게는 그 사이에 있던 것이 통째로 빠져 보인다 —
 * 전에 쓰던 개인적인 규칙, 다른 기록에서 이어진 생각, 어떤 자리를 고른
 * 이유, 제목에 쓴 비유, 글이 쓰인 시각과 일이 일어난 시각의 관계.
 *
 * 그것을 본문에 적어 넣지 않는다. 적어 넣는 순간 그 글은 남에게 설명하는
 * 글이 되고, 이 공간의 기록은 설명하지 않기로 되어 있다. 그래서 본문은
 * 그대로 두고 그 앞에 좌표만 놓는다.
 *
 * 하는 일은 미술관의 도슨트와 같고, 생긴 것은 코드의 블록 주석이다.
 *
 * 주석을 고른 이유는 그것이 이 공간의 말투이기 때문이다. 이 저장소의 파일은
 * 전부 왜 그렇게 했는지를 주석으로 남기고 있고, 읽는 사람에게 건네는 배경도
 * 같은 형식이면 «설명 카드»가 아니라 «이 지면의 다른 층»으로 읽힌다.
 *
 * 접혀 있는 것이 기본이다.
 *
 * 읽기를 강요하지 않는다. 이미 맥락을 아는 사람 — 쓴 사람 자신을 포함해 —
 * 에게 이것은 방해다. 펼치지 않으면 한 줄짜리 표시 하나만 지나간다.
 *
 * 요약하지 않는다. 마지막 문장이 무엇을 회수하는지, 감정에 어떤 이름이
 * 붙는지, 읽으면서 알아챌 수 있는 연결은 여기서 먼저 말하지 않는다.
 * 정답지가 아니라 출발선이다.
 */
export function ReadingGuide({ children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  const toggle = useCallback(() => setOpen((current) => !current), [])

  return (
    <section className={styles.guide} data-open={open} aria-labelledby={`${id}-label`}>
      <p className={`mono ${styles.label}`} id={`${id}-label`}>
        READING GUIDE
      </p>

      {/*
        무엇인지 한 번만 말한다.
        보조 설명이라는 것, 처음 읽는 사람을 위한 것이라는 것, 안 읽어도
        된다는 것. 세 가지가 두 줄 안에 있으면 그것으로 끝이다.
      */}
      <p className={styles.about}>
        처음 읽는 사람을 위해 본문에서 생략된 배경을 덧붙였다.
        <br />
        읽지 않아도 글은 그대로 읽힌다.
      </p>

      {/*
        접고 펴는 자리.

        테두리도 배경도 없다. 코드 편집기에서 블록을 접는 것과 같은 모양이라,
        무엇을 하는 자리인지는 접힌 표시가 이미 말한다.
      */}
      <button
        type="button"
        className={`mono ${styles.fold}`}
        aria-expanded={open}
        aria-controls={`${id}-body`}
        onClick={toggle}
      >
        <span className={styles.chevron} aria-hidden="true">
          ›
        </span>

        <span className={styles.mark}>{open ? '/*' : '/* … */'}</span>

        <span className="visually-hidden">{open ? '읽기 안내 접기' : '읽기 안내 펼치기'}</span>
      </button>

      {/*
        펼쳤을 때의 내용.

        display: none으로 지우지 않는다. 지우면 여닫히는 동안 아무 일도
        일어나지 않고 그냥 나타났다 사라진다. 높이만 0에서 자라게 두고,
        접혀 있는 동안에는 inert로 초점과 낭독에서 빼 둔다.
      */}
      <div className={styles.body} id={`${id}-body`} inert={!open}>
        <div className={styles.inner}>
          <div className={styles.note}>{children}</div>

          <p className={`mono ${styles.brace}`} aria-hidden="true">
            */
          </p>
        </div>
      </div>
    </section>
  )
}
