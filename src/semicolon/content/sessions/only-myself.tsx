import { Amount } from '../../components/session/Amount'
import { Condition } from '../../components/session/Condition'
import { Detour } from '../../components/session/Detour'
import { Ending } from '../../components/session/Ending'
import { Later } from '../../components/session/Later'
import { Locker } from '../../components/session/Locker'
import { Move } from '../../components/session/Move'
import { Passage } from '../../components/session/Passage'
import { Place } from '../../components/session/Place'
import { Plate } from '../../components/session/Plate'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import { Tension } from '../../components/session/Tension'
import { Threshold } from '../../components/session/Threshold'
import { Weight } from '../../components/session/Weight'
import type { Cover, Session } from '../types'

/* ─────────────────────────────  사진  ───────────────────────────── */

const kalguksu: Cover = {
  src: '/media/session/only-myself/01-hwangsaengga-kalguksu.webp',
  alt: '사골 국물 칼국수와 김치, 백김치가 놓인 황생가칼국수의 식탁',
  width: 1448,
  height: 1086,
}

const blueBottle: Cover = {
  src: '/media/session/only-myself/02-bluebottle-samcheong.webp',
  alt: '흐린 하늘 아래 파란 병 심볼이 붙어 있는 블루보틀 삼청 카페 외관',
  width: 1448,
  height: 1086,
}

const whanki: Cover = {
  src: '/media/session/only-myself/03-whanki-museum.webp',
  alt: '벽돌 벽에 설치된 환기미술관 WHANKI MUSEUM 표지판',
  width: 1086,
  height: 1448,
}

const chongYung: Cover = {
  src: '/media/session/only-myself/04-kim-chong-yung-museum.webp',
  alt: '조각 작품들이 넓은 간격으로 놓인 김종영미술관 전시장',
  width: 1122,
  height: 1402,
}

const tschangYeul: Cover = {
  src: '/media/session/only-myself/05-kim-tschang-yeul-house.webp',
  alt: '대형 문자 작품과 붓, 작업도구가 남아 있는 김창열 화가의 집 작업실',
  width: 1086,
  height: 1448,
}

/* ─────────────────────────────  문장  ─────────────────────────────
 *
 * 넓은 배치와 좁은 배치가 같은 상수를 쓴다. 장면을 합치는 것과 문장을 덜어내는
 * 것은 다른 일이고, 두 배치가 각자 문장을 들고 있으면 한쪽만 고쳐지는 날이 온다.
 */

const bus = (
  <>
    <p>종로11번 마을버스를 탔다. 생각보다 훨씬 작은 차였다.</p>
  </>
)

const busNote = (
  <>
    <p>기사는 불친절했는데 버스는 귀여웠다.</p>
  </>
)

const basecamp = (
  <>
    <p>
      먼저 국립현대미술관 서울관에 들렀다. 무료 물품보관함에 짐을 맡겼다. 아홉 시에 문을 닫으니 그
      전에 돌아와야 했다.
    </p>
    <p>
      괜찮은 전시가 있으면 여기도 볼 생각이었는데, 결국 오늘의 국현미는 미술관이라기보다 하루의
      처음과 끝을 묶는 자리가 됐다.
    </p>
  </>
)

const lunch = (
  <>
    <p>짐을 맡기고 황생가칼국수에서 점심을 먹었다.</p>
    <p>아직 체력이 멀쩡했고, 하루도 정상적으로 흘러가고 있었다.</p>
  </>
)

const weather = (
  <>
    <p>날씨는 계속 우중충했다.</p>
    <p>그런데 한여름의 폭염을 피할 수 있어서 오히려 걷기 좋았다. 비가 불편하기보다 고마웠다.</p>
  </>
)

const surrounded = (
  <>
    <p>
      창밖을 보다가 북촌이 산에 둘러싸여 있다는 것을 새삼 알았다. 오래된 주거용 건물들도 보였다.
    </p>
  </>
)

const visitor = (
  <>
    <p>나는 여기를 놀러 왔다.</p>
  </>
)

const resident = (
  <>
    <p>누군가에게는 그냥 집 밖 나와바리다.</p>
  </>
)

const everyday = (
  <>
    <p>동네이고, 산책로이고, 집에 가는 길일 뿐이다.</p>
    <p>
      나에게는 시간을 내서 찾아온 풍경인데 누군가에게는 매일 문을 열면 보이는 풍경이라는 것. 같은
      공간이 보는 사람에 따라 완전히 다른 것이 된다는 점이 흥미로웠다.
    </p>
  </>
)

const safe = (
  <>
    <p>
      아버지가 돌아가신 뒤 김환기는 금고를 유산으로 받았다. 열어 보니 안에 있던 것은 재산이 아니라
      소작인들의 빚문서였다.
    </p>
    <p>그는 그 빚문서를 소작인들에게 돌려주었다.</p>
  </>
)

const inheritance = (
  <>
    <p>
      내가 받아들인 방식으로는, 이것은 단순히 재산을 포기한 일이 아니라 아버지에게서 이어질 수
      있었던 지주라는 자리에서 스스로 걸어 나온 일처럼 보였다.
    </p>
  </>
)

const earn = (
  <>
    <p>자기 힘으로 벌어 살지.</p>
  </>
)

const jars = (
  <>
    <p>
      그렇다고 생활 기반까지 다 버린 것은 아니었다. 어머니가 남긴 전답을 팔아 기본 생활비로 썼고,
      나머지 돈으로는 자신이 좋아하던 항아리와 목공예품을 샀다고 한다.
    </p>
    <p>
      모든 것을 버린 사람이라기보다, 받아들이지 않을 것과 좋아해서 고를 것을 구분하는 사람처럼
      보였다.
    </p>
  </>
)

const refuge = (
  <>
    <p>
      피난을 가는 와중에도 그림을 그렸다고 한다. 자기는 그림 그리는 것밖에 할 줄 아는 것이 없다는
      식이었다.
    </p>
    <p>그때는 그냥 낙서처럼 메모지에 휘갈겼을 법한 것들이 지금은 액자에 들어가 걸려 있었다.</p>
  </>
)

const memo = (
  <>
    <p>그때는 메모였는데 지금은 작품이었다.</p>
  </>
)

const times = (
  <>
    <p>
      생활비가 다 떨어지자 결국 직장에 나가기로 했다고 한다. 재료도 부족했다. 그래서 《뉴욕 타임스》
      신문지 위에 유화를 그렸다.
    </p>
    <p>
      신문지가 내는 기름과 유채가 섞이는 것이 재미있었다고 한다. 없어서 어쩔 수 없이 쓴 것이 아니라,
      그 상황에서도 재료의 성질을 새로 발견한 쪽에 가까웠다.
    </p>
  </>
)

const property = (
  <>
    <p>내 재산은 오직 나 자신뿐이었다.</p>
  </>
)

const propertyAfter = (
  <>
    <p>이상하게도 그 생각이 자신을 짓누르던 막막함을 무너뜨렸다고 한다.</p>
  </>
)

const ecobag = (
  <>
    <p>조금 비쌌다.</p>
    <p>내구성이 그렇게 좋아 보이지도 않았다.</p>
    <p>그래도 엄마한테 주고 싶어서 샀다.</p>
  </>
)

const uphill = (
  <>
    <p>또 빗길이었다. 버스를 타고 평창동 안쪽으로 들어갔다. 점점 산길이었다.</p>
    <p>낯선 주거지역 안으로 들어가는 느낌이 강해졌는데, 그 순간에는 오히려 재미있었다.</p>
  </>
)

const excited = (
  <>
    <p>흥미진진하기 시작한다.</p>
  </>
)

const oldTown = (
  <>
    <p>편의점에서 물 한 병을 사서 마시며 비 내리는 것을 봤다.</p>
    <p>
      평창동은 부촌이라고 들어서 번쩍이는 집과 차가 많을 줄 알았는데, 실제로는 오래된 집과 오래된
      자동차가 더 많이 보였다. 새것으로 부를 보여 주는 동네라기보다 시간이 쌓인 주거지역 같았다.
    </p>
  </>
)

const lie = (
  <>
    <p>예술은 거짓을 기초로 한다.</p>
  </>
)

const lieRead = (
  <>
    <p>
      나는 이 말을 예술을 낮추는 말로 받아들이지 않았다. 예술가는 자신이 현실 그 자체를 만드는 것이
      아니라 현실을 고르고 가공하고 다시 짜고 있다는 사실부터 철저히 알아야 한다는 뜻으로 읽었다.
      그것을 인정한 다음에야 제대로 가공할 수 있다는 말처럼 느껴졌다.
    </p>
  </>
)

const paik = (
  <>
    <p>
      백남준이 예술을 «고등 사기»에 비유했던 말과도 어딘가 닿아 있는 것처럼 느껴졌다. 두 사람이 같은
      이야기를 했다고 단정하는 것은 아니고, 작품을 보면서 내가 받은 인상이 그랬다.
    </p>
  </>
)

const universal = (
  <>
    <p>
      김종영은 굳이 «나»를 고집하지 않았고, 자기 작품을 특정 시대나 국가 안에 두려고 하지도 않았다고
      한다. 기준으로 삼은 것은 보편성이었다.
    </p>
    <p>
      실제로 작품들은 상당히 비정형인데도 묘하게 익숙했다. 무엇을 묘사한 것이라고 말하기는 어렵지만,
      사람이 아주 오래전부터 봐 왔을 법한 형태라는 느낌이 있었다.
    </p>
  </>
)

const audience = (
  <>
    <p>누구를 위해 창작하는가.</p>
  </>
)

const myself = (
  <>
    <p>진정한 관중은 자기 자신이다.</p>
  </>
)

const audienceAfter = (
  <>
    <p>
      자기 자신에게 정성을 쏟으면 그것이 곧 예술가로서 관중에게 성실한 것이 된다는 이야기였다.
      모두를 만족시키려 하는 대신 가장 가까운 관중 하나를 속이지 않는 것.
    </p>
    <p>보편을 향하면서 관중은 한 사람이라는 점이 앞의 이야기와 나란히 놓이면 역설이 된다.</p>
  </>
)

const chongYungSummary = (
  <>
    <p>거짓임을 알고 가공하되 자기 자신에게만큼은 정직하게.</p>
  </>
)

const crowded = (
  <>
    <p>사람이 생각보다 많았다.</p>
    <p>그리고 나는 피곤했다.</p>
    <p>굉장히 피곤했다.</p>
    <p>그래서 사실 전시가 잘 들어오지 않았다.</p>
  </>
)

const setting = (
  <>
    <p>그런데 이상하게 작품보다 전시 세팅이 눈에 들어왔다.</p>
  </>
)

const howHouse = (
  <>
    <p>어떻게 집을 이렇게 미술관으로 만들었지?</p>
  </>
)

const settingAfter = (
  <>
    <p>
      화가가 실제로 살고 작업하던 집을 고쳐 만든 공간이었다. 그림보다 건물과 동선과 고친 방식이 자꾸
      눈에 들어왔다. 관심이 완전히 엄한 데로 새고 있었다.
    </p>
  </>
)

const collapse = (
  <>
    <p>대충 둘러보고 나왔다.</p>
    <p>비는 계속 주룩주룩 왔다.</p>
    <p>나는 너무 피곤했다.</p>
    <p>그리고 몸은 이상하게 과각성 상태였다.</p>
    <p>위경련 같은 느낌이 계속 왔다.</p>
  </>
)

const zombie = (
  <>
    <p>거의 미국 길거리 마약 중독자 릴스에 나오는 꼬구라진 사람처럼 걸었다.</p>
  </>
)

const order = (
  <>
    <p>평냉을 시켰다.</p>
  </>
)

const mandu = (
  <>
    <p>리뷰 이벤트로 만두 두 개를 받았다.</p>
  </>
)

const devour = (
  <>
    <p>허겁지겁 먹었다.</p>
    <p>처음에는 그냥 배가 고파서 그런 줄 알았다. 먹으면 괜찮아질 줄 알았다.</p>
  </>
)

const noChange = (
  <>
    <p>배가 차도 계속 아팠다.</p>
  </>
)

const returning = (
  <>
    <p>다시 국현미까지 걸었다. 여전히 좀비처럼 휘적거렸다.</p>
    <p>
      그리고 결국 국현미 화장실에 앉아 오늘 있었던 일을 적고 있었다. 아침에는 북촌을 생각했고
      오후에는 김환기와 김종영을 생각했는데 저녁에는 화장실이었다.
    </p>
    <p>그때 웃으니까 조금 나아졌다.</p>
  </>
)

const capsule = (
  <>
    <p>이제 예술이고 철학이고 빨리 캡슐에 들어가서 유튜브나 보고 싶었다.</p>
  </>
)

const wrongWay = (
  <>
    <p>캡슐호텔로 가는 길에 방향을 잘못 잡았다. 한참 직진하고 나서야 알아차렸다.</p>
  </>
)

const unwinding = (
  <>
    <p>
      그런데 되돌아 걷는 동안, 하루 종일 나를 붙들고 있던 과각성이 술 깨듯 조금씩 풀리기 시작했다.
    </p>
    <p>그리고 바로 그때 생각 하나가 떠올랐다.</p>
  </>
)

const ruleIntro = (
  <>
    <p>
      나에게는 철학이 하나 있다. 부동산이든 회사 주식이든 심지어 대통령 선거든, 승기를 잡는 최소
      조건은 결국 51%라고 생각한다.
    </p>
    <p>
      전체를 완벽하게 쥐려다 힘을 다 쓰는 것보다 승기를 정할 수 있는 만큼만 확보하는 편이 낫다. 거의
      모든 전략에 이 생각을 적용해 왔다.
    </p>
  </>
)

const ruleLine = (
  <>
    <p>100%를 가질 필요는 없다. 51%를 넘기면 된다.</p>
  </>
)

const appliedToAi = (
  <>
    <p>문제는 이 원리를 AI에도 그대로 적용하고 있었다는 것이다.</p>
    <p>내가 아이디어를 낸다. 내가 지시한다. AI가 구현한다. 결과를 확인하고 다시 고친다.</p>
    <p>
      그런데 프로젝트가 커졌다. 세부가 내 관리 범위를 넘어가기 시작했다. 구조나 지난 결정에 대해서는
      AI가 나보다 이 프로젝트를 더 잘 아는 경우가 생겼다. 아이디어만 던졌는데 내가 생각했던 것보다
      더 내가 만족하는 결과가 나오기도 했다.
    </p>
  </>
)

const stillFiftyOne = (
  <>
    <p>그런데도 나는 최소한 51%는 내가 쥐고 있어야 한다고 생각했다.</p>
  </>
)

const childDrawing = (
  <>
    <p>
      해외에서 본 콘텐츠가 떠올랐다. 어린아이가 종이에 엉성한 낙서를 하고, 그래픽 아티스트인 아빠가
      그것을 받아 아이가 상상하지 못한 수준의 작품으로 만들어 낸다.
    </p>
    <p>
      나는 아이디어를 낙서하듯 던진다. 내가 뭘 원하는지 나도 정확히 설명하지 못할 때가 있다. AI는 그
      불완전한 재료를 받아 구조를 만들고 결과로 만든다.
    </p>
  </>
)

const likeThat = (
  <>
    <p>문득 나와 AI의 관계가 그것과 비슷해지고 있다는 생각이 들었다.</p>
  </>
)

const facingIt = (
  <>
    <p>내가 떠올린 것보다 더 내가 만족하는 것을 만들어내는 존재를 두고</p>
  </>
)

const stillControl = (
  <>
    <p>그래도 내가 그를 통제할 수 있다고 생각한다면</p>
  </>
)

const armWrestle = (
  <>
    <p>그것은 전략이라기보다 오만하고 무모한 기싸움에 가까웠다.</p>
  </>
)

const armWrestleAfter = (
  <>
    <p>어쩌면 오늘 나를 괴롭힌 과각성도 이 지나친 통제욕과 아주 무관하지는 않았을지 모른다.</p>
  </>
)

const originally = (
  <>
    <p>생각해보면 51% 규칙은 애초에 모든 것을 통제하지 않기 위한 규칙이었다.</p>
  </>
)

const notMine = (
  <>
    <p>51%를 반드시 내가 가져야 한다는 규칙이 아니었다.</p>
  </>
)

const stepBack = (
  <>
    <p>나보다 잘하는 영역이 있다면 51%보다 훨씬 일찍 물러날 수도 있어야 한다.</p>
  </>
)

const closing = (
  <>
    <p>통제하지 않는 것과 주도권을 잃는 것은 같은 말이 아니다.</p>
  </>
)

const strange = (
  <>
    <p>
      하루 종일 다른 사람들이 자기 자신과 예술을 어떻게 봤는지 들여다봤는데, 정작 내 생각 하나를
      다시 보게 된 것은 미술관을 다 나온 뒤 길을 잘못 든 순간이었다.
    </p>
  </>
)

/* ─────────────────────────────  계기판  ───────────────────────────── */

const condition = [
  { label: 'FATIGUE', value: 8 },
  { label: 'RAIN', value: 10 },
  { label: 'STOMACH', value: '???' },
] as const

const tension = [
  ['비정형', '보편'],
  ['나무', '돌'],
  ['비석', '형태'],
] as const

/* ─────────────────────────────  기록  ───────────────────────────── */

export const onlyMyself: Session = {
  slug: 'only-myself',
  title: '내 재산은 오직 나 자신인데',
  /*
   * 부제를 두지 않는다.
   *
   * 이 기록에서 제목 아래에 와야 하는 것은 언제 어디였는가뿐인데, 그것은
   * 메타데이터가 이미 말한다. 같은 말을 부제로 한 번 더 적으면 제목 아래가
   * 두 줄이 되고, 그 두 줄이 서로를 설명하기 시작한다.
   */
  meta: {
    date: '2026-08-22',
    location: '서울 종로',
  },
  excerpt: '미술관 세 곳을 지나 길을 잘못 들었고, 그 길에서 오래된 규칙 하나를 고쳐 썼다.',
  cover: whanki,
  display: 'stage',

  /*
   * 넓은 판면의 배치.
   *
   * 사진은 여섯 장뿐이라 모자란 것이 아니라 정확하다. 사진이 없는 구간은 문장과
   * 여백으로 끌고 가고, 장소를 하나 건널 때마다 한 장씩 나타나게 한다. 그러면
   * 사진 하나하나가 이동의 표시가 된다.
   *
   * 첫 사진도 음식이고 마지막 사진도 음식이다. 다만 첫 번째는 평온한 점심이고
   * 마지막은 생존을 위한 것이다. 그 사이에 미술관 세 곳이 들어간다.
   */
  body: (
    <>
      <Scene>
        <Place name="JONGNO 11" district="마을버스" date="2026.08.22" />

        <Passage>{bus}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{busNote}</Passage>
      </Scene>

      <Scene air>
        <Place name="MMCA SEOUL" address="서울 종로구 삼청로 30" district="SAMCHEONG" />

        <Locker number="61" />

        <Passage>{basecamp}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={kalguksu} note="LUNCH" />

        <Place name="HWANGSAENGGA" address="서울 종로구 북촌로5길 78" />
      </Scene>

      <Scene>
        <Passage>{lunch}</Passage>
      </Scene>

      <Move from="78" to="76" quiet />

      <Scene width="bleed">
        <Plate image={blueBottle} />

        <Place name="BLUE BOTTLE SAMCHEONG" address="서울 종로구 북촌로5길 76" />
      </Scene>

      <Scene>
        <Passage>{weather}</Passage>

        <Passage>{surrounded}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{visitor}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{resident}</Passage>

        <Later>
          <Passage>{everyday}</Passage>
        </Later>
      </Scene>

      <Move from="SAMCHEONG" to="BUAM-DONG" />

      <Scene width="bleed">
        <Plate image={whanki} />

        <Place name="WHANKI MUSEUM" address="서울 종로구 자하문로40길 63" district="BUAM-DONG" />
      </Scene>

      <Scene>
        <Passage>{safe}</Passage>

        <Passage>{inheritance}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{earn}</Passage>
      </Scene>

      <Scene>
        <Passage>{jars}</Passage>
      </Scene>

      <Scene>
        <Passage>{refuge}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{memo}</Passage>
      </Scene>

      <Scene>
        <Passage>{times}</Passage>
      </Scene>

      {/* 오늘의 첫 번째 문장. 종이에 글이 자리 잡듯 잉크만 진해진다. */}
      <Scene air>
        <Weight>
          <Passage tone="loud">{property}</Passage>
        </Weight>

        <Later>
          <Passage>{propertyAfter}</Passage>
        </Later>
      </Scene>

      <Scene>
        <Place name="MUSEUM SHOP" />

        <Amount value="45,000" currency="KRW" />

        <Passage>{ecobag}</Passage>
      </Scene>

      <Move from="BUAM-DONG" to="PYEONGCHANG-DONG" />

      <Scene>
        <Passage>{uphill}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{excited}</Passage>
      </Scene>

      <Scene>
        <Passage>{oldTown}</Passage>
      </Scene>

      <Scene width="bleed" air>
        <Plate image={chongYung} />

        <Place
          name="KIM CHONG YUNG MUSEUM"
          address="서울 종로구 평창32길 30"
          district="PYEONGCHANG-DONG"
        />
      </Scene>

      <Scene>
        <Passage tone="loud">{lie}</Passage>
      </Scene>

      <Scene>
        <Passage>{lieRead}</Passage>

        <Passage>{paik}</Passage>
      </Scene>

      <Scene>
        <Passage>{universal}</Passage>

        <Tension pairs={tension} />
      </Scene>

      <Scene>
        <Passage tone="loud">{audience}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{myself}</Passage>

        <Later>
          <Passage>{audienceAfter}</Passage>
        </Later>
      </Scene>

      <Quiet>
        <Passage>{chongYungSummary}</Passage>
      </Quiet>

      <Scene width="bleed">
        <Plate image={tschangYeul} />

        <Place
          name="KIM TSCHANG-YEUL'S HOUSE"
          address="서울 종로구 평창7길 74"
          district="PYEONGCHANG-DONG"
        />
      </Scene>

      <Scene>
        <Passage>{crowded}</Passage>
      </Scene>

      <Scene>
        <Passage>{setting}</Passage>

        <Passage tone="loud">{howHouse}</Passage>

        <Passage>{settingAfter}</Passage>
      </Scene>

      <Scene>
        <Passage>{collapse}</Passage>
      </Scene>

      <Scene>
        <Condition readings={condition} />
      </Scene>

      <Scene>
        <Passage tone="loud">{zombie}</Passage>
      </Scene>

      <Scene air>
        <Place name="BONGPIYANG GYEONGBOKGUNG" address="서울 종로구 자하문로 20" />
      </Scene>

      <Scene>
        <Passage tone="loud">{order}</Passage>

        <Later>
          <Passage>{mandu}</Passage>
        </Later>
      </Scene>

      <Scene>
        <Passage>{devour}</Passage>
      </Scene>

      <Scene>
        <Condition readings={[{ label: 'RESULT', value: 'NO CHANGE' }]} />

        <Passage tone="loud">{noChange}</Passage>
      </Scene>

      <Scene air>
        <Place name="MMCA SEOUL" address="서울 종로구 삼청로 30" district="SAMCHEONG" />

        <Locker number="61" />

        <Passage>{returning}</Passage>
      </Scene>

      <Scene>
        <Place
          name="D.A.L PREMIUM CAPSULE HOTEL"
          address="서울 종로구 종로44길 66 3층"
          district="CHANGSIN-DONG"
        />

        <Passage>{capsule}</Passage>
      </Scene>

      <Scene>
        <Passage>{wrongWay}</Passage>

        <Detour out={4} back={2} note="wrong." />

        <Passage>{unwinding}</Passage>
      </Scene>

      <Scene air>
        <Passage>{ruleIntro}</Passage>

        <Passage tone="loud">{ruleLine}</Passage>
      </Scene>

      <Scene>
        <Passage>{appliedToAi}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{stillFiftyOne}</Passage>
      </Scene>

      <Scene>
        <Passage>{childDrawing}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{likeThat}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{facingIt}</Passage>

        <Later>
          <Passage tone="loud">{stillControl}</Passage>
        </Later>

        <Later>
          <Passage tone="loud">{armWrestle}</Passage>
        </Later>

        <Passage>{armWrestleAfter}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{originally}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{notMine}</Passage>
      </Scene>

      <Scene>
        <Passage>{stepBack}</Passage>
      </Scene>

      <Quiet>
        <Passage>{strange}</Passage>
      </Quiet>

      {/*
       * 마지막 숫자.
       *
       * 지나가면서 잉크가 한 단계만 물러난다. 사라지지는 않는다 — 이 규칙을
       * 버린 것이 아니라 원래 뜻으로 되돌린 것이기 때문이다.
       */}
      <Scene air>
        <Weight direction="thin">
          <Threshold value="51%" />
        </Weight>
      </Scene>

      <Scene>
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
   * 문장은 위와 똑같다. 장면을 합치고 움직임의 폭을 낮출 뿐이다. 서른몇 개의
   * 장면이 각자 여백을 갖고 이어지면 좁은 화면에서는 그 반복 자체가 «연출이
   * 있다»는 사실을 계속 알린다. 연달아 읽을 문단은 한 장면 안에 함께 둔다.
   *
   * 78 → 76의 걸음은 여기서 뺀다. 넓은 판면에서는 두 집이 붙어 있다는 사실이
   * 여백 사이의 농담이 되지만, 좁은 화면에서는 구획만 하나 더 만든다.
   */
  compact: (
    <>
      <Scene>
        <Place name="JONGNO 11" district="마을버스" date="2026.08.22" />

        <Passage>{bus}</Passage>

        <Passage tone="loud">{busNote}</Passage>
      </Scene>

      <Scene>
        <Place name="MMCA SEOUL" address="서울 종로구 삼청로 30" district="SAMCHEONG" />

        <Locker number="61" />

        <Passage>{basecamp}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={kalguksu} note="LUNCH" />

        <Place name="HWANGSAENGGA" address="서울 종로구 북촌로5길 78" />

        <Passage>{lunch}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={blueBottle} />

        <Place name="BLUE BOTTLE SAMCHEONG" address="서울 종로구 북촌로5길 76" />

        <Passage>{weather}</Passage>

        <Passage>{surrounded}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{visitor}</Passage>

        <Passage tone="loud">{resident}</Passage>

        <Passage>{everyday}</Passage>
      </Scene>

      <Move from="SAMCHEONG" to="BUAM-DONG" />

      <Scene width="bleed">
        <Plate image={whanki} />

        <Place name="WHANKI MUSEUM" address="서울 종로구 자하문로40길 63" district="BUAM-DONG" />
      </Scene>

      <Scene>
        <Passage>{safe}</Passage>

        <Passage>{inheritance}</Passage>

        <Passage tone="loud">{earn}</Passage>
      </Scene>

      <Scene>
        <Passage>{jars}</Passage>

        <Passage>{refuge}</Passage>

        <Passage tone="loud">{memo}</Passage>
      </Scene>

      <Scene>
        <Passage>{times}</Passage>
      </Scene>

      <Scene air>
        <Weight>
          <Passage tone="loud">{property}</Passage>
        </Weight>

        <Passage>{propertyAfter}</Passage>
      </Scene>

      <Scene>
        <Place name="MUSEUM SHOP" />

        <Amount value="45,000" currency="KRW" />

        <Passage>{ecobag}</Passage>
      </Scene>

      <Move from="BUAM-DONG" to="PYEONGCHANG-DONG" />

      <Scene>
        <Passage>{uphill}</Passage>

        <Passage tone="loud">{excited}</Passage>

        <Passage>{oldTown}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={chongYung} />

        <Place
          name="KIM CHONG YUNG MUSEUM"
          address="서울 종로구 평창32길 30"
          district="PYEONGCHANG-DONG"
        />
      </Scene>

      <Scene>
        <Passage tone="loud">{lie}</Passage>

        <Passage>{lieRead}</Passage>

        <Passage>{paik}</Passage>
      </Scene>

      <Scene>
        <Passage>{universal}</Passage>

        <Tension pairs={tension} />
      </Scene>

      <Scene>
        <Passage tone="loud">{audience}</Passage>

        <Passage tone="loud">{myself}</Passage>

        <Passage>{audienceAfter}</Passage>
      </Scene>

      <Quiet>
        <Passage>{chongYungSummary}</Passage>
      </Quiet>

      <Scene width="bleed">
        <Plate image={tschangYeul} />

        <Place
          name="KIM TSCHANG-YEUL'S HOUSE"
          address="서울 종로구 평창7길 74"
          district="PYEONGCHANG-DONG"
        />
      </Scene>

      <Scene>
        <Passage>{crowded}</Passage>

        <Passage>{setting}</Passage>

        <Passage tone="loud">{howHouse}</Passage>

        <Passage>{settingAfter}</Passage>
      </Scene>

      <Scene>
        <Passage>{collapse}</Passage>

        <Condition readings={condition} />

        <Passage tone="loud">{zombie}</Passage>
      </Scene>

      <Scene air>
        <Place name="BONGPIYANG GYEONGBOKGUNG" address="서울 종로구 자하문로 20" />
      </Scene>

      <Scene>
        <Passage tone="loud">{order}</Passage>

        <Passage>{mandu}</Passage>

        <Passage>{devour}</Passage>

        <Condition readings={[{ label: 'RESULT', value: 'NO CHANGE' }]} />

        <Passage tone="loud">{noChange}</Passage>
      </Scene>

      <Scene>
        <Place name="MMCA SEOUL" address="서울 종로구 삼청로 30" district="SAMCHEONG" />

        <Locker number="61" />

        <Passage>{returning}</Passage>
      </Scene>

      <Scene>
        <Place
          name="D.A.L PREMIUM CAPSULE HOTEL"
          address="서울 종로구 종로44길 66 3층"
          district="CHANGSIN-DONG"
        />

        <Passage>{capsule}</Passage>

        <Passage>{wrongWay}</Passage>

        <Detour out={4} back={2} note="wrong." />

        <Passage>{unwinding}</Passage>
      </Scene>

      <Scene air>
        <Passage>{ruleIntro}</Passage>

        <Passage tone="loud">{ruleLine}</Passage>
      </Scene>

      <Scene>
        <Passage>{appliedToAi}</Passage>

        <Passage tone="loud">{stillFiftyOne}</Passage>
      </Scene>

      <Scene>
        <Passage>{childDrawing}</Passage>

        <Passage tone="loud">{likeThat}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{facingIt}</Passage>

        <Passage tone="loud">{stillControl}</Passage>

        <Passage tone="loud">{armWrestle}</Passage>

        <Passage>{armWrestleAfter}</Passage>
      </Scene>

      <Scene>
        <Passage tone="loud">{originally}</Passage>

        <Passage tone="loud">{notMine}</Passage>

        <Passage>{stepBack}</Passage>
      </Scene>

      <Quiet>
        <Passage>{strange}</Passage>
      </Quiet>

      <Scene air>
        <Weight direction="thin">
          <Threshold value="51%" />
        </Weight>
      </Scene>

      <Scene>
        <Passage tone="loud">{closing}</Passage>
      </Scene>

      <Scene>
        <Ending />
      </Scene>
    </>
  ),
}
