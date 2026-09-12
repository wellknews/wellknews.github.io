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
 * 숫자의 출처
 *
 * revision과 diff는 git이 세어 준 값이다. 다시 돌려 확인할 수 있다.
 *
 *   git rev-list --count --no-merges efc4745..f1dc1ed   # 2
 *   git diff --shortstat efc4745 f1dc1ed                # 578 insertions, 146 deletions
 *
 * commits는 병합 커밋을 빼고 센다. 표지의 막대는 diffstat을 commits만큼의 칸으로 자르는데,
 * 그 칸이 뜻하는 것은 «이 변경이 몇 번에 나뉘어 도착했는가»이기 때문이다. 병합은 도착한
 * 것이 아니라 합쳐진 자리라 칸을 하나 늘리면서 아무것도 싣지 않는다.
 *
 * 필드 14개는 두 판본에서 직접 세었고 집합이 완전히 같다.
 *
 *   for rev in efc4745 f1dc1ed; do
 *     git show $rev:src/ekata/components/EkataStoryCard.tsx |
 *       grep -o "item\.[a-zA-Z]*" | sort -u
 *   done
 *
 * 나머지 숫자(면적비, 넘친 폭, 한 장에 들어간 건수)는 작업하면서 화면에서 잰 값이다.
 * git으로 다시 뽑을 수 없다 — 넘치던 조판은 두 해시 사이의 중간 상태였고 지금은 어느
 * 쪽에도 없다.
 *
 * 순서에 대하여.
 *
 * 처음 판은 «이 기록의 축은 무엇이 좋아졌는가가 아니다»로 시작했다. 좋아진 것은 릴리스
 * 노트가 갖고 있으니 겹치지 말자는 판단이었는데, 결과가 틀렸다. 노트와 기록이 각각 반쪽만
 * 갖고 있으면 읽는 사람은 두 곳을 맞춰 봐야 하고 아무도 그러지 않는다. 무엇이 달라졌는지를
 * 앞으로 옮기고 빗나간 이야기는 그 뒤에 둔다. 겹치는 것을 두려워하지 않기로 했다.
 */
export const theMiddleWasOlive: Code = {
  slug: 'the-middle-was-olive',
  title: '미리보기가 계정에 올라간 카드처럼 보이게 됐다',

  repo: 'wellknews.github.io',
  revision: { from: 'efc4745', to: 'f1dc1ed' },
  diff: { commits: 2, added: 578, removed: 146 },

  meta: {
    date: '2026-09-06',
    type: 'DESIGN',
  },

  excerpt:
    '에카타 페이지 속 스토리 미리보기를 계정의 카드 문법으로 다시 세웠다. 한 장에 들어가는 사건이 둘에서 다섯으로 늘었다.',

  body: (
    <>
      <Scene>
        <Passage>
          <p>
            에카타 페이지 한가운데에 웰뉴스 스토리 미리보기가 들어간다. 계정에 이미 올라가 있는
            카드를 옆에 놓고 나란히 봤더니 겹치는 요소가 하나도 없었다. 그래서 색을 손보는 대신{' '}
            <strong>카드 제작소가 굽는 문법을 그대로 옮겼다.</strong>
          </p>

          <p>
            검정 바탕, 왼쪽에 서는 빨간 분야 세로바, 이름이 먼저 오는 제목 자리, 버건디 발행 칩,
            그리고 앱이 굽는 것과 같은 워드마크. 미리보기 둘레는 에카타로 남긴다 — 표지 한 줄과 셸
            바깥선에만 형광 라임이 남고, 유리 안쪽부터는 웰뉴스다.
          </p>

          <p>
            우상단에 있던 회색 «AN EKATA CAMPAIGN»은 걷어내고 마크 하나를 놓았다. EKATA 흰 대문자와
            라임 정사각형이다. 관계 표기는 워드마크 옆 콜로폰으로 내렸다. 위는 정체, 아래는 관계다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">격자가 비율을 놓고 글의 높이를 따라간다.</Passage>

        <Passage>
          <p>
            전에는 칸마다 비율이 고정돼 있었다. 긴 글도 짧은 글도 같은 높이를 받으니 짧은 쪽은 비고
            긴 쪽은 넘쳤다. 이제 줄마다 제 글의 높이를 갖고, 남는 자리는 사진이 가져간다. 사진이
            바닥에 닿으면 검수 보류로 넘어간다.
          </p>
        </Passage>

        <Delta
          rows={[
            { label: '실측 폭에서 한 장에 들어간 사건', before: 2, after: 5, unit: '건' },
            { label: '카드가 읽는 사건 필드', before: 14, after: 14, unit: '개' },
          ]}
        />

        <Passage>
          <p>
            두 막대의 길이가 다르고 같다. 한 장에 들어가는 사건은 둘에서 다섯이 됐는데, 카드가 읽어
            들이는 항목은 하나도 늘지 않고 하나도 줄지 않았다.{' '}
            <strong>
              이 작업이 한 일은 정보를 더한 것이 아니라 같은 정보를 다른 면적에 나눠 놓은 것이다.
            </strong>
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">두 색은 섞지 않고 면적으로 가른다.</Passage>

        <Passage>
          <p>
            버건디(#551320)와 캠페인 라임(#BCFF45)은 채도 63대 100, 명도 20대 64다. 하나는 인쇄된
            잉크고 하나는 켜진 빛이라 같은 평면에서 섞이지 않는다. 그래서 섞는 대신{' '}
            <strong>면적과 물성으로 갈랐다.</strong> 심색은 면으로 깔리고 형광은 점으로만 찍힌다.
            발행 칩이 화면의 0.47퍼센트, 캠페인 램프가 0.005퍼센트다. 카드 안에서 초록이 허용되는
            곳은 우상단 마크의 정사각형 하나뿐이고, 그것은 발행 칩의 96분의 1이다.
          </p>

          <p>
            리소 인쇄가 형광과 심색을 섞지 않고 겹쳐 찍는 것과 같은 이유다. 96대 1에서 두 색은
            싸우지 않는다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">여기까지 오는 동안 겨눈 곳 셋이 전부 빗나갔다.</Passage>

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
            why: '문제는 어떤 색을 쓰느냐가 아니라 그 색이 몇 퍼센트를 덮느냐였다. 96대 1에서 두 색은 싸우지 않는다.',
          }}
        />

        <Passage>
          <p>
            회색은 그 사실을 알기 전에 나온 답이었다. 둘 다 안 건드리는 색이라고 생각했는데, 열어
            보니 안 건드린 것이 아니라 아무것도 하지 않은 것이었다.{' '}
            <strong>회색은 결정이 아니라 결정을 미뤄 둔 자리다.</strong>
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

        <Passage>
          <p>
            7px이 모자라서 사건 세 건이 화면에서 사라졌다. 그리고 그것을 확인하던 480px
            미리보기에서는 다섯 건 모두 멀쩡해 보였다. 줄어든 판면에서는 줄이 다르게 접히기
            때문이다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
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
        <Passage>
          <p>
            보이는 방식을 전부 바꾸는 동안 카드가 읽는 것은 하나도 늘지 않았고 하나도 줄지 않았다.
            같은 열네 개를 다른 면적에 나눠 놓았을 뿐이고, 그것이 맞았는지는 아직 아무도 대답하지
            않았다.
          </p>
        </Passage>
      </Quiet>
    </>
  ),
}
