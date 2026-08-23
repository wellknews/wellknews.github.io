import { Axis } from '../../components/session/Axis'
import { Breakdown } from '../../components/session/Breakdown'
import { Course } from '../../components/session/Course'
import { Ending } from '../../components/session/Ending'
import { Later } from '../../components/session/Later'
import { Move } from '../../components/session/Move'
import { Passage } from '../../components/session/Passage'
import { Place } from '../../components/session/Place'
import { Plate } from '../../components/session/Plate'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import { Tension } from '../../components/session/Tension'
import { Weight } from '../../components/session/Weight'
import type { Cover, Session } from '../types'

/* ─────────────────────────────  사진  ─────────────────────────────
 *
 * 세 장뿐이다. 이 기록에서 중요한 것은 구조와 문장이라, 사진을 늘리면
 * 다시 평범한 서울 방문기가 된다. 사진을 전부 지워도 글은 그대로 읽힌다.
 */

const counter: Cover = {
  src: '/media/session/divide-and-conquer/01-sushiichi-counter.webp',
  alt: '나무 판 위에 김밥처럼 썰린 마키와 군함말이가 놓여 카운터 너머로 건네지는 스시야의 자리',
  width: 1086,
  height: 1448,
}

const lounge: Cover = {
  src: '/media/session/divide-and-conquer/02-jangchung-lounge-r.webp',
  alt: '기와를 얹은 흰 담장과 철문 안쪽으로 계단이 이어지는 스타벅스 장충라운지R 외관',
  width: 1122,
  height: 1402,
}

const flight: Cover = {
  src: '/media/session/divide-and-conquer/03-espresso-flight.webp',
  alt: '검은 잔 두 개와 유리잔 하나가 한 트레이에 놓인 에스프레소 플라이트',
  width: 1448,
  height: 1086,
}

/* ─────────────────────────────  문장  ─────────────────────────────
 *
 * 넓은 배치와 좁은 배치가 같은 상수를 쓴다. 배치가 달라지는 것은 이 기록이
 * 하기로 한 일이고, 문장이 줄어드는 것은 아니다.
 */

const arrive = (
  <>
    <p>늦지 않게 을지로에 도착했다. 예약해 둔 런치 오마카세를 먹었다.</p>
  </>
)

const compare = (
  <>
    <p>
      만족스러웠다. 전에 청담에서 먹었던 곳과 견줘도 품질이 크게 밀리지 않았다. 그쪽도 가성비가 좋은
      편이라 가격 차이에서 오는 놀라움은 아니었다.
    </p>
  </>
)

const notTaste = (
  <>
    <p>
      다만 을지로라는 공간 자체는 여전히 내 취향과 잘 맞지 않는다고 느꼈다. 여러 번 와 봤는데도
      그렇다.
    </p>
  </>
)

const axisIntro = (
  <>
    <p>
      나는 압구정, 청담, 한남, 이태원 계열의 공간을 주로 향유해 왔다. 전날 평창동에서는 그것이 한
      단계 위로 확장된 것 같은 느낌을 받았다. 화려함은 적은데 더 조용하고, 정제되고, 문화적이고,
      시간이 쌓여 있었다.
    </p>
  </>
)

const parallel = (
  <>
    <p>을지로는 위도 아래도 아니었다.</p>
  </>
)

const parallelAfter = (
  <>
    <p>
      낡은 상가, 오래된 간판, 공업적인 질감, 좁은 계단을 그대로 미학으로 받아들이는 방식은 이해할 수
      있었다. 다만 내가 자연스럽게 향유하고 싶은 방향은 아니었다.
    </p>
  </>
)

const leaving = (
  <>
    <p>
      을지로에서 억지로 카페를 찾지 않았다. 스시만 먹고 장충동으로 걸었다. 걸어갈 만한 거리였다.
    </p>
  </>
)

const app = (
  <>
    <p>앱을 켜서 메뉴를 확인했다. 여기는 일반 매장과 달리 앱 주문이 제한되어 있었다.</p>
  </>
)

const mansion = (
  <>
    <p>
      대저택 같은 외관이었고, 실제로 과거에 대저택이었다. 중후한 철문. 사저 안으로 몸을 끌어들이는
      복도. 회오리치듯 올라가는 무거운 계단. 매대에서 진지한 표정으로 자기 일을 하는 크루들.
    </p>
    <p>그리고 과거 부자의 사생활을 더 이상 기억하지 못할 개별 방들.</p>
  </>
)

const rooms = (
  <>
    <p>
      각 방은 이제 스타벅스가 되었지만 평범한 스타벅스보다 하이엔드를 지향하는 가구와 전시품으로
      채워져 있었다.
    </p>
  </>
)

const twoOlds = (
  <>
    <p>같은 오래됨인데 하나는 흔적을 드러내고 다른 하나는 흔적을 정돈한다.</p>
  </>
)

const first = (
  <>
    <p>작은 잔 끝에 코코아 파우더가 얹혀 있었다. 마시면 부드럽게 넘어갔다.</p>
    <p>에스프레소니까 분명 쓴데 쓰지 않았다. 유연했다.</p>
  </>
)

const cleaned = (
  <>
    <p>스시가 지나간 목구멍을 결벽증 청소부가 지나간 흔적처럼 깨끗하게 해주었다.</p>
  </>
)

const clock = (
  <>
    <p>첫 잔을 다 마시는 순간 시간이 개입했다. 두 시가 되기 십오 분 전이었다.</p>
    <p>장충체육관까지 십 분. 세 시에는 도착해야 했다.</p>
  </>
)

const noRoom = (
  <>
    <p>여유를 부릴 여유가 없었다.</p>
  </>
)

const second = (
  <>
    <p>두 번째 잔은 천천히 마시지 않았다. 한입에 털어 넣었다.</p>
  </>
)

const eggy = (
  <>
    <p>계란찜처럼 담백한 기운이 머무르다 지나갔다.</p>
  </>
)

const third = (
  <>
    <p>마지막 셔벗은 스푼으로 잠깐 베어 먹었다. 시원했다. 유자 같으면서 달았다.</p>
  </>
)

const wind = (
  <>
    <p>셔벗은 시원하고 금세 떠날 바람이 되었다.</p>
  </>
)

const music = (
  <>
    <p>
      그 방은 뮤직룸이었다. 급한 피아노 선율이 흐르고 있었고, 드럼 심벌마저 발을 구르는 듯 들렸다.
      음악과 마음의 속도가 우연히 맞았다.
    </p>
  </>
)

const shouldHaveBeen = (
  <>
    <p>이게 진짜 오마카세의 마지막이었어야 했다.</p>
  </>
)

const fineDining = (
  <>
    <p>
      파인다이닝에서는 식사의 마지막을 산뜻하고 차가운 디저트로 정리하는 경우가 많다. 그 순간 두
      장소가 연결됐다. 을지로에서 끝났다고 생각했던 코스가 사실 장충동에서 완성되고 있었다.
    </p>
  </>
)

const unrelated = (
  <>
    <p>서로 아무 관계도 없는 두 가게에서 주문한 것이 내 안에서는 하나의 코스가 됐다.</p>
  </>
)

const phrase = (
  <>
    <p>나누고 나서 정복한다는 말이 있다. 오늘 이 말이 이상하게 계속 떠올랐다.</p>
  </>
)

const likeThis = (
  <>
    <p>
      나는 이런 것을 좋아하는 것 같다. 큰 하나를 대충 만드는 것보다, 작게 나누고 각각의 작은 것에
      퀄리티와 집요함을 뭉치는 것.
    </p>
    <p>오마카세도 그랬고 에스프레소 플라이트도 그랬다. 한입. 한 잔. 한 순서.</p>
    <p>각각은 작지만 그 작은 단위를 허투루 만들지 않는다. 오히려 작기 때문에 더 담을 수 있다.</p>
  </>
)

const notSmall = (
  <>
    <p>나는 사소한 것을 분석하는 사람이 아니다.</p>
  </>
)

const untilSmall = (
  <>
    <p>어떤 문제든 사소해질 때까지 나누어서 분석하는 사람이다.</p>
  </>
)

const howItGoes = (
  <>
    <p>문제가 크면 불편하다. 그러면 나눈다. 나뉜 문제도 크면 또 나눈다.</p>
    <p>
      내가 충분히 이해할 수 있고, 손으로 집어 들 수 있고, 하나의 결정을 내릴 수 있을 정도가 될
      때까지 나눈다. 그제야 거기에 깊게 몰입한다. 하나씩 처리한다. 그리고 다시 합친다.
    </p>
  </>
)

const strength = (
  <>
    <p>그런 몰입력은 나의 강점이기도 하다.</p>
  </>
)

const compulsion = (
  <>
    <p>동시에 나의 강박이기도 하다.</p>
  </>
)

const bothSides = (
  <>
    <p>
      한쪽에서는 디테일을 만들고 다른 한쪽에서는 나를 지치게 만든다. 둘은 다른 성질이 아니라 같은
      성질의 앞면과 뒷면에 가깝다.
    </p>
  </>
)

const sensitive = (
  <>
    <p>아마 그래서 내가 예민한 것 같다.</p>
  </>
)

const notSenses = (
  <>
    <p>
      감각이 특별히 예민하다기보다, 한 번 발견한 차이를 그냥 하나의 차이로 두지 못하고 계속 분해해서
      의미를 찾으려는 습관이 있는 것이다.
    </p>
    <p>
      무언가를 보면 자연스럽게 구성요소를 본다. 왜 이렇게 만들어졌는지 본다. 어떤 선택이 들어갔는지
      본다. 다른 방식은 없었는지 생각한다. 그러다 보면 남들이 그냥 지나칠 수 있는 것도 계속 눈에
      걸린다.
    </p>
  </>
)

const habit = (
  <>
    <p>습관이 반복되면 사고방식이 되고, 사고방식이 반복되면 관성이 된다.</p>
  </>
)

const divide = (
  <>
    <p>나눈다.</p>
  </>
)

const again = (
  <>
    <p>다시 나눈다.</p>
  </>
)

const untilSmallEnough = (
  <>
    <p>충분히 작아질 때까지.</p>
  </>
)

const soLife = (
  <>
    <p>그러다 보니 삶도 그렇게 보게 됐다.</p>
  </>
)

const closing = (
  <>
    <p>나는 작은 것을 좋아하는 사람이 아니라, 큰 것을 작게 만드는 사람인지도 모른다.</p>
  </>
)

/* ─────────────────────────────  나뉘는 것들  ───────────────────────────── */

const flightParts = ['WITH CHOCOLATE POWDER', 'WITH FRENCH VANILLA', 'JEJU PALSAK SORBET'] as const

const oneCourse = ['SUSHI', 'ESPRESSO', 'VANILLA', 'SORBET'] as const

const steps = ['PROBLEM', 'PART', 'DETAIL', 'ATOM'] as const

const twoFaces = [['STRENGTH', 'COMPULSION']] as const

const twoOldnesses = [
  ['OLD', 'EXPOSE'],
  ['OLD', 'REFINE'],
] as const

/* ─────────────────────────────  기록  ───────────────────────────── */

export const divideAndConquer: Session = {
  slug: 'divide-and-conquer',
  title: 'Divide and Conquer',
  meta: {
    date: '2026-08-23',
    location: '서울 을지로 · 장충동',
  },
  excerpt: '작게 나누고, 그 안에 집요함을 몰아넣는 방법.',
  cover: flight,
  display: 'stage',

  /*
   * 넓은 판면의 배치.
   *
   * 페이지 자체가 처음에는 하나였다가 점점 나뉘고, 마지막에 다시 하나로
   * 모여야 한다. 움직임은 셋뿐이다 — 갈라지고(Course), 좁아지고(Scene의 pace),
   * 다시 모인다(Course의 gather).
   *
   * 장충라운지 구간에서만 여백이 단계적으로 줄어든다. 시간이 부족해지는
   * 대목이라 초읽기를 그리는 대신 지면의 호흡을 실제로 바꾼다.
   */
  body: (
    <>
      <Scene>
        <Place name="SUSHI ICHI" district="EULJIRO" date="2026.08.23" />

        <Passage>{arrive}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={counter} note="OMAKASE" />
      </Scene>

      <Scene>
        <Passage>{compare}</Passage>

        <Passage>{notTaste}</Passage>
      </Scene>

      <Scene air>
        <Passage>{axisIntro}</Passage>

        <Axis familiar="CHEONGDAM" up="PYEONGCHANG" across="EULJIRO" />

        <Passage tone="loud">{parallel}</Passage>

        <Later>
          <Passage>{parallelAfter}</Passage>
        </Later>
      </Scene>

      <Scene>
        <Passage>{leaving}</Passage>
      </Scene>

      <Move from="EULJIRO" to="JANGCHUNG" />

      <Scene width="bleed">
        <Plate image={lounge} />

        <Place name="JANGCHUNG LOUNGE R" district="JANGCHUNG-DONG" />
      </Scene>

      <Scene>
        <Passage>{app}</Passage>
      </Scene>

      <Scene>
        <Passage>{mansion}</Passage>

        <Passage>{rooms}</Passage>
      </Scene>

      <Scene air>
        <Tension pairs={twoOldnesses} />

        <Passage tone="loud">{twoOlds}</Passage>
      </Scene>

      {/* 여기서 이 기록의 구조가 처음으로 나뉜다. */}
      <Scene width="bleed" air>
        <Plate image={flight} />

        <Course whole="ESPRESSO FLIGHT" parts={flightParts} />
      </Scene>

      <Scene>
        <Passage>{first}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{cleaned}</Passage>
      </Scene>

      {/*
       * 여기서부터 여백이 좁아진다.
       *
       * 남은 두 잔은 실제로 서둘러 마셨다. 읽는 속도도 그만큼 빨라져야 한다.
       */}
      <Scene pace="brisk">
        <Passage>{clock}</Passage>
      </Scene>

      <Scene pace="brisk">
        <Passage tone="loud">{noRoom}</Passage>
      </Scene>

      <Scene pace="fast">
        <Passage>{second}</Passage>
      </Scene>

      <Scene pace="fast">
        <Passage tone="loud">{eggy}</Passage>
      </Scene>

      <Scene pace="rushed">
        <Passage>{third}</Passage>
      </Scene>

      <Scene pace="rushed">
        <Passage tone="loud">{wind}</Passage>
      </Scene>

      <Scene pace="rushed">
        <Passage>{music}</Passage>
      </Scene>

      {/* 서두름이 끝난다. 여기서부터 다시 넓어진다. */}
      <Scene air>
        <Passage tone="loud">{shouldHaveBeen}</Passage>

        <Later>
          <Passage>{fineDining}</Passage>
        </Later>
      </Scene>

      {/* 흩어져 있던 네 가지가 하나의 이름으로 모인다. */}
      <Scene air>
        <Course whole="ONE COURSE" parts={oneCourse} direction="gather" />

        <Passage>{unrelated}</Passage>
      </Scene>

      <Scene air>
        <Weight>
          <Passage tone="loud">{phrase}</Passage>
        </Weight>
      </Scene>

      <Scene>
        <Passage>{likeThis}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{notSmall}</Passage>
      </Scene>

      <Scene>
        <Weight>
          <Passage tone="loud">{untilSmall}</Passage>
        </Weight>
      </Scene>

      <Scene air>
        <Breakdown steps={steps} />

        <Passage>{howItGoes}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{strength}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{compulsion}</Passage>
      </Scene>

      {/* 마주 보던 둘이 거의 붙는다. 다른 성질이 아니라 같은 성질의 두 면이다. */}
      <Scene>
        <Tension pairs={twoFaces} converge />

        <Passage>{bothSides}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{sensitive}</Passage>

        <Later>
          <Passage>{notSenses}</Passage>
        </Later>
      </Scene>

      <Scene>
        <Passage>{habit}</Passage>
      </Scene>

      {/* 앞의 서두름과 정확히 반대로, 여기서는 한 문장씩 크게 비운다. */}
      <Scene air>
        <Passage tone="loud">{divide}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{again}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{untilSmallEnough}</Passage>
      </Scene>

      <Quiet>
        <Passage>{soLife}</Passage>
      </Quiet>

      <Scene air>
        <Passage tone="loud">{closing}</Passage>
      </Scene>

      <Scene>
        <Ending />
      </Scene>
    </>
  ),

  /*
   * 작은 판면의 배치.
   *
   * 문장은 위와 똑같다. 장면을 합치고, 나뉘는 관계를 가로가 아니라 세로로
   * 다시 놓는다. 서두르는 구간의 압축은 그대로 둔다 — 그것이 이 기록에서
   * 여백이 하는 유일한 이야기이고, 좁은 화면에서도 같은 일이 일어나야 한다.
   */
  compact: (
    <>
      <Scene>
        <Place name="SUSHI ICHI" district="EULJIRO" date="2026.08.23" />

        <Passage>{arrive}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={counter} note="OMAKASE" />

        <Passage>{compare}</Passage>

        <Passage>{notTaste}</Passage>
      </Scene>

      <Scene>
        <Passage>{axisIntro}</Passage>

        <Axis familiar="CHEONGDAM" up="PYEONGCHANG" across="EULJIRO" />

        <Passage tone="loud">{parallel}</Passage>

        <Passage>{parallelAfter}</Passage>
      </Scene>

      <Scene>
        <Passage>{leaving}</Passage>
      </Scene>

      <Move from="EULJIRO" to="JANGCHUNG" />

      <Scene width="bleed">
        <Plate image={lounge} />

        <Place name="JANGCHUNG LOUNGE R" district="JANGCHUNG-DONG" />

        <Passage>{app}</Passage>
      </Scene>

      <Scene>
        <Passage>{mansion}</Passage>

        <Passage>{rooms}</Passage>

        <Tension pairs={twoOldnesses} />

        <Passage tone="loud">{twoOlds}</Passage>
      </Scene>

      <Scene width="bleed" air>
        <Plate image={flight} />

        <Course whole="ESPRESSO FLIGHT" parts={flightParts} />
      </Scene>

      <Scene>
        <Passage>{first}</Passage>

        <Passage tone="loud">{cleaned}</Passage>
      </Scene>

      <Scene pace="brisk">
        <Passage>{clock}</Passage>

        <Passage tone="loud">{noRoom}</Passage>
      </Scene>

      <Scene pace="fast">
        <Passage>{second}</Passage>

        <Passage tone="loud">{eggy}</Passage>
      </Scene>

      <Scene pace="rushed">
        <Passage>{third}</Passage>

        <Passage tone="loud">{wind}</Passage>

        <Passage>{music}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{shouldHaveBeen}</Passage>

        <Passage>{fineDining}</Passage>
      </Scene>

      <Scene air>
        <Course whole="ONE COURSE" parts={oneCourse} direction="gather" />

        <Passage>{unrelated}</Passage>
      </Scene>

      <Scene air>
        <Weight>
          <Passage tone="loud">{phrase}</Passage>
        </Weight>

        <Passage>{likeThis}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{notSmall}</Passage>

        <Weight>
          <Passage tone="loud">{untilSmall}</Passage>
        </Weight>
      </Scene>

      <Scene air>
        <Breakdown steps={steps} />

        <Passage>{howItGoes}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{strength}</Passage>

        <Passage tone="loud">{compulsion}</Passage>

        <Tension pairs={twoFaces} converge />

        <Passage>{bothSides}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{sensitive}</Passage>

        <Passage>{notSenses}</Passage>

        <Passage>{habit}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{divide}</Passage>

        <Passage tone="loud">{again}</Passage>

        <Passage tone="loud">{untilSmallEnough}</Passage>
      </Scene>

      <Quiet>
        <Passage>{soLife}</Passage>
      </Quiet>

      <Scene air>
        <Passage tone="loud">{closing}</Passage>
      </Scene>

      <Scene>
        <Ending />
      </Scene>
    </>
  ),
}
