import { Delta } from '../../components/code/Delta'
import { Gate } from '../../components/code/Gate'
import { Miss } from '../../components/code/Miss'
import { Open } from '../../components/code/Open'
import { Screens } from '../../components/code/Screens'
import { Passage } from '../../components/session/Passage'
import { Quiet } from '../../components/session/Quiet'
import { Scene } from '../../components/session/Scene'
import type { Code } from '../types'

/**
 * 에카타 캠페인 페이지에 들어가는 카드 미리보기를 다시 세운 작업.
 *
 * 누구에게 쓰는가
 *
 * 이 사이트를 본 적은 있지만 안이 어떻게 만들어졌는지는 모르는 사람에게 쓴다.
 * 조판 용어(워드마크, 콜로폰, 컨테이너 쿼리)는 처음 나올 때 풀어 주거나 뺀다.
 *
 * 숫자의 출처
 *
 *   git rev-list --count --no-merges efc4745..f1dc1ed   # 2
 *   git diff --shortstat efc4745 f1dc1ed                # 578 insertions, 146 deletions
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
 * 노트가 갖고 있으니 겹치지 말자는 판단이었는데 결과가 틀렸다. 무엇이 달라졌는지를 앞으로
 * 옮기고 빗나간 이야기는 그 뒤에 둔다.
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
    '캠페인 페이지 속 카드 미리보기를 계정에 실제로 올라가는 카드와 같은 모양으로 세웠다. 한 장에 들어가는 사건이 둘에서 다섯으로 늘었다.',

  body: (
    <>
      <Scene>
        <Passage>
          <p>
            에카타라는 캠페인이 있고, 이 사이트에 그 페이지가 하나 있다. 페이지 한가운데에는 웰뉴스
            계정에 올라갈 카드가 어떻게 생겼는지 보여 주는 미리보기가 들어간다. 그런데 계정에{' '}
            <strong>이미 올라가 있는 진짜 카드를 옆에 놓고 봤더니 닮은 데가 하나도 없었다.</strong>
          </p>

          <p>
            그래서 색만 손보는 대신 앱이 카드를 만들 때 쓰는 규칙을 그대로 옮겼다. 검정 바탕, 왼쪽에
            세로로 서는 빨간 막대(그 기사의 분야를 뜻한다), 사람 이름이 먼저 오는 제목, 진한 자주색
            작은 라벨, 그리고 앱이 카드에 찍는 것과 똑같은 로고 글자.
          </p>
        </Passage>

        <Screens
          frames={[
            {
              when: '전',
              parts: [
                { kind: 'bar', says: 'AN EKATA CAMPAIGN', gone: true },
                { kind: 'list', says: '사건 2건' },
              ],
              caption: '우상단에 회색 글씨가 있었고, 한 장에 두 건밖에 안 들어갔다.',
            },
            {
              when: '후',
              parts: [
                { kind: 'bar', says: 'EKATA 마크' },
                { kind: 'list', says: '사건 5건' },
              ],
              caption: '회색 글씨 대신 마크 하나. 같은 폭에 다섯 건이 들어간다.',
            },
          ]}
        />
      </Scene>

      <Scene air>
        <Passage tone="loud">칸마다 비율을 고정하던 것을 그만두었다.</Passage>

        <Passage>
          <p>
            전에는 사건 한 건이 들어가는 칸의 세로 길이가 정해져 있었다. 글이 짧아도 길어도 같은
            높이를 받으니 짧은 쪽은 아래가 비고 긴 쪽은 넘쳤다. 이제 줄마다 제 글의 높이를 갖고,
            남는 자리는 사진이 가져간다. 사진이 아래까지 닿으면 그 건은 검수 보류로 넘긴다.
          </p>
        </Passage>

        <Delta
          rows={[
            { label: '실제 폭에서 한 장에 들어간 사건', before: 2, after: 5, unit: '건' },
            { label: '카드가 읽어 오는 항목', before: 14, after: 14, unit: '개' },
          ]}
        />

        <Passage>
          <p>
            두 막대의 길이가 다르고 같다. 한 장에 들어가는 사건은 둘에서 다섯이 됐는데, 카드가 읽어
            들이는 항목은 하나도 늘지 않고 하나도 줄지 않았다.{' '}
            <strong>
              이 작업이 한 일은 정보를 더한 것이 아니라 같은 정보를 다르게 앉힌 것이다.
            </strong>
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">두 색은 섞지 않고 넓이로 가른다.</Passage>

        <Passage>
          <p>
            카드에는 색이 둘 섞인다. 웰뉴스의 진한 자주색과 에카타의 형광 연두다. 하나는 인쇄한
            잉크처럼 어둡고 하나는 불을 켠 것처럼 밝아서, 같은 면에 나란히 두면 서로 죽인다.
          </p>

          <p>
            그래서 섞지 않고 <strong>차지하는 넓이로 갈랐다.</strong> 어두운 색은 면으로 깔리고 밝은
            색은 점으로만 찍힌다. 카드 안에서 형광이 허용되는 곳은 오른쪽 위 마크 안의 작은 정사각형
            하나뿐이고, 그것은 자주색 라벨의 96분의 1이다. 96대 1이 되면 두 색은 싸우지 않는다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">여기까지 오는 동안 겨눈 곳 셋이 전부 빗나갔다.</Passage>

        <Miss
          aimed={[
            {
              at: '색을 바꾸면 된다',
              why: '계정의 진짜 카드와 대조해 보니 어긋난 것이 여섯 가지였고 색은 그중 하나였다. 바탕도, 분야 표시도, 발행 표시도, 로고도, 글자의 무게도 전부 달랐다.',
            },
            {
              at: '두 색의 중간을 찾으면 된다',
              why: '어두운 자주와 형광 연두의 가운데를 구하면 올리브가 나온다. 올리브는 어느 쪽도 아니고, 중간을 취하는 순간 둘 다 죽는다.',
            },
            {
              at: '회색이면 둘 다 안 건드린다',
              why: '실제로 첫 판이 회색 «AN EKATA CAMPAIGN»이었다. 에카타가 있기는 한데 색이 없어서 에카타로 읽히지도 않고 사라지지도 않았다.',
            },
          ]}
          found={{
            at: '넓이',
            why: '문제는 어떤 색을 쓰느냐가 아니라 그 색이 몇 퍼센트를 덮느냐였다.',
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
        <Passage tone="loud">검사는 전부 통과했는데 세 건이 화면에서 사라졌다.</Passage>

        <Gate
          passed={[
            { name: '글자 모양 검사' },
            { name: '코드 규칙 검사' },
            { name: '타입 검사' },
            { name: '사이트 빌드' },
            { name: '카드 내용 검사', note: '4개 통과' },
          ]}
          absent="실제 폭에서 글이 칸을 넘치는지 보는 자리"
          fell={[
            '넓은 화면에서 사실 목록이 305px 칸에 312px을 넣었다. 모자란 것은 7px이었다.',
            '가장 짧은 사건 셋이 검수 보류로 넘어가 화면에서 빠졌다.',
            '좁은 미리보기에서는 다섯 건 모두 정상으로 보였다. 판면을 줄이면 글이 다르게 접히기 때문이다.',
          ]}
        />

        <Passage>
          <p>
            7px이 모자라서 사건 세 건이 사라졌다. 그리고 그것을 확인하던 좁은 미리보기에서는 다섯 건
            모두 멀쩡해 보였다. 화면을 줄여서 보는 것과 실제로 그 폭에서 그리는 것이 다르다는
            뜻이고, 이 차이를 보는 검사가 없었다.
          </p>
        </Passage>
      </Scene>

      <Scene air>
        <Open
          items={[
            {
              what: '실제 공개 사진',
              why: '다섯 건 모두 지어낸 예시라 사진이 없다. 세로로 긴 인물 사진이 저 칸에 어떻게 앉는지는 실물이 와야 안다.',
            },
            {
              what: '앱이 만든 진짜 카드와 나란히 놓고 보기',
              why: '값은 앱의 코드에서 옮겨 왔지만, 실제로 만들어 나온 그림과 픽셀 단위로 맞춰 본 것은 아니다.',
            },
            {
              what: '같은 글꼴',
              why: '앱과 웹이 서로 다른 글꼴을 쓴다. 이 미리보기는 비슷하게 맞춘 것이지 같은 것이 아니다.',
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
            보이는 방식을 전부 바꾸는 동안 카드가 읽어 오는 항목은 하나도 늘지 않았고 하나도 줄지
            않았다. 같은 열네 개를 다르게 앉혔을 뿐이고, 그것이 맞았는지는 아직 아무도 대답하지
            않았다.
          </p>
        </Passage>
      </Quiet>
    </>
  ),
}
