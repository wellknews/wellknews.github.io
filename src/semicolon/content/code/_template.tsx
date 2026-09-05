import { Delta } from '../../components/code/Delta'
import { Open } from '../../components/code/Open'
import type { Code } from '../types'

/**
 * 새 CODE 기록을 쓸 때 이 파일을 복사한다.
 *
 *   1. code/무엇을-고쳤나.tsx 처럼 파일을 만든다 (파일명은 slug와 맞춘다)
 *   2. 아래 형태로 내용을 채운다
 *   3. content/code.ts의 codes 배열 맨 앞에 import해서 넣는다
 *
 * 세션의 템플릿과 규칙이 하나 다르다. 세션에서는 «없는 정보는 비워 둔다»가
 * 전부였는데, 여기서는 그 앞에 하나가 더 붙는다 — 있는 숫자는 지어내지
 * 않는다. revision과 diff는 git이 세어 준 값을 그대로 옮겨 적는 자리이고,
 * 어림잡은 값을 넣는 순간 이 게시판의 나머지 숫자도 전부 어림값이 된다.
 *
 * 무엇을 쓰는가.
 *
 * 릴리스 노트가 아니다. «무엇이 좋아졌습니다»의 목록은 이 자리에 필요
 * 없다 — 그것은 커밋 로그가 이미 더 정확하게 갖고 있다. 여기 남길 것은
 * 로그에 남지 않는 쪽이다. 무엇을 잘못 짚었는지, 왜 그렇게 짚었는지,
 * 무엇을 재지 못했는지.
 *
 * 조판 장치는 components/code/ 아래에 있다.
 *
 *   Delta   전과 후. 두 줄의 길이가 곧 변화다.
 *   Gate    통과한 검사들과, 검사가 없는 자리.
 *   Miss    겨눈 곳과 실제로 있던 곳.
 *   Prompt  답이 하나뿐인 물음. 눌러서 치울 수 있다.
 *   Open    못 쟀거나 하지 않은 것. 값 칸이 비어 있다.
 *
 * 새 장치를 만들기 전에 한 번 묻는다 — 이것이 문장을 대신하는가, 아니면
 * 문장 옆에 그림을 하나 더 두는 것인가. 뒤쪽이면 만들지 않는다.
 *
 * 이 파일은 codes 배열에 등록되어 있지 않으므로 사이트에 나오지 않는다.
 */
export const template: Code = {
  slug: 'slug',
  title: '제목',

  /** 저장소 이름. 주소가 아니라 부르는 이름이면 된다. */
  repo: 'repo',

  /** git이 말해 주는 그대로. 지어내지 않는다. */
  revision: { from: '0000000', to: '1111111' },
  diff: { commits: 1, added: 1, removed: 1 },

  meta: {
    date: '2026-01-01',
    type: 'PERFORMANCE',
  },

  /** 목록에 걸리는 한 줄. 무엇을 고쳤는지가 아니라 이 기록이 무엇을 보는지. */
  excerpt: '이 업데이트에서 무엇을 봤는지 한 줄.',

  body: (
    <>
      <p>본문.</p>

      <h3>소제목</h3>

      <Delta rows={[{ label: '무엇을 쟀는가', before: 100, after: 50, unit: 'ms' }]} />

      <p>단락.</p>

      <Open items={[{ what: '못 쟀거나 안 한 것', why: '왜 그런지' }]} />
    </>
  ),
}
