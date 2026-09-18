import { Conversation } from '../../components/session/chat/Conversation'
import { EmotionDial } from '../../components/session/EmotionDial'
import { Passage } from '../../components/session/Passage'
import { Plate } from '../../components/session/Plate'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import { TrainDrift } from '../../components/session/TrainDrift'
import { spinozaTurns, trainTurns } from './sugar-drop-reason.transcript'
import type { Cover, Session } from '../types'

/* ─────────────────────────────  사진  ─────────────────────────────
 *
 * 한 장이다. 이날 실제로 도착한 것은 여러 곳인데 이 기록이 끝나는 자리가
 * 하나이기 때문이다 — 기차에서 내려서 처음 앉은 자리.
 *
 * 다 먹은 사진도 아니고 나오자마자 찍은 사진도 아니다. 먹는 도중에 흰 크림과
 * 자주색 소스와 녹색이 서로 섞여 버린 상태이고, 이 기록에 필요한 것이 정확히
 * 그 상태다. 완벽하게 플레이팅된 접시를 걸면 이 글은 «기대한 것을 받은 이야기»가
 * 되는데, 기차에서 일어난 일은 기대가 한 번 사라졌다가 다른 이유로 다시 생긴
 * 쪽이었다.
 *
 * 손으로 찍은 사진이라 판면에 맞추는 일은 했다. 그릇의 중심을 화면의 중심으로
 * 옮기는 크롭, 그늘을 조금 내리고 밝기를 조금 올리는 정도. 거기까지다 — 없던
 * 테이블이나 소품을 더해 더 좋은 사진으로 만들면 그것은 이 자리에서 찍힌
 * 기록이 아니라 다른 가게의 사진이 된다.
 */
const dessert: Cover = {
  src: '/media/session/sugar-drop-reason/01-jl-dessert-bar.webp',
  alt: '오프화이트 도자기 볼 안에서 흰 크림과 자주색 소스, 선명한 녹색 기름, 검은 입자, 흰 직사각형 조각과 붉은 과일이 먹는 도중에 뒤섞여 있다. 오른쪽에 은수저가 놓여 있고 위쪽으로 물잔과 테이블이 보인다',
  width: 1236,
  height: 1032,
  /* 색이 가장 많이 섞인 자리. 목록의 한 조각도 여기를 잘라 보여 준다. */
  focus: { x: 0.52, y: 0.58 },
}

/* ─────────────────────────────  다이얼의 눈금  ─────────────────────────────
 *
 * 앞의 셋은 원인을 찾는 동안 붙여 본 이름이고 «오기»가 실제 원인이다.
 * 평정은 후보가 아니라 원인을 알아낸 뒤에 온 상태라서 눈금 밖에 따로 앉는다.
 * 다섯을 한 줄에 늘어놓으면 «다섯 중에 평정을 고르는 일»이 되는데, 그날
 * 일어난 일은 고르는 것이 아니었다.
 */
const candidates = ['짜증', '후회', '벌', '오기'] as const

/* ─────────────────────────────  문장  ─────────────────────────────
 *
 * 넓은 배치와 좁은 배치가 같은 상수를 쓴다. 좁은 판면에서 줄이는 것은 장면의
 * 수이지 읽을 것의 양이 아니다.
 */

const itinerary = (
  <>
    <p>오늘 여행 일정은 이상하다.</p>
    <p>점심 대신 어지간한 파인다이닝보다 비싼 디저트 코스를 예약했다.</p>
    <p>그다음에는 연 지 얼마 안 된 치폴레에서 점심도 저녁도 아닌 점저를 먹을 생각이다.</p>
    <p>화장실도 없는 중국 카페에서 쉬기로 했다.</p>
    <p>그리고 저녁에는 홍대 지하돌 공연에 간다.</p>
  </>
)

/*
 * 왜 이렇게 짰는가.
 *
 * 처음 판에는 이 구간이 통째로 없었다. 이상한 일정 다음에 바로 짜증이 왔고,
 * 그러면 읽는 사람이 만나는 것은 «스스로 만든 일정에 스스로 화내는 사람»이
 * 된다. 짜증이 이 기록의 출발점처럼 보이는 것이 문제였다 — 실제 출발점은
 * 의도였고, 짜증은 그 의도가 당일에 무너진 자리에서 나온다. 무너질 것이
 * 먼저 서 있어야 무너지는 것이 보인다.
 *
 * 그렇다고 일정의 의미를 앞에서 풀어 주지는 않는다. 여기 있는 것은 해설이
 * 아니라 예약하던 날의 생각이고, 그 생각은 여행 당일에 이미 유효하지 않다.
 */

const flaw = (
  <>
    <p>요즘에는 완벽함보다 결함과 비완성에 더 큰 기대를 하는 것 같다.</p>
    <p>불완전함에서 안정감을 찾으려는 시도가 이제부터 실천적 성격을 가지게 되는 것이다.</p>
  </>
)

const discomfort = (
  <>
    <p>불편한 상황이 생각할 거리를 던져주는 게 맞는 것 같다.</p>
  </>
)

const weathered = (
  <>
    <p>
      나는 줄곧 아름다운 삶을 보고 모방하려고 노력했지만 시간은 속절없이 지나갔고 고된 직장생활은
      나를 풍화시켰다.
    </p>
  </>
)

/*
 * 밑바닥 체험이 아니다.
 *
 * 결핍되어 보이는 삶에서 무엇을 배웠다는 이야기로 쓰지 않는다. 그런 글은
 * 남의 처지를 재료로 쓰고, 이 사람은 그때 그냥 무엇을 보게 될지 궁금해하고
 * 있었다. 궁금했다는 것까지만 적는다.
 */
const other = (
  <>
    <p>그래서 이번에는 반대쪽이 궁금했다.</p>
    <p>결핍되어 보이는 삶, 현실성보다 자극을 좇는 것처럼 보이는 삶에서도 얻을 것이 있는지.</p>
    <p>홍대 지하돌 공연을 일정에 넣은 이유도 거기에 있다.</p>
  </>
)

/*
 * 경첩.
 *
 * 앞의 넷은 예약하던 날의 생각이고 여기서 그 생각이 당일의 생각과 갈라진다.
 * 이 세 줄이 없으면 뒤에 오는 짜증이 어디서 나오는지 알 수 없고, 마지막 세
 * 문장의 «이제야 이유가 생겼다»도 무엇이 없어졌다가 다시 생겼는지 가리킬
 * 자리를 잃는다. 없어지는 장면을 본 사람만 다시 생기는 장면을 읽는다.
 */
const faded = (
  <>
    <p>하지만 그건 이 디저트바를 예약하던 당시의 내가 의도했던 바다.</p>
    <p>몇 주가 지난 지금은 오히려 기대가 떨어지는 기현상이 발생했다.</p>
    <p>아무튼 가보자.</p>
  </>
)

const mirror = (
  <>
    <p>
      엘리베이터에서 한껏 못생겨진 내 얼굴을 보고 있자니 어딘가 위로받고 싶은 마음이 한가득인데,
      디저트바에서 그걸 기대하기는 어렵다.
    </p>
  </>
)

const why = (
  <>
    <p>왜 점심을 디저트로 먹으러 가는 건지 나도 모르겠다.</p>
  </>
)

const hungry = (
  <>
    <p>솔직히 나는 밥 먹고 싶다.</p>
  </>
)

const twisted = (
  <>
    <p>의도적으로 비틀어 버린 병신 여행이다.</p>
    <p>어찌 보면 나중을 위한 여행일지도 모른다.</p>
    <p>지금 당장은 존나 재미없다. 짜증나고.</p>
  </>
)

const calmer = (
  <>
    <p>약간 진정되었다.</p>
    <p>내 감정 상태를 내가 알지 못하면 평정을 얻을 수 없구나.</p>
    <p>내 감정은 오기였다.</p>
  </>
)

const love = (
  <>
    <p>사랑도 그런 것 같다.</p>
    <p>사랑인지 모를 때는 혼란스럽다가 사랑이라는 걸 알면 진정되는.</p>
    <p>근데 까이고 나면 또 생각 많아지지.</p>
  </>
)

const label = (
  <>
    <p>감정은 추상적인데 라벨을 붙일 수 있다는 게 신기하다.</p>
    <p>그리고 그 행위가 굉장히 생산적이라는 지점이 흥미롭다.</p>
  </>
)

const unspoken = (
  <>
    <p>나는 인간이 언어보다 비언어에서 더 진솔하게 드러난다고 보는 입장이다.</p>
    <p>언어는 직위와 계급, 처세와 사회 규범에 맞춰 얼마든지 조정된다.</p>
    <p>비언어는 그 틀을 완전히 따르지 않는다.</p>
  </>
)

const rank = (
  <>
    <p>아무리 높은 직위에 있는 사람도 결국 인간이다.</p>
    <p>예상하지 못한 표정, 침묵, 시선, 태도, 분위기 앞에서는 직위와 별개로 흔들린다.</p>
    <p>
      계급이 사라진다는 뜻이 아니다. 계급과 직위가 사람 사이에 일어나는 모든 일을 완전히 결정하지는
      못한다는 뜻이다.
    </p>
  </>
)

const president = (
  <>
    <p>대통령도 인간이다.</p>
  </>
)

const equal = (
  <>
    <p>신 아래 인간은 모두 인간이다.</p>
  </>
)

const abstraction = (
  <>
    <p>
      신 아래 모두는 평등한데 어떤 겁쟁이들은 계속 추상적인 개념을 자기보호와 안식과 평화에 쓰려고
      한다.
    </p>
    <p>
      그리고 그들이 하는 말에 다수의 멍청이들이 휘둘리는 꼴을 보면, 저들과 내가 같은 인간이라는
      사실에 울렁증이 난다.
    </p>
  </>
)

const purpose = (
  <>
    <p>이제야 여행의 목적을 알았다.</p>
    <p>여행 또한 생산적이라는 것을 충분히 정리할 수 있겠다.</p>
    <p>
      나는 이성적 판단도 감정의 일환이라고 보는 입장이고, 그 연장선에서 여행에도 생산물이 있다고
      본다.
    </p>
  </>
)

const legacy = (
  <>
    <p>나는 명시적 성과에는 관심 없다. 피상적이고 고루한 레거시 같으니까.</p>
    <p>몇 군데를 갔는지, 얼마나 효율적으로 움직였는지, 무엇을 해냈는지가 아니다.</p>
  </>
)

const inspiration = (
  <>
    <p>여행의 목적에는 낯선 경험으로부터 영감을 수집하려는 기대가 깔려 있었다.</p>
    <p>불편한 상황 또는 편한 상황을 겪으면서 말이다.</p>
  </>
)

const ending = (
  <>
    <p>생각을 너무 많이 했다.</p>
    <p>당이 떨어졌다.</p>
    <p>이제야 디저트바에 가는 이유가 생겼다.</p>
  </>
)

/**
 * 당이 떨어진 이유.
 *
 * 여행기가 아니다. 이날 실제로 지나간 자리는 여섯 곳이 넘는데 이 기록에 나오는
 * 장소는 사실상 하나뿐이고, 그것도 마지막에야 나온다. 여기서 일어난 일은 전부
 * 기차 안에서 일어났다.
 *
 * 흐름은 하나다. 이상한 일정 → 그렇게 짠 이유 → 당일에 그 이유가 사라짐 →
 * 짜증 → 왜 포기하지 않는지 모르겠음 → 그 감정이 «오기»라는 발견 → 이름을
 * 붙인 직후의 평정. 그리고 그 뒤에야 스피노자가 온다. 순서를 뒤집어 철학을
 * 먼저 놓으면 이 글은 경험의 기록이 아니라 이론의 예시가 되고, 그 순간
 * 발견은 발견이 아니라 인용이 된다.
 *
 * 두 번째 칸이 처음 판에는 없었다. 이상한 일정 다음에 바로 짜증이 오니까
 * 읽는 사람이 만나는 것이 «스스로 만든 일정에 스스로 화내는 사람»이 되었다.
 * 짜증은 이 기록의 출발점이 아니라 의도가 무너진 자리이고, 무너질 것이 먼저
 * 서 있지 않으면 무너지는 장면이 그냥 불평으로 읽힌다. 완벽함보다 결함에
 * 기대를 걸어 보려던 생각, 불편함이 생각할 거리를 준다는 감, 아름다운 삶을
 * 모방하다 풍화되었으니 이번에는 반대쪽이 궁금하다는 것 — 넷을 앞에 세우고
 * 그 다음에 «그건 예약하던 당시의 나다»로 갈라 놓았다.
 *
 * 그 말을 뒤에서 한 번 더 하고 있던 문단은 지웠다. 기대가 떨어졌다는 사실은
 * 한 번만 필요하고, 두 번째는 앞의 요약이 된다.
 *
 * 형태가 내용이라 `display: 'stage'`를 쓴다. 이 기록에만 있는 것은 둘이다.
 *
 *   EmotionDial  감정에 이름을 붙이는 행위 자체. 이름들이 기준선을 지나가고
 *                «오기»에서 멎는다. 맞혔다고 알려 주지 않는다 — 달라지는 것은
 *                잉크의 농도와 정렬뿐이다.
 *   TrainDrift   이 대화가 이미 출발한 기차 안에서 일어났다는 사실. 페이지는
 *                아래로 가는데 뒤의 얇은 층은 옆으로 흐른다. 기차는 그리지 않는다.
 *
 * 지면의 호흡은 뒤로 갈수록 자극적으로 변하지 않는다. 오히려 반대다. 짜증
 * 구간에서 장면 간격이 불규칙하게 좁아졌다가, 이름을 찾은 뒤로는 여백이
 * 열리고 정렬이 돌아오고 횡이동이 멎는다. 인터랙션으로 말하는 것은
 * «행복해졌다»가 아니라 «내 상태를 설명할 수 있게 됐다»다.
 *
 * 아직 끝난 이야기가 아니다. 이 글은 2026-09-18 여행 도중에 쓰였고 그날 남은
 * 일정 — 치폴레, 차지, 홍대 공연, 캡슐호텔, 다음 날 시그니엘 — 은 여기 없다.
 * 지금 이 기록이 붙잡고 있는 것은 하나뿐이다. «기차 안에서는 여기까지 생각이
 * 도달했다.» 뒤의 경험이 이 결론을 굳힐 수도 무너뜨릴 수도 있어서, 장면을
 * 뒤에 붙이거나 결론의 자리를 옮길 수 있도록 마지막 구간을 닫아 두지 않았다.
 */
export const sugarDropReason: Session = {
  slug: 'sugar-drop-reason',
  title: '당이 떨어진 이유',
  subtitle: 'A CONVERSATION ON A TRAIN',
  display: 'stage',

  meta: {
    date: '2026-09-18',
    location: '기차 안 · 서울',
    type: 'TRAVEL',
  },

  excerpt: '디저트바에 가는 이유는 출발한 뒤에 생겼다.',

  cover: dessert,

  /*
   * 넓은 판면의 배치.
   *
   * 앞쪽은 조밀하다. 일정이 다섯 줄로 붙어 나오고, 짜증 구간에서 장면 사이가
   * 한 번 더 좁아진다. 기차 대화는 끊지 않고 한 장면에 통째로 둔다 — 중간에
   * 여백을 넣으면 생각이 끊긴 자리가 생기는데, 그날 이 말들은 한 번도 끊기지
   * 않았다.
   *
   * 다이얼에서 한 번 크게 비우고, 그 뒤로는 계속 열린다.
   */
  body: (
    <>
      <TrainDrift>
        <Scene pace="brisk">
          <Passage>{itinerary}</Passage>
        </Scene>

        {/* 여기부터 넷은 예약하던 날의 생각이다. 아직 무너지기 전. */}
        <Scene>
          <Passage>{flaw}</Passage>
        </Scene>

        <Scene pace="brisk">
          <Passage>{discomfort}</Passage>

          <Passage>{weathered}</Passage>
        </Scene>

        <Scene>
          <Passage>{other}</Passage>
        </Scene>

        {/* 경첩. 예약하던 날의 생각과 당일의 생각이 여기서 갈라진다. */}
        <Scene>
          <Passage>{faded}</Passage>
        </Scene>

        <Scene pace="fast">
          <Passage>{mirror}</Passage>

          <Passage>{why}</Passage>
        </Scene>

        <Scene>
          <Passage tone="loud">{hungry}</Passage>
        </Scene>

        <Scene pace="fast">
          <Passage>{twisted}</Passage>
        </Scene>

        {/* 기차 안에서 오간 말. 여기서부터 이 기록의 본문은 대화 자체다. */}
        <Scene>
          <Conversation turns={trainTurns} label="기차 안에서 ME와 JIPPY가 나눈 대화" />
        </Scene>

        {/* 이름이 걸리는 자리. 앞뒤로 크게 비운다. */}
        <Scene air>
          <EmotionDial candidates={candidates} after="평정" />
        </Scene>
      </TrainDrift>

      {/*
        이름을 찾은 뒤.

        같은 기차이고 같은 속도인데 옆으로 흐르던 것이 멎는다. 이름표도
        기준선으로 돌아온다. 달라진 것은 창밖이 아니라 창 안쪽이다.
      */}
      <TrainDrift state="settled">
        <Quiet>
          <Passage>{calmer}</Passage>
        </Quiet>

        <Scene air>
          <Passage>{love}</Passage>
        </Scene>

        <Scene>
          <Passage>{label}</Passage>
        </Scene>

        {/* 발견이 먼저고 철학이 나중이다. 두 마디면 된다. */}
        <Scene air>
          <Conversation turns={spinozaTurns} label="오기라는 이름에 대해 나눈 대화" />
        </Scene>

        <Scene>
          <Passage>{unspoken}</Passage>
        </Scene>

        <Scene>
          <Passage>{rank}</Passage>
        </Scene>

        <Scene>
          <Passage tone="loud">{president}</Passage>
        </Scene>

        {/* 한 문장이 한 화면을 쓴다. 이 줄은 앞뒤 어느 문단에도 딸리지 않는다. */}
        <Scene air>
          <Passage tone="loud">{equal}</Passage>
        </Scene>

        <Scene>
          <Passage>{abstraction}</Passage>
        </Scene>

        <Scene air>
          <Passage>{purpose}</Passage>
        </Scene>

        <Scene>
          <Passage>{legacy}</Passage>
        </Scene>

        <Scene air>
          <Passage>{inspiration}</Passage>
        </Scene>
      </TrainDrift>

      {/*
        여기서부터는 기차가 아니다.

        뒤의 층이 아예 없다 — 도착했기 때문이다. 끝까지 옆으로 흐르게 두면
        마지막 세 문장이 여전히 이동 중인 사람의 말이 되는데, 그 세 문장은
        앉아서 하는 말이다.
      */}
      <Scene width="bleed">
        <Plate image={dessert} note="LUNCH" tone="full" />
      </Scene>

      <Quiet>
        <Passage tone="loud">{ending}</Passage>
      </Quiet>
    </>
  ),

  /*
   * 좁은 판면의 배치.
   *
   * 문장은 하나도 빼지 않는다. 합치는 것은 장면이다 — 넓은 판면에서 한 문단이
   * 한 화면을 쓰던 자리가 여기서는 두 문단씩 모인다. 좁은 화면에서 여백이
   * 같은 비율로 반복되면 «여백 → 문단 → 여백 → 문단»이라는 리듬 자체가 눈에
   * 띄기 시작하고, 조용해지려던 것이 연출이 있다는 사실을 계속 알리게 된다.
   *
   * 다이얼은 그대로 둔다. 창이 좁아지면 지나간 이름이 더 일찍 창 밖으로
   * 나가지만 그것은 다이얼이 원래 하는 일이고, 움직임을 끈 화면에서는 눈금이
   * 통째로 펼쳐진다.
   */
  compact: (
    <>
      <TrainDrift>
        <Scene pace="brisk">
          <Passage>{itinerary}</Passage>

          <Passage>{flaw}</Passage>
        </Scene>

        <Scene>
          <Passage>{discomfort}</Passage>

          <Passage>{weathered}</Passage>

          <Passage>{other}</Passage>
        </Scene>

        <Scene>
          <Passage>{faded}</Passage>

          <Passage>{mirror}</Passage>

          <Passage>{why}</Passage>
        </Scene>

        <Scene>
          <Passage tone="loud">{hungry}</Passage>
        </Scene>

        <Scene pace="fast">
          <Passage>{twisted}</Passage>
        </Scene>

        <Scene>
          <Conversation turns={trainTurns} label="기차 안에서 ME와 JIPPY가 나눈 대화" />
        </Scene>

        <Scene air>
          <EmotionDial candidates={candidates} after="평정" />
        </Scene>
      </TrainDrift>

      <TrainDrift state="settled">
        <Quiet>
          <Passage>{calmer}</Passage>
        </Quiet>

        <Scene>
          <Passage>{love}</Passage>

          <Passage>{label}</Passage>
        </Scene>

        <Scene air>
          <Conversation turns={spinozaTurns} label="오기라는 이름에 대해 나눈 대화" />
        </Scene>

        <Scene>
          <Passage>{unspoken}</Passage>

          <Passage>{rank}</Passage>
        </Scene>

        <Scene>
          <Passage tone="loud">{president}</Passage>
        </Scene>

        <Scene air>
          <Passage tone="loud">{equal}</Passage>
        </Scene>

        <Scene>
          <Passage>{abstraction}</Passage>
        </Scene>

        <Scene air>
          <Passage>{purpose}</Passage>

          <Passage>{legacy}</Passage>
        </Scene>

        <Scene air>
          <Passage>{inspiration}</Passage>
        </Scene>
      </TrainDrift>

      <Scene width="bleed">
        <Plate image={dessert} note="LUNCH" tone="full" />
      </Scene>

      <Quiet>
        <Passage tone="loud">{ending}</Passage>
      </Quiet>
    </>
  ),
}
