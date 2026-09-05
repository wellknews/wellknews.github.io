import { Bridge } from '../../components/session/Bridge'
import { Choice } from '../../components/session/Choice'
import { Drift } from '../../components/session/Drift'
import { Later } from '../../components/session/Later'
import { Move } from '../../components/session/Move'
import { Nightfall } from '../../components/session/Nightfall'
import { Passage } from '../../components/session/Passage'
import { Place } from '../../components/session/Place'
import { Plate } from '../../components/session/Plate'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import { Setlist, type Beat } from '../../components/session/Setlist'
import { Tension } from '../../components/session/Tension'
import type { Cover, Session } from '../types'

/* ─────────────────────────────  사진  ─────────────────────────────
 *
 * 네 장이다. 사진 없이도 끝까지 읽히도록 쓴 글이라, 들어온 사진은 장식이
 * 아니라 각자 한 문단의 근거로 들어간다.
 *
 * 표지는 DJ 부스의 한 컷이다. 무대에서 춤추는 컷을 표지로 걸면 이 기록이
 * 콘서트 후기로 읽히는데, 이 글이 공연에서 실제로 붙잡은 것은 그쪽이
 * 아니라 «이거다 싶었던» 그 자리다. 그리고 왕관을 쓴 채 장비 앞에 앉아
 * 뒤를 돌아보는 자세가, 이 기록이 그 장면에서 본 것 — 아직 이쪽 다리에
 * 있으면서 다음 것을 이미 쥔 상태 — 과 정확히 겹친다.
 */

const yenaDjSet: Cover = {
  src: '/media/session/pleasure-is-not-a-sin/01-yena-dj-set.webp',
  alt: '검은 무대 위, 반짝이는 왕관을 얹은 검은 방울 모자를 쓰고 DJ 장비 앞에 앉아 뒤를 돌아보는 최예나',
  width: 1023,
  height: 1537,
}

const yenaStage: Cover = {
  src: '/media/session/pleasure-is-not-a-sin/02-yena-stage.webp',
  alt: '가죽 코트를 펼치고 마이크를 든 채 어두운 무대에 선 최예나',
  width: 1023,
  height: 1537,
}

const nowimyoung: Cover = {
  src: '/media/session/pleasure-is-not-a-sin/03-nowimyoung.webp',
  alt: '푸른 조명을 등지고 마이크를 쥔 채 웃고 있는 래퍼 나우아임영',
  width: 852,
  height: 1600,
}

const unknownPlate: Cover = {
  src: '/media/session/pleasure-is-not-a-sin/04-unknown-plate.webp',
  alt: '나무 받침에 올린 검은 무쇠판 위의 고기와 계란 요리, 옆에 뚜껑 덮인 스테인리스 공기',
  width: 1122,
  height: 1402,
}

/* ─────────────────────────────  자리  ─────────────────────────────
 *
 * 하루에 세 곳을 지난다. 두 곳은 이름과 주소가 있고 한 곳은 없다.
 *
 *   JANGCHUNG ARENA      서울 중구 동호로 241
 *   ???                  ―
 *   MEGABOX DONGDAEMUN   서울 중구 장충단로 247
 *
 * 층과 호수는 적지 않는다. Place는 «장소가 바뀌었다»를 알리는 자리이지
 * 찾아가는 안내가 아니다(굿모닝시티 9층은 그래서 뺐다).
 *
 * 가운데 한 곳만 비어 있는 것이 이 기록의 형태다. 지금 찾아보면 나올지도
 * 모르지만 확정된 적이 없고, 무엇보다 그날의 나는 끝까지 몰랐다. 짐작을
 * 확정처럼 적어 두면 다음에 이 파일을 여는 사람이 그것을 사실로 읽는다.
 *
 * meta의 location에도 두 곳만 적는다. 가운데를 어디라고 적는 순간 본문이
 * 끝까지 감추는 것을 머리말이 먼저 알려 주게 된다.
 */

/* ─────────────────────────────  장치의 재료  ───────────────────────────── */

/*
 * 알고 있다고 생각한 순서와 실제로 온 것.
 *
 * 마지막 줄에는 예상이 없다. 거기서부터는 무엇이 올지 짐작조차 하지 못했다.
 */
const beats: readonly Beat[] = [
  ['SONG', 'SONG'],
  ['MENT', 'DJ'],
  ['SONG', 'GUEST'],
  ['VCR', 'UNRELEASED'],
  ['ENCORE', 'CLUB'],
  ['', '?'],
]

/*
 * 평소 듣던 자리와 그날 무대에서 나온 곡.
 *
 * 지나가는 동안 둘 사이가 좁아진다. 서로 다른 두 곳이 아니라 같은 곡의 두
 * 자리였다는 것을, 거리가 줄어드는 것으로 말한다.
 */
const playlist = [
  ['SHOWER', 'AH AH'],
  ['DRIVE', 'KISS KISS KISS'],
] as const

/* 문자는 끝까지 못 읽었는데 테이블 위의 것은 처음 보는 물건이 아니었다. */
const roomAndTable = [
  ['LANGUAGE', '???'],
  ['INTERFACE', 'KNOWN'],
] as const

/* ─────────────────────────────  문장  ─────────────────────────────
 *
 * 넓은 배치와 좁은 배치가 같은 상수를 쓴다. 좁은 판면에서 줄이는 것은 장면의
 * 수이지 읽을 것의 양이 아니다.
 */

const best = (
  <>
    <p>장충체육관에서 본 최예나의 앙코르 콘서트는 역대급이었다.</p>
  </>
)

const grammar = (
  <>
    <p>
      지금까지 여러 아이돌 콘서트를 보러 다니면서 나 역시 이 문화에 조금씩 익숙해지던 차였다. 아이돌
      콘서트라는 것이 대략 어떤 식으로 흘러가는지, 어떤 순간에 멘트가 나오고 어떤 순간에 다시 노래가
      시작되며 어떤 방식으로 앵콜을 기다리게 되는지, 이제는 어느 정도 문법을 알고 있다고 생각했다.
    </p>
  </>
)

const off = (
  <>
    <p>그런데 이번 공연은 그중에서도 단연 톱이었다.</p>

    <p>가장 재미있었고, 가장 예상할 수 없었다.</p>

    <p>몸을 가누고 얌전히 앉아 있을 수가 없을 정도였다.</p>
  </>
)

const container = (
  <>
    <p>사실상 클럽과 DJing 문화를 ‘전체 이용가’라는 용기에 담아서 내어준 것 같은 공연이었다.</p>
  </>
)

/*
 * 원문은 «퇴폐적»이었다. 옮겨 적는 과정에서 «폐쇄적»이 되어 있었다.
 *
 * 한 글자 차이인데 문단이 통째로 다른 말을 한다. 앞 문단이 클럽 문화를
 * «전체 이용가»라는 용기에 담았다고 적어 두었으니, 그다음에 올 말은
 * 처음부터 퇴폐 쪽이었다 — 그 용기에 담아낸 것이 바로 그것이기 때문이다.
 *
 * 그래서 뒤따르는 문장의 조건절도 함께 고친다. 팬덤의 규칙을 알아야 하는지는
 * 폐쇄의 조건이지 퇴폐의 조건이 아니라, 그대로 두면 앞 문장이 세운 말을
 * 뒷문장이 받지 않는다.
 *
 * 끝 문장은 원문 그대로 둔다. «누구든 음악에 몸을 맡길 수 있을 것 같은»은
 * 퇴폐 쪽에서도 그대로 성립한다 — 취해 있지 않아도 그럴 수 있었다는 말이다.
 * 대신 한 줄로 떼어 놓는다. 이 글은 한 생각을 한 줄에 놓는다.
 *
 * 조건은 둘만 적는다. 처음에 셋을 나열했다가 고쳤다 — 이 글 어디에도 삼단
 * 나열이 없다. «가장 재미있었고, 가장 예상할 수 없었다»처럼 둘이거나 한
 * 절로 끝난다. 셋을 늘어놓으면 글쓴이의 리듬이 아니라 옮긴 사람의 리듬이
 * 된다.
 *
 * 둘 다 이 기록 안에 근거가 있다. 취함은 조금 뒤에 «혈중알코올농도는 아직
 * 0%»로 한 번 더 나오고, 밤은 이 다음 끼니를 먹는 가게가 8시 10분 전에
 * 불을 껐다는 데서 나온다. 아직 밤이 아니었다.
 *
 * 그리고 앞의 «몸을 가누고 얌전히 앉아 있을 수가 없을 정도였다»를 여기서
 * 한 번 받는다. 그렇게까지 움직였는데 술도 밤도 없었다는 것이 이 문단이
 * 하려는 말이다.
 */
const open = (
  <>
    <p>그런데 신기하게도 퇴폐적이지 않았다.</p>

    <p>
      그런 음악에 그렇게까지 움직이려면 보통은 밤이거나 취해 있어야 한다. 그날은 둘 다 아니었다.
    </p>

    <p>그냥 그 자리에 있는 사람이라면 누구든 음악에 몸을 맡길 수 있을 것 같은 분위기였다.</p>

    <p>
      최예나라는 아티스트가 춤을 추고 노래만 한 것이 아니라 직접 DJing까지 했다는 것도 인상적이었다.
    </p>
  </>
)

const guest = (
  <>
    <p>그리고 특별 게스트까지 등장했다.</p>

    <p>나우아임영이었다.</p>

    <p>내가 원래 좋아하던 래퍼였다.</p>
  </>
)

const duet = (
  <>
    <p>
      그가 등장해 최예나와 아직 공개되지 않은 듀엣곡을 불렀는데, 그 순간이 공연 전체에서 확신의
      하이라이트였다.
    </p>

    <p>약간 트로트 같은 기운이 있는데 촌스럽지는 않았다.</p>

    <p>오히려 묘하게 트렌디한 역린을 쿡쿡 찌르는 느낌이었다.</p>

    <p>정확히 설명하기는 어려운데, 듣는 순간 이건 재미있다고 확신하게 만드는 종류의 곡이었다.</p>
  </>
)

const mine = (
  <>
    <p>나우아임영은 내가 평소 샤워하면서 듣던 「AH AH」도 불렀다.</p>

    <p>그리고 평소 운전하면서 듣던 「KISS KISS KISS」까지 불렀다.</p>
  </>
)

const onstage = (
  <>
    <p>
      내 일상에서 각기 다른 상황의 배경음악으로 존재하던 노래가 갑자기 눈앞의 무대에서 흘러나왔다.
    </p>
  </>
)

const seasoning = (
  <>
    <p>그는 그렇게 몇 곡을 부르고 퇴장했다.</p>

    <p>공연 전체를 잡아먹을 정도로 오래 머물지는 않았다.</p>

    <p>그래서 더 좋았다.</p>

    <p>좋은 감초였다.</p>
  </>
)

const familiar = (
  <>
    <p>사실 최예나의 노래를 평소에 아주 자주 듣는 것은 아니다.</p>

    <p>
      전형적인 댄스 아이돌 곡에 가까워서 내 플레이리스트에서 반복해서 찾아 듣는 종류는 아니었다.
    </p>

    <p>그렇다고 노래를 모르는 것도 아니었다.</p>

    <p>숏츠에도 워낙 많이 나오니 모를 수가 없었고, 애초에 나와 사촌 지간이기도 하다.</p>

    <p>그래서 적극적으로 찾아 듣지 않았을 뿐 다른 노래들까지 꽤 익숙하게 알고 있었다.</p>

    <p>그렇게 익숙한 곡들을 들으며 공연을 즐겼다.</p>
  </>
)

const encore = (
  <>
    <p>모든 무대가 끝나고 관객들이 앵콜을 외치고 있었다.</p>

    <p>그때 최예나가 DJing을 하면서 다시 등장했다.</p>
  </>
)

const thatWasIt = (
  <>
    <p>이거다 싶었다.</p>
  </>
)

const age = (
  <>
    <p>아이돌도 나이를 먹는다.</p>

    <p>
      나는 개인적으로 나이를 단순한 숫자로만 보지는 않는다. 나이라는 것이 신체의 노화를 상징하는
      하나의 대유라면, 자신의 변화와 조화되지 않는 언동을 계속 유지하는 것도 자연스럽지는 않다고
      생각한다.
    </p>

    <p>시간이 흘렀는데 과거의 모습만 붙들고 있는 것.</p>

    <p>예전에 잘 어울렸다는 이유만으로 그것을 계속 반복하는 것.</p>

    <p>그런 것에는 언젠가 어색함이 생긴다.</p>

    <p>최예나 역시 그 과도기를 지나가는 중이라고 생각했다.</p>
  </>
)

const grip = (
  <>
    <p>그런데 DJing을 하는 모습을 보면서 이상하게 좋은 영감을 받았다.</p>

    <p>
      아직 지금의 다리를 완전히 건너지도 않았는데, 재빨리 다음 건널다리를 꽉 잡은 것 같은
      느낌이었다.
    </p>

    <p>기존의 자기를 버린 것도 아니다.</p>

    <p>그렇다고 과거의 자기만 반복하고 있는 것도 아니다.</p>

    <p>다음에 잡을 수 있는 것을 미리 꽉 움켜쥐고, 거기에서 진짜 힘을 주고 포즈를 취하고 있었다.</p>

    <p>그 모습이 좋았다.</p>
  </>
)

const stopThinking = (
  <>
    <p>하지만 이제 그만 사유해야 했다.</p>

    <p>나는 저녁을 먹으러 이동해야 했다.</p>
  </>
)

const wander = (
  <>
    <p>공연장을 나온 뒤 별다른 목적지를 정하지 않고 그냥 정처 없이 횡보했다.</p>

    <p>나는 이미 음악에 의해 각성된 상태였다.</p>

    <p>그리고 혈중알코올농도는 아직 0%였다.</p>
  </>
)

const strange = (
  <>
    <p>그렇게 걷다가 이상한 골목에서 이상한 식당 하나를 발견했다.</p>

    <p>간판에 쓰인 문자가 낯설었다.</p>

    <p>몽골이 러시아어를 쓰는지 그날 처음 알았다고 생각했다.</p>

    <p>물론 실제로 러시아어인지도 몰랐다.</p>

    <p>
      몽골어인지 러시아어인지, 두 문자가 원래 비슷해서 내가 구분하지 못하는 건지도 알 수 없었다.
    </p>

    <p>하지만 그런 건 별로 중요하지 않았다.</p>
  </>
)

const stopped = (
  <>
    <p>중요한 것은 내가 그 가게 앞에서 멈췄다는 것이었다.</p>

    <p>고민했다.</p>

    <p>안 하던 짓을 할 것인가.</p>

    <p>아니면 늘 그렇듯 굳이 도전하지 않고 그냥 지나칠 것인가.</p>

    <p>들어가 볼까.</p>

    <p>말까.</p>
  </>
)

const asking = (
  <>
    <p>그렇게 가게 앞에서 서성이고 있는데 직원처럼 보이는 사람이 밖을 정리하고 있었다.</p>

    <p>결국 물었다.</p>

    <p>“혹시 1인 식사 되나요?”</p>

    <p>말하고 나니 조금 멋쩍었다.</p>

    <p>목소리가 점점 작아졌다.</p>
  </>
)

const curious = (
  <>
    <p>“궁금해서요…”</p>
  </>
)

const nobodyAsked = (
  <>
    <p>왜 그런 말을 덧붙였는지는 모르겠다.</p>

    <p>내가 왜 이 이상한 식당에 관심을 가졌는지 직원에게 변명이라도 해야 할 것 같았던 모양이다.</p>

    <p>
      물론 그 직원은 내가 ‘궁금해서요’라고 변명하는 지점에 대해서는 딱히 궁금하지 않았을 것이다.
    </p>

    <p>그저 1인 식사가 가능하다고 안내했을 뿐이다.</p>
  </>
)

const inside = (
  <>
    <p>안으로 들어갔다.</p>

    <p>
      알 수 없는 언어가 여기저기 보였지만 테이블 위의 시스템만큼은 너무나 익숙했다. 현대적인 한국
      식당에서 흔히 볼 수 있는 테이블오더 태블릿이었다.
    </p>
  </>
)

const ordering = (
  <>
    <p>문자는 잘 모르겠고 메뉴 이름도 제대로 읽을 수 없었지만 사진은 볼 수 있었다.</p>

    <p>사진을 넘겨보다가 계란말이와 제육볶음이 혼합된 것처럼 보이는 음식을 골랐다.</p>

    <p>정확히 무슨 음식인지는 몰랐다.</p>

    <p>그래도 주문했다.</p>

    <p>맥주도 잊지 않았다.</p>
  </>
)

const lightsDown = (
  <>
    <p>원래는 술집이었던 모양이다.</p>

    <p>8시가 되기 10분 전쯤 갑자기 가게의 불을 끄기 시작했다.</p>

    <p>그리고 R&amp;B가 흘러나왔다.</p>

    <p>
      아까까지는 낯선 문자가 쓰인 정체불명의 식당이었는데, 조명이 낮아지고 음악이 흐르기 시작하자
      공간의 성격도 살짝 변했다.
    </p>
  </>
)

const good = (
  <>
    <p>무엇보다 음식은 입에 잘 맞았다.</p>

    <p>들어올까 말까 한참 고민했던 곳인데 결과적으로 꽤 성공적인 선택이었다.</p>

    <p>맥주를 마시고, 음식을 먹고, R&amp;B를 들었다.</p>

    <p>
      조금 전까지만 해도 장충체육관에서 음악에 휩쓸려 있었는데, 공연장을 나온 뒤 우연히 들어간 낯선
      식당에서도 계속 음악이 따라왔다.
    </p>
  </>
)

const karma = (
  <>
    <p>그때 문득 생각했다.</p>

    <p>내가 오늘 이토록 즐거울 수 있었던 까닭은 그만큼 일상에서 지쳤기 때문이었을까?</p>

    <p>마치 카르마의 반대처럼.</p>

    <p>평소에 지친 만큼 오늘의 즐거움이 반대편에서 몰려오는 것 같은 기분이었다.</p>

    <p>물론 그 생각의 답을 찾은 것은 아니다.</p>

    <p>그리고 굳이 찾을 필요도 없었다.</p>
  </>
)

const notASin = (
  <>
    <p>이미 더할 나위 없이 즐거웠다.</p>

    <p>그렇다고 더 큰 즐거움을 찾아 나서는 게 죄가 되는 것도 아니었다.</p>

    <p>그래서 다시 이동하기로 했다.</p>

    <p>요즘 반응이 좋다는 스파이더맨을 보러 갔다.</p>
  </>
)

const spider = (
  <>
    <p>동생이 나보다 먼저 영화를 보고 와서는 스파이더맨이 불쌍하다고 말했었다.</p>

    <p>그 말을 듣고 나는 어느 정도 샤덴프로이데를 기대했다.</p>

    <p>얼마나 처참하길래 불쌍하다고 하는지 조금 궁금했다.</p>

    <p>하지만 막상 보고 나니 그렇게까지 특별하지는 않았다.</p>

    <p>그냥저냥.</p>

    <p>내 감상으로는 꽤 ‘메데타시 메데타시’식이었다.</p>

    <p>시간을 때우는 용도로는 적격이라는 심산이었다.</p>
  </>
)

const newYork = (
  <>
    <p>영화의 이야기보다 오히려 배경으로 등장하는 뉴욕이 눈에 들어왔다.</p>

    <p>도시가 활기차 보였다.</p>

    <p>사람과 건물과 움직임이 계속 이어지는 그 문화 자체가 매력적으로 느껴졌다.</p>
  </>
)

const recliner = (
  <>
    <p>그리고 무엇보다 좋았던 것은 리클라이너 체어였다.</p>

    <p>편했다.</p>

    <p>그게 아주 좋았다.</p>
  </>
)

const allDay = (
  <>
    <p>
      공연장에서 몸을 쉬지 않고 움직이고, 밖으로 나와 정처 없이 걸었고, 이름도 모르는 식당에
      들어갔다가 다시 영화관까지 이동했다.
    </p>

    <p>마지막에는 그냥 편한 의자에 기대어 영화를 보는 것만으로도 충분했다.</p>
  </>
)

const enough = (
  <>
    <p>영화가 끝났다.</p>

    <p>이제 더 이상의 도파민은 필요하지 않았다.</p>

    <p>오늘은 충분했다.</p>

    <p>더 재미있는 것을 찾아 또 어디론가 갈 필요도 없었다.</p>
  </>
)

const walking = (
  <>
    <p>이제 걸어서 숙소로 돌아갈 것이다.</p>
  </>
)

const noMore = (
  <>
    <p>NO MORE DOPAMINE.</p>
  </>
)

export const pleasureIsNotASin: Session = {
  slug: 'pleasure-is-not-a-sin',
  title: '즐거움을 좇는 게 죄는 아니잖아',
  meta: {
    date: '2026-08-23',
    location: '서울 장충동 · 동대문',
  },
  excerpt: '술은 마시지 않았는데 이미 취해 있었다.',
  cover: yenaDjSet,
  display: 'stage',

  /*
   * 넓은 판면의 배치.
   *
   * 이 기록은 뒤로 갈수록 커지지 않는다. 공연에서 한 번 최고점을 찍고, 우연히
   * 그 상태가 이어지다가, 영화관에서 완만하게 내려앉고, 걸어서 돌아가는 동안
   * 멈춘다. 그래서 여백도 그 모양을 따라간다 — 앞쪽은 pace로 좁혀 서두르고,
   * 리클라이너 이후로는 아무것도 서두르지 않는다.
   *
   * 움직이는 것은 넷뿐이다. 예상이 어긋나는 박자(Setlist), 목적 없이 흐르는
   * 상태(Drift·Bridge·Choice), 조명이 내려가는 순간(Nightfall), 그리고 전부
   * 멈추는 마지막(Quiet). 이 넷에 속하지 않는 움직임은 넣지 않았다.
   */
  body: (
    <>
      <Scene>
        <Place
          name="JANGCHUNG ARENA"
          address="서울 중구 동호로 241"
          district="JANGCHUNG"
          date="2026.08.23"
        />

        <Passage tone="loud">{best}</Passage>
      </Scene>

      <Scene>
        <Passage>{grammar}</Passage>
      </Scene>

      {/* 알고 있다고 생각한 순서가 여기서 어긋나기 시작한다. */}
      <Scene>
        <Setlist beats={beats} />

        <Passage>{off}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{container}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={yenaStage} />

        <Passage>{open}</Passage>
      </Scene>

      {/* 게스트가 등장하는 자리부터 여백이 한 단계씩 좁아진다. */}
      <Scene width="bleed" pace="brisk">
        <Plate image={nowimyoung} />

        <Passage>{guest}</Passage>
      </Scene>

      <Scene pace="brisk">
        <Passage>{duet}</Passage>
      </Scene>

      <Scene pace="fast">
        <Passage>{mine}</Passage>

        <Tension pairs={playlist} converge />

        <Passage>{onstage}</Passage>
      </Scene>

      <Scene pace="brisk">
        <Passage>{seasoning}</Passage>
      </Scene>

      <Scene>
        <Passage>{familiar}</Passage>
      </Scene>

      {/* 이 기록의 전환점. 앞의 서두름이 여기서 한 문장으로 멎는다. */}
      <Scene air>
        <Passage>{encore}</Passage>

        <Later>
          <Passage tone="loud">{thatWasIt}</Passage>
        </Later>
      </Scene>

      <Quiet>
        <Passage>{age}</Passage>
      </Quiet>

      <Scene>
        <Passage>{grip}</Passage>

        <Bridge from="NOW" to="NEXT" />
      </Scene>

      <Scene air>
        <Passage tone="loud">{stopThinking}</Passage>
      </Scene>

      {/*
       * 여기에는 Move를 두지 않는다.
       *
       * Move는 «어디에서 어디로 갔다»이고, 이 구간에는 갈 곳이 없었다. 화살표
       * 하나를 그려 넣는 순간 정처 없이 걸은 일이 목적지가 있는 이동이 된다.
       * 자리가 바뀐 것은 다음 Place가 알린다.
       */}
      <Scene>
        <Passage>{wander}</Passage>

        <Drift label="BAC" value="0.00%" states={['AWAKE', 'MUSIC', 'MOVING']} />
      </Scene>

      <Scene>
        <Passage>{strange}</Passage>
      </Scene>

      {/*
       * 이름도 주소도 적지 않는다.
       *
       * 지금 찾아보면 나올지도 모른다. 나중에 알아낸 것으로 그때의 상태를
       * 덮으면 이 장면이 성립하지 않는다 — 그날의 나는 간판의 문자가 무엇인지
       * 끝까지 몰랐고, 모른 채로 들어간 것이 이 기록에서 일어난 일의 전부다.
       * 데이터가 빠진 것이 아니라 이것이 내용이다.
       *
       * 그래서 주소도 넘기지 않는다. Place는 주소를 받으면 지도로 가는 링크를
       * 만드는데, 여기에 링크가 하나 생기는 순간 «모르는 곳»이 «찾아갈 수 있는
       * 곳»이 된다.
       */}
      <Scene>
        <Place name="???" address="서울 ??구 ???로 ??" district="???" unknown />

        <Passage>{stopped}</Passage>

        <Choice taken="ENTER" passed="PASS" />
      </Scene>

      <Scene>
        <Passage>{asking}</Passage>

        <Later>
          <Passage>{curious}</Passage>
        </Later>
      </Scene>

      <Scene>
        <Passage>{nobodyAsked}</Passage>
      </Scene>

      <Scene>
        <Passage>{inside}</Passage>

        <Tension pairs={roomAndTable} />
      </Scene>

      <Scene width="bleed">
        <Passage>{ordering}</Passage>

        <Plate image={unknownPlate} />
      </Scene>

      {/* 자리를 옮긴 것이 아니다. 같은 가게에서 조명만 내려갔다. */}
      <Nightfall at="7:50 PM">
        <Passage>{lightsDown}</Passage>

        <Passage>{good}</Passage>
      </Nightfall>

      <Scene>
        <Passage>{karma}</Passage>
      </Scene>

      <Scene>
        <Passage>{notASin}</Passage>

        <Move from="???" to="MEGABOX DONGDAEMUN" />
      </Scene>

      <Scene>
        <Place name="MEGABOX DONGDAEMUN" address="서울 중구 장충단로 247" district="DONGDAEMUN" />

        <Passage>{spider}</Passage>
      </Scene>

      <Scene air>
        <Passage>{newYork}</Passage>
      </Scene>

      {/*
       * 여기서부터 화면이 조용해진다.
       *
       * 오늘의 마지막 즐거움이 자극이 아니라 몸을 눕히는 것이었다는 게 이
       * 기록의 결론이라, 그 문장 뒤로는 움직이는 것을 남기지 않는다.
       */}
      <Quiet>
        <Passage>{recliner}</Passage>

        <Passage>{allDay}</Passage>

        <Passage>{enough}</Passage>
      </Quiet>

      <Scene>
        <Passage>{walking}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{noMore}</Passage>
      </Scene>
    </>
  ),

  /*
   * 좁은 판면의 배치.
   *
   * 같은 문장을 그대로 쓰고 장면만 합친다. 390px에서는 여백이 곧 화면의
   * 4분의 1이라, 넓은 판면의 장면 수를 그대로 쓰면 «여백 → 장치 → 여백»의
   * 반복 자체가 눈에 띄기 시작한다.
   *
   * 장치는 하나도 빼지 않았다. 이 기록에서 장치는 커서를 전제로 하지 않고
   * 전부 스크롤로만 움직여서, 손가락에서도 넓은 화면과 똑같이 일어난다.
   */
  compact: (
    <>
      <Scene>
        <Place
          name="JANGCHUNG ARENA"
          address="서울 중구 동호로 241"
          district="JANGCHUNG"
          date="2026.08.23"
        />

        <Passage tone="loud">{best}</Passage>

        <Passage>{grammar}</Passage>
      </Scene>

      <Scene>
        <Setlist beats={beats} />

        <Passage>{off}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{container}</Passage>
      </Scene>

      <Scene width="bleed">
        <Plate image={yenaStage} />

        <Passage>{open}</Passage>

        <Passage>{guest}</Passage>
      </Scene>

      <Scene width="bleed" pace="brisk">
        <Plate image={nowimyoung} />

        <Passage>{duet}</Passage>
      </Scene>

      <Scene pace="fast">
        <Passage>{mine}</Passage>

        <Tension pairs={playlist} converge />

        <Passage>{onstage}</Passage>
      </Scene>

      <Scene pace="brisk">
        <Passage>{seasoning}</Passage>

        <Passage>{familiar}</Passage>
      </Scene>

      <Scene air>
        <Passage>{encore}</Passage>

        <Later>
          <Passage tone="loud">{thatWasIt}</Passage>
        </Later>
      </Scene>

      <Quiet>
        <Passage>{age}</Passage>
      </Quiet>

      <Scene>
        <Passage>{grip}</Passage>

        <Bridge from="NOW" to="NEXT" />
      </Scene>

      <Scene air>
        <Passage tone="loud">{stopThinking}</Passage>
      </Scene>

      <Scene>
        <Passage>{wander}</Passage>

        <Drift label="BAC" value="0.00%" states={['AWAKE', 'MUSIC', 'MOVING']} />

        <Passage>{strange}</Passage>
      </Scene>

      <Scene>
        <Place name="???" address="서울 ??구 ???로 ??" district="???" unknown />

        <Passage>{stopped}</Passage>

        <Choice taken="ENTER" passed="PASS" />
      </Scene>

      <Scene>
        <Passage>{asking}</Passage>

        <Later>
          <Passage>{curious}</Passage>
        </Later>

        <Passage>{nobodyAsked}</Passage>
      </Scene>

      <Scene>
        <Passage>{inside}</Passage>

        <Tension pairs={roomAndTable} />

        <Passage>{ordering}</Passage>

        <Plate image={unknownPlate} />
      </Scene>

      <Nightfall at="7:50 PM">
        <Passage>{lightsDown}</Passage>

        <Passage>{good}</Passage>
      </Nightfall>

      <Scene>
        <Passage>{karma}</Passage>

        <Passage>{notASin}</Passage>

        <Move from="???" to="MEGABOX DONGDAEMUN" />
      </Scene>

      <Scene>
        <Place name="MEGABOX DONGDAEMUN" address="서울 중구 장충단로 247" district="DONGDAEMUN" />

        <Passage>{spider}</Passage>
      </Scene>

      <Scene air>
        <Passage>{newYork}</Passage>
      </Scene>

      <Quiet>
        <Passage>{recliner}</Passage>

        <Passage>{allDay}</Passage>

        <Passage>{enough}</Passage>
      </Quiet>

      <Scene>
        <Passage>{walking}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{noMore}</Passage>
      </Scene>
    </>
  ),
}
