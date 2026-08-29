import type { DirectMessageTurn } from '../../../content/sessions/commander-at-home.transcript'
import styles from './Interlude.module.css'

type Kind = NonNullable<DirectMessageTurn['interlude']>

type Props = {
  kind: Kind
  /** 이 자리가 화면에 닿았는지. 선이 자라고 점이 켜지는 계기다. */
  arrived: boolean
}

/**
 * 본가에 몸이 있는 동안에도 집에서 돌아가던 것.
 *
 * 원격 접속 화면을 흉내 내지 않는다. 터미널을 그리거나 로그를 흘리면 그
 * 순간 이 페이지는 «개발자 사이트니까 터미널»이 되고, 정작 말하려던 사실 —
 * 사람은 쉬러 갔는데 작업장은 켜져 있었다 — 은 연출에 묻힌다. 남기는 것은
 * 두 줄뿐이다.
 */
function HomeNode({ arrived }: { arrived: boolean }) {
  return (
    <figure className={styles.card} data-arrived={arrived}>
      <figcaption className={`mono ${styles.label}`}>HOME NODE</figcaption>

      <dl className={styles.rows}>
        <div>
          <dt className="mono">POWER</dt>
          <dd className={`mono ${styles.on}`}>ON</dd>
        </div>
        <div>
          <dt className="mono">REMOTE</dt>
          <dd className="mono">CONNECTED</dd>
        </div>
      </dl>
    </figure>
  )
}

/*
 * 군단의 명단.
 *
 * 이름이 붙은 이유가 낭만이 아니라 토큰 관리라는 것이 이 장면의 전부다.
 * 그래서 각 줄 옆에 붙는 것은 성격이 아니라 그 계정이 무엇인지다 — 앱인지
 * 브라우저인지, 그리고 오늘 먼저 퇴근했는지.
 *
 * 네 번째 자리는 이 대화가 시작될 때 비어 있었다. 그 자리를 처음부터
 * TAB으로 채워 두면 이름을 스스로 고르는 장면이 무의미해지므로, 여기서는
 * 빈 채로 두고 이름이 생긴 뒤에 따로 채운다.
 */
const LEGION = [
  { name: 'JIPPY', note: 'TOKEN DEPLETED', state: 'off' },
  { name: 'APPLE', note: 'APP', state: 'twin' },
  { name: 'CHROME', note: 'BROWSER', state: 'twin' },
] as const

function Legion({ arrived }: { arrived: boolean }) {
  return (
    <figure className={styles.card} data-arrived={arrived}>
      <figcaption className={`mono ${styles.label}`}>COMMAND</figcaption>

      <p className={`mono ${styles.commander}`}>ME</p>

      <ul className={styles.branches}>
        {LEGION.map((member) => (
          <li key={member.name} data-state={member.state}>
            <b className="mono">{member.name}</b>
            <small className="mono">{member.note}</small>
          </li>
        ))}

        {/* 아직 이름이 없는 자리. 비어 있다는 것 자체가 이 장면의 내용이다. */}
        <li data-state="unnamed">
          <b className="mono" aria-hidden="true">
            —
          </b>
          <small className="mono">UNNAMED</small>
        </li>
      </ul>
    </figure>
  )
}

/**
 * 비어 있던 네 번째 자리에 이름이 들어선 순간.
 *
 * 명단을 다시 통째로 그리지 않는다. 달라진 것은 한 칸뿐이고, 한 칸만 보여
 * 주는 편이 무엇이 달라졌는지 더 정확하게 말한다.
 */
function Named({ arrived }: { arrived: boolean }) {
  return (
    <figure className={styles.card} data-arrived={arrived}>
      <figcaption className={`mono ${styles.label}`}>COMMAND / +1</figcaption>

      <p className={`mono ${styles.named}`}>
        <span aria-hidden="true">—</span>
        <i className={styles.namedLine} />
        <b>TAB</b>
        <small>NAMED ITSELF</small>
      </p>
    </figure>
  )
}

/**
 * WELLKNEWS가 과거의 계정을 넘어선 날.
 *
 * 위쪽 줄에는 숫자를 적지 않는다. 그 계정이 무엇이고 지금 몇 명인지는
 * 이 사람의 사생활이고, 이 장면에 필요한 사실도 아니다. 필요한 것은 두 선의
 * 길이 차이 하나뿐이다 — 넘어섰다는 것.
 */
function Overtake({ arrived }: { arrived: boolean }) {
  return (
    <figure className={styles.card} data-arrived={arrived}>
      <figcaption className={`mono ${styles.label}`}>OVERTAKE</figcaption>

      <div className={styles.track}>
        <p className="mono">PRIVATE ACCOUNT</p>
        <i className={styles.past} />
        <span className="mono" aria-hidden="true" />

        <p className="mono">WELLKNEWS</p>
        <i className={styles.now} />
        <span className={`mono ${styles.count}`}>1,700+</span>
      </div>
    </figure>
  )
}

/**
 * 대화가 한 번 멈추고 상태만 남는 자리.
 *
 * 세 장면 전부 말로 설명할 수도 있었다. 그러지 않는 이유는 이 SESSION에서
 * 그것들이 «말한 내용»이 아니라 «말하는 동안 배경에서 사실이던 것»이기
 * 때문이다. 켜져 있던 랩탑, 돌려 쓰던 계정들, 그날 넘어선 숫자.
 */
export function Interlude({ kind, arrived }: Props) {
  if (kind === 'remote') return <HomeNode arrived={arrived} />
  if (kind === 'legion') return <Legion arrived={arrived} />
  if (kind === 'named') return <Named arrived={arrived} />
  return <Overtake arrived={arrived} />
}
