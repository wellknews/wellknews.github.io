import type { CSSProperties, ReactNode } from 'react'

import { useViewport } from '../../layout/useViewport'
import { Amount } from '../../components/session/Amount'
import { Move } from '../../components/session/Move'
import { Passage } from '../../components/session/Passage'
import { Place } from '../../components/session/Place'
import { Plate } from '../../components/session/Plate'
import { Scene } from '../../components/session/Scene'
import { useInView } from '../../motion/useInView'
import type { Cover, Session } from '../types'
import styles from './signiel-exhibition.module.css'

/* ─────────────────────────────  사진  ─────────────────────────────
 *
 * 이번 기록에는 두 장만 쓴다.
 *
 * 둘 다 그날 실제로 찍은 사진을 정방형으로 잘라 색만 한 단계 가라앉혔다.
 * 사람을 옮기거나 작품을 다시 그리거나 공간을 만들어내지 않았다. SESSION의
 * 사진은 분위기를 꾸미는 이미지가 아니라 그 문단이 실제로 있었음을 보여 주는
 * 근거라서, 구도가 마음에 들지 않는 사진을 생성 이미지로 교체하지 않는다.
 *
 * 객실 전체를 찍은 사진도 있었지만 쓰지 않는다. 사람의 자세와 중앙의 가구가
 * 판면을 너무 많이 가져갔고, 그 장면을 고치려면 실제로 없던 순간을 만들어야
 * 했다. 결벽은 기록을 깨끗하게 다시 만드는 것이 아니라, 기준을 못 넘은 한 장을
 * 버리는 쪽으로 쓴다.
 */
const ramen: Cover = {
  src: '/media/session/signiel-exhibition/01-ramen.webp',
  alt: '흰 그릇에 담긴 진한 닭육수 라멘. 반숙란과 목이버섯과 파가 얹혀 있고 붉은 기름이 떠 있다',
  width: 1086,
  height: 1448,
}

const windowArt: Cover = {
  src: '/media/session/signiel-exhibition/02-window-art.webp',
  alt: '서울 전경이 내려다보이는 높은 창가에 광택 나는 꽃 그림 석 점이 바닥과 창턱에 기대어 놓여 있고, 옆 좌대 위에 왕관을 쓴 붉은 캐릭터 조형물과 작가 이름이 적힌 상자가 있다',
  width: 1086,
  height: 1448,
  /* 창밖의 도시가 아니라 바닥에 기대어 놓인 그림들이 이 사진의 내용이다. */
  focus: { x: 0.4, y: 0.62 },
}

/*
 * 마지막 한 장.
 *
 * 이 기록이 쓰인 자리다. 시그니엘에서 내려와 앉은 롯데월드몰 CHAGEE의 테이블
 * 위이고, 전날 강남에서 못 갔던 곳이 여기 있었다는 사실이 이 사진의 내용이다.
 */
const chagee: Cover = {
  src: '/media/session/signiel-exhibition/03-chagee.webp',
  alt: '베이지색 테이블 위에 놓인 남색 별자리 무늬의 CHAGEE 테이크아웃 컵과 그 옆의 매장 이용 안내 팻말',
  width: 1086,
  height: 1448,
}

/* ─────────────────────────────  본문  ─────────────────────────────
 *
 * 인터랙션이 문장을 대신하는 자리는 그 문장을 아래에서 한 번 더 반복하지 않는다.
 * 이번 기록의 첫 시안은 객실 복도에서 들은 말을 보여 준 다음 같은 말을 Passage로
 * 다시 읽게 했고, 그 순간 장치는 본문이 아니라 본문을 재연하는 삽화가 됐다.
 *
 * 여기서는 각 문장을 정확히 한 번만 쓴다. 복도에서 읽은 것은 복도가 본문이고,
 * 일반 문단으로 읽은 것은 장치가 다시 말하지 않는다.
 */
const start = (
  <>
    <p>토요일은 명동역에서 시작했다.</p>
    <p>용산역에 들러 짐을 맡겼는데, 보관함이 기본 2시간 1,000원에 이후 1시간당 200원이었다.</p>
  </>
)

const lockerAfter = (
  <>
    <p>
      다른 곳은 시작부터 4천 원 정도 받는 경우가 많아서 거의 국가에서 운영하나 싶을 만큼 싸게
      느껴졌다.
    </p>
    <p>다음에도 용산역을 거점으로 쓸 일이 있으면 다시 이용하고 싶을 정도였다.</p>
  </>
)

const mall = (
  <>
    <p>그다음 잠실로 이동했다.</p>
    <p>롯데월드몰은 사람이 정말 많았다.</p>
    <p>여기도 웨이팅, 저기도 웨이팅이었다.</p>
    <p>
      전날 치폴레도 오래 기다렸지만 그때는 가을 바람도 불고 강남 사람들을 구경하는 맛이라도 있었다.
    </p>
    <p>롯데월드몰은 전부 실내라 개방감이 없고 사람이 빽빽해서 훨씬 답답했다.</p>
  </>
)

const ramenRush = (
  <>
    <p>그래도 오레노라멘은 약 30분 정도 만에 들어갔다.</p>
    <p>라멘은 엄청 급하게 먹었다.</p>
  </>
)

const ramenHabit = (
  <>
    <p>먹는 속도도 늘었고 빠르게 먹는 데 익숙해진 것 같았다.</p>
    <p>직장에서 밥 먹던 버릇이 여기에서도 쓰인 것 같았다.</p>
  </>
)

const refill = (
  <>
    <p>면 반 덩이를 추가할 수 있었고 육수도 더 받을 수 있었는데 추가금은 없었다.</p>
  </>
)

const signielDoor = (
  <>
    <p>그렇게 금방 먹고 시그니엘로 갔다.</p>
    <p>입구에서는 정장을 입은 문지기가 기분 좋게 인사해줬다.</p>
    <p>기품인지 허영인지 모를 차림의 아트페어 참가자들과 함께 엘리베이터를 타고 79층으로 날았다.</p>
  </>
)

const lobby = (
  <>
    <p>79층은 로비였다.</p>
    <p>훈훈하게 생긴 서버들을 지나며 가볍게 주변을 훑어봤다.</p>
    <p>
      예전에 시그니엘에 왔을 때는 로비만 구경하고 내려갔는데, 이번에는 숙박객용 엘리베이터로
      갈아타고 더 위로 올라갈 수 있었다.
    </p>
  </>
)

const pass = (
  <>
    <p>그 순간에는 7천 원짜리 통행권이 드디어 빛을 발한다는 생각이 들었다.</p>
  </>
)

const fair = (
  <>
    <p>
      아트페어 참가자들의 나이대는 대체로 40대를 넘긴 올드비 쪽이었고, 간헐적으로 30대나 그보다 더
      어려 보이는 사람들도 있었다.
    </p>
    <p>행사 구성은 호텔 객실을 각각 화랑처럼 바꿔놓은 방식이었다.</p>
    <p>객실 번호 위에는 각 갤러리 이름이 붙어 있었다.</p>
  </>
)

/*
 * 층 전체를 보고 든 생각.
 *
 * 한동안 이 넷이 복도 안에서 다섯 걸음에 나뉘어 있었다. 복도는 걸어가며 주워
 * 듣는 장치인데, 이것은 주워들은 말이 아니라 층을 보고 든 생각이다. 장치가
 * 문장을 대신할 수 없는 자리라 본문으로 돌려보냈다.
 */
const fleaMarket = (
  <>
    <p>시그니엘의 한 층이 갑자기 웰메이드 플리마켓이 된 것 같아서 웃겼다.</p>
    <p>
      플리마켓이라는 표현이 모멸적으로 들릴 수도 있지만, 각 방에 있는 미술관장들의 목적은 꽤
      명확했다.
    </p>
    <p>그림을 파는 것이었다.</p>
    <p>그리고 그 취지는 생각보다 노골적이었다.</p>
  </>
)

const afterCorridor = (
  <>
    <p>내가 미술 작품을 비웃고 싶어지는 이유도 조금 더 분명해졌다.</p>
    <p>작품이 말하고자 하는 메시지보다 그럴싸한 포장이 더 먼저 드러나는 것 같아서다.</p>
    <p>허영 같아서 웃긴다.</p>
    <p>그렇다고 싫다는 뜻은 아니다.</p>
    <p>그냥 장난스럽고, 위트 있다고 느끼는 쪽에 가깝다.</p>
  </>
)

const engineering = (
  <>
    <p>
      대다수는 실용적 효용이 거의 없는 물건인데, 그걸 둘러싼 사람들은 아주 진지하게 논의하고 최대한
      있어 보이려고 노력한다.
    </p>
    <p>나는 오히려 그 사회공학이 배울 만하다고 느꼈다.</p>
  </>
)

const nonverbal = (
  <>
    <p>어쩌면 비언어를 읽고 쓰는 요령의 절벽 끝 같은 곳일지도 모른다.</p>
  </>
)

const display = (
  <>
    <p>
      미술관장들의 기분 좋은 허영은 예쁘고 센스 있는 패션으로도, 올드머니 스타일로도 디스플레이되고
      있었다.
    </p>
    <p>
      옷차림, 말투, 작품을 설명하는 방식, 어떤 이름을 자연스럽게 꺼내는지 같은 것들이 전부 하나의
      장면처럼 보였다.
    </p>
  </>
)

const tea = (
  <>
    <p>구경을 끝내고 다시 내려왔다.</p>
    <p>그리고 어제 강남에서 결국 못 갔던 CHAGEE가 롯데월드몰에도 있다는 걸 알게 됐다.</p>
    <p>지금은 롯데월드몰 CHAGEE에 앉아 이 글을 쓰고 있다.</p>
  </>
)

/*
 * 소음과 노캔이 한 문장이다.
 *
 * 원문에서 «사람이 존나 많고»와 «노캔 헤드폰을 쓰고 있다»는 쉼표 하나로 이어진
 * 한 문장이다. 앞뒤를 갈라 두 문단으로 만들면 읽기는 편해지지만 그날 실제로
 * 적힌 문장이 아니게 된다. 주변이 사라지는 순간은 이 한 문장이 판면에 들어올
 * 때로 잡는다.
 */
const anc = (
  <>
    <p>사람이 존나 많고 어지간히 시끄러워서 노캔 헤드폰을 쓰고 있다.</p>
  </>
)

const x = (
  <>
    <p>헤드폰에서는 죽은 텐타시온의 노래가 나온다.</p>
  </>
)

const black = (
  <>
    <p>괜히 맞짱 뜨러 다니고 깝싸고 그러면</p>
    <p>죽을 수도 있다.</p>
  </>
)

const last = (
  <>
    <p>아무튼 나는 구경만 했다.</p>
  </>
)

/* ─────────────────────────────  용산 보관함  ─────────────────────────────
 *
 * 가격표를 카드로 만들지 않는다. 이 숫자가 기억에 남은 이유는 싸서였고, 싸다는
 * 사실은 숫자 둘이면 충분하다. 보관함 그림이나 비교 그래프를 붙이면 «공공서비스
 * 가격 설명»이 되고, 이 장면은 그저 이동 중 발견한 작은 이득이었다.
 */
function LockerRate() {
  return (
    <div
      className={styles.rate}
      aria-label="용산역 보관함 요금, 기본 2시간 1,000원, 이후 시간당 200원"
    >
      <p className={`mono ${styles.rateMain}`}>₩1,000 / 2H</p>
      <p className={`mono ${styles.rateMore}`}>+ ₩200 / H</p>
    </div>
  )
}

/* ─────────────────────────────  실내의 밀도  ─────────────────────────────
 *
 * 전날의 Wait는 긴 스크롤 거리 자체가 오래 기다린 시간을 뜻했다. 오늘의 핵심은
 * 시간이 아니라 같은 기다림이 실내에서는 훨씬 답답했다는 것이다. 그래서 이
 * 구간은 길어지지 않는다. 같은 Scene 높이 안에서 글의 양옆만 조금씩 조인다.
 *
 * 화면 가장자리의 짧은 막대는 사람을 그린 것이 아니다. 의미 없는 밀도다. 실제로
 * 들은 말을 만들어 넣지 않고, 가독성을 건드리지 않는 바깥쪽에서만 움직인다.
 */
function Density({ children }: { children: ReactNode }) {
  return (
    <div className={styles.density}>
      <div className={styles.densityNoise} aria-hidden="true">
        {Array.from({ length: 14 }, (_, index) => (
          <span key={index} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
      <div className={styles.densityBody}>{children}</div>
    </div>
  )
}

/* ─────────────────────────────  79 → 87  ─────────────────────────────
 *
 * 엘리베이터를 그리지 않는다. 버튼도 문도 층별 눈금도 없다. 이 장면에서 기억에
 * 남은 것은 79층 로비에서 갈아탄 뒤 87층까지 올라갔다는 두 숫자다.
 *
 * 기본 상태에서는 두 줄을 정적으로 읽는다. 스크롤 타임라인을 아는 화면에서만
 * 79가 짧게 위로 밀리고 87이 올라온다. «날았다»는 표현 때문에 상승 구간을
 * 길게 늘이지 않는다 — 오래 올라간 것이 아니라 빨리 장면이 바뀐 쪽이다.
 */
function FloorShift() {
  return (
    <div className={styles.floorShift} aria-label="79층 로비에서 87층 아트페어로 이동">
      <p className={`mono ${styles.floorFrom}`}>79F / LOBBY</p>
      <span className={styles.floorRule} aria-hidden="true" />
      <p className={`mono ${styles.floorTo}`}>87F / ART FAIR</p>
    </div>
  )
}

/*
 * 87층에서 주워들은 말.
 *
 * 따옴표를 쓸 수 있는 것은 문장 형태로 기억한 두 발화뿐이다. 세 번째는 방
 * 안이 아니라 방과 방 사이에서 떠다닌 말이라 따옴표를 붙이지 않는다. 첫
 * 시안처럼 전부 직접 인용으로 만들면 기록을 정돈한 것이 아니라 말을 새로
 * 만들어낸 것이 된다.
 */
type Heard = {
  id: string
  /** 그대로 옮길 수 있는 발화인지. 요약해 기억한 말에는 따옴표를 붙이지 않는다. */
  verbatim: boolean
  said: string
  /** 그 말에 속으로 한 마디. */
  back?: string
}

const heard: readonly Heard[] = [
  {
    id: 'kusama',
    verbatim: true,
    said: '요즘은 쿠사마 야요이보다 요시모토 나라가 뛰어넘었어요.',
    back: '무엇을?',
  },
  {
    id: 'warhol',
    verbatim: true,
    said: '이 작가님은 차세대 앤디 워홀로 인정받기 시작했어요. 지금 사두시면 좋아요.',
    back: '앤디 워홀이 상업 작가여서 그런 비교를 한 거라면 차라리 설득력이 있겠다고 생각했지만, 나는 별로 인정하고 싶지 않았다.',
  },
  {
    id: 'between',
    verbatim: false,
    said: '방과 방 사이에서는 작품 이야기만 오간 것도 아니었다.',
    back: '캔버스가 너무 비싸졌다는 얘기, 거래가 다 끊겼다는 얘기, 누구와 사이가 나빠져서 슬펐다는 얘기, 명품 선물을 해주면 관계가 다시 풀릴 것 같다는 얘기 같은 소소한 잡담들도 흘러다녔다.',
  },
] as const

/* ─────────────────────────────  87층의 복도  ─────────────────────────────
 *
 * 문을 두 번 그렸고 두 번 다 문으로 읽히지 않았다. 처음에는 커다란 테두리
 * 사각형 셋이었고(빈 상자로 읽혔다), 다음에는 굵은 세로줄과 가는 세로줄이었다
 * (그냥 선으로 읽혔다). 둘 다 같은 이유로 실패했다 — **그려 놓고 문이라는
 * 신호를 하나도 주지 않았다.**
 *
 * 문이 문으로 읽히려면 몇 가지가 필요하다. 바닥에 서 있어야 하고, 사람만 한
 * 비율(대략 1:2)이어야 하고, 손잡이가 있어야 하고, 열려 있다면 문짝이 돌아간
 * 모양이 보여야 한다. 이 넷이 없으면 어떤 사각형도 그냥 사각형이다.
 *
 * 호텔을 재현하지는 않는다. 개발 요청서가 적어 둔 것만 그린다 — 바닥선,
 * 상단 기준선, 객실 문. 객실 번호와 갤러리 이름은 기록해 두지 않았으므로
 * 그 자리를 지어내지 않는다.
 */

/*
 * 도면의 좌표계.
 *
 * 높이는 고정이고 폭만 판면을 따라간다. 좁은 판면에서 넓은 판면과 같은 폭을
 * 쓰면 도면이 높이에 맞춰 확대되면서 왼쪽이 잘려 나가고, 하필 그 잘리는
 * 자리에 열린 문이 있었다. 폭을 줄이면 확대는 늘 가로가 정하게 되고, 문의
 * 자리와 글의 자리가 어느 폭에서도 같은 세로선에 남는다.
 */
const PLAN = { wide: 1200, narrow: 480, height: 360, floor: 330 } as const

/** 문 하나. 100 × 215 — 1:2.15, 사람이 지나다니는 비율이다. */
const DOOR = { width: 100, height: 215, pitch: 240 } as const

/*
 * 열린 문이 늘 서 있는 자리.
 *
 * 걷는 사람은 제자리에 있고 복도가 지나간다. 이 수는 아래의 글이 시작하는
 * 자리이기도 하다 — 열린 문과 그 앞에서 주운 말은 같은 세로선에 선다. 두 값을
 * 따로 적으면 화면 폭이 바뀔 때마다 어긋나므로, CSS에는 이 수를 비율로
 * 내려보낸다(--seat).
 */
const SEAT = 79

/*
 * 한 걸음에서 세워 둘 문들.
 *
 * 열린 문은 늘 같은 자리(SEAT)에 서고, 나머지 문들이 걸음마다 왼쪽으로
 * 흘러간다. 걷는 사람은 제자리에 있고 복도가 지나가는 셈이다.
 *
 * 미는 거리를 문 사이 간격의 3분의 1로 둔다. 한 칸을 통째로 밀면 미는 거리와
 * 간격이 같아져서 세 걸음이 전부 똑같은 그림이 된다 — 움직이는 코드는 있는데
 * 화면에서는 아무것도 움직이지 않는다. 한 번 그렇게 만들어 봤다.
 */
const DRIFT = DOOR.pitch / 3

/** 열린 문의 자리를 비워 둔다. 겹쳐 그리면 문 두 짝이 한자리에 선다. */
function doorsAt(step: number): number[] {
  const out: number[] = []

  for (let n = -2; n <= 6; n += 1) {
    const x = SEAT + DOOR.pitch * n - DRIFT * step
    if (Math.abs(x - SEAT) < DOOR.pitch * 0.72) continue
    out.push(x)
  }

  return out
}

function Door({ x, open }: { x: number; open: boolean }) {
  const top = PLAN.floor - DOOR.height
  const mid = top + DOOR.height * 0.52

  return (
    <g className={styles.door} data-open={open ? true : undefined}>
      {/* 문 안쪽. 문짝이 비켜난 만큼만 드러난다. 방 안을 그리지는 않는다. */}
      {open ? (
        <rect className={styles.gap} x={x} y={top} width={DOOR.width} height={DOOR.height} />
      ) : null}

      <rect className={styles.frame} x={x} y={top} width={DOOR.width} height={DOOR.height} />

      {/*
        문짝. 경첩은 왼쪽이다.

        여는 것을 가로 배율로 한다. 정면에서 본 문은 열릴수록 폭이 줄어드는
        것으로 보이고, 줄어든 만큼 뒤의 어둠이 드러난다 — 실제로 눈에 들어오는
        변화가 그것뿐이라 그것만 그린다. 손잡이도 같이 줄어드는데, 그것도 맞다.
      */}
      <g className={styles.swing}>
        <rect className={styles.leaf} x={x} y={top} width={DOOR.width} height={DOOR.height} />
        <line
          className={styles.knob}
          x1={x + DOOR.width - 18}
          y1={mid}
          x2={x + DOOR.width - 4}
          y2={mid}
        />
      </g>
    </g>
  )
}

/**
 * 복도 한 칸과, 그 앞에서 주워들은 말.
 *
 * 걷는 사람은 제자리에 있고 복도가 지나간다. 열린 문은 늘 같은 자리(SEAT)에
 * 서고, 그 아래 같은 칼럼에서 말을 줍는다 — 문이 움직이고 글이 따라다니면
 * 읽는 자리가 매번 달라진다.
 *
 * 문과 문 «사이»에서 들은 말에는 열린 문이 없다. 그 말은 방에서 나온 것이
 * 아니라 복도에 떠다니던 것이라, 그 걸음에서는 모든 문이 닫힌 채 지나간다.
 */
function Corridor({ item, step, wide }: { item: Heard; step: number; wide: boolean }) {
  const between = !item.verbatim
  const width = wide ? PLAN.wide : PLAN.narrow

  return (
    <div
      className={styles.corridor}
      style={{ '--seat': `${((SEAT / width) * 100).toFixed(3)}%` } as CSSProperties}
    >
      <svg
        className={styles.plan}
        viewBox={`0 0 ${width} ${PLAN.height}`}
        /* 왼쪽 기준으로 자른다. 가운데 기준이면 열린 문이 먼저 잘린다. */
        preserveAspectRatio="xMinYMax slice"
        aria-hidden="true"
      >
        {/*
          지나가는 문들.

          이쪽만 흐른다. 지금 지나는 방은 제자리에 서 있어야 아래의 글과 같은
          세로선에 남는다 — 걷는 사람은 제자리이고 복도가 지나간다.
        */}
        <g className={styles.row}>
          {doorsAt(step).map((x) => (
            <Door key={x} x={x} open={false} />
          ))}
        </g>

        {/* 지금 지나는 방. 열려 있거나(방에서 들린 말) 닫혀 있다(복도의 말). */}
        <Door x={SEAT} open={!between} />

        {/*
        바닥. 문이 서 있는 자리다.

        천장선도 그려 두었다가 지웠다. 도면을 판면 폭에 맞춰 자르면(slice) 위가
        먼저 잘려서 그 선만 사라지고, 잘리지 않을 만큼 내려 그으면 문 위 19칸에
        뜬금없는 가로줄 하나가 남는다. 문이 바닥에 서 있으면 벽은 이미 있다.
      */}
        <line className={styles.wall} x1="0" y1={PLAN.floor} x2={width} y2={PLAN.floor} />
      </svg>

      <div className={styles.heard} data-between={between ? true : undefined}>
        <p className={styles.said}>{item.verbatim ? `“${item.said}”` : item.said}</p>
        {item.back ? <p className={styles.back}>{item.back}</p> : null}
      </div>
    </div>
  )
}

/**
 * 87층에서 주워들은 말 셋.
 *
 * 판면의 폭을 알아야 도면의 좌표계를 정할 수 있어서 한 겹 감싼다. body는
 * 정적인 JSX라 그 안에서는 판면을 물어볼 수 없다.
 */
function Corridors() {
  const wide = useViewport() !== 'compact'

  return (
    <>
      {heard.map((item, index) => (
        <Scene key={item.id} width="bleed" air>
          <Corridor item={item} step={index} wide={wide} />
        </Scene>
      ))}
    </>
  )
}

/**
 * 마지막에 남은 말.
 *
 * 여기에도 문을 그려 두었다가 지웠다. 빈 사각형 하나가 «닫힌 문»으로 읽히지
 * 않는다. 닫아 두는 일은 문장이 이미 하고 있다 — 속으로만 말했고, 들어가지
 * 않았고, 구경만 했다.
 *
 * 액자를 지우지 않는다. «진지한 척 좀 하지 마»만 남기면 이 문장은 미술계에
 * 건 선언이 된다. 원문에서 이것은 앞뒤로 «솔직히 속으로는»과 «라고 말하고
 * 싶은 순간도 있었다»에 싸여 있고, 그 두 마디가 이것을 속말로 붙들고 있다.
 */
function Inside() {
  return (
    <div className={styles.closedText}>
      <p className={styles.closedFrame}>솔직히 속으로는</p>
      <p className={styles.closedLine}>진지한 척 좀 하지 마.</p>
      <p className={styles.closedFrame}>라고 말하고 싶은 순간도 있었다.</p>
      <p>그래도 내가 거기 맞짱 뜨러 간 건 아니었다.</p>
      <p>그냥 구경하러 간 거였다.</p>
    </div>
  )
}

/**
 * CHAGEE의 소음과 노이즈 캔슬링.
 *
 * 소음을 «주문번호», «웃음», «의자 끄는 소리» 같은 가짜 대사로 만들지 않는다.
 * 그날 확실히 남은 사실은 사람이 많았고 몹시 시끄러웠다는 것뿐이다. 주변에는
 * 뜻 없는 선과 점만 움직인다.
 *
 * 노캔 문장이 화면에 충분히 들어오면 한 번만 사라진다. useInView의 기본값은
 * replay=false라서, 다시 위로 올려도 주변 소음이 되살아나지 않는다. 헤드폰을
 * 쓴 뒤의 글은 조용한 판면에 남아야 한다.
 */
function NoiseField() {
  const { ref, inView } = useInView<HTMLDivElement>({ amount: 0.55 })

  return (
    <div className={styles.noiseField} data-cancelled={inView}>
      <div className={styles.noise} aria-hidden="true">
        {Array.from({ length: 24 }, (_, index) => (
          <span key={index} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>

      <div className={styles.noiseCopy}>
        <div ref={ref}>
          <Passage>{anc}</Passage>
        </div>
      </div>
    </div>
  )
}

export const signielExhibition: Session = {
  slug: 'signiel-exhibition',
  title: '시그니엘에서 전시를',
  subtitle: 'SEOUL',
  meta: {
    date: '2026-09-19',
    /*
     * 잠실 하나로 적는다.
     *
     * 명동에서 출발했고 용산역을 거쳤지만 그 둘은 지나간 자리다. 이 기록이
     * 서 있는 곳은 87층이고, 목록의 메타데이터는 그날의 동선이 아니라 그
     * 기록이 어디의 기록인지를 적는 자리다. 지나온 곳은 본문이 말한다.
     */
    location: '서울 잠실',
  },
  excerpt: '호텔 객실이 갤러리가 된 87층에서 그림보다 먼저 보인 것들이 있었다.',

  /*
   * 도슨트의 자리다.
   *
   * 처음에는 여기에 «제목은 「티파니에서 아침을」의 문형을 빌렸다»부터 적혀
   * 있었다. 그것은 배경이 아니라 쓴 사람의 해설이다 — 읽는 사람이 몰라서 막히는
   * 자리가 아니라, 알아도 그만인 자리다. 이 저장소의 다른 안내는 그렇게 쓰이지
   * 않았다. 군단이 실제 조직이 아니라는 것, 51%가 언제부터 쓰던 숫자인지,
   * 분할 정복이 무엇인지 — 전부 그 글에서 «모르면 문장이 안 읽히는» 것들이다.
   *
   * 이 기록에서 그런 자리는 하나다. 호텔 객실이 갤러리가 되었다는 문장은
   * 그런 형식의 행사가 있다는 것을 모르면 이상한 장면으로만 읽힌다.
   *
   * 마지막 문장이 무엇을 회수하는지는 적지 않는다. 그날의 태도가 비웃음인지
   * 흥미인지도 적지 않는다. 그것은 읽으면서 알아채는 몫이고, 여기서 먼저
   * 말하면 출발선이 아니라 정답지가 된다.
   */
  guide: (
    <>
      <p>
        아트페어 중에는 호텔에서 열리는 형식이 있다. 갤러리들이 객실을 하나씩 빌려 그 안을 그대로
        전시장으로 쓴다.
      </p>

      <p>
        벽에 걸고, 창턱에 기대 놓고, 침대와 바닥까지 전시대가 된다. 객실 문 앞에는 호수 대신 그 방을
        쓰는 갤러리의 이름이 붙는다. 이 글의 87층이 그런 층이었다.
      </p>

      <p>
        시그니엘은 잠실 롯데월드타워 안에 있는 호텔이다. 79층이 그 호텔의 로비이고, 나는 숙박객이
        아니라 그 위층에서 열린 행사를 보러 갔다.
      </p>

      <p>전날의 기록이 하나 앞에 있다.</p>

      <p>
        그날 강남에서 치폴레를 오래 기다렸고, 그 뒤에 가려던 CHAGEE는 시간이 모자라 일정에서 빠졌다.
        이 글에서 두 이름이 다시 나오는 것은 그래서다.
      </p>

      <p>제목은 「티파니에서 아침을」의 문형을 빌렸다.</p>
    </>
  ),
  display: 'stage',
  cover: windowArt,
  images: [ramen, windowArt, chagee],

  body: (
    <>
      <Scene>
        <Place
          name="MYEONG-DONG STATION"
          address="서울 중구 퇴계로 지하 126"
          district="MYEONG-DONG"
          date="2026.09.19"
        />
        <Passage>{start}</Passage>
      </Scene>

      <Scene>
        <Move from="MYEONG-DONG" to="YONGSAN" />
      </Scene>

      <Scene>
        <Place name="YONGSAN STATION" address="서울 용산구 한강대로23길 55" district="YONGSAN" />
        <LockerRate />
        <Passage>{lockerAfter}</Passage>
      </Scene>

      <Scene>
        <Move from="YONGSAN" to="JAMSIL" />
      </Scene>

      <Scene>
        <Place name="LOTTE WORLD MALL" address="서울 송파구 올림픽로 300" district="JAMSIL" />
        <Density>
          <Passage>{mall}</Passage>
        </Density>
      </Scene>

      <Scene pace="brisk">
        <Move from="LOTTE WORLD MALL" to="ORENO RAMEN" quiet />
      </Scene>

      <Scene pace="brisk">
        <Place
          name="ORENO RAMEN LOTTE WORLD MALL"
          address="서울 송파구 올림픽로 300 롯데월드몰 5층"
          district="JAMSIL"
        />
        <Passage>{ramenRush}</Passage>
      </Scene>

      <Scene pace="fast" width="bleed">
        <Plate image={ramen} tone="full" />
      </Scene>

      <Scene pace="fast">
        <Passage>{ramenHabit}</Passage>
      </Scene>

      <Scene pace="rushed">
        <Passage>{refill}</Passage>
        <p className={`mono ${styles.refill}`}>NOODLE +0.5 / BROTH + / ₩0</p>
      </Scene>

      <Scene>
        <Move from="ORENO RAMEN" to="SIGNIEL SEOUL" quiet />
      </Scene>

      <Scene>
        <Place name="SIGNIEL SEOUL" address="서울 송파구 올림픽로 300" district="JAMSIL" />
        <Passage>{signielDoor}</Passage>
      </Scene>

      <Scene>
        <Passage>{lobby}</Passage>
      </Scene>

      <Scene air>
        <FloorShift />
      </Scene>

      <Scene>
        <Amount value="7,000" currency="KRW" />
        <Passage>{pass}</Passage>
      </Scene>

      <Scene>
        <Place
          name="THE SELECT ART FAIR 2026 · SIGNIEL SEOUL"
          address="서울 송파구 올림픽로 300 롯데월드타워 87층"
          district="JAMSIL"
        />
        <Passage>{fair}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={windowArt} tone="full" />
      </Scene>

      {/*
        층을 보고 든 생각. 복도로 들어가기 전에 한 번 선다.

        표시는 한 번만 찍는다. 이 말이 재밌는 것은 «웰메이드 플리마켓»이라는
        낙차 하나이고, 낙차는 반복하면 사라진다.
      */}
      <Scene air>
        <p className={`mono ${styles.marketLabel}`}>WELL-MADE FLEA MARKET</p>
        <Passage>{fleaMarket}</Passage>
      </Scene>

      {/*
        주워들은 말 셋. 한 번에 하나씩 지나간다.

        복도를 그리지 않는다. 그릴 근거가 없어서다 — 이 구간에는 복도 사진이
        없고 객실 번호도 갤러리 이름도 기록해 두지 않았다. 지나가며 줍는다는
        것은 장면마다의 여백이 한다.
      */}
      <Corridors />

      <Scene>
        <Passage>{afterCorridor}</Passage>
      </Scene>

      <Scene>
        <Passage>{engineering}</Passage>
      </Scene>

      <Scene air>
        <div className={styles.nonverbal}>
          <Passage>{nonverbal}</Passage>
        </div>
      </Scene>

      <Scene>
        <Passage>{display}</Passage>
      </Scene>

      <Scene air>
        <Inside />
      </Scene>

      <Scene>
        <Move from="SIGNIEL" to="CHAGEE" quiet />
      </Scene>

      <Scene>
        <Place name="CHAGEE LOTTE WORLD" address="서울 송파구 올림픽로 300" district="JAMSIL" />
        <Passage>{tea}</Passage>
      </Scene>

      {/* 이 글이 쓰인 자리. 시그니엘의 창가 그림 다음에 오는 유일한 사물이다. */}
      <Scene width="bleed">
        <Plate image={chagee} tone="full" />
      </Scene>

      <Scene width="bleed">
        <NoiseField />
      </Scene>

      <Scene air>
        <Passage>{x}</Passage>
      </Scene>

      <Scene air>
        <div className={styles.black}>
          <Passage>{black}</Passage>
        </div>
      </Scene>

      <Scene air>
        <div className={styles.last}>
          <Passage>{last}</Passage>
        </div>
      </Scene>
    </>
  ),
}
