import type { ConversationTurn } from '../../components/session/chat/turn'

/**
 * 기차 안에서 오간 말.
 *
 * 「군단장은 본가에 있다」와 같은 원칙으로 줄였다 — 대화를 굴리기 위한 추임새와
 * 중복과 «이거 정리해 줘» 같은 메타 발언은 지우고, 실제로 사고가 한 칸 움직인
 * 말만 남긴다. 지운 것이 절반이 넘는다.
 *
 * 다만 온도는 줄이지 않았다. 여기 남은 말은 기분이 좋을 때 한 말이 아니고,
 * 문장을 다듬으면 그 상태가 같이 다듬어진다. 이 대화에서 발견된 것은 결론이
 * 아니라 감정의 이름이라, 감정이 실제로 어떤 모양이었는지가 지워지면 발견도
 * 같이 사라진다.
 *
 * 두 갈래로 나눠 둔다. 이름을 찾기 전과 찾은 뒤 사이에 다이얼이 들어가기
 * 때문이다. 한 배열로 두고 중간을 잘라 쓰면 원고가 조판의 사정을 알게 된다.
 */

/**
 * 이름을 찾기까지.
 *
 * 다섯 번 연속으로 혼잣말이 이어진다. 상대가 끼어들 자리를 주지 않은 것이
 * 아니라 실제로 그랬다 — 누구에게 묻고 있는 말이 아니었기 때문이다. 묻기
 * 시작하는 것은 «지금 내가 무슨 상태인지 알고 싶다»부터다.
 */
export const trainTurns: readonly ConversationTurn[] = [
  {
    id: 'commute',
    speaker: 'ME',
    side: 'right',
    paragraphs: [
      '너무 짜증나서 비교 대상이 출근이다.',
      '출근하는 게 더 짜증날까 지금이 더 짜증날까.',
    ],
  },
  {
    id: 'no-one',
    speaker: 'ME',
    side: 'right',
    paragraphs: [
      '출근해서는 처신 똑바로 못하면 내 인생이 많이 피곤해지는데 지금은 아무것도 안 해도 뭐라 하는 사람 없다.',
      '근데 내가 설정한 지점이 날 피곤하게 한다.',
    ],
  },
  {
    id: 'material',
    speaker: 'ME',
    side: 'right',
    paragraphs: ['결국 나는 글감을 얻기 위해 이 지랄을 하고 있는 건가.'],
  },
  {
    id: 'penalty',
    speaker: 'ME',
    side: 'right',
    paragraphs: [
      '이건 벌이다.',
      '더 나은 인간이 되지 못한 벌.',
      '아직 감정이 쉽게 변하고 평정하지 못해서 내린 벌.',
    ],
  },
  {
    id: 'ask',
    speaker: 'ME',
    side: 'right',
    paragraphs: [
      '나는 납득이 안 된다.',
      '메타인지도 지금 안 되고 있다.',
      '지금 내가 무슨 상태인지 알고 싶다.',
    ],
  },
  {
    id: 'duty',
    speaker: 'JIPPY',
    side: 'left',
    paragraphs: [
      '아무도 강요하지 않았는데 네가 만든 일정이 의무처럼 작동하고 있는 것 같다.',
      '바꿔도 된다. 지금 취소해도 아무 일도 일어나지 않는다.',
    ],
  },
  {
    id: 'pride',
    speaker: 'ME',
    side: 'right',
    paragraphs: ['근데 자존심 상해.', '그럴 생각 없어.'],
  },
  {
    id: 'mine',
    speaker: 'JIPPY',
    side: 'left',
    paragraphs: ['그럼 포기하기 싫어서 계속하는 거네.', '내가 정한 건 내가 끝까지 본다는 쪽.'],
  },
  {
    id: 'named',
    speaker: 'ME',
    side: 'right',
    paragraphs: ['그냥 오기네.'],
  },
]

/**
 * 왜 자유로워졌는지 물은 뒤.
 *
 * 이 두 마디는 대화의 한참 뒤에 나온다. 그 사이에 여러 갈래의 철학적 설명이
 * 오갔는데 여기 남은 것은 실제로 «이게 가장 공감된다»는 대답이 붙은 하나뿐이다.
 * 나머지를 같이 실으면 이 기록의 주인공이 스피노자가 된다.
 */
export const spinozaTurns: readonly ConversationTurn[] = [
  {
    id: 'spinoza',
    speaker: 'JIPPY',
    side: 'left',
    paragraphs: [
      '스피노자식으로 보면 인간은 자신을 움직이는 원인을 모를수록 수동적이고, 그 원인을 이해할수록 조금 더 능동적이 된다고 볼 수 있다.',
      '‘뭔지 모르겠는데 존나 하기 싫다’에서 ‘나는 지금 오기로 계속하고 있다’로 바뀐 셈이다.',
    ],
  },
  {
    id: 'agree',
    speaker: 'ME',
    side: 'right',
    paragraphs: ['이게 가장 공감된다.'],
  },
]
