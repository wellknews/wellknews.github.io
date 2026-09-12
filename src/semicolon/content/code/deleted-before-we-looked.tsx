import { Delta } from '../../components/code/Delta'
import { Flow } from '../../components/code/Flow'
import { Gate } from '../../components/code/Gate'
import { Open } from '../../components/code/Open'
import { Screens } from '../../components/code/Screens'
import { Passage } from '../../components/session/Passage'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import type { Code } from '../types'

/**
 * DEUS 뉴스룸이 기사를 고르는 방식을 바꾼 업데이트.
 *
 * 누구에게 쓰는가
 *
 * 앱을 써 본 적은 있지만 안이 어떻게 생겼는지는 모르는 사람에게 쓴다. 그래서
 * 저장소 안에서 쓰는 이름(Source Pool, 워커, 후보풀)을 그대로 내놓지 않고,
 * 화면에 실제로 적혀 있는 낱말이나 앱을 쓰는 자리의 말로 바꾼다. 바꿀 수 없는
 * 이름은 처음 나올 때 한 마디로 풀어 준다.
 *
 * 숫자의 출처
 *
 *   git rev-list --count 8b209e7..76b247d              # 118
 *   git diff --shortstat 8b209e7 76b247d               # 60 files, +4863 −4848
 *
 * 이 구간에는 병합 커밋이 없다. main이 가지의 조상 그대로여서 fast-forward로
 * 들어갔고, 그래서 «병합 포함»과 «병합 제외»가 같은 값이다.
 *
 * 본문의 줄 수는 두 판본에서 직접 세었다.
 *
 *   git show 8b209e7:.../NewsroomScreen.kt | wc -l                  # 2848
 *   git show 76b247d:.../BasicNewsroomWorkspaceScreen.kt | wc -l    # 714
 *   git show 8b209e7:.../StoryHeat.kt | wc -l                       # 145
 *   git show 8b209e7:.../SourceExploration.kt | wc -l               # 78
 *   git show 8b209e7:.../sourcepool/NewsroomFeedComposer.kt | wc -l # 253
 *
 * 476은 그 셋의 합이고 세 파일 모두 이 구간에서 통째로 지워졌다.
 *
 * 화면에 적히는 낱말(최신순·화제순·기본·AI 추천·기사 제작)은 앱의 소스에서
 * 그대로 옮겼다. Screens 장치의 says에는 지면을 위해 고쳐 쓴 문구를 넣지 않는다.
 *
 * AI에게 보내는 문장과 갈래 일곱, 고르는 개수의 기준은 AiRecommendationPrompt.kt에
 * 적힌 것을 그대로 옮겼다. 모드 두 개와 구형 상태를 잇는 규칙은 NewsroomMode.kt,
 * 최소화와 알약에 관한 문장은 앱이 첫 실행에서 사용자에게 직접 보여 주는 안내에서
 * 가져왔다.
 *
 * 시험 건수는 CI 로그에서 가져왔다. 2c639f5에서 돈 569번 실행에 «2166 tests
 * completed, 9 failed, 3 skipped»가 있고, 76b247d에서 돈 570번 실행은 BUILD
 * SUCCESSFUL로 끝났다.
 */
export const deletedBeforeWeLooked: Code = {
  slug: 'deleted-before-we-looked',
  title: '기사를 고르는 일을 AI에게 넘겼다',

  repo: 'rwkor',
  revision: { from: '8b209e7', to: '76b247d' },
  diff: { commits: 118, added: 4863, removed: 4848 },

  meta: {
    date: '2026-09-12',
    type: 'NEWSROOM',
  },

  excerpt: '뉴스룸 목록의 순서를 앱이 점수로 정하던 것을 그만두고, AI가 고른 것만 올린다.',

  body: (
    <>
      <Scene>
        <Passage>
          <p>
            DEUS에는 뉴스룸이라는 화면이 있다. 연예 기사를 모아 목록으로 보여 주고, 그중 하나를 골라
            누르면 카드나 릴스를 만드는 자리로 넘어간다. 매일 수백 건이 들어오므로 무엇을 위에
            세우느냐가 이 화면의 전부다.
          </p>

          <p>
            <strong>그 순서를 정하는 쪽이 바뀌었다.</strong> 지금까지는 앱이 제목을 읽고 점수를 매겨
            줄을 세웠다. 이제는 모아 온 기사를 AI에게 통째로 보내고, AI가 고른 것만 목록에 올린다.
          </p>
        </Passage>

        <Screens
          frames={[
            {
              when: '전',
              parts: [
                { kind: 'bar', says: '최신순 · 화제순', gone: true },
                { kind: 'list', says: '들어온 기사 전부' },
              ],
              caption: '순서를 고르는 버튼이 위에 있었다. 화제순은 앱이 매긴 점수 순서다.',
            },
            {
              when: '후',
              parts: [
                { kind: 'bar', says: '기본 · AI 추천' },
                { kind: 'list', says: 'AI가 고른 기사' },
                { kind: 'pill', says: 'AI 알약' },
              ],
              caption: '순서 버튼이 사라지고 그 자리에 화면을 고르는 스위치가 들어왔다.',
            },
          ]}
        />
      </Scene>

      <Scene air>
        <Passage tone="loud">기사가 목록에 서기까지 네 자리를 거친다.</Passage>

        <Passage>
          <p>
            기사를 모아 오는 길은 둘이다. 하나는 언론사가 새 기사를 자동으로 흘려 주는 주소에서 받아
            오는 것이고, 다른 하나는 앱이 연예 종합 매체를 직접 뒤져 우리 주제만 주워 오는 것이다.
            뒤엣것은 아직 시험 중이라 설정에서 켜야 돈다. 이 둘은 이번에 바뀌지 않았다.
          </p>
        </Passage>

        <Flow
          steps={[
            { at: '모아 온다', note: '언론사가 흘려 주는 기사와, 앱이 직접 뒤져 주워 온 기사' },
            { at: '거른다', note: '제목이 비었거나 이미 목록에 있는 것과 똑같으면 뺀다' },
            {
              at: 'AI가 고른다',
              note: '후보를 통째로 보내고 골라 온 것만 받는다',
              mark: true,
            },
            { at: '목록에 선다', note: '고른 순서가 곧 화면의 순서다' },
          ]}
        />

        <Passage>
          <p>
            AI에게 보내는 목록에는 <strong>그 기사가 어느 길로 들어왔는지가 지워져 있다.</strong>{' '}
            기사마다 A001 같은 번호만 붙는다. 어느 쪽에서 왔는지를 알면 AI가 그것을 판단에 섞을 수
            있는데, 우리가 물어보려는 것은 출처가 아니라 기사 자체이기 때문이다. 돌아온 번호를 원래
            기사와 다시 잇는 것은 앱이 한다. 목록에 없는 번호를 지어내 보내면 그 자리에서 버려진다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">AI에게 던지는 물음은 한 문장이다.</Passage>

        <Passage>
          <p>
            «이걸 WELLKNEWS 카드·릴스로 만들면 사람들이 멈춰 보고 싶어 할까?» 앱이 실제로 보내는
            문장이고, 바로 아래에 <strong>사회적으로 중요하다는 이유만으로 고르지 말라</strong>는
            줄이 붙는다. 중요한 기사를 고르는 자리가 아니라 멈춰 세우는 기사를 고르는 자리라는
            뜻이다.
          </p>

          <p>
            세게 보라고 적어 둔 것은 연애와 결별, 논란과 폭로와 수사, 예상 밖의 발언, 최초와 신기록,
            여자 아이돌 이슈다. 낮게 보라고 적어 둔 것은 단순 행사 참석, 평범한 화보와 인터뷰, 홍보
            일정과 티저, 근황 사진이다. 같은 사건을 여러 매체가 받아쓴 것은 하나만 고른다.
          </p>

          <p>
            보통 10~30개를 예상한다고 적었지만 개수를 채우라고 하지는 않는다.{' '}
            <strong>고를 것이 없으면 0개도 된다.</strong> 고른 기사마다 갈래 하나와 이유 한 줄이
            붙는데, 갈래는 관계·논란·사건·발언·연예활동·기록·기타 일곱으로 고정이다. 점수나 확률
            같은 숫자는 만들지 못하게 막아 두었다 — 숫자가 붙는 순간 그것이 다시 정렬 기준이 되고,
            그러면 방금 걷어낸 것이 이름만 바꿔 돌아온다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">뉴스룸이 두 화면으로 갈렸다.</Passage>

        <Passage>
          <p>
            목록 위의 스위치로 고른다. <strong>기본</strong>은 웹에서 직접 기사를 찾아 돌아다니던
            기존 방식이고, <strong>AI 추천</strong>은 위에서 말한 걸러진 목록만 본다.
          </p>

          <p>
            업데이트하고 앱을 열었을 때 보던 자리가 바뀌지 않도록, 예전에 웹 화면을 보고 있었으면
            기본으로, 기사 목록을 보고 있었으면 AI 추천으로 이어 둔다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">AI 대화가 뒤로가기로 끊기지 않는다.</Passage>

        <Passage>
          <p>
            기사를 골라 «기사 제작»을 누르면 AI와 대화하는 창이 열린다. 전에는 그 창에서 뒤로가기를
            누르면 대화가 그냥 끝났다. 이제는 끝나는 대신 <strong>접힌다.</strong> 화면 아래에 알약
            모양이 남고, 다른 일을 하다가 그것을 누르면 같은 대화로 그대로 돌아간다. 앱을 완전히
            껐다 켜도 살아 있다.
          </p>

          <p>
            뉴스룸과 실험용 화면이 각자 따로 띄우던 AI 창도 하나로 합쳤다. 어디서 열든 같은 대화라서
            «아까 그 대화가 어디 있더라»가 사라진다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">앱이 스스로 매기던 점수가 없어졌다.</Passage>

        <Passage>
          <p>
            사라진 것은 넷이다. 기사가 얼마나 터질지 계산하던 점수, 아직 성적을 모르는 언론사에게
            목록 위쪽 두 칸을 비워 주던 장치, 최신순과 화제순 사이를 고르던 버튼, 그리고 두 길로
            들어온 기사를 한 목록에 끼워 넣던 코드.
          </p>
        </Passage>

        <Delta
          rows={[
            { label: '앱이 스스로 매기던 점수', before: 476, after: 0, unit: '줄' },
            { label: '목록 순서를 고르는 버튼', before: 2, after: 0, unit: '가지' },
            { label: '뉴스룸 화면 한 파일', before: 2848, after: 714, unit: '줄' },
          ]}
        />

        <Passage>
          <p>
            마지막 줄은 화면이 둘로 갈라진 결과다. 목록과 기사 본문이 한 파일에 같이 들어 있던 것을
            떼어 냈다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">지운 것도 들인 것도, 아직 아무도 켜 보지 않았다.</Passage>

        <Passage>
          <p>
            이 게시판이 이틀 전에 화제순을 두고 이렇게 적었다 — 만들어 두고 기본값에서 껐고, 실제
            폰에서 그것을 켜 보는 숙제가 나흘째 열려 있다고. 그 숙제의 답은 켜 보는 것이 아니었다.{' '}
            <strong>켜 보지 않은 채로 지우는 것</strong>이었다.
          </p>

          <p>
            지운 판단 자체는 옳다고 본다. 사람이 손으로 적은 낱말 목록이 정하는 순서보다 AI가 읽고
            고르는 편이 나을 가능성이 높고, 무엇보다 낱말 목록은 계속 사람 손이 간다. 다만 옳다는
            것과 확인했다는 것은 다른 말이다.{' '}
            <strong>걷어낸 점수가 실제로 나빴는지를 끝내 재지 않았고</strong>, 잰 적이 없으므로 새로
            들인 쪽과 견줄 기준도 남지 않았다. 지금 말할 수 있는 것은 «바꿨다» 까지이고 «나아졌다»는
            아직 아니다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">합치기 전에 검사가 빨간불이었다.</Passage>

        <Passage>
          <p>
            여기는 화면에 보이는 것을 바꾸지 않았으므로 짧게 적는다. 이 저장소에는 화면 파일을 글로
            읽어 «이 문구가 아직 있는가»를 확인하는 시험이 여럿 있다. 화면 파일이 헐리면서 그 시험
            일곱 개가 읽을 파일을 찾지 못해 울었다.
          </p>

          <p>
            시험을 지우면 빨간불은 즉시 꺼진다. 지우지 않은 이유는 확인해 보니 시험이 지키던 것이 새
            화면에 그대로 있었기 때문이다.{' '}
            <strong>
              없어진 기능을 지키던 시험이면 지우는 것이 맞고, 있는 기능을 못 찾고 있는 시험을 지우면
              초록불만 오고 그 기능은 그날부터 아무도 지키지 않는다.
            </strong>{' '}
            그래서 겨냥만 새 파일로 옮겼다.
          </p>
        </Passage>

        <Gate
          passed={[
            { name: '안드로이드 없이 도는 규칙 시험', note: '876건' },
            { name: '앱 빌드' },
            { name: '단위 시험 전체', note: '2,166건 중 9건이 깨져 있었다 · 고친 뒤 전부 통과' },
            { name: '압축 빌드', note: 'R8' },
          ]}
          absent="실제 폰에서 AI 추천을 한 번 돌려 보는 자리"
          fell={[
            '깨진 시험 여섯 묶음이 빠른 검사 목록에 하나도 없었다',
            '빨간불은 9분 뒤에야 나왔고, 그 9분은 빠른 검사가 아끼기로 한 시간이다',
            '압축 빌드는 시험이 깨지면 건너뛰어진다 — 이 가지에서 한 번도 선 적이 없었다',
          ]}
        />
      </Scene>

      <Scene air>
        <Open
          items={[
            {
              what: '실제 폰에서 AI 추천을 한 번 돌려 보기',
              why: 'AI가 실제로 무엇을 고르는지 아직 아무도 보지 못했다. 이틀 전 화제순에 대해 열려 있던 숙제와 같은 종류이고 대상만 바뀌었다',
            },
            {
              what: 'AI가 고른 목록이 점수가 고르던 목록보다 나은가',
              why: '견줄 기준이 없다. 화제순은 실제 폰에서 한 번도 읽히지 않은 채 지워졌고, 그래서 새 방식이 무엇을 이겼는지 말할 수 있는 수가 남아 있지 않다',
            },
            {
              what: '빠른 검사가 무엇을 덮을 것인가',
              why: '이번에 깨진 여섯 묶음이 목록에 하나도 없었다. 화면 파일을 글로 읽는 시험은 안드로이드가 필요 없으므로 넣지 못할 이유가 없다',
            },
          ]}
        />
      </Scene>

      <Quiet>
        <Passage>
          <p>
            바꾼 것을 한 줄로 적으면 이렇다. 목록의 순서를 정하는 쪽이 앱에서 AI로 넘어갔고,
            뉴스룸이 두 화면으로 갈렸고, AI 대화가 뒤로가기에 끊기지 않게 됐다.
          </p>

          <p>
            바꾸지 못한 것도 한 줄이다. 넘긴 뒤에 무엇이 올라오는지는 여전히 아무도 보지 않았다.
          </p>
        </Passage>
      </Quiet>
    </>
  ),
}
