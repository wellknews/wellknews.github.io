import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

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

type CorridorStep =
  | {
      id: string
      kind: 'market'
      text: string
      phase: number
    }
  | {
      id: string
      kind: 'room'
      text: string
      verbatim: boolean
      note?: string
    }

/*
 * 복도에서 실제로 읽는 순서.
 *
 * 따옴표를 쓸 수 있는 것은 실제로 문장 형태로 기억한 두 발화뿐이다. 그 밖의
 * 항목은 대화의 내용을 요약해 기억한 것이므로 따옴표를 붙이지 않는다. 첫
 * 시안처럼 전부 직접 인용으로 만들면 기록을 정돈한 것이 아니라 말을 새로
 * 만들어낸 것이 된다.
 *
 * 처음 다섯 칸은 같은 자리에 머문다. 수직 스크롤은 진행되지만 복도는 움직이지
 * 않고 문장만 바뀐다. 이것이 «WELL-MADE FLEA MARKET»에서 잠깐 멈추는 구간이다.
 */
const corridorSteps: readonly CorridorStep[] = [
  {
    id: 'market-0',
    kind: 'market',
    phase: 0,
    text: '시그니엘의 한 층이 갑자기 웰메이드 플리마켓이 된 것 같아서 웃겼다.',
  },
  {
    id: 'market-1',
    kind: 'market',
    phase: 1,
    text: '플리마켓이라는 표현이 모멸적으로 들릴 수도 있지만,',
  },
  {
    id: 'market-2',
    kind: 'market',
    phase: 2,
    text: '각 방에 있는 미술관장들의 목적은 꽤 명확했다.',
  },
  {
    id: 'market-3',
    kind: 'market',
    phase: 3,
    text: '그림을 파는 것이었다.',
  },
  {
    id: 'market-4',
    kind: 'market',
    phase: 4,
    text: '그리고 그 취지는 생각보다 노골적이었다.',
  },
  {
    id: 'room-kusama',
    kind: 'room',
    verbatim: true,
    text: '요즘은 쿠사마 야요이보다 요시모토 나라가 뛰어넘었어요.',
    note: '무엇을?',
  },
  {
    id: 'room-warhol',
    kind: 'room',
    verbatim: true,
    text: '이 작가님은 차세대 앤디 워홀로 인정받기 시작했어요. 지금 사두시면 좋아요.',
    note: '앤디 워홀이 상업 작가여서 그런 비교를 한 거라면 차라리 설득력이 있겠다고 생각했지만, 나는 별로 인정하고 싶지 않았다.',
  },
  {
    id: 'room-other-talk',
    kind: 'room',
    verbatim: false,
    text: '방과 방 사이에서는 작품 이야기만 오간 것도 아니었다.',
  },
  /*
   * 한 문장을 쉼표에서만 끊는다.
   *
   * 원문에서 이 넷은 «캔버스가 너무 비싸졌다는 얘기, 거래가 다 끊겼다는 얘기,
   * …» 하고 쉼표로 이어진 한 문장이다. 복도가 문마다 한 줄씩 주워듣는 장치라
   * 나누어 싣되, 나누는 자리는 원문이 이미 끊어 둔 자리로만 한다. 말을 새로
   * 지어 이어 붙이지 않는다.
   */
  {
    id: 'room-canvas',
    kind: 'room',
    verbatim: false,
    text: '캔버스가 너무 비싸졌다는 얘기,',
  },
  {
    id: 'room-deal',
    kind: 'room',
    verbatim: false,
    text: '거래가 다 끊겼다는 얘기,',
  },
  {
    id: 'room-relationship',
    kind: 'room',
    verbatim: false,
    text: '누구와 사이가 나빠져서 슬펐다는 얘기,',
  },
  {
    id: 'room-gift',
    kind: 'room',
    verbatim: false,
    text: '명품 선물을 해주면 관계가 다시 풀릴 것 같다는 얘기 같은',
  },
  {
    id: 'room-small-talk',
    kind: 'room',
    verbatim: false,
    text: '소소한 잡담들도 흘러다녔다.',
  },
] as const

function CorridorDoor({ step }: { step: Extract<CorridorStep, { kind: 'room' }> }) {
  return (
    <div className={styles.doorScene}>
      <div className={styles.sideDoor} data-side="left" aria-hidden="true" />
      <div className={styles.door}>
        <div className={styles.doorLeaf} aria-hidden="true" />
        <div className={styles.voice}>
          {step.verbatim ? <p className={styles.quote}>“{step.text}”</p> : <p>{step.text}</p>}
          {step.note ? <p className={styles.roomNote}>{step.note}</p> : null}
        </div>
      </div>
      <div className={styles.sideDoor} data-side="right" aria-hidden="true" />
    </div>
  )
}

/**
 * 87층의 객실 복도.
 *
 * 세로 스크롤은 페이지가 계속 가진다. 안에 별도 스크롤 상자를 만들지도,
 * wheel 이벤트를 가로채지도 않는다. 보이지 않는 눈금이 화면 가운데를 지날 때
 * 같은 자리에 다음 객실이 옆에서 들어온다. VerticalFeed와 같은 원리지만 이동
 * 방향만 수평이다.
 *
 * 실제 객실 번호와 갤러리 이름은 기록해 두지 않았다. 그래서 문 위에 8701,
 * 8702 같은 번호를 만들어 적지 않는다. 본문에는 «객실 번호 위에 갤러리 이름이
 * 붙어 있었다»는 실제 관찰만 남기고, 이 장치는 문이라는 구조만 가져온다.
 *
 * 움직임을 줄이기로 한 화면과 이 문법을 지원하지 않는 화면에서는 전부 세로
 * 목록으로 읽힌다. 장치가 없어져도 문장 하나가 빠지지 않는다.
 */
function GalleryCorridor() {
  const [at, setAt] = useState(0)
  const rail = useRef<HTMLDivElement>(null)
  const current = corridorSteps[at] ?? corridorSteps[0]!

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
  }, [])

  return (
    <div className={styles.corridor} style={{ '--count': corridorSteps.length } as CSSProperties}>
      {/*
        낭독과 reduced-motion의 본문.

        움직이는 판은 aria-hidden이다. 읽어 주는 쪽은 이 목록 하나만 만나고,
        화면에서 모션을 끈 사람에게도 바로 이 목록이 보인다.
      */}
      {/*
        여백은 창이 갖고 목록은 갖지 않는다.

        판면의 좌우 여백을 <ol>에 직접 주면, 기호를 하나도 그리지 않는 목록이
        기호의 자리만큼 들여쓰인 것과 같은 모양이 된다. 이 저장소의 검사가
        그것을 잡는다(«기울어진 목록»). 여백을 밖의 상자로 옮기면 목록은
        들여쓰기 0으로 남는다.
      */}
      <div className={styles.corridorRead}>
        <ol className={styles.corridorFallback} role="list">
          {corridorSteps.map((step) => (
            <li key={step.id}>
              {step.kind === 'market' ? (
                <p>{step.text}</p>
              ) : (
                <>
                  {step.verbatim ? <p>“{step.text}”</p> : <p>{step.text}</p>}
                  {step.note ? <p className={styles.fallbackNote}>{step.note}</p> : null}
                </>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className={styles.corridorStage} aria-hidden="true">
        <p className={`mono ${styles.corridorFloor}`}>87F</p>
        <span className={styles.corridorLine} />

        {current.kind === 'market' ? (
          <div key={current.id} className={styles.market} data-phase={current.phase}>
            <p className={`mono ${styles.marketLabel}`}>WELL-MADE FLEA MARKET</p>
            <p className={styles.marketText}>{current.text}</p>
          </div>
        ) : (
          <CorridorDoor key={current.id} step={current} />
        )}
      </div>

      <div className={styles.corridorRail} ref={rail} aria-hidden="true">
        {corridorSteps.map((step) => (
          <div key={step.id} />
        ))}
      </div>
    </div>
  )
}

/*
 * 복도의 마지막 문.
 *
 * 앞에서는 문이 조금씩 열리며 말을 주웠다. 마지막에는 반대로 문을 닫아 둔다.
 * 크게 선언하지 않고 문 안으로 들어가지 않은 채 끝낸다. 이 문장은 미술계에
 * 싸움을 걸기 위한 결론이 아니라, 구경하면서 속으로 든 말이었다.
 */
function ClosedDoor() {
  return (
    <div className={styles.closedDoor}>
      <span className={styles.closedLeaf} aria-hidden="true" />
      {/*
        액자를 지우지 않는다.

        «진지한 척 좀 하지 마»만 남기면 이 문장은 미술계에 건 선언이 된다.
        원문에서 이것은 앞뒤로 «솔직히 속으로는»과 «라고 말하고 싶은 순간도
        있었다»에 싸여 있고, 그 두 마디가 이것을 속말로 붙들고 있다. 문을 닫아
        두는 것과 같은 일을 문장이 이미 하고 있다.
      */}
      <div className={styles.closedText}>
        <p className={styles.closedFrame}>솔직히 속으로는</p>
        <p className={styles.closedLine}>진지한 척 좀 하지 마.</p>
        <p className={styles.closedFrame}>라고 말하고 싶은 순간도 있었다.</p>
        <p>그래도 내가 거기 맞짱 뜨러 간 건 아니었다.</p>
        <p>그냥 구경하러 간 거였다.</p>
      </div>
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
    location: '서울 명동 · 용산 · 잠실',
  },
  excerpt: '호텔 객실이 갤러리가 된 87층에서 그림보다 먼저 보인 것들이 있었다.',

  /*
   * 제목은 「티파니에서 아침을」의 문형을 빌렸다.
   *
   * 그 사실은 제목만 보고는 알 수도 있고 모를 수도 있어서 Reading Guide에만
   * 적는다. 전날 CHAGEE가 일정에서 빠졌다는 것도 다른 기록을 읽지 않은 사람에게
   * 필요한 선행 정보라 여기까지는 말한다. 다음 날 다시 만나게 된다는 사실은
   * 본문에서 발견해야 하므로 먼저 적지 않는다.
   */
  guide: (
    <>
      <p>제목은 「티파니에서 아침을」의 문형을 빌렸다.</p>
      <p>
        이 글의 시그니엘은 숙박한 호텔이 아니라 객실이 전시장으로 바뀐 공간이다. 전날 기록에서는
        강남에서 가려던 CHAGEE가 시간 부족으로 일정에서 빠졌다.
      </p>
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

      <Scene width="bleed" air>
        <GalleryCorridor />
      </Scene>

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
        <ClosedDoor />
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
