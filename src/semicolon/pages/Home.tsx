import { Doors, type Door } from '../components/Doors'
import { Hero } from '../components/Hero'
import { codes } from '../content/code'
import { semicolon } from '../content/site'
import { sessions } from '../content/sessions'
import { threads } from '../content/threads'
import { path } from '../router'

/**
 * 홈은 목록이 아니라 문이다.
 *
 * 오랫동안 그렇게 적어 두고 실제로는 아니었다. 게시판마다 한 구간을 두고 그
 * 구간이 최신 글을 통째로 펼쳤으니, 홈은 문 옆에 방을 열어 둔 모양이었다.
 * 자리가 둘일 때는 견딜 만했다. 셋이 되자 두 가지가 한꺼번에 무너졌다.
 *
 *   · ';'가 둘이 되면서 이음매가 기호가 아니라 구분선이 되었다. 세미콜론은
 *     두 개의 절을 잇는 기호이고, 화면에 하나뿐일 때만 그 일을 한다.
 *     반복되는 기호는 뜻을 잃는다.
 *   · 전문이 그대로 나오는 THREAD 뒤에 무언가를 두면 그것은 사실상 없는
 *     자리가 된다. 순서를 바꿔 가며 막아 봤지만, 자리가 하나 더 늘면 또
 *     막아야 하는 종류의 문제였다.
 *
 * 그래서 구간을 없앴다. 지금 이 페이지에 있는 것은 둘뿐이다 — 이 공간이
 * 무엇인지 말하는 선, 그리고 세 개의 문.
 *
 * 이음매도 없앴다. 구간이 셋일 때 ';'가 둘이 되는 것이 문제라고 보고 하나로
 * 줄였는데, 하나로 줄여도 그 자리가 틀렸다. 히어로 한가운데에 이미 ';'가
 * 있고, 그 바로 아래에 또 하나를 놓으면 한 화면 안에 같은 기호가 두 번
 * 나온다. 게다가 이음매는 두 개의 절 사이에 서는 기호인데 위쪽에는 이을
 * 글이 없다 — 선과 기호뿐이다. 이을 것이 없는 자리에 놓인 이음매는
 * 이음매가 아니라 장식이다.
 *
 * 이 페이지의 세미콜론은 히어로 안의 그것 하나뿐이다. 이 공간에서 가장 강한
 * 기호를 한 화면에 두 번 쓰지 않는 것이, 그 기호를 지키는 유일한 방법이다.
 */
export function Home() {
  const [session] = sessions
  const [code] = codes
  const [thread] = threads

  /*
   * 문마다 그 자리에 가장 최근에 놓인 것 한 줄.
   *
   * 스레드는 제목이 없어도 되는 글이라 날짜만 있을 수 있다. 없는 제목을
   * 슬러그나 첫 문장으로 지어내지 않는다 — 제목을 붙이지 않은 것도 그 글이
   * 고른 형식이다.
   */
  const doors: readonly Door[] = [
    {
      kind: 'session',
      label: semicolon.session.label,
      to: path.sessionIndex,
      ...(session?.meta?.date ? { latest: { date: session.meta.date, title: session.title } } : {}),
      empty: semicolon.session.empty,
    },
    {
      kind: 'code',
      label: semicolon.code.label,
      to: path.codeIndex,
      ...(code?.meta?.date ? { latest: { date: code.meta.date, title: code.title } } : {}),
      empty: semicolon.code.empty,
    },
    {
      kind: 'thread',
      label: semicolon.thread.label,
      to: path.threadIndex,
      ...(thread ? { latest: { date: thread.date, title: thread.title } } : {}),
      empty: semicolon.thread.empty,
    },
  ]

  return (
    <>
      <Hero />

      <div className="shell">
        <Doors doors={doors} />
      </div>
    </>
  )
}
