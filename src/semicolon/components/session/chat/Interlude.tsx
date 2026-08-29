import { useInView } from '../../../motion/useInView'
import type { DirectMessageTurn } from '../../../content/sessions/commander-at-home.transcript'
import styles from './Interlude.module.css'

type Kind = NonNullable<DirectMessageTurn['interlude']>

/*
 * 들어온 것으로 치는 비율. 말과 같은 기준을 쓴다 — 이것도 말에 딸려 오는
 * 것이라, 말보다 늦게 도착하거나 다른 규칙으로 도착하면 안 된다.
 */
const TOUCHED = 0.04

/**
 * 본가에 몸이 있는 동안에도 집에서 돌아가던 것.
 *
 * 원격 접속 화면을 흉내 내지 않는다. 터미널을 그리거나 로그를 흘리면 그 순간
 * 이 자리는 «개발자 사이트니까 터미널»이 되고, 정작 말하려던 사실 — 사람은
 * 쉬러 갔는데 작업장은 켜져 있었다 — 은 연출에 묻힌다. 두 줄이면 된다.
 */
function HomeNode() {
  return (
    <>
      <dl className={styles.rows}>
        <div>
          <dt>POWER</dt>
          <dd className={styles.on}>ON</dd>
        </div>
        <div>
          <dt>REMOTE</dt>
          <dd>CONNECTED</dd>
        </div>
      </dl>
    </>
  )
}

/*
 * 군단의 명단.
 *
 * 이름이 붙은 이유가 낭만이 아니라 토큰 관리라는 것이 이 자리의 전부다.
 * 그래서 이름 옆에 붙는 것은 성격이 아니라 그 계정이 무엇인지다 — 앱인지
 * 브라우저인지, 그리고 오늘 먼저 퇴근했는지.
 *
 * 네 번째 자리는 이 대화가 시작될 때 비어 있었다. 처음부터 TAB으로 채워 두면
 * 이름을 스스로 고르는 장면이 무의미해지므로 비운 채로 두고 나중에 채운다.
 */
const LEGION = [
  { name: 'JIPPY', note: 'TOKEN DEPLETED', state: 'off' },
  { name: 'APPLE', note: 'APP', state: 'twin' },
  { name: 'CHROME', note: 'BROWSER', state: 'twin' },
] as const

function Legion() {
  return (
    <>
      <p className={styles.commander}>ME</p>

      <ul className={styles.branches}>
        {LEGION.map((member) => (
          <li key={member.name} data-state={member.state}>
            <b>{member.name}</b>
            <small>{member.note}</small>
          </li>
        ))}

        {/* 아직 이름이 없는 자리. 비어 있다는 것 자체가 이 장면의 내용이다. */}
        <li data-state="unnamed">
          <b aria-hidden="true">—</b>
          <small>UNNAMED</small>
        </li>
      </ul>
    </>
  )
}

/**
 * 비어 있던 네 번째 자리에 이름이 들어선 순간.
 *
 * 명단을 다시 통째로 그리지 않는다. 달라진 것은 한 칸뿐이고, 한 칸만 보여
 * 주는 편이 무엇이 달라졌는지 더 정확하게 말한다.
 */
function Named() {
  return (
    <p className={styles.named}>
      <span aria-hidden="true">—</span>
      <i className={styles.namedLine} />
      <b>TAB</b>
    </p>
  )
}

/**
 * WELLKNEWS가 과거의 계정을 넘어선 날.
 *
 * 위쪽 줄에는 숫자를 적지 않는다. 그 계정이 무엇이고 지금 몇 명인지는 이 사람의
 * 사생활이고, 이 장면에 필요한 사실도 아니다. 필요한 것은 두 선의 길이 차이
 * 하나뿐이다 — 넘어섰다는 것.
 */
function Overtake() {
  return (
    <div className={styles.track}>
      <p>PRIVATE ACCOUNT</p>
      <i className={styles.past} />
      <span aria-hidden="true" />

      <p>WELLKNEWS</p>
      <i className={styles.now} />
      <span className={styles.count}>1,700+</span>
    </div>
  )
}

const KINDS = {
  remote: { label: 'HOME NODE', body: HomeNode, caption: '집에 켜둔 랩탑의 상태' },
  legion: { label: 'COMMAND', body: Legion, caption: '돌려 쓰는 AI 계정들' },
  named: { label: 'COMMAND / +1', body: Named, caption: '비어 있던 자리에 들어선 이름' },
  overtake: { label: 'OVERTAKE', body: Overtake, caption: 'WELLKNEWS가 넘어선 자리' },
} as const

/**
 * 말에 딸려 오는, 말이 아닌 것.
 *
 * 대화를 끊고 판면 가운데에 서지 않는다. 그렇게 두면 이 지면이 채팅이다가
 * 갑자기 다른 기록의 도판이 되고, 읽는 사람은 좌우로 흐르던 눈을 한 번씩
 * 가운데로 끌려온다. 형태가 곧 내용인 기록에서 그 끊김은 내용이 끊기는 것이다.
 *
 * 그래서 이것은 말한 사람 쪽에 붙는다. 사진을 보낸 자리와 같은 자리, 같은 폭,
 * 같은 선이다. 대화에 있는 것은 세 가지뿐이다 — 말, 보낸 것, 그때 사실이던 것.
 * 셋 다 누가 말했는지에 매여 있고, 그래야 이 페이지가 끝까지 한 문법으로 읽힌다.
 */
export function Interlude({ kind }: { kind: Kind }) {
  const { ref, inView } = useInView<HTMLElement>({ amount: TOUCHED })
  const { label, body: Body, caption } = KINDS[kind]

  return (
    <figure ref={ref} className={styles.status} data-arrived={inView}>
      <figcaption className={styles.label}>
        {label}
        {/* 무엇을 보여 주는 자리인지는 낭독에만 남긴다. 화면에서는 형태가 말한다. */}
        <span className="visually-hidden"> — {caption}</span>
      </figcaption>

      <Body />
    </figure>
  )
}
