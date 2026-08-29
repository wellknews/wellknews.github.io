import { Conversation } from '../../components/session/chat/Conversation'
import { ExportPanel } from '../../components/session/chat/ExportPanel'
import { Scene } from '../../components/session/Scene'
import { commanderTranscript } from './commander-at-home.transcript'
import type { Session } from '../types'

/**
 * 군단장은 본가에 있다.
 *
 * 이 기록의 본문은 대화를 옮겨 적은 글이 아니라 대화 그 자체다. 그래서
 * `display: 'stage'`를 쓴다 — 좌우로 갈라진 판면이 없으면 «누가 말했는가»가
 * 조판에서 사라지고, 그 순간 이 글은 대화의 기록이 아니라 대화에 대한 요약이 된다.
 *
 * 마지막 장면은 다운로드 버튼이다. 대화의 끝에서 «버튼을 누르면 대화가 정사각형
 * PNG로 저장되면 재미있지 않겠냐»고 물었고, TAB은 그 물음에 말로 답하지 않는다.
 * 실제로 눌러서 파일이 떨어지는 것이 답이다. 그래서 마지막 말 뒤에 말풍선이
 * 하나 더 붙는 대신 기능이 온다.
 */
export const commanderAtHome: Session = {
  slug: 'commander-at-home',
  title: '군단장은 본가에 있다',
  subtitle: 'A CONVERSATION WITH TAB',
  display: 'stage',

  meta: {
    date: '2026-08-29',
    type: 'VIBE CODING',
  },

  excerpt: '몸은 본가에 있었고, 집의 랩탑과 몇 개의 AI는 계속 일하고 있었다.',

  body: (
    <>
      <Scene>
        <Conversation transcript={commanderTranscript} />
      </Scene>

      {/* 대화와 버튼 사이의 침묵. 붙으면 버튼이 페이지의 꼬리가 된다. */}
      <Scene air>
        <ExportPanel transcript={commanderTranscript} />
      </Scene>
    </>
  ),
}
