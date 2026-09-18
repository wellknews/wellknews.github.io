import { Aperture } from '../../components/session/Aperture'
import { ContactSheet, type Shot } from '../../components/session/ContactSheet'
import { Daybook, type Stop } from '../../components/session/Daybook'
import { Descent } from '../../components/session/Descent'
import { Dropout } from '../../components/session/Dropout'
import { Link } from '../../components/session/Link'
import { Loose } from '../../components/session/Loose'
import { Move } from '../../components/session/Move'
import { Order } from '../../components/session/Order'
import { Passage } from '../../components/session/Passage'
import { Place } from '../../components/session/Place'
import { Pushed } from '../../components/session/Pushed'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import { Shrink } from '../../components/session/Shrink'
import { Stairs } from '../../components/session/Stairs'
import { Stand } from '../../components/session/Stand'
import { Stretch } from '../../components/session/Stretch'
import { Trace } from '../../components/session/Trace'
import { Unfinished } from '../../components/session/Unfinished'
import { Unvisited } from '../../components/session/Unvisited'
import { Wait } from '../../components/session/Wait'
import type { Cover, Session } from '../types'

/* ─────────────────────────────  사진  ─────────────────────────────
 *
 * 둘은 왔고 둘은 아직이다.
 *
 * 없는 자리를 채우지 않는다. 이 공간의 사진은 장식이 아니라 증거라서,
 * 분위기를 만들려고 다른 데서 가져온 그림을 걸면 그 순간 이 기록은 그날
 * 있었던 일이 아니게 된다. 계단도 지하돌도 그날 실제로 찍힌 파일이 들어와야
 * 그 자리에 선다.
 *
 * 그때까지 그 장면들은 그리지 않는다. 화면에 회색 칸을 놓아 두면 그것은
 * «아직 안 왔다»가 아니라 «여기 뭔가 있어야 하는데 깨졌다»로 읽힌다.
 *
 * 사진이 오면 하는 일은 두 가지다.
 *
 *   npm run photos pushed-underground <사진이 있는 폴더>
 *
 * 스크립트가 파일을 옮기고 실제 크기를 재서 Cover 객체를 찍어 준다. 그것을
 * 아래 자리에 붙이고 alt만 사람이 채운다 — 무엇이 찍혀 있는지는 그 자리에
 * 있던 사람만 안다.
 */

/*
 * 줄.
 *
 * 벤치에 앉아 있던 쪽이 아니라 서 있는 줄을 찍은 한 장이다. 그래서 이 사진이
 * 붙박이는 자리에 온다 — 화면 한가운데에서 이것만 움직이지 않고 주변의 기록만
 * 바뀐다. 실제로 한 시간 반 동안 달라지지 않은 것이 이 줄이었다.
 *
 * 가로 사진이다. 붙박인 판이 화면 높이의 절반쯤을 쓰므로 세로로 긴 것보다
 * 이쪽이 맞는다 — 여기서 보여야 하는 것은 한 사람이 아니라 줄의 길이다.
 */
const line: Cover = {
  src: '/media/session/pushed-underground/01-chipotle-gangnam-line.webp',
  alt: '강남대로에 면한 치폴레 매장 앞으로 사람들이 길게 줄지어 서 있다. 붉은 CHIPOTLE MEXICAN GRILL 간판 아래 통유리 안쪽에 주문대와 메뉴 화면이 보이고, 유리에 REAL INGREDIENTS REAL CHANGE와 GOOD FOOD GOOD PEOPLE이 적혀 있다. 대기선 폴대가 인도를 따라 오른쪽 끝까지 이어진다',
  width: 1448,
  height: 1086,
}

/*
 * 보울.
 *
 * 다 먹은 그릇도 남긴 그릇도 아니다. 카운터에서 막 덮개를 덮기 전, 썬 상추가
 * 위를 덮고 있는 상태다. 이 기록에 필요한 것이 정확히 그 상태다 — 뒤에 오는
 * 문장이 «꽤 많이 남겼다»인데, 남은 사진을 같이 걸면 그 문장이 사진의 설명이
 * 된다. 여기서 사진이 말해야 하는 것은 74분을 기다려 받은 것이 이만큼이었다는
 * 사실이고, 얼마나 남겼는지는 지면이 줄어드는 것으로 말한다(Shrink).
 */
const bowl: Cover = {
  src: '/media/session/pushed-underground/02-bowl.webp',
  alt: '스테인리스 쟁반 위에 놓인 흰 종이 보울. 밥과 바바코아 위에 치즈와 옥수수가 깔리고 그 위를 굵게 썬 상추가 거의 다 덮고 있다',
  width: 1122,
  height: 1402,
}

/** 지하로 내려가는 계단. 세로 사진이어야 한다 — 열리는 방향이 아래쪽이다. */
const stairwell: Cover | null = null

/**
 * 지하돌 구간의 기록.
 *
 * 여기부터는 한 장씩 고르지 않는다. 그날 찍은 것을 그대로 늘어놓는 자리라
 * 배열의 길이 자체가 이 구간의 내용이다. 영상은 video에 주소를 적으면 같은
 * 칸을 쓴다.
 */
const underground: readonly Shot[] = []

/* ─────────────────────────────  아침의 표  ─────────────────────────────
 *
 * 네 줄이다. 간격이 전부 같고 시각이 전부 같은 자리에서 시작한다. 이 표가
 * 이 기록의 기준선이다 — 뒤에서 여백이 벌어지고 좁아지는 것은 전부 이 표의
 * 간격과 비교되는 값이지 그 자체로 읽히는 값이 아니다.
 *
 * 실제로 일어난 일을 여기 적지 않는다. 이것은 아침에 적어 둔 표이고,
 * 아침에는 아무 일도 일어나지 않았다.
 */
const plan: readonly Stop[] = [
  ['11:58', 'YONGSAN'],
  ['13:00', 'JL'],
  ['15:54', 'GANGNAM'],
  ['18:40', 'SANGSU'],
]

/* ─────────────────────────────  문장  ─────────────────────────────
 *
 * 넓은 배치와 좁은 배치가 같은 상수를 쓴다. 좁은 판면에서 줄이는 것은 장면의
 * 수이지 읽을 것의 양이 아니다.
 */

const intent = (
  <>
    <p>이번 여행은 처음부터 엉망진창 상식파괴 여행으로 만들 생각이었다.</p>
    <p>
      밥 대신 디저트를 먹고, 그다음 강남으로 넘어가 치폴레를 먹는다. 치폴레는 아이폰 앱으로 픽업
      주문하고 근처 카페에서 기다리는 것도 생각했다. 자라 카페를 갈 수도 있었고 CHAGEE 강남점을 갈
      수도 있었다. CHAGEE는 중국에서 패왕차희를 먹었을 때 맛있었던 기억이 있어서 한국 매장도 한번
      가보고 싶었다. 그리고 마지막에는 상수로 넘어가 지하 아이돌 공연을 본다.
    </p>
  </>
)

const twisted = (
  <>
    <p>의도적으로 순서를 비틀어버린 여행이었다.</p>
  </>
)

const honest = (
  <>
    <p>
      솔직히 나는 밥을 먹고 싶었다. 왜 점심 식사를 디저트로 하러 가는지도 나도 모르겠다. 지금은
      좆같을 수 있는데 나중에 이 글을 다시 읽으면 재미있기는 하겠다는 생각도 했다.
    </p>
  </>
)

const yongsan = (
  <>
    <p>용산에 도착해서 짐부터 맡겼다.</p>
    <p>
      13시에는 JL Dessert Bar 예약이 있었다. 이동 시간을 생각하면 그 전에 정상적인 점심을 먹기
      애매했다. 밥은 먹고 싶은데 조금 있으면 디저트 코스를 먹어야 한다. 편의점에서 간단히 뭔가 먹는
      것도 생각했지만 결국 제대로 된 점심은 먹지 않았다.
    </p>
    <p>
      12시쯤에는 이미 치폴레 앱을 열어서 메뉴와 웨이팅을 보고 있었다. 몇 시간 뒤에 먹을 음식인데
      미리 보고 있었다.
    </p>
    <p>그리고 JL로 갔다.</p>
  </>
)

const first = (
  <>
    <p>이날 첫 끼는 결국 디저트가 됐다.</p>
    <p>
      JL에서는 디저트 코스를 먹었고 칵테일 페어링도 했다. 어지간한 파인다이닝보다 비싼 디저트 코스를
      점심에 먹는 일정이 실제로 실행되고 있었다.
    </p>
    <p>
      먹는 중간에는 셰프와 잠깐 이야기를 했다. 정확히는 메인 셰프라기보다는 보조로 보이는 분이었다.
    </p>
    <p>그 대화를 하다가 생각한 게 있다.</p>
  </>
)

/*
 * 링크가 걸리기까지.
 *
 * 마지막 줄이 «오히려»에서 끊긴다. 끊긴 자리에 다음 문장이 오는 것이 아니라
 * 두 점이 맞는 장면이 온다 — 그날 그 말도 실제로 거기서 한 번 끊겼다.
 */
const linking = (
  <>
    <p>내가 아닌 타자와 링크될 때 느껴지는 묘한 완결감이 있다.</p>
    <p>
      나라는 꽤 어려운 문제를 타인에게 이해시키는 데 성공했다는, 그런 낮은 확률에서 오는 쾌감이
      있다.
    </p>
    <p>그렇다고 기분이 좋았다는 말은 조금 다르다.</p>
    <p>오히려</p>
  </>
)

const received = (
  <>
    <p>에 가까웠다.</p>
    <p>
      내 머릿속에 있는 것을 다른 사람에게 전달하고, 그 사람이 내가 말하려던 것과 꽤 가까운 형태로
      받아들이는 일. 그런 게 아예 불가능한 건 아니구나 하는 느낌이었다.
    </p>
    <p>그래서 그 짧은 대화가 기억에 남았다.</p>
  </>
)

const mirror = (
  <>
    <p>
      JL에서는 내 얼굴을 보면서 한껏 못생겨진 얼굴이라는 생각도 했다. 그렇다고 디저트바에서 그걸
      무슨 방식으로 위로받을 수 있을 것 같지도 않았다.
    </p>
  </>
)

/*
 * 끝까지 마시지 못한 커피.
 *
 * 이 기록에서 무언가가 완료되지 않은 형태로 처음 나오는 자리다. 문단 뒤에
 * 오는 것은 구분선이 아니라 7할에서 멈춘 선이고, 그 선에는 아무 설명도
 * 붙이지 않는다.
 */
const coffee = (
  <>
    <p>
      마지막에는 커피도 나왔는데 시간을 계산해야 했다. 결국 다 마시지 못했다. 칵테일 페어링 때문에
      약간 술기운도 있는 상태로 약 15시 20분쯤 JL을 나왔다.
    </p>
  </>
)

const toGangnam = (
  <>
    <p>이제 강남으로 가야 했다.</p>
  </>
)

const trouble = (
  <>
    <p>약간 문제가 생겼다.</p>
    <p>현재 시각 3시 54분.</p>
  </>
)

/*
 * 줄을 본 순간부터.
 *
 * 다섯 문단이고 사이가 한 칸씩 벌어진다. 화면에 «WAITING»도 «90 MIN»도
 * 적지 않는다. 스크롤해야 하는 거리 자체가 그날 기다린 시간이다.
 */
const queue = (
  <Stretch>
    <p>치폴레 대기줄이 존나 길었다.</p>
    <p>
      입장까지 한 시간 반 정도 기다려야 하고, 주문하고 실제로 먹는 시간까지 생각하면 두 시간은
      잡아야 했다.
    </p>
    <p>두 시간 뒤면 거의 6시다.</p>
    <p>저녁에는 공연이 있다.</p>
    <p>
      원래 생각했던 치폴레 픽업, 카페 대기, CHAGEE까지 들렀다가 상수로 넘어가는 일정은 여기서 사실상
      깨졌다.
    </p>
  </Stretch>
)

const anyway = (
  <>
    <p>그래도 기다렸다.</p>
    <p>
      다행히 그냥 길바닥에 계속 서 있는 건 아니었다. 벤치가 있었고 앉아 있을 수 있었다. 생수도
      받았고 책자도 받았다. 서비스가 꽤 좋았다.
    </p>
  </>
)

const watching = (
  <>
    <p>그리고 강남역 거리를 지나가는 사람들을 계속 구경했다.</p>
    <p>의외로 웨이팅이 진짜 하나도 안 지루했다.</p>
    <p>
      한 시간 넘게 기다리는 상황인데 다리도 별로 안 아팠고, 책자도 보고 물도 마시고 사람도 구경하다
      보니 시간이 갔다. 줄도 처음 생각했던 것보다는 빨리 빠지는 느낌이었다.
    </p>
    <p>17시쯤 드디어 안으로 들어갔다.</p>
  </>
)

const ordered = (
  <>
    <p>주문은 보울.</p>
  </>
)

const nothingElse = (
  <>
    <p>그 외 추가는 안 했다. 과카몰리 같은 것도 안 넣었다. 음료도 안 샀다. 그냥 물을 먹었다.</p>
    <p>맛은 나쁘지 않았다.</p>
    <p>그런데 생각만큼은 아니었다.</p>
  </>
)

const left = (
  <>
    <p>그리고 꽤 많이 남겼다.</p>
    <p>왜 그랬는지는 정확히 하나로 말하기 어렵다.</p>
  </>
)

/*
 * 이유를 확정하지 않는 자리.
 *
 * 세 줄이 서로 다른 x축에 선다. 한 문단으로 붙이면 마지막 줄이 결론이 되고,
 * 목록으로 만들면 셋 중 하나를 고르는 화면이 된다. 둘 다 그날 일어난 일이
 * 아니다 — 지금도 모른다.
 */
const maybe = [
  '시간이 없어서였을 수도 있다.',
  '아니면 직전에 먹은 디저트가 너무 배불러서였을 수도 있다.',
  '아니면 그냥 원래 생각했던 것과 다른 이유가 있었을 수도 있다.',
] as const

const spent = (
  <>
    <p>어쨌든 그렇게 오래 기다린 치폴레를 결국 많이 남겼다.</p>
    <p>그리고 이제 진짜 시간이 없었다.</p>
  </>
)

const gone = (
  <>
    <p>CHAGEE는 갈 수 없게 됐다.</p>
  </>
)

const toSangsu = (
  <>
    <p>상수로 넘어가야 했다.</p>
    <p>18시 40분 입장, 19시 첫 무대였다.</p>
  </>
)

const arrived = (
  <>
    <p>상수까지 왔다.</p>
    <p>그런데 여기까지 와놓고 갑자기 공연장에 가기가 정말 싫어졌다.</p>
  </>
)

/*
 * 이 기록에서 가장 센 문장.
 *
 * 크게 세우지 않는다. 주변을 비우고 본문 폭 그대로 한 줄만 남긴다. 화면이
 * 내내 움직이다가 여기서 아무 일도 일어나지 않는 것이 이 문장의 연출이다.
 */
const reserve = (
  <>
    <p>예비군 가던 때보다 가기 싫은 마음이 컸다.</p>
  </>
)

const mine = (
  <>
    <p>
      애초에 지하 아이돌 공연을 일정에 넣은 건 나였다. 지하돌만 보려던 것도 아니었다. 그 공연장에
      모이는 사람들도 궁금했다. 지하돌보다 그 공간에 있는 남자 관객들을 구경해야 한다는 말까지
      했었다.
    </p>
    <p>내가 평소에 접하지 않는 사람들이 어떤 식으로 놀고 있는지 직접 보고 싶었다.</p>
    <p>그래서 내가 찾아서 넣은 일정이다.</p>
  </>
)

const butNow = (
  <>
    <p>그런데 실제로 상수까지 와서 이제 진짜 들어가야 한다고 생각하니까 존나 가기 싫었다.</p>
  </>
)

const doors = (
  <>
    <p>18시 40분 입장.</p>
    <p>19시 첫 무대.</p>
    <p>공연은 약 20시 40분까지, 이후에는 특전회도 예정돼 있었다.</p>
  </>
)

const standing = (
  <>
    <p>가기 싫다고 계속 서 있을 수는 없었다.</p>
    <p>내가 마음을 단단히 먹고 씩씩하게 들어간 것도 아니다.</p>
    <p>그냥 시간이 계속 갔다.</p>
  </>
)

const shoved = (
  <>
    <p>결국 시간에 떠밀려 건물 지하로 들어갔다.</p>
  </>
)

const lucky = (
  <>
    <p>오히려 그게 다행이었을지도 모른다.</p>
    <p>시간이 조금 더 있었으면 그 잘난 오기도 흔들렸을지 모른다.</p>
  </>
)

/* 한 계단에 한 줄. 문장을 끊은 자리가 곧 계단의 수다. */
const descent = ['그렇게', '계단을', '내려갔다.'] as const

const changing = (
  <>
    <p>그리고 여기서부터는 기록의 모양이 달라진다.</p>
    <p>지하돌 때는 의외로 사진이 많았다.</p>
    <p>앞부분처럼 사진 한 장을 골라놓고 글 하나를 붙이는 방식으로는 안 될 것 같았다.</p>
    <p>사진을 여러 장 올릴 수 있는 구조가 필요했다.</p>
    <p>여기서부터는 글뿐 아니라 보여주는 방식도 바뀌어야 한다.</p>
  </>
)

/* 그날 카운터에서 하나씩 짚은 순서 그대로. */
const bowlItems = ['BROWN RICE', 'PINTO', 'BARBACOA', 'TOMATO', 'GREEN', 'SOUR', 'CORN'] as const

/* 기다리는 동안 지나간 것들. 정리된 적이 없어서 순서도 없다. */
const passing = ['생수', '책자', '사람 구경', '다리 안 아픔', '안 지루함'] as const

export const pushedUnderground: Session = {
  slug: 'pushed-underground',
  title: '시간에 떠밀려 내려갔다',
  subtitle: 'SEOUL',
  meta: {
    date: '2026-09-18',
    location: '서울 용산 · 강남 · 상수',
  },
  excerpt: '완벽하게 정렬된 일정표가 하루를 못 버텼고, 마지막에 남은 건 시간이 미는 방향이었다.',
  display: 'stage',

  /*
   * 넓은 판면의 배치.
   *
   * 이 기록은 같은 문법으로 끝까지 가지 않는다. 처음에는 모든 것이 정확하게
   * 정렬되어 있고, 중간부터 규칙이 조금씩 달라지고, 상수에 가까워질수록
   * 지면이 조급해지고, 지하로 내려간 뒤에는 앞부분과 다른 밀도가 된다.
   *
   * 화면이 실제로 망가지지는 않는다. 어긋나는 것은 정렬과 여백뿐이고, 글은
   * 어디서도 가려지거나 잘리지 않는다. 읽기가 나빠지는 순간 그것은 하루의
   * 오차가 아니라 고장이다.
   *
   * 여백은 하루의 밀도를 따라간다. 아침의 표에서 크게 열리고, 줄을 보는
   * 구간에서 늘어지고, 식사에서 급히 접히고, 상수로 갈수록 한 단계씩 좁아진다.
   * 초읽기를 화면에 그리지 않고 지면의 호흡으로 한다.
   *
   * 스스로 일어나는 장면은 일곱이다. 일정표에서 목적지가 물러나는 것, 두
   * 좌표가 맞고 선이 한 번 그어지는 것, 끝까지 가지 않는 선, CHAGEE가 계획에서
   * 빠지는 것, 15:54가 17:00이 되는 것, 계획한 내가 밀려나는 것, 그리고 계단
   * 아래에서 판면이 열리는 것. 여기 속하지 않는 움직임은 넣지 않았다.
   */
  body: (
    <>
      {/* 아침. 간격이 전부 같다. 이 표가 이 기록의 기준선이다. */}
      <Scene air>
        <Daybook stops={plan} />
      </Scene>

      <Scene>
        <Passage>{intent}</Passage>
      </Scene>

      <Scene>
        <Passage>{twisted}</Passage>
      </Scene>

      <Scene>
        <Passage>{honest}</Passage>
      </Scene>

      {/* 11:58 — 시간은 아직 여백의 맨 끝에 있다. 내가 시간을 보는 쪽이다. */}
      <Scene>
        <Trace at="11:58">
          <Place
            name="YONGSAN STATION"
            address="서울 용산구 한강대로23길 55"
            district="YONGSAN"
            date="2026.09.18"
          />

          <Passage>{yongsan}</Passage>
        </Trace>
      </Scene>

      <Scene pace="brisk">
        <Move from="YONGSAN" to="JL" quiet />
      </Scene>

      <Scene>
        <Trace at="13:00">
          <Place
            name="JL DESSERT BAR"
            address="서울 용산구 대사관로31길 7-2 3층"
            district="HANNAM"
          />

          <Passage>{first}</Passage>
        </Trace>
      </Scene>

      {/* 두 좌표가 맞는 자리. 이 기록에서 본문 레이아웃이 처음 깨진다. */}
      <Scene air>
        <Link at="아, 이게 가능하긴 하구나." checksum="received ≈ intended">
          <Passage>{linking}</Passage>
        </Link>
      </Scene>

      <Scene>
        <Passage>{received}</Passage>
      </Scene>

      <Scene>
        <Passage>{mirror}</Passage>
      </Scene>

      {/* 완전하지 않은 종료. 선이 7할에서 멈추고 다음 장면으로 넘어간다. */}
      <Scene>
        <Passage>{coffee}</Passage>

        <Unfinished />
      </Scene>

      <Scene pace="brisk">
        <Passage>{toGangnam}</Passage>

        <Move from="JL" to="GANGNAM" />
      </Scene>

      {/* 최초 계획이 한 번 지나간다. 이 화면에서 CHAGEE가 조용히 빠진다. */}
      <Scene pace="brisk">
        <Dropout label="PLAN" items={['CHIPOTLE', 'CHAGEE', 'SANGSU']} drops="CHAGEE" />
      </Scene>

      {/* 15:54 — 시간이 한 뼘 들어온다. */}
      <Scene>
        <Trace at="15:54" creep={1}>
          <Place name="CHIPOTLE GANGNAM" address="서울 서초구 강남대로 423" district="GANGNAM" />

          <Passage>{trouble}</Passage>
        </Trace>
      </Scene>

      {/* 줄을 본 순간부터 문단 사이가 벌어진다. 스크롤 거리가 곧 기다린 시간이다. */}
      <Scene>{queue}</Scene>

      <Scene>
        <Passage>{anyway}</Passage>
      </Scene>

      {/* 사람은 지나가고 나는 안 움직인다. 이 구간의 끝에서 15:54가 17:00이 된다. */}
      <Scene>
        <Wait from="15:54" to="17:00" notes={passing} image={line} />
      </Scene>

      <Scene>
        <Passage>{watching}</Passage>
      </Scene>

      {/* 74분 기다리고, 본체는 짧다. 여기부터 지면이 급히 접힌다. */}
      <Scene pace="fast">
        <Trace at="17:08" creep={1}>
          <Passage>{ordered}</Passage>

          <Order head="BOWL" items={bowlItems} />
        </Trace>
      </Scene>

      <Scene pace="fast" width="bleed">
        <Shrink image={bowl} note="17:08" />
      </Scene>

      <Scene pace="fast">
        <Passage>{nothingElse}</Passage>
      </Scene>

      <Scene pace="fast">
        <Passage>{left}</Passage>
      </Scene>

      {/* 원인을 하나로 정렬하지 않는다. 마지막 줄 뒤에는 답 대신 여백이 온다. */}
      <Scene>
        <Loose lines={maybe} />
      </Scene>

      <Scene pace="brisk">
        <Passage>{spent}</Passage>
      </Scene>

      {/* 가지 않은 곳. 자리를 뜨지 않고 그 자리에서 사라진다. */}
      <Scene pace="brisk">
        <Passage>{gone}</Passage>

        <Unvisited name="CHAGEE" />
      </Scene>

      <Scene pace="brisk">
        <Passage>{toSangsu}</Passage>

        <Move from="GANGNAM" to="SANGSU" />
      </Scene>

      {/* 18:40 — 시간이 본문 바로 옆까지 온다. */}
      <Scene pace="brisk">
        <Trace at="18:40" creep={2}>
          <Place name="SANGSU STATION" address="서울 마포구 독막로 지하85" district="SANGSU" />

          <Passage>{arrived}</Passage>
        </Trace>
      </Scene>

      {/*
        가장 센 문장.

        크게 세우지 않고 주변을 비운다. 화면이 내내 움직이다가 여기서 아무
        일도 일어나지 않는 것이 이 문장의 연출이다.
      */}
      <Quiet>
        <Passage>{reserve}</Passage>
      </Quiet>

      <Scene pace="brisk">
        <Passage>{mine}</Passage>
      </Scene>

      <Scene pace="fast">
        <Passage>{butNow}</Passage>
      </Scene>

      {/* 계획한 나와 실행해야 하는 나. 계획 쪽이 판면 밖으로 밀려난다. */}
      <Scene>
        <Stand plan="지하돌 공연" now="가기 싫음" />
      </Scene>

      {/* 시간이 본문 위로 올라온다. 여기서부터 여백이 아니다. */}
      <Scene pace="fast">
        <Trace at="18:40" creep={3}>
          <Place
            name="ATELIER HALL"
            address="서울 마포구 독막로19길 46 지하 1층"
            district="SANGSU"
          />

          <Passage>{doors}</Passage>
        </Trace>
      </Scene>

      {/* 여기서부터 판면이 한 단계씩 좁아진다. 좌우 여백이 커지고 공간이 줄어든다. */}
      <Scene pace="fast">
        <Descent step={2}>
          <Passage>{standing}</Passage>
        </Descent>
      </Scene>

      {/* 스크롤과 잠깐 반대로. 내가 가는 게 아니라 뒤에서 밀린다. */}
      <Scene pace="rushed">
        <Descent step={3}>
          <Pushed>{shoved}</Pushed>
        </Descent>
      </Scene>

      <Scene pace="rushed">
        <Descent step={4}>
          <Passage>{lucky}</Passage>
        </Descent>
      </Scene>

      <Scene pace="rushed">
        <Descent step={4}>
          <Stairs lines={descent} />
        </Descent>
      </Scene>

      {/* 사진을 보는 것이 아니라 공간이 아래로 열린다. */}
      {stairwell ? (
        <Scene width="bleed">
          <Aperture image={stairwell} />
        </Scene>
      ) : null}

      <Scene pace="rushed">
        <Descent step={4}>
          <Passage>{changing}</Passage>
        </Descent>
      </Scene>

      {/* 여기서 판면의 규칙이 풀린다. 본문 폭을 지키던 것이 좌우로 퍼진다. */}
      <ContactSheet shots={underground} label="아틀리에홀 지하 1층" />
    </>
  ),

  /*
   * 작은 판면의 배치.
   *
   * 문장은 하나도 덜어내지 않는다. 합치는 것은 장면의 수다. 넓은 판면에서
   * 각자 자리를 갖던 장치가 좁은 화면에서 한 줄씩 이어지면 «공간의 다양성»이
   * «장치의 연속»으로 바뀌기 때문이다.
   *
   * 움직임의 폭은 각 부품이 자기 CSS에서 낮춘다. 두 점이 어긋나는 거리도,
   * 밀리는 픽셀도, 계단의 폭도 여기서는 절반 아래다. 없애지는 않는다 —
   * 손가락으로 읽는 사람에게 이 하루가 평평한 글이 되면 안 된다.
   */
  compact: (
    <>
      <Scene air>
        <Daybook stops={plan} />
      </Scene>

      <Scene>
        <Passage>{intent}</Passage>

        <Passage>{twisted}</Passage>
      </Scene>

      <Scene>
        <Passage>{honest}</Passage>
      </Scene>

      <Scene>
        <Trace at="11:58">
          <Place
            name="YONGSAN STATION"
            address="서울 용산구 한강대로23길 55"
            district="YONGSAN"
            date="2026.09.18"
          />

          <Passage>{yongsan}</Passage>
        </Trace>

        <Move from="YONGSAN" to="JL" quiet />
      </Scene>

      <Scene>
        <Trace at="13:00">
          <Place
            name="JL DESSERT BAR"
            address="서울 용산구 대사관로31길 7-2 3층"
            district="HANNAM"
          />

          <Passage>{first}</Passage>
        </Trace>
      </Scene>

      <Scene air>
        <Link at="아, 이게 가능하긴 하구나." checksum="received ≈ intended">
          <Passage>{linking}</Passage>
        </Link>
      </Scene>

      <Scene>
        <Passage>{received}</Passage>

        <Passage>{mirror}</Passage>
      </Scene>

      <Scene>
        <Passage>{coffee}</Passage>

        <Unfinished />
      </Scene>

      <Scene pace="brisk">
        <Passage>{toGangnam}</Passage>

        <Move from="JL" to="GANGNAM" />

        <Dropout label="PLAN" items={['CHIPOTLE', 'CHAGEE', 'SANGSU']} drops="CHAGEE" />
      </Scene>

      <Scene>
        <Trace at="15:54" creep={1}>
          <Place name="CHIPOTLE GANGNAM" address="서울 서초구 강남대로 423" district="GANGNAM" />

          <Passage>{trouble}</Passage>
        </Trace>
      </Scene>

      <Scene>{queue}</Scene>

      <Scene>
        <Passage>{anyway}</Passage>
      </Scene>

      <Scene>
        <Wait from="15:54" to="17:00" notes={passing} image={line} />
      </Scene>

      <Scene>
        <Passage>{watching}</Passage>
      </Scene>

      <Scene pace="fast">
        <Trace at="17:08" creep={1}>
          <Passage>{ordered}</Passage>

          <Order head="BOWL" items={bowlItems} />
        </Trace>
      </Scene>

      <Scene pace="fast" width="bleed">
        <Shrink image={bowl} note="17:08" />
      </Scene>

      <Scene pace="fast">
        <Passage>{nothingElse}</Passage>

        <Passage>{left}</Passage>
      </Scene>

      <Scene>
        <Loose lines={maybe} />
      </Scene>

      <Scene pace="brisk">
        <Passage>{spent}</Passage>

        <Passage>{gone}</Passage>

        <Unvisited name="CHAGEE" />
      </Scene>

      <Scene pace="brisk">
        <Passage>{toSangsu}</Passage>

        <Move from="GANGNAM" to="SANGSU" />
      </Scene>

      <Scene pace="brisk">
        <Trace at="18:40" creep={2}>
          <Place name="SANGSU STATION" address="서울 마포구 독막로 지하85" district="SANGSU" />

          <Passage>{arrived}</Passage>
        </Trace>
      </Scene>

      <Quiet>
        <Passage>{reserve}</Passage>
      </Quiet>

      <Scene pace="brisk">
        <Passage>{mine}</Passage>

        <Passage>{butNow}</Passage>
      </Scene>

      <Scene>
        <Stand plan="지하돌 공연" now="가기 싫음" />
      </Scene>

      <Scene pace="fast">
        <Trace at="18:40" creep={3}>
          <Place
            name="ATELIER HALL"
            address="서울 마포구 독막로19길 46 지하 1층"
            district="SANGSU"
          />

          <Passage>{doors}</Passage>
        </Trace>
      </Scene>

      <Scene pace="fast">
        <Descent step={2}>
          <Passage>{standing}</Passage>
        </Descent>
      </Scene>

      <Scene pace="rushed">
        <Descent step={3}>
          <Pushed>{shoved}</Pushed>
        </Descent>
      </Scene>

      <Scene pace="rushed">
        <Descent step={4}>
          <Passage>{lucky}</Passage>

          <Stairs lines={descent} />
        </Descent>
      </Scene>

      {stairwell ? (
        <Scene width="bleed">
          <Aperture image={stairwell} />
        </Scene>
      ) : null}

      <Scene pace="rushed">
        <Descent step={4}>
          <Passage>{changing}</Passage>
        </Descent>
      </Scene>

      <ContactSheet shots={underground} label="아틀리에홀 지하 1층" />
    </>
  ),
}
