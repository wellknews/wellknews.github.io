import type { CSSProperties } from 'react'

import type { Cover, Session } from '../content/types'
import { useViewport } from '../layout/useViewport'
import { Link, path } from '../router'
import { EmptyState } from './EmptyState'
import { MetaLine } from './MetaLine'
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
  image: Cover
  cols: number
  rows: number
  /** 자르지 않고 지면 위에 놓는 자리인지. */
  whole: boolean
}

/**
 * 그 기록이 판에서 쓰는 조각들.
 *
 * 사진이 없으면 아무 조각도 없다. 한 줄 요약도 제목도 이제 판이 아니라 그
 * 위의 머리에 적히므로, 걸 사진이 없는 날은 머리만 있고 판이 없다 — 빈
 * 지면 한 조각을 두면 «사진이 있는데 안 나온다»로 읽힌다.
 */
function piecesFor(session: Session, wide: boolean): Piece[] {
  const images = session.images ?? (session.cover ? [session.cover] : [])
  const table = wide ? WIDE : NARROW

  const seed = seedOf(session.slug)

  if (images.length === 0) return []

  const out: Piece[] = []
  let at = 0

  for (const band of bandsFor(images, seed, table)) {
    for (const cols of band.spans) {
      const image = images[at]
      if (!image) break
      out.push({ image, cols, rows: band.rows, whole: image.whole === true })
      at += 1
    }
  }

  return out
}

/**
 * 기록 하나 — 방주와 판.
 *
 * 이 페이지는 목록이 아니라 축적이다. 지면의 내용은 그날이 남긴 사진이고,
 * 글자는 그 축적에 눈금을 매긴다. 그래서 이름은 사진 «위»가 아니라 «옆»에
 * 선다 — 날짜와 장소가 왼쪽 여백 칼럼에 앉고, 제목과 한 줄이 판과 같은
 * 칼럼의 머리에 앉는다. THREAD의 글이 앉는 방식과 같은 조판이다(방주).
 *
 * 두 번 틀렸던 자리다. 한 번은 이름을 조각 밑에 깔고 사진으로 덮었다 —
 * 조판으로는 옳았지만 무엇이 있는지 알려면 서른세 번을 지나가 봐야 했다.
 * 그다음에는 옆 목록(CODE)의 인덱스 행을 통째로 가져와 판 위에 얹었다 —
 * 세리프 표제와 발췌와 화살표가 판면을 가로지르는 행이 되어, 한 페이지 안에
 * 목차와 갤러리라는 두 체계가 겹쳤다. 사진이 정보를 나르지도 않으면서
 * 지면의 대부분을 쓰고 있으니 어느 쪽으로도 읽히지 않았다.
 *
 * 화살표를 두지 않는다. 판 전체가 이미 그 기록으로 가는 문이라, 그 자리에
 * «여기를 누르세요»를 한 번 더 적으면 그것은 안내가 아니라 장식이다.
 */
function Record({ session, wide }: { session: Session; wide: boolean }) {
  const pieces = piecesFor(session, wide)
  const to = path.session(session.slug)

  return (
    <section className={styles.record}>
      <div className={styles.aside}>
        <MetaLine meta={session.meta} className={styles.meta} />
      </div>

      <div className={styles.name}>
        <h2 className={styles.title}>
          <Link to={to} className={styles.seat}>
            {session.title}
          </Link>
        </h2>

        {session.excerpt ? <p className={styles.line}>{session.excerpt}</p> : null}
      </div>

      {pieces.length > 0 ? (
        <div className={styles.plate}>
          <div className={styles.band}>
            {pieces.map((piece, index) => (
              /*
               * 조각도 같은 곳으로 간다.
               *
               * 낭독과 키보드에서는 건너뛴다. 이 기록으로 가는 길은 위의 제목
               * 하나로 충분하고, 같은 주소를 가리키는 링크 열한 개가 차례로
               * 읽히면 목록이 아니라 소음이 된다. 눌리기는 그대로 눌린다.
               */
              <Link
                key={`${session.slug}@${index}`}
                to={to}
                className={styles.piece}
                style={{ '--cols': piece.cols, '--rows': piece.rows } as CSSProperties}
                data-whole={piece.whole ? true : undefined}
                tabIndex={-1}
                aria-hidden
              >
                <img
                  className={styles.face}
                  src={piece.image.src}
                  alt=""
                  width={piece.image.width}
                  height={piece.image.height}
                  loading="lazy"
                  decoding="async"
                  style={
                    {
                      '--fx': `${(piece.image.focus?.x ?? 0.5) * 100}%`,
                      '--fy': `${(piece.image.focus?.y ?? 0.5) * 100}%`,
                    } as CSSProperties
                  }
                />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}

/**
 * 지금까지 떼어낸 경험들이 쌓여 있는 판.
 *
 * 목차이면서 지형이다. 기록마다 머리 한 줄이 서고 그 아래에 그날이 실제로
 * 남긴 장면들이 붙는다. 멀리서 보면 사진이 시간을 따라 쌓인 한 장의 면이고,
 * 가까이 오면 어느 날의 무엇인지가 글자로 적혀 있다. GitHub가 코드를 잔디로
 * 쌓는다면 여기서는 경험을 장면으로 쌓는다 — 가져오는 것은 초록색 정사각형이
 * 아니라 «작은 단위가 시간을 따라 쌓인다»는 문법 하나다.
 *
 * 사진이 열한 장 남은 하루는 열한 조각을 차지하고, 한 장뿐인 날은 한 조각을
 * 차지한다. 그 차이를 평준화하지 않는다. 남은 사진의 수가 곧 그날의 밀도다.
 *
 * 시간은 위에서 아래로 흐른다. 가장 최근이 맨 위에 있고 내려갈수록 과거로
 * 간다. 새 기록이 생기면 맨 위에 한 덩어리가 얹힐 뿐, 아래의 판은 다시 짜이지
 * 않는다(seedOf).
 */
export function SessionTerrain({ sessions, empty }: Props) {
  const viewport = useViewport()
  const wide = viewport !== 'compact'

  if (sessions.length === 0) {
    return <EmptyState>{empty}</EmptyState>
  }

  return (
    <div className={styles.terrain}>
      {sessions.map((session) => (
        <Record key={session.slug} session={session} wide={wide} />
      ))}
    </div>
  )
}
