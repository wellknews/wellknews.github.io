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
 * 한 칸은 정사각형이다. 조각은 그 칸을 가로로 몇 개, 세로로 몇 개 쓰는지로만
 * 정해진다. 줄의 생김새(Shape)는 왼쪽부터의 폭이고, 합이 늘 판의 폭과 같아서
 * 줄에 빈칸이 남지 않는다. 높이는 표에 적지 않는다 — 그 줄에 실제로 실릴
 * 사진을 보고 고른다(heightFor).
 */
type Shape = readonly number[]

/**
 * 넓은 판면 — 여덟 칸.
 *
 * 여섯 칸으로 시작했는데 판이 조밀해지지 않았다. 한 줄에 세 장이 한계라
 * 조각 하나하나가 크고, 화면에 한 번에 들어오는 장면이 적었다 — 쌓인 것처럼
 * 보이려면 작은 단위가 여럿 보여야 하는데 큰 단위가 몇 개 보였다.
 *
 * 한 줄에 몇 장을 놓느냐로 표를 만든다. 같은 수라도 생김새가 여럿인 자리는
 * 실제로 실릴 사진에 가장 덜 모진 쪽을 고르고, 우열이 같으면 기록마다 다른
 * 것을 골라 판 전체가 같은 무늬로 반복되지 않게 한다.
 */
const WIDE: readonly (readonly Shape[])[] = [
  /*
   * 한 장만 남은 날은 줄을 다 쓴다.
   *
   * 절반만 쓰게 두었더니 옆이 비어 판에 구멍이 생겼다. 구멍은 «작게 남았다»가
   * 아니라 «덜 만들었다»로 읽힌다. 그날의 몫이 작다는 것은 줄이 하나뿐인
   * 것으로 이미 말해진다.
   */
  [[12]],
  /*
   * 둘로 나누는 자리에 [6,6]을 먼저 둔다.
   *
   * 폭이 같으면 한 높이가 두 장 모두에게 맞는다. [7,5]는 한쪽이 2.4:1일 때
   * 다른 쪽이 1.7:1이라, 어떤 높이를 줘도 한 장은 반드시 모질게 잘린다.
   * 생김새의 다양함은 [7,5]와 [5,7]이 맡고, 사진이 그 불균형을 견디지 못할
   * 때에는 [6,6]이 이긴다.
   */
  [
    [6, 6],
    [7, 5],
    [5, 7],
  ],
  [
    [4, 4, 4],
    [5, 4, 3],
    [3, 4, 5],
  ],
  [
    [3, 3, 3, 3],
    [4, 3, 3, 2],
    [2, 3, 3, 4],
  ],
]

/**
 * 좁은 판면 — 여섯 칸.
 *
 * 열을 줄이는 대신 한 조각을 키운다. 열두 칸을 그대로 들고 오면 조각이
 * 손톱만 해지고, 그러면 장면이 아니라 무늬가 된다. 여기서 한 조각은 화면의
 * 절반이거나 한 줄 전체다.
 *
 * 네 칸으로 두었더니 한 줄에 두 장씩 들어가는데 세로 사진이라 줄이 높아서,
 * 판이 7800px이 되었다. 여섯 칸이면 같은 두 장이 더 낮은 줄에 들어가고,
 * 폭이 다른 두 장이 섞였을 때 [4,2]로 받아 낼 자리도 생긴다.
 */
const NARROW: readonly (readonly Shape[])[] = [
  [[6]],
  [
    [3, 3],
    [4, 2],
    [2, 4],
  ],
]

/*
 * 줄의 높이로 허용하는 칸 수.
 *
 * 두 칸 아래로 내려가면 어떤 생김새든 가로로 납작해지고, 다섯 칸을 넘으면 한
 * 줄이 화면보다 높아져서 «판»이 아니라 한 장씩 넘기는 화면이 된다.
 */
const SHORTEST = 2
const TALLEST = 7

/*
 * 아무것도 고르지 못할 때의 높이.
 *
 * 그 줄에 실린 것이 전부 자르지 않는 이미지이면 어느 높이든 똑같이 온전하다.
 * 그때는 가장 낮은 것을 집지 않는다 — 심볼 한 장이 판을 가로지르는 납작한
 * 띠 안에 손톱만 하게 놓인다.
 */
const PLAIN = 4

/**
 * 이 생김새를 h칸 높이로 두면 사진이 평균 얼마나 남는가(0..1).
 *
 * 조각은 채워서 자르므로(cover), 남는 것은 사진의 비율과 칸의 비율 중 작은
 * 쪽을 큰 쪽으로 나눈 만큼이다. 1이면 한 점도 버리지 않는다.
 *
 * 틈은 여기 넣지 않는다. 한 칸의 1.5% 남짓이라 어느 후보도 뒤집지 못하고,
 * 넣으면 이 계산이 화면 폭에 딸려 다니게 된다 — 같은 기록이 창 크기에 따라
 * 다른 모양으로 짜이면 그것은 판이 아니라 그때그때의 배치다.
 */
function keptAt(spans: Shape, images: readonly Cover[], from: number, h: number): number {
  let sum = 0
  let counted = 0

  for (let i = 0; i < spans.length; i += 1) {
    const image = images[from + i]
    /* 자르지 않는 이미지는 높이를 고르는 데 끼지 않는다. */
    if (!image || image.whole) continue

    const cell = spans[i]! / h
    const own = image.width / image.height
    sum += Math.min(own, cell) / Math.max(own, cell)
    counted += 1
  }

  return counted === 0 ? 1 : sum / counted
}

/**
 * 줄의 높이는 그 줄에 실린 사진이 가장 적게 잘리는 높이다.
 *
 * 한동안 판에 높이가 하나뿐이었다. 그러면 칸의 비율이 1:1부터 4:1까지 전부
 * 가로형이 되는데, 이 아카이브는 서른세 조각 중 스물세 장이 세로 사진이다.
 * 열여덟 장이 절반 이상 잘려 나갔고, 가장 심한 것은 22%만 남았다 — 900×1600
 * 사진을 2.5:1 칸에 넣으면 머리가 통째로 사라진다.
 *
 * 평균으로 고른다. 가장 나쁜 한 장을 기준으로 삼아 봤더니, 두 장이 온전하고
 * 한 장이 67% 남는 쪽을 버리고 세 장 모두 75%인 쪽을 골랐다. 잘 맞는 자리를
 * 스스로 없애는 셈이라 판이 평평해진다.
 */
function heightFor(spans: Shape, images: readonly Cover[], from: number): number {
  let best = -1
  let bestKept = -1

  for (let h = SHORTEST; h <= TALLEST; h += 1) {
    const kept = keptAt(spans, images, from, h)
    if (kept > bestKept + 1e-9) {
      bestKept = kept
      best = h
    }
  }

  /* 어느 높이든 한 점도 잃지 않는다면 고른 것이 아니라 걸린 것이다. */
  return bestKept >= 1 ? PLAIN : best
}

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

/** 실제로 깔린 한 줄. */
type Band = { spans: Shape; rows: number }

/**
 * 한 줄을 놓는 순서.
 *
 * 첫 줄만 넓은 조각을 앞에 둔다. 기록의 첫 조각이 그 기록에서 가장 큰 조각이어야
 * 하기 때문이다 — 장소와 한 줄 설명이 붙는 자리가 거기라서, 작은 조각이 앞에
 * 오면 가장 많은 글이 가장 좁은 칸에 들어간다. 나머지 줄은 표에 적힌 순서를
 * 그대로 쓴다. 거기까지 정렬하면 판이 왼쪽부터 작아지는 계단이 된다.
 */
function laid(shape: Shape, lead: boolean): Shape {
  return lead ? [...shape].sort((a, b) => b - a) : shape
}

/**
 * 사진들을 빈틈없이 까는 줄들.
 *
 * 한 줄에 몇 장을 놓을지, 그 폭을 어떻게 끊을지, 높이를 얼마로 할지 — 셋을
 * 따로 정하지 않고 함께 고른다. 사진이 가장 적게 잘리는 조합이 이긴다.
 *
 * 따로 정했을 때 무엇이 어긋나는지가 분명했다. 장수를 먼저 정하면 세로 사진
 * 셋이 한 줄에 들어가고, 그 줄은 조각이 넓은 만큼 높아져서 사진 세 장이 한
 * 화면을 다 먹는다. 같은 사진을 넷으로 놓으면 조각이 좁아지고 줄도 낮아진다 —
 * 세로 사진은 좁은 자리에 넣어야 줄이 낮아지고, 가로 사진은 그 반대다.
 * 무엇이 실리는지를 보지 않고는 정할 수 없는 값이었다.
 */
function bandsFor(
  images: readonly Cover[],
  seed: number,
  table: readonly (readonly Shape[])[],
): Band[] {
  const widest = table.length
  const out: Band[] = []
  let left = images.length
  let at = 0
  let step = 0

  while (left > 0) {
    /*
     * 첫 줄에는 네 장을 놓지 않는다.
     *
     * 네 장짜리 줄은 조각이 전부 3칸이라, 그 줄이 첫 줄이면 기록에서 가장 큰
     * 조각이 가장 작은 조각과 같아진다. 장소와 한 줄 설명이 붙는 자리가 그
     * 첫 조각이라서 글이 들어갈 데가 없어진다.
     */
    const most = step === 0 ? Math.min(widest, 3) : widest
    const above = out.at(-1)

    let band: (Band & { kept: number; size: number }) | null = null
    let anyway: (Band & { kept: number; size: number }) | null = null

    for (let size = 1; size <= Math.min(most, left); size += 1) {
      /* 다음 줄에 한 장만 남기지 않는다. 한 장짜리 줄은 드물어야 리듬이다. */
      if (left - size === 1 && left !== 1) continue

      const options = table[size - 1] ?? table[0]!
      const start = (seed + step) % options.length

      for (let turn = 0; turn < options.length; turn += 1) {
        const spans = laid(options[(start + turn) % options.length]!, step === 0)
        const rows = heightFor(spans, images, at)
        const here = { spans, rows, kept: keptAt(spans, images, at, rows), size }

        /* 우열이 같으면 장수가 많은 쪽 — 같은 자리에 더 많은 장면이 들어간다. */
        const better = (a: typeof here, b: typeof here | null) =>
          !b || a.kept > b.kept + 1e-9 || (a.kept > b.kept - 1e-9 && a.size > b.size)

        if (better(here, anyway)) anyway = here

        /*
         * 위아래 줄이 같은 자리에서 끊기지 않게 한다. 세로 선 하나가 기록을
         * 위에서 아래까지 가로지르면, 조각들이 서로 물린 판이 아니라 표가 된다.
         */
        if (above && above.spans.join() === spans.join()) continue
        if (better(here, band)) band = here
      }
    }

    const chosen = band ?? anyway!
    out.push({ spans: chosen.spans, rows: chosen.rows })

    left -= chosen.size
    at += chosen.size
    step += 1
  }

  return out
}

/** 한 조각이 판에서 차지하는 자리. 정사각형인 칸을 가로 cols개, 세로 rows개. */
type Piece = {
  image: Cover | undefined
  cols: number
  rows: number
  /** 자르지 않고 지면 위에 놓는 자리인지. */
  whole: boolean
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

  const seed = seedOf(session.slug)

  if (images.length === 0) {
    return [{ image: undefined, cols: table[0]![0]![0]!, rows: PLAIN, whole: false, lead: true }]
  }

  const out: Piece[] = []
  let at = 0

  for (const band of bandsFor(images, seed, table)) {
    for (const cols of band.spans) {
      const image = images[at]
      if (!image) break
      out.push({ image, cols, rows: band.rows, whole: image.whole === true, lead: at === 0 })
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
      data-whole={piece.whole ? true : undefined}
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
