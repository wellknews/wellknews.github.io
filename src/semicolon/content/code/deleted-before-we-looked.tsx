import { Delta } from '../../components/code/Delta'
import { Gate } from '../../components/code/Gate'
import { Open } from '../../components/code/Open'
import { Passage } from '../../components/session/Passage'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import type { Code } from '../types'

/**
 * rwkor 뉴스룸이 기사를 고르는 방식을 바꾼 업데이트.
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
 * AI에게 보내는 문장과 갈래 일곱, 고르는 개수의 기준은 지어낸 것이 아니라
 * AiRecommendationPrompt.kt에 적힌 것을 그대로 옮겼다. 모드 두 개와 구형 상태를
 * 잇는 규칙은 NewsroomMode.kt, 최소화와 알약에 관한 문장은 앱이 첫 실행에서
 * 사용자에게 직접 보여 주는 안내에서 가져왔다.
 *
 * 시험 건수는 CI 로그에서 가져왔다. 2c639f5에서 돈 569번 실행에 «2166 tests
 * completed, 9 failed, 3 skipped»가 있고, 76b247d에서 돈 570번 실행은 BUILD
 * SUCCESSFUL로 끝났다. 초록으로 끝난 실행은 그래들이 건수를 찍지 않으므로 «전부
 * 통과했다»까지만 적는다.
 *
 * 합치면서 시험을 고친 이야기는 한 장면으로 줄였다. 그 일이 만들어진 것의 모양을
 * 바꾸지 않았기 때문이다. 처음 판에서는 그쪽이 글의 절반을 넘었고, 그러면 무엇이
 * 달라졌는지가 어디에도 서지 않는다.
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

  excerpt:
    '앱이 제목을 읽고 점수를 매기던 자리가 사라졌다. 이제 후보를 AI에게 넘기고 골라 온 것만 본다.',

  body: (
    <>
      <Scene>
        <Passage>
          <p>
            뉴스룸이 기사를 고르는 방식이 바뀌었다. 지금까지는{' '}
            <strong>앱이 제목을 읽고 점수를 매겨</strong> 목록을 세웠다. 어떤 낱말이 들어 있는지, 몇
            개 매체가 같이 보도했는지 같은 것을 세는 방식이다. 그 계산이 전부 사라지고, 대신 모아 온
            기사를 <strong>AI에게 통째로 넘긴다.</strong> 돌아온 목록이 곧 추천이다.
          </p>

          <p>
            기사를 모아 오는 쪽은 그대로다. RSS와 Source Pool 두 갈래에서 들어오는 것도, 품질이
            낮거나 제목이 빈 것을 거르는 것도 전과 같다. 달라진 것은 그 뒤 — 남은 후보 중에서 무엇을
            목록에 세울지 정하는 자리다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">AI에게 던지는 물음은 한 문장이다.</Passage>

        <Passage>
          <p>
            «이걸 WELLKNEWS 카드·릴스로 만들면 사람들이 멈춰 보고 싶어 할까?» 프롬프트에 그대로 적혀
            있는 문장이고, 바로 아래에 <strong>사회적으로 중요하다는 이유만으로 고르지 말라</strong>
            는 줄이 붙는다. 중요한 기사를 고르는 자리가 아니라 멈춰 세우는 기사를 고르는 자리라는
            뜻이다.
          </p>

          <p>
            강하게 보라고 적어 둔 것은 연애와 결별, 논란과 폭로와 수사, 예상 밖의 발언, 최초와
            신기록, 여자 아이돌 이슈다. 낮게 보라고 적어 둔 것은 단순 행사 참석, 평범한 화보와
            인터뷰, 홍보 일정과 티저, 근황 사진이다. 같은 사건의 반복 보도는 하나만 고른다.
          </p>

          <p>
            보통 10~30개를 예상한다고 적었지만 개수를 채우라고 하지는 않는다.{' '}
            <strong>고를 것이 없으면 0개도 된다</strong>고 명시돼 있다. 고른 기사마다 갈래 하나와
            이유 한 줄이 붙는데, 갈래는 관계·논란·사건·발언·연예활동·기록·기타 일곱으로 고정이다.
            점수나 확률 같은 숫자는 만들지 못하게 막아 두었다 — 숫자가 붙는 순간 그것이 다시 정렬
            기준이 되고, 그러면 걷어낸 것이 이름만 바꿔 돌아온다.
          </p>

          <p>
            AI가 받는 목록에는 <strong>출처가 지워져 있다.</strong> 기사마다 A001 같은 번호만 붙고,
            RSS에서 왔는지 Source Pool에서 왔는지는 넘어가지 않는다. 돌아온 번호를 원래 기사와 다시
            잇는 것은 앱 쪽 일이고, 목록에 없는 번호를 지어내 보내면 그 자리에서 걸러진다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">화면이 둘로 갈렸다. 기본과 AI 추천이다.</Passage>

        <Passage>
          <p>
            <strong>기본</strong>은 웹에서 직접 기사를 찾아 돌아다니던 기존 방식이다. 반응이 큰
            기사를 눈으로 찾아 기사 제작으로 보낸다. <strong>AI 추천</strong>은 걸러진 목록만 본다.
            수백 건을 훑는 대신 골라진 것부터 본다.
          </p>

          <p>
            업데이트하고 앱을 열었을 때 보던 자리가 바뀌지 않도록, 예전 WEB 화면은 기본으로 RSS
            화면은 AI 추천으로 이어 둔다. 저장된 옛 값이 무엇이든 두 모드 중 하나로 접힌다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">AI 대화가 뒤로가기로 끊기지 않는다.</Passage>

        <Passage>
          <p>
            전에는 AI 대화 중에 뒤로가기를 누르면 대화가 그냥 끝났다. 이제는 끝나는 대신{' '}
            <strong>최소화</strong>된다. 화면 아래에 알약이 남고, 다른 일을 하다가 그것을 누르면
            같은 대화로 그대로 돌아간다. 앱을 완전히 껐다 켜도 추천 세션은 살아 있다.
          </p>

          <p>
            뉴스룸과 Source Pool 실험실이 각자 따로 띄우던 AI 창도 하나로 합쳤다. 어디서 열든 같은
            대화이고, 그래서 «아까 그 대화가 어디 있더라»가 사라진다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">그리고 앱이 스스로 매기던 점수가 없어졌다.</Passage>

        <Passage>
          <p>
            사라진 것은 넷이다. 기사가 얼마나 터질지 계산하던 점수, 아직 성과를 모르는 발행처에게
            목록 위쪽 두 칸을 비워 주던 장치, 최신순과 화제순 사이를 고르던 길, 그리고 두 갈래
            기사를 한 목록에 끼워 넣던 코드.
          </p>
        </Passage>

        <Delta
          rows={[
            { label: '앱이 스스로 매기던 점수', before: 476, after: 0, unit: '줄' },
            { label: '목록 순서를 고르는 길', before: 2, after: 0, unit: '가지' },
            { label: '뉴스룸 화면 한 파일', before: 2848, after: 714, unit: '줄' },
          ]}
        />

        <Passage>
          <p>
            마지막 줄은 화면이 목록과 본문 둘로 갈라진 결과다. 2,848줄짜리 한 파일이 714줄짜리
            작업공간과 401줄짜리 기사 리더로 나뉘었다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">지운 것도 들인 것도, 아직 아무도 켜 보지 않았다.</Passage>

        <Passage>
          <p>
            여기가 이 기록이 앞의 기록과 만나는 자리다. 이틀 전 이 게시판은 화제순을 두고 이렇게
            적었다 — 만들었지만 기본값에서 물렸고, 실기기에서 그것을 켜 보는 숙제가 나흘째 열려
            있다고. 그 숙제의 답은 켜 보는 것이 아니었다.{' '}
            <strong>켜 보지 않은 채로 지우는 것</strong>이었다.
          </p>

          <p>
            지운 판단 자체는 옳다고 본다. 손으로 적은 낱말 목록이 정하는 순서보다 AI가 읽고 고르는
            편이 나을 가능성이 높고, 무엇보다 낱말 목록은 계속 사람 손이 간다. 다만 옳다는 것과
            확인했다는 것은 다른 말이다.{' '}
            <strong>걷어낸 점수가 실제로 나빴는지를 끝내 재지 않았고</strong>, 잰 적이 없으므로 새로
            들인 판단과 견줄 기준도 남지 않았다. 지금 말할 수 있는 것은 «바꿨다»까지이고
            «나아졌다»는 아직 아니다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">합치기 전에 가지가 빨간불이었다.</Passage>

        <Passage>
          <p>
            여기는 만들어진 것의 모양을 바꾸지 않았으므로 짧게 적는다. 합치려고 열어 보니 2,166건
            가운데 아홉이 깨져 있었고, 그중 일곱이 한 가지 이유였다 — 헐린 2,848줄짜리 화면을 글로
            읽어 대조하던 시험들이 그 파일을 찾지 못했다.
          </p>

          <p>
            시험을 지우면 빨간불은 즉시 꺼진다. 지우지 않은 이유는 확인해 보니 계약이 지키던 것이 새
            화면에 그대로 있었기 때문이다. 감시 15초, 정착 0.6초, 추출 8초 — 감시가 나머지 둘의 합을
            넘어야 한다는 관계가 한 파일 안에서 여전히 성립한다.{' '}
            <strong>
              없어진 기능을 지키던 시험이면 지우는 것이 맞고, 있는 기능을 못 찾고 있는 시험을 지우면
              초록불만 오고 그 기능은 그날부터 아무도 지키지 않는다.
            </strong>{' '}
            그래서 겨냥만 옮겼고, 옮긴 뒤 두 번째 합류 지점을 일부러 심어 계약이 여전히 무는지
            확인했다.
          </p>
        </Passage>

        <Gate
          passed={[
            { name: 'tools/verify-core.sh', note: '876건' },
            { name: 'tools/verify-weekly-copy.sh' },
            { name: 'tools/verify-card-bgm.sh' },
            { name: './gradlew assembleDebug' },
            { name: './gradlew testDebugUnitTest', note: '고친 뒤 전부 통과' },
            { name: './gradlew assembleRelease', note: 'R8' },
          ]}
          absent="실제 기기에서 AI 추천을 한 번 돌려 보는 자리"
          fell={[
            '헐린 화면을 가리키던 시험 여섯 묶음이 오프라인 검사 목록에 하나도 없었다',
            '빨간불은 9분 뒤 그래들에서 나왔고, 그 9분은 앞 검사가 아끼기로 한 시간이다',
            'R8은 시험이 깨진 실행에서는 건너뛰어진다 — 가지에서 한 번도 선 적이 없었다',
          ]}
        />
      </Scene>

      <Scene air>
        <Open
          items={[
            {
              what: '실기기에서 AI 추천을 한 번 돌려 보기',
              why: 'AI가 실제로 무엇을 고르는지 아직 아무도 보지 못했다. 이틀 전 화제순에 대해 열려 있던 숙제와 같은 종류이고 대상만 바뀌었다',
            },
            {
              what: 'AI가 고른 목록이 점수가 고르던 목록보다 나은가',
              why: '견줄 기준이 없다. 화제순은 실기기에서 한 번도 읽히지 않은 채 지워졌고, 그래서 새 방식이 무엇을 이겼는지 말할 수 있는 수가 남아 있지 않다',
            },
            {
              what: '오프라인 검사가 무엇을 덮을 것인가',
              why: '이번에 깨진 여섯 묶음이 목록에 하나도 없었다. 소스를 글로 읽는 시험은 안드로이드가 필요 없으므로 넣지 못할 이유가 없다',
            },
          ]}
        />
      </Scene>

      <Quiet>
        <Passage>
          <p>
            바꾼 것을 한 줄로 적으면 이렇다. 고르는 쪽이 앱에서 AI로 넘어갔고, 화면이 둘로 정리됐고,
            대화가 끊기지 않게 됐다.
          </p>

          <p>
            바꾸지 못한 것도 한 줄이다. 넘긴 뒤에 무엇이 올라오는지는 여전히 아무도 보지 않았다. 이
            게시판에 그 문장이 두 번째로 적힌다.
          </p>
        </Passage>
      </Quiet>
    </>
  ),
}
