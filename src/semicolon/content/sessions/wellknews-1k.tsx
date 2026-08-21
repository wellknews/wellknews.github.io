import { Amount } from '../../components/session/Amount'
import { Becoming } from '../../components/session/Becoming'
import { Candidates } from '../../components/session/Candidates'
import { Counter } from '../../components/session/Counter'
import { Ending } from '../../components/session/Ending'
import { Faces } from '../../components/session/Faces'
import { Later } from '../../components/session/Later'
import { Materialize } from '../../components/session/Materialize'
import { Passage } from '../../components/session/Passage'
import { Quiet } from '../../components/session/Quiet'
import { Quotes } from '../../components/session/Quotes'
import { Scene } from '../../components/session/Scene'
import { Span } from '../../components/session/Span'
import type { Cover, Session } from '../types'

/**
 * 이 기록에 쓰인 사진들.
 *
 * 전부 실제로 이 일에 있었던 것들이다. 분위기를 만들려고 새로 만든 그림은
 * 한 장도 없다. 시안 두 장은 업체에 실제로 보낸 파일이라 이 사건의 기록이고,
 * 나머지 두 장은 도착한 물건과 그것을 입은 모습이다.
 *
 * 시안은 배경이 투명하다. 그래서 종이 위에 그대로 얹으면 흰 사각형이 생기지
 * 않고, 판면 뒤의 색면이 티셔츠 주위로 그대로 비쳐 보인다.
 */
const mockupFront: Cover = {
  src: '/media/session/1k/mockup-front.webp',
  alt: '검은 반팔 티셔츠 앞면 시안. 왼쪽 가슴에 흰 선으로 그린 토끼 얼굴이 작게 들어가 있다.',
  width: 800,
  height: 800,
  /* 화면 안에 있던 것 중 실제로 옷으로 옮겨간 부분. */
  focus: { x: 0.6, y: 0.33 },
}

const mockupBack: Cover = {
  src: '/media/session/1k/mockup-back.webp',
  alt: '같은 티셔츠 뒷면 시안. 등 위쪽에 흰 산세리프 대문자로 WELLKNEWS라고 적혀 있다.',
  width: 800,
  height: 800,
}

const packaged: Cover = {
  src: '/media/session/1k/package.webp',
  alt: '투명 비닐에 넣어 접힌 채 나무 바닥에 놓인 검은 티셔츠. 목 안쪽에 제조사 라벨이 보인다.',
  width: 1600,
  height: 1200,
}

const worn: Cover = {
  src: '/media/session/1k/worn.webp',
  alt: '회색 벽 앞에서 그 티셔츠를 입고 거울로 찍은 사진. 왼쪽 가슴의 토끼 얼굴이 보인다.',
  width: 1122,
  height: 1402,
}

/**
 * 이 기록의 문장들.
 *
 * 배치는 화면 폭에 따라 둘로 갈리지만 문장은 한 벌뿐이다. 좁은 화면에서
 * 장면을 합칠 때 글을 덜어내지 않으려고 여기 따로 모아 둔다 — 판면이 좁다는
 * 것이 읽을 것을 덜 받아도 된다는 뜻은 아니다.
 */
const opening = (
  <>
    <p>팔로워가 1,000명이 됐다.</p>
    <p>뭔가 하나쯤 남겨보고 싶었다.</p>
    <p>거창한 이유는 없었다. 화면 안에만 있던 것을 한번 밖으로 꺼내보고 싶었다.</p>
  </>
)

const decision = <p>하나쯤은 물건으로 남겨보기로 했다.</p>
const soonest = <p>가장 먼저 만들 수 있었던 것.</p>
const easily = <p>생각보다 간단하게 화면 밖으로 나왔다.</p>
const arrived = <p>도착했다.</p>
const withinWeek = <p>주문하고 일주일도 지나지 않았다.</p>

const inHand = (
  <>
    <p>화면에서 보던 것보다 별일 아닌 물건이었다.</p>
    <p>그래서 조금 신기했다.</p>
  </>
)

const quality = (
  <>
    <p>인쇄가 특별히 고급스럽지는 않았다.</p>
    <p>오래 버틸 것 같지도 않았다.</p>
    <p>그래도 기념품이라고 생각하니 별로 중요하지 않았다.</p>
  </>
)

const rights = (
  <>
    <p>판매할 생각은 아직 없다.</p>
    <p>언젠가 그렇게 된다면 그때는 로고와 권리에 대해서도 제대로 생각해봐야 할 것이다.</p>
  </>
)

const reflection = (
  <>
    <p>요즘은 무언가를 만들 여유가 많지 않다.</p>
    <p>이상하게도 그래서 더 자주 만든다.</p>
    <p>앱을 만들고, 계정을 운영하고, 웹페이지를 고친다.</p>
    <p>쉬는 대신 만드는 쪽에 가까운 것 같다.</p>
    <p>그렇게 만든 것들에는 그때의 상태가 조금씩 남는다.</p>
  </>
)

const learned = (
  <>
    <p>그래도 하나 알게 됐다.</p>
    <p>화면에서 만든 것은 생각보다 쉽게 물건이 될 수 있었다.</p>
    <p>다음에는 또 다른 형태가 될지도 모르겠다.</p>
  </>
)

const next = (
  <>
    <p>1,000 다음은 10,000이다.</p>
    <p>얼마나 걸릴지는 모르겠다.</p>
  </>
)

const keepMaking = <p>계속 만든다.</p>

const candidates = ['KEYCAP', 'T-SHIRT', 'ECO BAG', 'MOUSE PAD'] as const

const conversation = [
  { text: '제작 가능할까요?', from: 'me' },
  { text: '네 가능합니다.', from: 'maker' },
] as const

/**
 * SEMICOLON의 첫 SESSION.
 *
 * 이 기록의 중심은 1,000이라는 숫자도, 티셔츠라는 물건도 아니다. 화면 안에서만
 * 존재하던 것이 처음으로 현실의 물건이 된 일이다. 그래서 순서 자체가 내용이 된다 —
 * 이미지에서 시작해 주문을 거쳐 물건이 되고 마지막에 입는다.
 *
 * `display: 'stage'`를 쓰는 이유가 그것이다. 이 경험은 형태가 곧 내용이라
 * 판면을 통째로 가져간다. 대부분의 SESSION은 이렇게 만들지 않는다.
 */
export const wellknews1k: Session = {
  slug: 'wellknews-1k',
  title: '화면 속의 것을 입어보다',
  subtitle: 'FROM SCREEN TO COTTON',
  display: 'stage',

  meta: {
    date: '2026-08',
    type: 'WELLKNEWS 1K',
  },

  /* 표지는 완성품이 아니라 시안이다. 아직 물건이 아닌 상태에서 시작해야 한다. */
  cover: mockupFront,

  /*
   * 넓은 판면의 배치.
   *
   * 장면마다 자기 자리와 자기 여백을 갖는다. 1200px 화면에서 200px의 공백은
   * 침묵으로 읽히고, 그 침묵이 장면들을 서로 떼어 놓는다.
   */
  body: (
    <>
      <Scene air>
        <Passage>{opening}</Passage>
      </Scene>

      <Scene>
        <Counter />
      </Scene>

      <Scene air>
        <Passage tone="loud">{decision}</Passage>
      </Scene>

      <Scene>
        <Candidates options={candidates} chosen="T-SHIRT" />

        <Passage>{soonest}</Passage>
      </Scene>

      <Scene>
        <Quotes quotes={conversation} />
      </Scene>

      <Scene>
        <Amount value="22,000" currency="KRW" />

        <Passage tone="loud">{easily}</Passage>
      </Scene>

      {/*
        표지에서 흐릿하게만 보던 그 이미지가 여기서 처음 온전히 나온다.
        앞뒤를 직접 돌려보는 동안, 이것이 아직 화면 안의 것이라는 사실이 남는다.
      */}
      <Scene width="bleed" air>
        <Faces front={mockupFront} back={mockupBack} />
      </Scene>

      {/* 이 기록의 핵심. 스크롤한 만큼 이미지가 물건이 된다. */}
      <Scene width="bleed" air>
        <Becoming from={mockupFront} to={packaged} />
      </Scene>

      <Scene>
        <Passage tone="loud">{arrived}</Passage>
      </Scene>

      <Scene>
        <Span from="ORDER" to="ARRIVED" />

        <Passage>{withinWeek}</Passage>
      </Scene>

      {/*
        이 기록에서 가장 큰 사진.
        여기서는 인터랙션을 오히려 줄인다 — 손을 대는 대신 그냥 보게 한다.
      */}
      <Scene width="bleed" air>
        <Materialize image={worn} rest={1} />
      </Scene>

      <Scene>
        <Passage>{inHand}</Passage>
      </Scene>

      <Scene>
        <Passage>{quality}</Passage>
      </Scene>

      <Scene>
        <Passage>{rights}</Passage>
      </Scene>

      {/*
        여기서부터 색이 빠진다.
        이 문단에 연출을 얹으면 값싸진다. 더하는 대신 뺀다.
      */}
      <Quiet>
        <Passage>{reflection}</Passage>
      </Quiet>

      <Scene air>
        <Passage>{learned}</Passage>
      </Scene>

      <Scene>
        <Passage>{next}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{keepMaking}</Passage>

        {/* 다짐이 아니라 아직 모르는 숫자다. 물음표를 떼지 않는다. */}
        <Later>
          <p className="mono">10,000 ?</p>
        </Later>
      </Scene>

      {/* 끝났지만 끝난 것이 아니라는 말을, 마지막 기호가 대신한다. */}
      <Scene>
        <Ending />
      </Scene>
    </>
  ),

  /*
   * 작은 판면의 배치.
   *
   * 문장은 위와 똑같다. 달라지는 것은 두 가지다.
   *
   *   · 장면을 합친다. 스무 개의 장면이 각자 여백을 갖고 이어지면, 좁은
   *     화면에서는 그 반복 자체가 «연출이 있다»는 사실을 계속 알린다.
   *     연달아 읽을 문단은 한 장면 안에 함께 둔다.
   *   · 강한 움직임을 둘만 남긴다 — 시안이 실물이 되는 장면과 마지막 기호.
   *     나머지는 정지한 채로 놓인다. 남은 둘이 정말 사건으로 읽히려면
   *     그 사이가 조용해야 한다.
   *
   * ORDER→ARRIVED의 선은 여기서 뺀다. «일주일도 지나지 않았다»는 문장이
   * 이미 같은 말을 하고, 좁은 화면에서 선은 구획만 하나 더 만든다.
   */
  compact: (
    <>
      <Scene>
        <Passage>{opening}</Passage>

        <Counter />

        <Passage tone="loud">{decision}</Passage>
      </Scene>

      <Scene>
        <Candidates options={candidates} chosen="T-SHIRT" />

        <Passage>{soonest}</Passage>
      </Scene>

      <Scene>
        <Quotes quotes={conversation} />

        <Amount value="22,000" currency="KRW" />

        <Passage tone="loud">{easily}</Passage>
      </Scene>

      {/* 앞면과 뒷면이 순서대로 놓인다. 뒤집는 장치는 커서가 있어야 성립한다. */}
      <Scene width="bleed">
        <Faces front={mockupFront} back={mockupBack} />
      </Scene>

      {/* 좁은 화면에서 살아남는 유일한 강한 움직임. */}
      <Scene width="bleed" air>
        <Becoming from={mockupFront} to={packaged} />
      </Scene>

      <Scene>
        <Passage tone="loud">{arrived}</Passage>

        <Passage>{withinWeek}</Passage>
      </Scene>

      <Scene width="bleed">
        <Materialize image={worn} rest={1} />
      </Scene>

      <Scene>
        <Passage>{inHand}</Passage>

        <Passage>{quality}</Passage>

        <Passage>{rights}</Passage>
      </Scene>

      <Quiet>
        <Passage>{reflection}</Passage>
      </Quiet>

      <Scene>
        <Passage>{learned}</Passage>

        <Passage>{next}</Passage>
      </Scene>

      <Scene air>
        <Passage tone="loud">{keepMaking}</Passage>

        <Later>
          <p className="mono">10,000 ?</p>
        </Later>
      </Scene>

      <Scene>
        <Ending />
      </Scene>
    </>
  ),
}
