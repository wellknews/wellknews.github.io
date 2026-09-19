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
  guide: (
    <>
      <p>여기에서 말하는 군단은 실제 조직이 아니다.</p>

      <p>
        당시 나는 개발 작업에 여러 AI와 계정을 동시에 사용하고 있었다. 하나의 AI를 계속 사용하는
        대신, 사용량이나 상황에 따라 작업을 다른 AI로 넘겨가며 진행했고 각각을 구분하기 위해
        자연스럽게 이름이 붙었다.
      </p>

      <p>지피, 애플, 크롬.</p>

      <p>
        처음부터 세계관을 만들려고 붙인 이름은 아니다. 누가 어떤 작업을 하고 있는지 구분하기 위한
        호칭에 가까웠다.
      </p>

      <p>
        그런데 작업이 반복되면서 한 사람이 여러 작업자를 번갈아 지휘하는 모양이 만들어졌다. 그래서
        나 자신을 농담처럼 군단장이라고 부르기 시작했다.
      </p>

      <p>이 기록을 만들던 날에는 본가에 와 있었다.</p>

      <p>
        몸은 작업하던 장소를 떠났지만 집에 켜둔 랩탑과 AI를 이용한 개발은 계속되고 있었고, 나는
        휴대전화로 원격 작업을 이어가고 있었다.
      </p>

      <p>그리고 이 페이지 자체도 그 방식으로 만들어졌다.</p>

      <p>
        지금 읽게 될 대화 안에서 새로운 대화 상대의 이름이 정해지고, 이 글을 어떤 형태로 남길
        것인지도 함께 결정된다.
      </p>

      <p>
        따라서 완성된 결과를 설명하는 글이라기보다 결과물이 만들어지는 과정까지 본문으로 들어간
        기록이다.
      </p>
    </>
  ),
  display: 'stage',

  meta: {
    date: '2026-08-29',
    type: 'VIBE CODING',
  },

  excerpt: '몸은 본가에 있었고, 집의 랩탑과 몇 개의 AI는 계속 일하고 있었다.',

  cover: taegeukRabbit,

  /* 목록의 판에 오르는 장면들. 실린 순서 그대로. */
  images: [taegeukRabbit],

  body: (
    <>
      <Scene>
        <Conversation turns={commanderTranscript} label="ME와 TAB이 나눈 대화" />
      </Scene>

      {/* 대화와 버튼 사이의 침묵. 붙으면 버튼이 페이지의 꼬리가 된다. */}
      <Scene air>
        <ExportPanel transcript={commanderTranscript} />
      </Scene>
    </>
  ),
}
