import { useTouchReveal } from '../motion/useTouchReveal'
import { Link } from '../router'
import { KindMark, type Kind } from './KindMark'
import styles from './Doors.module.css'

export type Door = {
  kind: Kind
  /** 'SESSION' 같은 개념 이름 */
  label: string
  /** '/;/session' */
  to: string
  /** 가장 최근에 여기 놓인 것. 제목이 없는 글도 있으므로 날짜만 있을 수 있다. */
  latest?: { date: string; title?: string | undefined } | undefined
  /** 아직 아무것도 없을 때 대신 놓을 한 줄 */
  empty: string
}

type Props = {
  doors: readonly Door[]
}

/**
 * 이 공간의 세 자리로 들어가는 문.
 *
 * 한동안 홈은 게시판마다 한 구간을 갖고, 각 구간이 최신 글 한 편을 통째로
 * 펼쳐 놓고, 구간 사이마다 ';'가 들어가는 모양이었다. 자리가 둘일 때는
 * 그것이 성립했다 — 세미콜론은 두 개의 절을 잇는 기호이고, 화면에 하나뿐인
 * ';'가 정확히 그 일을 하고 있었다.
 *
 * 셋이 되자 무너졌다. 이음매가 둘이 되는 순간 ';'는 기호가 아니라 구분선이
 * 된다. 반복되는 것은 뜻을 잃는다. 그리고 구간마다 글을 통째로 펼쳐 놓으니
 * 홈은 문이 아니라 세 개의 목록이 되었고, 세 번째 문은 화면 몇 개 아래로
 * 밀려났다.
 *
 * 그래서 구간을 없애고 문만 남긴다.
 *
 * 세 문이 한 무리로 붙어 앉는다. 이 공간에서 세 기호가 나란히 놓이는 것은
 * 여기가 처음이자 유일한 자리다 — 닫힌 선, 나뉜 선, 열린 선이 같은 세로줄
 * 위에 서면 세 개념의 차이는 설명할 것이 없어진다. 흩어 놓았을 때는 각각이
 * 무슨 뜻인지 알 수 없었고, 그것이 이 진입로가 예쁘지 않았던 이유이기도 하다.
 *
 * 한동안 그 세 기호를 세로선 하나로 이어 두었다. «셋이 한 자리에서 갈라져
 * 나왔다»는 뜻이라고 적었는데, 그것은 세 기호가 같은 x에 서 있는 것만으로
 * 이미 보이는 사실이었다. 이미 보이는 것을 한 번 더 그리면 그것은 뜻이
 * 아니라 장식이고, 게다가 그 선은 세 게시판 어느 것의 기호도 아닌 네 번째
 * 모양이었다. 값은 두 번의 어긋남으로 치렀다 — 기호에 31px 못 닿은 것과
 * 구분선과 십자로 만난 것. 뜻이 없는 선은 유지비만 낸다. 지웠다.
 *
 * 문마다 한 줄이 붙는다. 가장 최근에 그 자리에 놓인 것의 날짜와 제목.
 * 글을 통째로 펼치지 않는 이유는 그러면 문이 다시 방이 되기 때문이고,
 * 한 줄도 두지 않으면 세 문이 이름만 다른 세 개의 링크가 되기 때문이다.
 *
 * 행 전체가 문이다. 기호도 이름도 그 한 줄도 같은 문의 일부이고, 다가갔을 때
 * 기호가 반응하는 범위와 눌러서 들어가는 범위가 정확히 같다.
 */
export function Doors({ doors }: Props) {
  return (
    <nav className={styles.doors} aria-label="이 공간의 세 자리">
      <ul className={styles.list} role="list">
        {doors.map((door) => (
          <Panel key={door.kind} door={door} />
        ))}
      </ul>
    </nav>
  )
}

function Panel({ door }: { door: Door }) {
  const touch = useTouchReveal()

  return (
    <li className={styles.item}>
      <Link
        to={door.to}
        className={`kindGate ${styles.door}`}
        data-touched={touch.active}
        onPointerDown={touch.onPointerDown}
      >
        <span className={styles.mark}>
          <KindMark kind={door.kind} />
        </span>

        <h2 className={`mono ${styles.label}`}>{door.label}</h2>

        {/*
          그 자리에 가장 최근에 놓인 것.
          날짜는 고정폭, 제목은 본문의 글자다. 같은 줄에 두 글자 체계가
          나란히 서는 것이 이 공간이 메타데이터와 문장을 구분하는 방식이다.
        */}
        <span className={styles.latest}>
          {door.latest ? (
            <>
              <span className={`mono ${styles.date}`}>{door.latest.date}</span>
              {door.latest.title ? <span className={styles.title}>{door.latest.title}</span> : null}
            </>
          ) : (
            <span className={styles.none}>{door.empty}</span>
          )}
        </span>

        <span className={`mono ${styles.path}`}>
          {door.to} <span aria-hidden="true">→</span>
        </span>
      </Link>
    </li>
  )
}
