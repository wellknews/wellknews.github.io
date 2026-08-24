import { Amount } from '../../components/session/Amount'
import { Cue } from '../../components/session/Cue'
import { Detour } from '../../components/session/Detour'
import { Drowse } from '../../components/session/Drowse'
import { Ending } from '../../components/session/Ending'
import { Grammar } from '../../components/session/Grammar'
import { Move } from '../../components/session/Move'
import { Passage } from '../../components/session/Passage'
import { Place } from '../../components/session/Place'
import { Plan, PlanStage } from '../../components/session/PlanStage'
import { PlanRoute } from '../../components/session/PlanRoute'
import { Plate } from '../../components/session/Plate'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import { Tension } from '../../components/session/Tension'
import type { Cover, Session } from '../types'

/* ─────────────────────────────  사진  ─────────────────────────────
 *
 * 세 장이다. 그날 실제로 멈춰 선 자리가 세 곳이었다는 뜻이기도 하다 —
 * 앉아서 뭔가를 먹은 곳, 커피를 마신 곳, 마지막에 앉은 곳.
 *
 * 표지는 마지막 자리의 말차 아이스크림이다. 무신사의 트레이를 걸면 이 기록이
 * «성수 먹거리»로 읽히고, 휴먼메이드의 파란 하늘을 걸면 «성수 매장 투어»가
 * 된다. 이 하루가 실제로 도착한 곳은 그 둘이 아니라 계획이 전부 어긋난 뒤에
 * 앉은 마지막 자리였다. 넓은 나무 쟁반에 그릇 하나와 숟가락 하나만 놓인
 * 그 구도가, 하루치를 다 쓰고 남은 것이 그만큼이었다는 사실과 겹친다.
 */

const musinsaLunch: Cover = {
  src: '/media/session/seongsu-plan-collapse/01-musinsa-lunch.webp',
  alt: '창가 나무 선반에 올린 빨간 트레이 위의 피자 한 조각과 케일 샐러드, 은박에 싼 갈릭노츠, 얼음 가득한 음료. 창밖으로 성수의 거리와 흰 건물이 보인다',
  width: 1086,
  height: 1448,
}

const humanmadeStore: Cover = {
  src: '/media/session/seongsu-plan-collapse/02-humanmade-store.webp',
  alt: '맑은 하늘 아래 붉은 벽돌 건물 위에 걸린 HUMAN MADE OFFLINE STORE SEOUL 간판과 유리로 된 2층',
  width: 1086,
  height: 1448,
}

const potRitual: Cover = {
  src: '/media/session/seongsu-plan-collapse/03-pot-ritual.webp',
  alt: '나무 탁자 위 짙은 색 쟁반에 놓인 말차 아이스크림 한 그릇과 숟가락 하나',
  width: 1254,
  height: 1254,
}

/* ─────────────────────────────  아침의 계획  ─────────────────────────────
 *
 * 아홉 줄이다. 실제로 지난 자리는 열한 곳인데, 나머지 둘 — 메르세데스-벤츠
 * 스튜디오와 아더에러 성수 스페이스 — 은 그날 즉흥으로 정했다. 아침의 표에
 * 끼워 넣으면 그 표는 더 이상 아침에 적은 것이 아니게 된다.
 *
 * 세 번째 휴무가 계획에 없던 자리에서 나온다는 것도 그날의 형태다. 계획을
 * 세워서 닫힌 것이 아니라, 계획이 닫혀서 즉흥으로 정한 곳까지 닫혀 있었다.
 */
const plan = [
  'D MUSEUM',
  'MUSINSA',
  'UVU',
  'HUMAN MADE',
  'KASINA',
  'ADERERROR SIGNIFICANT',
  'THE COFFEE',
  'NUZZLE',
  'POT RITUAL',
] as const

/* ─────────────────────────────  장치의 재료  ───────────────────────────── */

/*
 * 두 공간에서 같이 나온 낱말들.
 *
 * 무신사는 여섯, 블루보틀은 다섯이다. 수를 맞추지 않는다 — 똑같으면 같은
 * 공간이라는 말이 되는데, 그날 든 생각은 «같다»가 아니라 «겹친다»였다.
 * 격자의 마지막 줄이 채워지지 않는 것이 그 차이다.
 */
const musinsaGrammar = ['METAL', 'GREY', 'WHITE', 'LIGHT', 'GLOSS', 'SPACE'] as const

const bottleGrammar = ['MATERIAL', 'NEUTRAL', 'SPACE', 'GLOSS', 'LIGHT'] as const

/* 점수를 매기지 않는다. 두 줄의 자리만으로 비교가 끝난다. */
const ader = [
  ['BRANDING', 'STRONG'],
  ['PRODUCT', 'LESS CONVINCING'],
] as const

/*
 * 성수에서 뚝섬으로, 다시 성수로.
 *
 * 갔던 선과 돌아온 선을 하나로 그리면 한 번 간 것이 된다. 그날 실제로는
 * 두 번 걸었고, 두 번째는 아무 데도 들어가지 않은 채로 걸었다.
 */
const tukseom = [
  { name: 'SEONGSU', leg: 'actual' as const },
  { name: 'TUKSEOM', leg: 'back' as const },
  { name: 'SEONGSU' },
]

/* 끝점이 없어진 선. 긋기는 했는데 그 끝에서 할 일이 사라졌다. */
const brokenCoffee = [{ name: 'HUMAN MADE', leg: 'cancelled' as const }, { name: 'THE COFFEE' }]

/*
 * 하루 전체의 선.
 *
 * 다섯 자리에 네 종류의 선이 각자 자기 자리에 있다. 아침에 그어만 놓고 걷지
 * 않은 선, 실제로 걸은 선, 끝점이 없어진 선, 그리고 갔다가 그대로 돌아온 구간.
 * 순서는 실제로 지난 순서 그대로다 — 지도가 아니라 순서를 보여 주는 그림이라
 * 방향과 거리는 없어도 되지만 순서까지 틀리면 그건 다른 하루가 된다.
 */
const wholeDay = [
  { name: 'D MUSEUM', leg: 'plan' as const },
  { name: 'MUSINSA', leg: 'actual' as const },
  { name: 'HUMAN MADE', leg: 'cancelled' as const },
  { name: 'NUZZLE', leg: 'back' as const },
  { name: 'POT RITUAL' },
]

/* ─────────────────────────────  문장  ─────────────────────────────
 *
 * 넓은 배치와 좁은 배치가 같은 상수를 쓴다. 좁은 판면에서 줄이는 것은 장면의
 * 수이지 읽을 것의 양이 아니다.
 */

const night = (
  <>
    <p>전날 새벽 4시쯤 잠들었던 것 같다.</p>
    <p>
      여행 동안 찍은 사진과 예나 콘서트 영상을 정리하느라 잠들지 못했다. 게다가 오늘 아침에는 일찍
      체크아웃해야 했다.
    </p>
  </>
)

const sleepy = (
  <>
    <p>졸렸다.</p>
  </>
)

const control = (
  <>
    <p>그냥 조금 피곤한 정도가 아니라 계획을 제대로 통제하기 어려울 정도로 졸렸다.</p>
    <p>
      돌이켜보면 오늘 계획이 계속 수정된 이유도 이것 때문이었던 것 같다. 너무 졸린 나머지
      자기제어력을 잃어버렸다.
    </p>
  </>
)

const had = (
  <>
    <p>그래도 처음에는 계획이 있었다.</p>
    <p>
      10시에 체크아웃하고 디뮤지엄부터 갈 생각이었다. 짐을 맡기고 성수를 돌아다니면 될 것 같았다.
    </p>
  </>
)

const monday = (
  <>
    <p>그런데 디뮤지엄은 오늘 휴무였다.</p>
    <p>월요일이었다.</p>
  </>
)

const off = (
  <>
    <p>시작부터 계획이 틀어졌다.</p>
    <p>일단 성수로 향했다.</p>
  </>
)

const lunch = (
  <>
    <p>무신사 메가스토어에서는 먼저 뭔가를 먹었다.</p>
    <p>Today&apos;s Slice, 샐러드, 갈릭노츠, 닥터페퍼 제로.</p>
  </>
)

const tasted = (
  <>
    <p>맛있었다.</p>
    <p>그리고 무신사 메가스토어 안에도 팝업이 더러 있어서 키키 팝업과 빅뱅 팝업을 구경했다.</p>
  </>
)

const seated = (
  <>
    <p>하지만 나는 졸렸다.</p>
    <p>자리에 앉고 나니까 엉덩이를 떼기가 싫었다.</p>
    <p>원래 성수에 와서 이것저것 돌아다닐 생각이었는데 몸은 전혀 협조할 생각이 없어 보였다.</p>
  </>
)

const noticed = (
  <>
    <p>그 와중에도 공간은 눈에 들어왔다.</p>
    <p>무신사가 말하고자 하는 시각적인 비언어에 대해서는 어느 정도 납득했다고 해야 할 것 같다.</p>
    <p>현대적이고 미니멀했다.</p>
    <p>무인양품을 연상한다고 해야 할까.</p>
    <p>
      아니면 조너선 아이브의 LoveFrom 같은 계열의 현대적인 미니멀리즘과 궤를 같이한다고 해야 할까.
    </p>
  </>
)

const packaged = (
  <>
    <p>그것들이 하나의 공간 안에서 패키징되어 있었다.</p>
    <p>요즘 디자인의 트렌드가 이런 방향인 걸까 하는 생각도 들었다.</p>
    <p>그런 생각을 하면서도 졸렸다.</p>
  </>
)

const uvu = (
  <>
    <p>원래 UVU에도 가볼 생각이었다.</p>
    <p>그런데 UVU도 오늘 휴무였다.</p>
  </>
)

const shutting = (
  <>
    <p>오늘은 계획을 세우면 하나씩 문이 닫히는 날이었다.</p>
  </>
)

const next = (
  <>
    <p>다음으로 휴먼메이드에 갔다.</p>
  </>
)

const everywhere = (
  <>
    <p>요즘에는 카페든 카페가 아니든 커피를 팔고 있는 지경이다.</p>
    <p>마치 웰컴드링크를 트레이에 올려 두고 나를 응시하는 매력적인 가게들 같다.</p>
    <p>그런 곳에 들어가 놓고 잔 하나를 들지 않고서는 무시하기가 어렵다.</p>
    <p>
      그러다 보니 여행을 다니다 보면 과장해서 하루에 대여섯 잔의 커피를 마신다거나, 하다못해 원하지
      않는 디저트와 아이스크림이라도 골라야 했다.
    </p>
  </>
)

const took = (
  <>
    <p>휴먼메이드에서도 그랬다.</p>
    <p>원래 커피는 나중에 더커피 성수에서 마실 생각이었다.</p>
    <p>그런데 결국 휴먼메이드에서 마셨다.</p>
  </>
)

const paid = (
  <>
    <p>입장료를 낸 후 여유를 마셨다.</p>
    <p>커피를 마시고 가만히 앉아 있었다.</p>
    <p>조금씩 정신이 들기 시작했다.</p>
    <p>졸음을 조금 소화한 뒤에야 옷가지를 구경하려고 1층으로 내려갈 수 있었다.</p>
  </>
)

const bottle = (
  <>
    <p>잠깐 정신이 돌아오자 다시 공간이 보이기 시작했다.</p>
    <p>그러고 보니 지금 내가 머물고 있는 휴먼메이드 카페도 블루보틀이 서포트하는 것으로 보였다.</p>
    <p>블루보틀 역시 무신사에서 느꼈던 것과 비슷한 디자인 공용어를 사용하는 것 같았다.</p>
  </>
)

const shared = (
  <>
    <p>
      서로 전혀 다른 브랜드인데도 공간을 현대적으로 보이게 만드는 어떤 문법은 공유되고 있는 것
      같았다.
    </p>
    <p>무신사에서 보았던 것도 그런 것이었을까.</p>
    <p>이게 지금의 미니멀리즘일까.</p>
  </>
)

const wearing = (
  <>
    <p>하지만 커피의 효과는 길지 않았다.</p>
    <p>다시 졸렸다.</p>
    <p>여전히 시야가 흐렸다.</p>
    <p>그래도 의지로 조금 더 구경해보려고 했다.</p>
    <p>망할 커피 효과가 이렇게 짧다니.</p>
  </>
)

const stuck = (
  <>
    <p>계획대로라면 이미 다음 장소로 움직이고 있어야 했다.</p>
    <p>그런데 나는 여전히 휴먼메이드 카페에서 발을 떼지 못하고 있었다.</p>
  </>
)

const asleep = (
  <>
    <p>사실상 눈을 뜬 채로 자는 중이었다.</p>
  </>
)

const up = (
  <>
    <p>겨우 자리에서 일어났다.</p>
    <p>1층으로 내려가 옷가지를 구경하고 밖으로 나왔다.</p>
    <p>카시나는 스쳐 지나갔다.</p>
  </>
)

const toAder = (
  <>
    <p>그리고 아더에러 시그니피컨트에 갔다.</p>
  </>
)

const branding = (
  <>
    <p>아더에러는 브랜딩을 잘한다는 생각이 들었다.</p>
    <p>공간을 만들고 자신들을 보여주는 방식도 좋았다.</p>
    <p>다만 제품 자체를 보고 있으면 조금 다른 생각이 들었다.</p>
  </>
)

const product = (
  <>
    <p>젠틀몬스터와 비교하면 제품의 퀄리티가 조금 부족한 것처럼 느껴졌다.</p>
    <p>브랜딩은 잘했는데 물건 자체의 품질이 그만큼 좋아 보이지 않았다.</p>
    <p>그래서 딱히 사고 싶은 것은 없었다.</p>
  </>
)

const toward = (
  <>
    <p>이후 뚝섬 방향으로 걸었다.</p>
    <p>원래 이쪽에서 더커피 성수와 고양이카페 너즐에 가볼 생각이었다.</p>
  </>
)

const quieter = (
  <>
    <p>성수 중심지에서 조금 멀어지자 분위기가 달라졌다.</p>
    <p>나는 오히려 뚝섬 쪽이 더 마음에 들었다.</p>
    <p>성수 중심보다 한적했고 예뻤다.</p>
    <p>사람과 가게와 팝업이 계속 밀려드는 중심부보다 공간에 여유가 있었다.</p>
  </>
)

const already = (
  <>
    <p>더커피 앞까지 갔다.</p>
    <p>그런데 이미 휴먼메이드에서 커피를 마셔버렸다.</p>
    <p>애초에 더커피에서 커피를 마시려고 했던 계획을 내가 앞선 행동으로 직접 없애버린 셈이었다.</p>
    <p>밖에서 보니 실내도 좁아 보였다.</p>
    <p>이미 커피도 마셨고 자리도 좁아 보이는데 굳이 들어갈 이유가 없었다.</p>
    <p>그래서 그냥 지나갔다.</p>
  </>
)

const cats = (
  <>
    <p>다음은 고양이카페 너즐이었다.</p>
  </>
)

const fine = (
  <>
    <p>여기는 휴무도 아니었다.</p>
    <p>커피를 이미 마신 것도 문제가 아니었다.</p>
    <p>앞까지 갔다.</p>
    <p>그리고 서성거렸다.</p>
    <p>들어갈까.</p>
    <p>말까.</p>
    <p>조금 더 서성거렸다.</p>
  </>
)

const nerve = (
  <>
    <p>결국 용기가 나지 않았다.</p>
    <p>다시 돌아왔다.</p>
  </>
)

const walked = (
  <>
    <p>결국 뚝섬에서는 더커피에도 들어가지 않았고 고양이카페에도 들어가지 않았다.</p>
    <p>그냥 산책만 하고 돌아다닌 셈이었다.</p>
    <p>그래도 성수 중심보다는 뚝섬 쪽이 더 한적하고 예쁘기는 했다.</p>
    <p>다만 딱히 할 것이 없었다.</p>
    <p>그래서 다시 성수로 돌아왔다.</p>
  </>
)

const candidate = (
  <>
    <p>중간에 메르세데스-벤츠 스튜디오 서울도 후보로 생각했다.</p>
  </>
)

const again = (
  <>
    <p>그런데 여기도 월요일 휴무였다.</p>
    <p>또 월요일이었다.</p>
    <p>또 휴무였다.</p>
  </>
)

const meant = (
  <>
    <p>처음에는 오늘 하루를 꽤 많이 돌아다닐 생각이었다.</p>
    <p>그런데 실제 하루는 달랐다.</p>
    <p>디뮤지엄은 휴무였다.</p>
    <p>UVU도 휴무였다.</p>
    <p>메르세데스-벤츠 스튜디오도 휴무였다.</p>
    <p>더커피는 이미 다른 곳에서 커피를 마셔서 들어가지 않았다.</p>
    <p>너즐은 앞까지 갔다가 내가 들어가지 못했다.</p>
    <p>뚝섬까지 걸어갔다가 결국 산책만 하고 다시 돌아왔다.</p>
  </>
)

const drifted = (
  <>
    <p>계획은 계속 존재했지만 실제 행동은 그 계획에서 조금씩 벗어났다.</p>
    <p>그리고 그 모든 과정에서 나는 계속 졸렸다.</p>
  </>
)

const last = (
  <>
    <p>다시 성수로 돌아왔다.</p>
    <p>여행에서 제대로 머무르는 마지막 장소는 팟리츄얼이었다.</p>
  </>
)

const matcha = (
  <>
    <p>말차 아이스크림을 시켰다.</p>
    <p>건너편에서는 패션업계에서 일하는 것처럼 보이는 사람들이 이야기를 나누고 있었다.</p>
    <p>무슨 이야기를 하는지 조금 흥미로워 보였다.</p>
    <p>평소라면 귀를 기울였을지도 모르겠다.</p>
  </>
)

const curiosity = (
  <>
    <p>그런데 아무튼 졸렸다.</p>
    <p>이제는 호기심도 졸음을 이기지 못했다.</p>
    <p>말차 아이스크림을 앞에 두고 앉아 있었다.</p>
    <p>여행의 마지막이었다.</p>
  </>
)

const leaving = (
  <>
    <p>이제 옆에 있는 아더에러를 대충 보고 돌아갈 생각이다.</p>
  </>
)

const train = (
  <>
    <p>17시 28분.</p>
    <p>서울역에서 열차를 타야 한다.</p>
  </>
)

const changed = (
  <>
    <p>오늘 하루 동안 계획은 계속 바뀌었다.</p>
    <p>휴무라서 바뀌었고,</p>
    <p>이미 커피를 마셔서 바뀌었고,</p>
    <p>공간이 좁아 보여서 바뀌었고,</p>
    <p>들어갈 용기가 나지 않아서 바뀌었고,</p>
    <p>그냥 너무 졸려서 바뀌었다.</p>
  </>
)

const one = (
  <>
    <p>그리고 지금 남은 생각은 하나다.</p>
  </>
)

const sleep = (
  <>
    <p>그냥 자고 싶다.</p>
  </>
)

export const seongsuPlanCollapse: Session = {
  slug: 'seongsu-plan-collapse',
  title: '계획은 계속 있었다',
  meta: {
    date: '2026-08-24',
    location: '서울 성수동 · 뚝섬',
  },
  excerpt: '계획은 하나도 사라지지 않았는데 하루는 계획과 달랐다.',
  cover: potRitual,
  display: 'stage',

  /*
   * 넓은 판면의 배치.
   *
   * 이 기록에는 층이 둘 있다. 아침에 적어 둔 계획표가 위에 한 번 서고, 그
   * 아래로 하루가 지나가면서 그 표에 한 줄씩 적힌다. 끝까지 내려간 다음 맨
   * 위로 돌아가면 아침의 표에 하루가 전부 적혀 있다.
   *
   * 여백은 하루의 밀도를 따라간다. 문이 세 번 닫히는 자리에서는 좁아지고,
   * 커피가 들어온 뒤 두 장면만 정돈되었다가, 뚝섬에서 크게 열리고, 마지막
   * 자리에서 완전히 멈춘다. 초읽기를 화면에 그리는 대신 지면의 호흡을 바꾼다.
   *
   * 움직이는 것은 여섯뿐이다. 계획표가 고쳐지는 것, 결과가 세 가지 속도로
   * 도착하는 것, 선이 그어지고 끊기는 것, 두 공간에서 같은 낱말이 다시
   * 나오는 것, 졸음이 보조 층을 기준선에서 밀어내는 것, 그리고 열차 시각의
   * 잉크가 짙어지는 것. 여기 속하지 않는 움직임은 넣지 않았다.
   */
  body: (
    <PlanStage items={plan} from="10:00 CHECKOUT" to="17:28 SEOUL">
      <Drowse level={2}>
        <Scene air>
          <Passage>{night}</Passage>
        </Scene>

        <Scene>
          <Passage tone="loud">{sleepy}</Passage>
        </Scene>

        <Scene>
          <Passage>{control}</Passage>
        </Scene>

        <Scene>
          <Passage>{had}</Passage>
        </Scene>

        <Scene>
          <Passage>{monday}</Passage>
        </Scene>

        {/* 첫 번째 휴무. 이름을 읽고, 이유를 읽고, 그 다음에 결과가 앉는다. */}
        <Scene>
          <Cue item="D MUSEUM" state="closed" reason="MONDAY" pace="sequential">
            <Place
              name="D MUSEUM"
              address="서울 성동구 왕십리로 83-21"
              district="SEONGSU"
              date="2026.08.24"
            />
          </Cue>

          <Passage>{off}</Passage>
        </Scene>

        {/* 무신사 구간에서 지면이 잠깐 안정된다. 앉아 있었던 시간만큼. */}
        <Scene air>
          <Cue item="MUSINSA" state="visited">
            <Place name="MUSINSA MEGA STORE SEONGSU" address="서울 성동구 성수이로 62" />
          </Cue>
        </Scene>

        <Scene width="bleed">
          <Plate image={musinsaLunch} note="LUNCH" />

          <Passage>{lunch}</Passage>
        </Scene>

        <Scene>
          <Amount value="20,000" currency="KRW" />

          <Passage>{tasted}</Passage>
        </Scene>

        <Scene>
          <Passage>{seated}</Passage>
        </Scene>

        <Scene>
          <Passage>{noticed}</Passage>
        </Scene>

        <Scene>
          <Grammar words={musinsaGrammar} />

          <Passage>{packaged}</Passage>
        </Scene>

        <Scene>
          <Passage>{uvu}</Passage>
        </Scene>

        {/* 두 번째 휴무. 읽을 시간만 주고 바로 붙는다. */}
        <Scene>
          <Cue item="UVU" state="closed" reason="MONDAY" pace="quick">
            <Place name="UVU SEONGSU FLAGSHIP" address="서울 성동구 둘레7길 15" />
          </Cue>
        </Scene>

        <Scene air>
          <Passage tone="loud">{shutting}</Passage>
        </Scene>

        <Scene pace="brisk">
          <Passage>{next}</Passage>
        </Scene>

        <Scene width="bleed" pace="brisk">
          <Plate image={humanmadeStore} />

          <Cue item="HUMAN MADE" state="visited">
            <Place name="HUMAN MADE OFFLINE STORE SEOUL" address="서울 성동구 성수이로7길 39" />
          </Cue>
        </Scene>

        <Scene pace="brisk">
          <Passage>{everywhere}</Passage>
        </Scene>

        {/*
            여기서 계획 하나가 깨진다.
            더커피로 가던 선의 끝점이 없어진다 — 문이 닫힌 것이 아니라
            내가 그 끝에서 할 일을 이미 다른 데서 해버렸다.
          */}
        <Scene pace="brisk">
          <Passage>{took}</Passage>

          <PlanRoute stops={brokenCoffee} drops="THE COFFEE" />
        </Scene>
      </Drowse>

      {/* 커피가 들어온 두 장면. 이 구간에서만 아무것도 어긋나지 않는다. */}
      <Drowse level={1}>
        <Scene air>
          <Passage>{paid}</Passage>
        </Scene>

        <Scene>
          <Passage>{bottle}</Passage>

          <Grammar words={bottleGrammar} />

          <Passage>{shared}</Passage>
        </Scene>
      </Drowse>

      {/* 커피가 떨어진다. 여기서부터 보조 층이 기준선에서 벗어나기 시작한다. */}
      <Drowse level={3}>
        <Scene pace="brisk">
          <Passage>{wearing}</Passage>
        </Scene>

        <Scene pace="brisk">
          <Passage>{stuck}</Passage>
        </Scene>

        <Scene>
          <Passage tone="loud">{asleep}</Passage>
        </Scene>

        <Scene pace="fast">
          <Passage>{up}</Passage>
        </Scene>

        {/* 카시나. 멈추는 시간만큼만 서 있다가 옆으로 빠진다. */}
        <Scene pace="rushed">
          <Cue item="KASINA" state="passed">
            <Place name="KASINA SEONGSU" address="서울 성동구 성수이로7길 41" />
          </Cue>
        </Scene>

        <Scene>
          <Passage>{toAder}</Passage>

          <Cue item="ADERERROR SIGNIFICANT" state="visited">
            <Place name="ADERERROR SIGNIFICANT SEONGSU" address="서울 성동구 연무장길 26 2F" />
          </Cue>
        </Scene>

        <Scene>
          <Passage>{branding}</Passage>
        </Scene>

        <Scene>
          <Tension pairs={ader} />

          <Passage>{product}</Passage>
        </Scene>

        {/* 뚝섬. 여백이 열리고 한 화면에 한 가지만 남는다. */}
        <Scene air>
          <Passage>{toward}</Passage>

          <Move from="SEONGSU" to="TUKSEOM" />
        </Scene>

        <Scene air>
          <Passage>{quieter}</Passage>
        </Scene>

        <Scene>
          <Cue
            item="THE COFFEE"
            state="skipped"
            from="VISIT"
            because="COFFEE ALREADY TAKEN"
            pace="quick"
          >
            <Place name="THE COFFEE SEONGSU" address="서울 성동구 서울숲2길 27" />
          </Cue>

          <Passage>{already}</Passage>
        </Scene>

        <Scene>
          <Passage>{cats}</Passage>

          {/* 너즐은 열려 있었다. 이름에는 아무 표시도 하지 않는다. */}
          <Cue item="NUZZLE" state="turned-back">
            <Place name="NUZZLE" address="서울 성동구 서울숲6길 14 4F" />
          </Cue>
        </Scene>

        <Scene>
          <Passage>{fine}</Passage>

          <Detour out={4} back={4} note="no." />

          <Passage>{nerve}</Passage>
        </Scene>

        <Scene>
          <Passage>{walked}</Passage>

          <PlanRoute stops={tukseom} />
        </Scene>

        {/* 세 번째 휴무. 이름을 읽기 전에 이미 알고 있다. */}
        <Scene pace="rushed">
          <Passage>{candidate}</Passage>

          <Cue state="closed" reason="MONDAY" pace="foretold">
            <Place
              name="MERCEDES-BENZ STUDIO SEOUL"
              address="서울 성동구 연무장길 73"
              district="XYZ SEOUL"
            />
          </Cue>

          <Passage>{again}</Passage>
        </Scene>

        {/* 아침의 표가 다시 선다. 그 사이에 하루가 전부 적혀 들어갔다. */}
        <Scene pace="fast">
          <Passage>{meant}</Passage>
        </Scene>

        <Scene pace="fast">
          <PlanRoute stops={wholeDay} />

          <Plan />

          <Passage>{drifted}</Passage>
        </Scene>
      </Drowse>

      {/* 마지막 자리. 계획선도 결과 표시도 없다. 문장만 남는다. */}
      <Scene air>
        <Passage>{last}</Passage>

        <Cue item="POT RITUAL" state="visited">
          <Place name="POT RITUAL SEONGSU" address="서울 성동구 연무장9길 14 1F" />
        </Cue>
      </Scene>

      <Scene width="bleed">
        <Plate image={potRitual} />

        <Passage>{matcha}</Passage>
      </Scene>

      <Quiet>
        <Passage>{curiosity}</Passage>
      </Quiet>

      <Scene>
        <Passage>{leaving}</Passage>

        <Cue state="short">
          <Place name="ADERERROR SEONGSU SPACE" address="서울 성동구 성수이로 82" />
        </Cue>

        <Passage>{train}</Passage>
      </Scene>

      <Scene air>
        <Passage>{changed}</Passage>
      </Scene>

      <Scene>
        <Passage>{one}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{sleep}</Passage>
      </Scene>

      <Ending />
    </PlanStage>
  ),

  /*
   * 좁은 판면의 배치.
   *
   * 문장은 하나도 빼지 않는다. 줄이는 것은 한 화면에 동시에 떠 있는 층의
   * 수다 — 넓은 판면에서는 자리와 결과와 계획선이 같은 화면에 놓이지만,
   * 여기서는 그것들이 위아래로 줄을 서면서 화면 하나에 «본문 + 상태» 정도만
   * 남는다. 그래서 장면을 합치고, 옆으로 지나가던 것은 아래로 지나가게 한다.
   */
  compact: (
    <PlanStage items={plan} from="10:00 CHECKOUT" to="17:28 SEOUL">
      <Drowse level={2}>
        <Scene>
          <Passage>{night}</Passage>

          <Passage tone="loud">{sleepy}</Passage>
        </Scene>

        <Scene>
          <Passage>{control}</Passage>

          <Passage>{had}</Passage>
        </Scene>

        <Scene>
          <Passage>{monday}</Passage>

          <Cue item="D MUSEUM" state="closed" reason="MONDAY" pace="sequential">
            <Place
              name="D MUSEUM"
              address="서울 성동구 왕십리로 83-21"
              district="SEONGSU"
              date="2026.08.24"
            />
          </Cue>

          <Passage>{off}</Passage>
        </Scene>

        <Scene>
          <Cue item="MUSINSA" state="visited">
            <Place name="MUSINSA MEGA STORE SEONGSU" address="서울 성동구 성수이로 62" />
          </Cue>
        </Scene>

        <Scene width="bleed">
          <Plate image={musinsaLunch} note="LUNCH" />

          <Passage>{lunch}</Passage>

          <Amount value="20,000" currency="KRW" />

          <Passage>{tasted}</Passage>
        </Scene>

        <Scene>
          <Passage>{seated}</Passage>

          <Passage>{noticed}</Passage>
        </Scene>

        <Scene>
          <Grammar words={musinsaGrammar} />

          <Passage>{packaged}</Passage>
        </Scene>

        <Scene>
          <Passage>{uvu}</Passage>

          <Cue item="UVU" state="closed" reason="MONDAY" pace="quick">
            <Place name="UVU SEONGSU FLAGSHIP" address="서울 성동구 둘레7길 15" />
          </Cue>
        </Scene>

        <Scene air>
          <Passage tone="loud">{shutting}</Passage>
        </Scene>

        <Scene width="bleed" pace="brisk">
          <Passage>{next}</Passage>

          <Plate image={humanmadeStore} />

          <Cue item="HUMAN MADE" state="visited">
            <Place name="HUMAN MADE OFFLINE STORE SEOUL" address="서울 성동구 성수이로7길 39" />
          </Cue>
        </Scene>

        <Scene pace="brisk">
          <Passage>{everywhere}</Passage>

          <Passage>{took}</Passage>

          <PlanRoute stops={brokenCoffee} drops="THE COFFEE" />
        </Scene>
      </Drowse>

      <Drowse level={1}>
        <Scene air>
          <Passage>{paid}</Passage>
        </Scene>

        <Scene>
          <Passage>{bottle}</Passage>

          <Grammar words={bottleGrammar} />

          <Passage>{shared}</Passage>
        </Scene>
      </Drowse>

      <Drowse level={3}>
        <Scene pace="brisk">
          <Passage>{wearing}</Passage>

          <Passage>{stuck}</Passage>
        </Scene>

        <Scene>
          <Passage tone="loud">{asleep}</Passage>
        </Scene>

        <Scene pace="fast">
          <Passage>{up}</Passage>

          <Cue item="KASINA" state="passed">
            <Place name="KASINA SEONGSU" address="서울 성동구 성수이로7길 41" />
          </Cue>
        </Scene>

        <Scene>
          <Passage>{toAder}</Passage>

          <Cue item="ADERERROR SIGNIFICANT" state="visited">
            <Place name="ADERERROR SIGNIFICANT SEONGSU" address="서울 성동구 연무장길 26 2F" />
          </Cue>

          <Passage>{branding}</Passage>
        </Scene>

        <Scene>
          <Tension pairs={ader} />

          <Passage>{product}</Passage>
        </Scene>

        <Scene air>
          <Passage>{toward}</Passage>

          <Move from="SEONGSU" to="TUKSEOM" quiet />

          <Passage>{quieter}</Passage>
        </Scene>

        <Scene>
          <Cue
            item="THE COFFEE"
            state="skipped"
            from="VISIT"
            because="COFFEE ALREADY TAKEN"
            pace="quick"
          >
            <Place name="THE COFFEE SEONGSU" address="서울 성동구 서울숲2길 27" />
          </Cue>

          <Passage>{already}</Passage>
        </Scene>

        <Scene>
          <Passage>{cats}</Passage>

          <Cue item="NUZZLE" state="turned-back">
            <Place name="NUZZLE" address="서울 성동구 서울숲6길 14 4F" />
          </Cue>

          <Passage>{fine}</Passage>
        </Scene>

        <Scene>
          <Detour out={4} back={4} note="no." />

          <Passage>{nerve}</Passage>
        </Scene>

        <Scene>
          <Passage>{walked}</Passage>

          <PlanRoute stops={tukseom} />
        </Scene>

        <Scene pace="rushed">
          <Passage>{candidate}</Passage>

          <Cue state="closed" reason="MONDAY" pace="foretold">
            <Place
              name="MERCEDES-BENZ STUDIO SEOUL"
              address="서울 성동구 연무장길 73"
              district="XYZ SEOUL"
            />
          </Cue>

          <Passage>{again}</Passage>
        </Scene>

        <Scene pace="fast">
          <Passage>{meant}</Passage>

          <PlanRoute stops={wholeDay} />

          <Plan />

          <Passage>{drifted}</Passage>
        </Scene>
      </Drowse>

      <Scene air>
        <Passage>{last}</Passage>

        <Cue item="POT RITUAL" state="visited">
          <Place name="POT RITUAL SEONGSU" address="서울 성동구 연무장9길 14 1F" />
        </Cue>
      </Scene>

      <Scene width="bleed">
        <Plate image={potRitual} />

        <Passage>{matcha}</Passage>
      </Scene>

      <Quiet>
        <Passage>{curiosity}</Passage>
      </Quiet>

      <Scene>
        <Passage>{leaving}</Passage>

        <Cue state="short">
          <Place name="ADERERROR SEONGSU SPACE" address="서울 성동구 성수이로 82" />
        </Cue>

        <Passage>{train}</Passage>
      </Scene>

      <Scene air>
        <Passage>{changed}</Passage>

        <Passage>{one}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{sleep}</Passage>
      </Scene>

      <Ending />
    </PlanStage>
  ),
}
