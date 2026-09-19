import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
} from 'react'

import type { Cover, Session } from '../content/types'
import { useViewport } from '../layout/useViewport'
import { Link, path } from '../router'
import { EmptyState } from './EmptyState'
import styles from './SessionTerrain.module.css'

type Props = {
  sessions: readonly Session[]
  /** 아직 아무것도 없을 때 대신 놓을 한 줄 */
  empty: string
}

/* ─────────────────────────────  판을 나누는 법  ─────────────────────────────
 *
 * 한 줄의 생김새. spans의 합이 늘 판의 폭과 같아서 줄에 빈칸이 남지 않는다.
 * rows는 그 줄이 격자에서 몇 칸 높이인지다. 한 칸의 높이는 열 폭의 절반이라
 * [6]×4는 3:1 띠가 되고, [4,2]×4는 2:1과 정사각이 되고, [2,2,2]×3은 4:3 셋이
 * 된다 — 줄마다 다른 생김새가 나오면서도 한 화면에 여러 기록이 들어온다.
 */
type Shape = { spans: readonly number[]; rows: number }

/**
 * 넓은 판면 — 여섯 칸.
 *
 * 한 줄에 몇 장을 놓느냐로 표를 만든다. 첫 줄은 한 장, 두 번째 줄은 두 장,
 * 세 번째 줄은 세 장. 같은 수라도 둘 이상의 생김새가 있는 자리는 기록마다
 * 다른 것을 고르게 해서, 판 전체가 같은 무늬로 반복되지 않게 한다.
 */
const WIDE: readonly (readonly Shape[])[] = [
  [{ spans: [6], rows: 4 }],
  [
    { spans: [4, 2], rows: 4 },
    { spans: [2, 4], rows: 4 },
  ],
  [{ spans: [2, 2, 2], rows: 3 }],
]

/**
 * 좁은 판면 — 네 칸.
 *
 * 열을 줄이는 대신 한 조각을 키운다. 여섯 칸을 그대로 들고 오면 2칸짜리
 * 조각이 손톱만 해지고, 그러면 장면이 아니라 무늬가 된다. 여기서 한 조각은
 * 화면의 절반이거나 한 줄 전체다.
 */
const NARROW: readonly (readonly Shape[])[] = [
  [{ spans: [4], rows: 4 }],
  [{ spans: [2, 2], rows: 4 }],
]

/**
 * 기록마다 다른 배치를 주되, 늘 같은 배치를 준다.
 *
 * 무작위로 흔들면 새로고침할 때마다 판이 다시 짜인다. 그러면 이 판은 쌓인
 * 것이 아니라 매번 뽑히는 것이 된다. 그래서 slug에서 수를 뽑는다 — 기록이
 * 하나 늘어도 앞의 기록들은 어제와 같은 자리에 있다. 순번으로 뽑으면 맨 위에
 * 한 편이 들어올 때마다 아래 전부가 다시 짜인다.
 */
function seedOf(slug: string): number {
  let sum = 0
  for (let at = 0; at < slug.length; at += 1) sum = (sum * 31 + slug.charCodeAt(at)) % 9973
  return sum
}

/**
 * n장을 빈틈없이 까는 줄들.
 *
 * 남은 수가 한 줄에 들어가면 그대로 한 줄이 된다. 그러지 않으면 넓은 줄부터
 * 채우되, 다음 줄에 한 장만 남게 되는 경우에는 한 장을 미리 넘겨 준다 —
 * 한 장짜리 줄은 판을 가로지르는 띠라서 드물게 나와야 리듬이고 자주 나오면
 * 그냥 줄무늬다.
 */
function rowsFor(count: number, seed: number, table: readonly (readonly Shape[])[]): Shape[] {
  const widest = table.length
  const out: Shape[] = []
  let left = count
  let step = 0

  while (left > 0) {
    let size = left <= widest ? left : (seed + step) % 2 === 0 ? widest : Math.max(1, widest - 1)

    if (left - size === 1 && size > 1) size -= 1

    const options = table[size - 1] ?? table[0]
    out.push(options![(seed + step) % options!.length]!)

    left -= size
    step += 1
  }

  return out
}

/** 한 조각이 판에서 차지하는 자리. */
type Piece = {
  image: Cover | undefined
  cols: number
  rows: number
  /** 그 기록의 첫 조각인지. 정보를 전부 펴 놓는 자리는 기록마다 하나다. */
  lead: boolean
}

function piecesFor(session: Session, wide: boolean): Piece[] {
  /*
   * 사진이 없으면 빈 지면 한 조각을 준다. 사진이 없다고 목록에서 빠지지
   * 않는다 — 기록의 무게가 사진의 수와 같지는 않다.
   */
  const images = session.images ?? (session.cover ? [session.cover] : [])
  const table = wide ? WIDE : NARROW

  if (images.length === 0) {
    const only = table[0]![0]!
    return [{ image: undefined, cols: only.spans[0]!, rows: only.rows, lead: true }]
  }

  const out: Piece[] = []
  let at = 0

  for (const shape of rowsFor(images.length, seedOf(session.slug), table)) {
    /*
     * 첫 줄만 넓은 조각을 앞에 둔다.
     *
     * 기록의 첫 조각이 그 기록에서 가장 큰 조각이어야 한다. 장소와 한 줄
     * 설명이 붙는 자리가 거기라서, 작은 조각이 앞에 오면 가장 많은 글이 가장
     * 좁은 칸에 들어간다. 나머지 줄은 순서를 그대로 둔다 — 거기까지 정렬하면
     * 판이 왼쪽부터 작아지는 계단이 된다.
     */
    const spans = at === 0 ? [...shape.spans].sort((a, b) => b - a) : shape.spans

    for (const cols of spans) {
      const image = images[at]
      if (!image) break
      out.push({ image, cols, rows: shape.rows, lead: at === 0 })
      at += 1
    }
  }

  return out
}

/**
 * 조각 하나.
 *
 * 사진과 정보가 같은 사각형을 번갈아 쓴다. 정보는 사진 «위에» 얹히지 않는다 —
 * 아래에 이미 적혀 있고, 사진이 걷히면 드러난다. 그래서 다가갔을 때 나타나는
 * 것은 새 카드가 아니라 원래 있던 지면이다.
 *
 * 이 순서에는 실용적인 이유도 있다. 정보가 늘 그려져 있으므로 움직임을 끈
 * 화면에서도, 낭독에서도, 자바스크립트가 죽은 화면에서도 제목은 그대로 있다.
 * 반대로 두면 — 정보를 숨겨 두고 다가갈 때 띄우면 — 그 사람들에게 이 목록은
 * 제목 없는 사진 무더기가 된다.
 */
function Piece({
  session,
  piece,
  open,
  onEnter,
  onOpen,
  onPoint,
}: {
  session: Session
  piece: Piece
  open: boolean
  onEnter: (event: PointerEvent<Element>) => void
  onOpen: (event: MouseEvent<HTMLAnchorElement>) => void
  onPoint: (event: PointerEvent<Element>) => void
}) {
  const { image } = piece

  return (
    <Link
      to={path.session(session.slug)}
      className={styles.piece}
      style={{ '--cols': piece.cols, '--rows': piece.rows } as CSSProperties}
      data-lead={piece.lead}
      data-open={open ? true : undefined}
      data-bare={image ? undefined : true}
      onPointerEnter={onEnter}
      onPointerDown={onPoint}
      onClick={onOpen}
    >
      {/*
        걷히는 쪽.
        낭독에서는 건너뛴다. 무엇이 찍혀 있는지가 아니라 어느 기록인지가
        이 링크의 이름이고, 그 이름은 아래에 글자로 적혀 있다.
      */}
      {image ? (
        <img
          className={styles.face}
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          loading="lazy"
          decoding="async"
          aria-hidden="true"
          style={
            {
              '--fx': `${(image.focus?.x ?? 0.5) * 100}%`,
              '--fy': `${(image.focus?.y ?? 0.5) * 100}%`,
            } as CSSProperties
          }
        />
      ) : null}

      <span className={styles.card}>
        {session.meta?.date ? (
          <span className={`mono ${styles.date}`}>{session.meta.date}</span>
        ) : null}

        {/*
          제목은 기록마다 한 번만 표제가 된다. 같은 기록의 조각이 여섯이라고
          해서 제목이 여섯 개 있는 것은 아니다 — 문서의 뼈대에는 기록의 수만큼만
          제목이 있어야 한다.
        */}
        {piece.lead ? (
          <h2 className={styles.title}>{session.title}</h2>
        ) : (
          <span className={styles.title}>{session.title}</span>
        )}

        {piece.lead && session.meta?.location ? (
          <span className={`mono ${styles.where}`}>{session.meta.location}</span>
        ) : null}

        {piece.lead && session.excerpt ? <p className={styles.line}>{session.excerpt}</p> : null}
      </span>
    </Link>
  )
}

/**
 * 지금까지 떼어낸 경험들이 쌓여 있는 판.
 *
 * 목차가 아니다. 제목의 세로 줄을 세우는 대신 그 기록들이 실제로 남긴 장면을
 * 위에서부터 붙여 놓는다. 멀리서 보면 하나의 지형이고, 가까이 가면 각각이
 * 하나의 기록이다. GitHub가 코드를 잔디로 쌓는다면 여기서는 경험을 장면으로
 * 쌓는다 — 가져오는 것은 초록색 정사각형이 아니라 «작은 단위가 시간을 따라
 * 쌓인다»는 문법 하나다.
 *
 * 경계를 그리지 않는다.
 *
 * 기록과 기록 사이에 선을 긋거나 카드로 구획하면 이 판은 다시 목록이 된다.
 * 대신 기록마다 자기 격자를 따로 갖고, 그 사이의 틈이 조각 사이의 틈보다
 * 조금 넓다. 몇 픽셀 차이라 눈으로 세지는 않지만 «여기까지가 하루»라는 것은
 * 읽힌다. 다가가면 같은 기록의 다른 조각들이 함께 또렷해지고 나머지는 한
 * 단계 가라앉는다 — 테두리를 그리는 대신 관계가 잠깐 보이는 쪽이다.
 *
 * 시간은 위에서 아래로 흐른다. 가장 최근이 맨 위에 있고 내려갈수록 과거로
 * 간다. 새 기록이 생기면 맨 위에 한 덩어리가 얹힐 뿐, 아래의 판은 다시 짜이지
 * 않는다(seedOf).
 */
export function SessionTerrain({ sessions, empty }: Props) {
  const viewport = useViewport()
  const wide = viewport !== 'compact'

  /*
   * 지금 펴져 있는 조각.
   *
   * 커서는 지나가는 것만으로 편다. 손가락에는 지나가는 일이 없으므로 첫 번째
   * 찍기가 커서의 자리를 대신하고, 그 상태에서 한 번 더 찍어야 기록으로
   * 들어간다. 손가락으로 온 사람도 사진이 정보로 바뀌는 장면을 보게 하려는
   * 것이고, 이 페이지에서 그 장면이 곧 목록을 읽는 방법이다.
   *
   * 기록이 아니라 조각을 기억한다. 처음에는 slug만 들고 있었는데, 그러면 같은
   * 기록의 두 번째 조각을 찍었을 때 «이미 열려 있다»로 판정되어 그대로 이동해
   * 버렸다. 찍은 자리가 아닌 다른 조각이 펴지기도 했다 — 커서는 조각 단위로
   * 반응하는데 손가락만 기록 단위였으니, 같은 장치가 두 사람에게 다르게
   * 동작한 셈이다.
   */
  const [open, setOpen] = useState<string | null>(null)

  /*
   * 커서가 지나가면 편다.
   *
   * 손가락은 여기서 걸러야 한다. 탭 한 번에도 pointerenter가 먼저 오기
   * 때문에, 거르지 않으면 찍기도 전에 그 조각이 열린 상태가 되고 뒤따라오는
   * click은 «이미 열려 있으니 가라»로 읽는다. 첫 찍기를 삼키려고 만든 장치가
   * 첫 찍기에 이동하는 장치가 되어 있었다.
   */
  const enter = useCallback(
    (key: string) => (event: PointerEvent<Element>) => {
      if (event.pointerType === 'touch') return
      setOpen(key)
    },
    [],
  )

  /*
   * 방금 누른 것이 손가락인지.
   *
   * click만 보고는 알 수 없다. `detail`로 가르려다 틀렸다 — 손가락에서 온
   * click도 브라우저에 따라 1이 들어와서, 커서로 누른 것과 구별되지 않는다.
   * 종류를 아는 자리는 pointerdown뿐이므로 거기서 받아 적어 두고 click에서
   * 읽는다. 이 저장소가 손가락을 가려내는 방식과 같다(useTouchReveal).
   */
  const finger = useRef(false)

  const point = useCallback((event: PointerEvent<Element>) => {
    finger.current = event.pointerType === 'touch'
  }, [])

  /*
   * 손가락으로 누른 경우에만 첫 번째를 삼킨다.
   *
   * 커서로 온 사람은 이미 지나가면서 펴 본 뒤에 누르는 것이라, 한 번 더
   * 누르게 하면 그냥 고장이다. 손가락에는 그 «지나감»이 없으니 첫 찍기가
   * 그 자리를 대신하고 두 번째에 기록으로 들어간다.
   */
  const openAt = useCallback(
    (key: string) => (event: MouseEvent<HTMLAnchorElement>) => {
      if (!finger.current || open === key) return

      event.preventDefault()
      setOpen(key)
    },
    [open],
  )

  if (sessions.length === 0) {
    return <EmptyState>{empty}</EmptyState>
  }

  return (
    <div
      className={styles.terrain}
      data-open={open ? open.slice(0, open.lastIndexOf('@')) : undefined}
      /* 판 밖을 찍으면 펴져 있던 조각이 닫힌다. */
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) setOpen(null)
      }}
    >
      {sessions.map((session) => (
        <section
          key={session.slug}
          className={styles.group}
          data-open={open?.startsWith(`${session.slug}@`) ? true : undefined}
          aria-label={session.title}
        >
          {piecesFor(session, wide).map((piece, index) => {
            /* 조각 하나를 가리키는 이름. 앞이 기록이고 뒤가 그 안에서의 자리다. */
            const key = `${session.slug}@${index}`

            return (
              <Piece
                key={key}
                session={session}
                piece={piece}
                open={open === key}
                onEnter={enter(key)}
                onOpen={openAt(key)}
                onPoint={point}
              />
            )
          })}
        </section>
      ))}
    </div>
  )
}
