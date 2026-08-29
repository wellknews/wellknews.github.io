import { Conversation } from '../../components/session/chat/Conversation'
import { ExportPanel } from '../../components/session/chat/ExportPanel'
import { Scene } from '../../components/session/Scene'
import { commanderTranscript } from './commander-at-home.transcript'
import type { Cover, Session } from '../types'

/*
 * 표지.
 *
 * 이 기록에는 그날의 사진이 없다. 몸은 본가에 있었고 일어난 일은 전부 화면
 * 안에 있었으므로, 남은 증거는 대화 도중에 실제로 보낸 이미지 한 장뿐이다.
 * 없는 사진을 지어내는 대신 그것을 건다.
 *
 * 표지에 걸린다고 해서 대화 안의 그 장면이 미리 소비되지는 않는다. 판면 위의
 * 표지는 Materialize가 20%의 유령으로 놓기 때문에, 다가가기 전까지는 무엇인지
 * 알 수 없는 형태로만 서 있다. 무엇인지 알게 되는 자리는 여전히 대화 안에서
 * «프로필 이미지를 바꾸었어»라고 말한 다음이다.
 *
 * 초점은 토끼의 눈이다. 목록의 한 조각도 여기를 잘라 보여 준다.
 */
const taegeukRabbit: Cover = {
  src: '/media/session/commander-at-home/taegeuk-rabbit.webp',
  alt: '짙은 배경 위 붉고 푸른 태극 색면과 흰 선으로 그린 토끼 얼굴 심볼',
  width: 720,
  height: 720,
  focus: { x: 0.5, y: 0.6 },
}

/**
 * 군단장은 본가에 있다.
 *
 * 이 기록의 본문은 대화를 옮겨 적은 글이 아니라 대화 그 자체다. 그래서
 * `display: 'stage'`를 쓴다 — 좌우로 갈라진 판면이 없으면 «누가 말했는가»가
 * 조판에서 사라지고, 그 순간 이 글은 대화의 기록이 아니라 대화에 대한 요약이 된다.
 *
 * 판면을 가져가되 이 공간을 벗어나지는 않는다. 머리는 다른 stage 기록과 같은
 * Opening이고, 장면은 같은 Scene이 나누고, 끝에는 같은 자리로 돌아가는 링크가
 * 있다. 이 기록만의 문법은 그 안쪽에서 좌우로만 일어난다.
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

  cover: taegeukRabbit,

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
