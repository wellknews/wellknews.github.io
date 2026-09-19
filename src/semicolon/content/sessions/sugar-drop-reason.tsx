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
 * 이 구간이 없으면 뒤에 오는 짜증이 어디서 나오는지 알 수 없다. 짜증은 이
 * 기록의 출발점이 아니라 의도가 당일에 무너진 자리이고, 무너질 것이 먼저
 * 서 있어야 무너지는 것이 보인다.
 *
 * 세 칸이 원인에서 결과로 이어진다. 아름다운 삶을 모방하다 풍화되었고,
 * 그래서 결함 쪽에 기대를 걸게 되었고, 이 일정이 그 생각을 실제로 해보는
 * 것이었다. 세 번째 칸이 일정표를 직접 가리킨다 — 그러지 않으면 앞의 둘은
 * 일정과 상관없는 독백으로 떠 있는다.
 */
const imitation = (
  <>
    <p>나는 줄곧 아름다운 삶을 보고 모방하려고 노력했다.</p>
    <p>그런데 시간은 속절없이 지나갔고 고된 직장생활은 나를 풍화시켰다.</p>
  </>
)

const flaw = (
  <>
    <p>그래서인지 요즘에는 완벽함보다 결함과 비완성에 더 큰 기대를 하게 됐다.</p>
    <p>
      잘 굴러가는 자리에서는 아무 생각도 나지 않는다. 생각할 거리를 던져주는 건 늘 불편한 쪽이었다.
    </p>
    <p>이번 일정은 그 생각을 실제로 해보는 것이었다. 일부러 어긋나게 짜 놓으면 뭐가 나오는지.</p>
  </>
)

/*
 * 밑바닥 체험이 아니다.
 *
 * 결핍되어 보이는 삶에서 무엇을 배웠다는 이야기로 쓰지 않는다. 그런 글은
 * 남의 처지를 재료로 쓴다. 마지막 줄이 그 선을 긋는다 — 배우러 가는 것이
 * 아니라 무엇을 보게 될지 몰라서 넣었다.
 */
const other = (
  <>
    <p>지하돌 공연을 넣은 이유도 거기에 있다.</p>
    <p>아름다워 보이는 삶만 참고해 왔으니, 결핍되어 보이는 삶에서도 얻을 게 있는지 궁금했다.</p>
    <p>배우겠다는 게 아니라 뭘 보게 될지 몰라서 넣었다.</p>
  </>
)

/*
 * 경첩.
 *
 * 앞의 셋은 예약하던 날의 생각이고 여기서 그 생각이 당일의 생각과 갈라진다.
 * 이 세 줄이 없으면 마지막 세 문장의 «이제야 이유가 생겼다»가 무엇이
 * 없어졌다가 다시 생겼는지 가리킬 자리를 잃는다. 없어지는 장면을 본 사람만
 * 다시 생기는 장면을 읽는다.
 */
const faded = (
  <>
    <p>여기까지가 예약하던 날의 생각이다.</p>
    <p>몇 주가 지나 당일이 되니 그 기대가 오히려 떨어져 있었다.</p>
    <p>아무튼 가보자.</p>
  </>
)

const mirror = (
  <>
    <p>엘리베이터 거울에서 한껏 못생겨진 얼굴을 봤다.</p>
    <p>어딘가에서 위로받고 싶은 마음이 한가득인데, 디저트바에서 그걸 기대하기는 어렵다.</p>
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

/*
 * 이름이 붙은 직후.
 *
 * 두 번째 줄이 이 기록에서 가장 중요한 문장이다. 한동안 이 문장이 코드의
 * 주석에만 있었다 — 화면에는 «약간 진정되었다»만 올려 두고, 그게 왜 대단한
 * 일인지는 만든 사람만 알고 있었다. 상황이 하나도 달라지지 않았는데 상태가
 * 달라졌다는 것이 이 글의 전부라서, 그 사실이 본문에 없으면 뒤에 오는
 * 스피노자도 여행의 목적도 걸릴 데가 없다.
 */
const calmer = (
  <>
    <p>약간 진정되었다.</p>
    <p>달라진 건 아무것도 없다. 기차도 그대로 가고 있고 일정도 예약도 그대로다.</p>
    <p>내 감정에 이름이 붙었을 뿐인데 그걸로 됐다.</p>
    <p>내 감정 상태를 내가 알지 못하면 평정을 얻을 수 없구나.</p>
  </>
)

const love = (
  <>
    <p>사랑도 그런 것 같다.</p>
    <p>사랑인지 모를 때는 혼란스럽다가 사랑이라는 걸 알면 진정된다.</p>
    <p>근데 까이고 나면 또 생각 많아지지.</p>
  </>
)

/*
 * «생산적»이라는 말이 여기서 처음 나온다.
 *
 * 원문은 «그 행위가 굉장히 생산적이라는 지점이 흥미롭다»로 끝났는데, 왜
 * 생산적인지가 없으면 그 말은 그냥 낱말이다. 이름을 붙이는 것만으로 상태가
 * 실제로 달라진다는 앞줄이 있어야 «생산»이라는 말이 값을 갖는다. 뒤에서
 * 여행도 같은 이유로 생산적이라고 말할 때 걸리는 자리가 여기다.
 */
const labelled = (
  <>
    <p>감정은 추상적인데 거기에 이름을 붙일 수 있다는 게 신기하다.</p>
    <p>그리고 이름을 붙이는 것만으로 상태가 실제로 달라진다.</p>
    <p>그렇다면 그건 생산적인 행위다.</p>
  </>
)

/* 질문이 있어야 스피노자가 답이 된다. 질문 없이 놓으면 인용이 된다. */
const freedom = (
  <>
    <p>이 감정이 오기라는 걸 알고 나니 되게 자유롭게 느껴지는데, 왜 그런 걸까.</p>
  </>
)

/*
 * 스피노자에서 비언어로 건너가는 다리.
 *
 * 처음 판에는 이 칸이 없어서 두 이야기가 그냥 나란히 놓여 있었다. 건너가는
 * 길은 방금 자기한테 일어난 일이다 — 이 사람은 스스로에 대해서도 «벌»과
 * «글감»을 먼저 말했고 진짜 원인은 마지막에 나왔다. 자기 말도 자기 원인을
 * 못 가리켰다는 사실이, 남의 말은 더 그렇다는 다음 이야기의 근거가 된다.
 */
const cause = (
  <>
    <p>사람을 움직이는 진짜 원인은 그 사람이 하는 말에 잘 나오지 않는다.</p>
    <p>나부터 그랬다. 벌이라고 했다가, 글감 때문이라고 했다가, 결국 오기였다.</p>
  </>
)

const unspoken = (
  <>
    <p>그래서 나는 사람이 언어보다 비언어에서 더 진솔하게 드러난다고 본다.</p>
    <p>말은 직위와 계급, 처세와 사회 규범에 맞춰 얼마든지 조정된다.</p>
    <p>표정과 침묵과 시선은 그만큼 조정되지 않는다.</p>
  </>
)

const rank = (
  <>
    <p>아까 출근이 더 나을까 생각했던 것도 결국 이 얘기다.</p>
    <p>회사에서 처신을 똑바로 한다는 건 말을 직위에 맞춰 고르는 일이고, 나는 그걸 매일 한다.</p>
    <p>현생의 정치와 처세에서 내가 제일 중요하게 보는 게 이 지점이다.</p>
    <p>
      아무리 높은 직위에 있어도 결국 인간이라, 예상하지 못한 표정이나 침묵 앞에서는 직위와 별개로
      흔들린다.
    </p>
    <p>
      계급이 사라진다는 뜻이 아니다. 계급이 사람 사이에 일어나는 모든 일을 결정하지는 못한다는
      뜻이다.
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

/*
 * «겁쟁이»가 왜 겁쟁이인지.
 *
 * 원문은 그 낱말을 설명 없이 던진다. 앞줄에 «그 평등을 견디지 못하고»를
 * 두면 겁쟁이라는 말이 욕이 아니라 진단이 된다 — 무서워서 앞에 뭘 세우는
 * 사람이라는 뜻이다. 낱말은 그대로 두고 왜 그 낱말인지만 보이게 했다.
 */
const abstraction = (
  <>
    <p>그런데 어떤 겁쟁이들은 그 평등을 견디지 못하고 추상적인 개념을 자기 앞에 세운다.</p>
    <p>자기보호와 안식과 평화를 위해서. 그리고 그 말에 다수의 멍청이들이 휘둘린다.</p>
    <p>
      그 꼴을 보면 울렁증이 난다. 같은 문장이 나한테도 걸리기 때문이다 — 신 아래 모두가 인간이면
      저들을 내려다볼 자리도 나한테는 없다.
    </p>
  </>
)

/*
 * 기차로 돌아오는 자리.
 *
 * 울렁증에서 여행의 목적으로 그냥 넘어가면 두 이야기가 남이 된다. 첫 줄이
 * 상황을 다시 불러오고, 셋째 줄이 앞에서 세워 둔 «이름을 붙이는 것은
 * 생산적이다»를 여행으로 연장한다. 그 연장이 이 사람의 실제 논리다.
 */
const purpose = (
  <>
    <p>기차는 아직 가고 있다.</p>
    <p>그리고 이제야 이 여행의 목적을 알았다.</p>
    <p>
      감정에 이름을 붙이는 게 생산이라면, 오늘 이 기차에서 나온 것도 생산이다. 짜증밖에 없던 두
      시간에서 이름 하나와 그 이름이 왜 나를 놓아줬는지가 나왔다.
    </p>
  </>
)

const legacy = (
  <>
    <p>명시적인 성과에는 관심 없다. 피상적이고 고루한 레거시 같으니까.</p>
    <p>
      몇 군데를 갔는지 세는 칸에는 방금 그게 안 들어간다. 오늘 실제로 남은 것을 적을 수 없는 표라면
      그 표가 잘못된 것이다.
    </p>
  </>
)

const inspiration = (
  <>
    <p>여행의 목적에는 낯선 경험으로부터 영감을 수집하려는 기대가 깔려 있었다.</p>
    <p>불편한 상황이든 편한 상황이든, 평소와 다른 조건을 통과하면서 말이다.</p>
    <p>이 일정을 짤 때 이미 그게 깔려 있었다. 그때는 말로 못 했을 뿐이다.</p>
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
 * 붙인 직후의 평정 → 그게 왜 자유로운지 묻는다 → 스피노자 → 사람을 움직이는
 * 진짜 원인은 말에 안 나온다 → 비언어와 직위 → 여행도 같은 이유로 생산적이다
 * → 당이 떨어진다.
 *
 * 이 기록이 두 번 고쳐진 이유가 둘 다 같다. 조각을 늘어놓고 사이를 비워
 * 두었다.
 *
 * 처음에는 일정표 다음에 바로 짜증이 왔다. 무너질 것이 서 있지 않으니 화자가
 * «스스로 만든 일정에 스스로 화내는 사람»으로 읽혔다. 그래서 예약하던 날의
 * 생각 셋과 «여기까지가 예약하던 날의 생각이다»라는 경첩을 앞에 세웠다.
 *
 * 두 번째는 더 근본이었다. 본문이 채팅 조각을 그대로 옮긴 것이어서, 쓴 사람
 * 머릿속에만 있는 연결이 화면에서는 전부 빠져 있었다. 문장은 다 맞는 말인데
 * 읽으면 무슨 소린지 모르는 상태 — 단언이 줄지어 있고 그 사이를 잇는 말이
 * 없었다. 가장 큰 증거는 이 글에서 제일 중요한 문장이 본문이 아니라 이
 * 파일의 주석에 있었다는 것이다(«달라진 건 아무것도 없다»).
 *
 * 그래서 다리를 놓았다. 왜 자유롭게 느껴지는지 묻는 한 줄이 있어야 스피노자가
 * 답이 되고, 자기도 «벌»과 «글감»을 먼저 말했다는 한 줄이 있어야 비언어
 * 이야기가 남의 이야기가 아니게 되고, «기차는 아직 가고 있다»가 있어야
 * 울렁증에서 여행의 목적으로 돌아온다. 낱말은 손대지 않았다 — 겁쟁이도
 * 멍청이도 병신 여행도 그대로 있고, 달라진 것은 그 낱말이 왜 그 낱말인지가
 * 화면에 있느냐다.
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
  guide: (
    <>
      <p>이 글은 여행을 끝낸 뒤 작성한 회고가 아니다.</p>

      <p>서울로 이동하는 기차 안에서, 아직 첫 번째 목적지에도 도착하지 않은 상태에서 시작됐다.</p>

      <p>이날 일정은 처음부터 조금 이상하게 짜여 있었다.</p>

      <p>
        점심 대신 비싼 디저트 코스를 먹고, 그 뒤에 치폴레를 먹고, 마지막에는 평소의 생활반경과는 꽤
        다른 지하 아이돌 공연에 가는 계획이었다.
      </p>

      <p>
        당시 나는 잘 정돈된 경험보다 조금 불편하거나 어긋난 상황에서 오히려 더 많은 생각이 나올 수도
        있다고 보고 있었다. 그래서 일부러 평소라면 선택하지 않았을 조건들을 하루 안에 섞어두었다.
      </p>

      <p>그런데 정작 당일 기차에 타고 나니 기분이 좋지 않았다.</p>

      <p>특별한 사고가 난 것도 아니고 예약을 취소하고 싶은 이유가 명확한 것도 아니었다.</p>

      <p>
        뒤에 이어지는 대화는 이미 정리된 생각을 옮겨 적은 것이 아니다. 무슨 감정인지도 정확히 모르는
        상태에서 대화를 계속하면서 하나씩 이름을 붙여본 실제 과정에 가깝다.
      </p>

      <p>따라서 이 기록에서는 여행에 대한 생각과 글을 쓰는 과정이 동시에 진행된다.</p>
    </>
  ),
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
          <Passage>{imitation}</Passage>
        </Scene>

        <Scene>
          <Passage>{flaw}</Passage>
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
          <Passage>{labelled}</Passage>
        </Scene>

        {/* 질문이 먼저다. 질문 없이 철학을 놓으면 인용이 된다. */}
        <Scene>
          <Passage>{freedom}</Passage>
        </Scene>

        <Scene air>
          <Conversation turns={spinozaTurns} label="오기라는 이름에 대해 나눈 대화" />
        </Scene>

        {/* 방금 자기한테 일어난 일이 다음 이야기의 근거가 된다. */}
        <Scene>
          <Passage>{cause}</Passage>
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

        {/* 기차로 돌아온다. 여기서부터 다시 이 여행의 이야기다. */}
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

  compact: (
    <>
      <TrainDrift>
        <Scene pace="brisk">
          <Passage>{itinerary}</Passage>

          <Passage>{imitation}</Passage>
        </Scene>

        <Scene>
          <Passage>{flaw}</Passage>

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

          <Passage>{labelled}</Passage>
        </Scene>

        <Scene>
          <Passage>{freedom}</Passage>
        </Scene>

        <Scene air>
          <Conversation turns={spinozaTurns} label="오기라는 이름에 대해 나눈 대화" />
        </Scene>

        <Scene>
          <Passage>{cause}</Passage>

          <Passage>{unspoken}</Passage>
        </Scene>

        <Scene>
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

        <Scene>
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
