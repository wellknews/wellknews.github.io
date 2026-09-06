import { Delta } from '../../components/code/Delta'
import { Gate } from '../../components/code/Gate'
import { Miss } from '../../components/code/Miss'
import { Open } from '../../components/code/Open'
import { Passage } from '../../components/session/Passage'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import type { Code } from '../types'

/**
 * 에카타의 Story 미리보기를 웰뉴스 계정의 문법으로 다시 세운 작업.
 *
 * 이 기록의 축은 «무엇이 좋아졌는가»가 아니다. 좋아진 것은 릴리스 노트가 이미
 * 더 정확하게 갖고 있고, 같은 글을 두 곳에 세우면 둘 중 하나는 반드시
 * 뒤처진다. 여기 남기는 것은 그 노트에도 커밋 로그에도 없는 쪽이다 —
 * 섞으려는 시도가 있었다는 것, 회색이 타협이었다는 것, 그리고 확인하던 틀
 * 안에서는 무너진 자리가 보이지 않았다는 것.
 *
 * 숫자의 출처
 *
 * revision과 diff는 git이 세어 준 값이다. 다시 돌려 확인할 수 있다.
 *
 *   git rev-list --count --no-merges efc4745..f1dc1ed   # 2
 *   git diff --shortstat efc4745 f1dc1ed                # 578 insertions, 146 deletions
 *
 * commits는 병합 커밋을 빼고 센다. 표지의 막대는 diffstat을 commits만큼의
 * 칸으로 자르는데, 그 칸이 뜻하는 것은 «이 변경이 몇 번에 나뉘어 도착했는가»
 * 이기 때문이다. 병합은 도착한 것이 아니라 합쳐진 자리라 칸을 하나 늘리면서
 * 아무것도 싣지 않는다. 이 게시판의 다음 기록도 같은 기준을 쓴다.
 *
 * 필드 14개는 두 판본에서 직접 세었고 집합이 완전히 같다.
 *
 *   for rev in efc4745 f1dc1ed; do
 *     git show $rev:src/ekata/components/EkataStoryCard.tsx |
 *       grep -o "item\.[a-zA-Z]*" | sort -u
 *   done
 *
 * 나머지 숫자(면적비, 넘친 폭, 한 장에 들어간 건수)는 작업하면서 화면에서 잰
 * 값이다. git으로 다시 뽑을 수 없다 — 넘치던 조판은 두 해시 사이의 중간
 * 상태였고 지금은 어느 쪽에도 없다.
 */
export const theMiddleWasOlive: Code = {
  slug: 'the-middle-was-olive',
  title: '중간값은 올리브였다',

  repo: 'wellknews.github.io',
  revision: { from: 'efc4745', to: 'f1dc1ed' },
  diff: { commits: 2, added: 578, removed: 146 },

  meta: {
    date: '2026-09-06',
    type: 'DESIGN',
  },

  excerpt: '두 색 사이에서 중간을 찾으려 했다. 첫 판에서 나온 것은 중간이 아니라 회색이었다.',

  body: (
    <>
      <Scene>
        <Passage>
          <p>
            에카타 페이지 한가운데에 웰뉴스 스토리 미리보기가 들어간다. 페이지는 형광 라임을 쓰고,
            그 스토리는 웰뉴스 계정의 것이라 버건디와 검정을 쓴다. 계정에 이미 올라가 있는 것을 옆에
            놓고 나란히 봤더니 따로 놀았다.
          </p>

          <p>
            그래서 색을 고치러 갔다. 고치고 나서 보니 색은 고칠 것 중 하나였고, 정작 이 작업이
            찾아낸 것은 색이 아니었다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">겨눈 곳이 셋이었고, 셋 다 빗나갔다.</Passage>

        <Miss
          aimed={[
            {
              at: '색을 바꾸면 된다',
              why: '계정과 대조해 보니 어긋난 것이 여섯 줄이었고 색은 그중 한 줄이었다. 바탕도, 분야 표시도, 발행 표시도, 서명도, 조판의 무게도 전부 달랐다.',
            },
            {
              at: '두 색의 중간을 찾으면 된다',
              why: '채도 63과 100, 명도 20과 64 사이의 중간은 올리브다. 올리브는 어느 쪽도 아니고, 중간을 취하는 순간 둘 다 죽는다.',
            },
            {
              at: '회색이면 둘 다 안 건드린다',
              why: '실제로 첫 판이 회색 «AN EKATA CAMPAIGN»이었다. 에카타가 있기는 한데 색이 없어서 에카타로 읽히지도 않고 사라지지도 않았다.',
            },
          ]}
          found={{
            at: '면적',
            why: '문제는 어떤 색을 쓰느냐가 아니라 그 색이 몇 퍼센트를 덮느냐였다. 발행 칩이 화면의 0.47퍼센트, 캠페인 램프가 0.005퍼센트다. 96대 1에서 두 색은 싸우지 않는다.',
          }}
        />
      </Scene>

      <Scene>
        <Passage>
          <p>
            중간을 찾으려 한 것이 왜 틀렸는지는 숫자를 보고 나서야 알았다. 두 색은 채도와 명도가 멀
            뿐 아니라 종류가 다르다. 하나는 인쇄된 잉크고 하나는 켜진 빛이다. 그 둘 사이에는 중간이
            없고, 억지로 구하면 올리브가 나온다.
          </p>

          <p>
            회색은 그 사실을 알기 전에 나온 답이었다. 둘 다 안 건드리는 색이라고 생각했는데, 열어
            보니 안 건드린 것이 아니라 아무것도 하지 않은 것이었다. 회색은 결정이 아니라 결정을 미뤄
            둔 자리다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">전부 통과했는데 세 건이 넘어갔다.</Passage>

        <Gate
          passed={[
            { name: 'npm run format:check' },
            { name: 'npm run lint' },
            { name: 'npm run typecheck' },
            { name: 'npm run build' },
            { name: 'node --test scripts/ekata-check.test.mjs', note: '4개 통과' },
          ]}
          absent="실측 폭에서 조판이 넘치는지 보는 자리"
          fell={[
            '1080px에서 사실 목록이 305px 칸에 312px을 넣었다. 모자란 것은 7px이었다.',
            '홍길동·이하늘·박지우 — 가장 짧은 사건 셋이 검수 보류 화면으로 넘어갔다.',
            '480px 미리보기에서는 다섯 건 모두 정상으로 보였다. 컨테이너 쿼리는 배율을 따라가지만 줄바꿈은 따라가지 않는다.',
          ]}
        />
      </Scene>

      <Scene air>
        <Delta
          rows={[
            { label: '실측 폭에서 한 장에 들어간 사건', before: 2, after: 5, unit: '건' },
            { label: '카드가 읽는 사건 필드', before: 14, after: 14, unit: '개' },
          ]}
        />

        <Open
          items={[
            {
              what: '실제 공개 사진',
              why: '다섯 건 모두 가상 데이터라 사진이 없다. 세로 증명사진이 저 칸에 어떻게 앉는지는 실물이 와야 안다.',
            },
            {
              what: '앱이 굽는 그림과의 대조',
              why: '값은 카드 제작소의 소스에서 옮겨 왔지만, 실제로 구워 나온 그림과 픽셀로 맞춰 본 것은 아니다.',
            },
            {
              what: '같은 글꼴',
              why: '앱은 SUIT ExtraBold와 IBM Plex Sans KR Bold를 쓰고 웹은 Pretendard 800을 쓴다. 이 미리보기는 근사값이다.',
            },
            {
              what: '보는 사람의 대답',
              why: '«갑작스럽지 않은가»는 결국 사람이 답할 질문이다. 이번에 한 것은 그 답이 아니라 답할 수 있는 형태다.',
            },
          ]}
        />
      </Scene>

      <Quiet>
        <p>
          아래 줄의 막대 두 개는 길이가 같다. 보이는 방식을 전부 바꾸는 동안 카드가 읽는 것은 하나도
          늘지 않았고 하나도 줄지 않았다. 이 작업이 한 일은 정보를 정리한 것이 아니라 같은 정보를
          다른 면적에 나눠 놓은 것이고, 그것이 맞았는지는 아직 아무도 대답하지 않았다.
        </p>
      </Quiet>
    </>
  ),
}
