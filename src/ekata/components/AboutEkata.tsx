import { CampaignPoster } from './CampaignPoster'
import { PrinciplesLink } from './PrinciplesLink'
export function AboutEkata() {
  return (
    <section className="about-spread" aria-labelledby="about-title">
      <CampaignPoster />
      <div className="about-copy">
        <div data-reveal>
          <h2 id="about-title">
            받은 관심을
            <br />
            다시 사람에게.
          </h2>
          <p>
            WELLKNEWS는 매일 사람들의 관심이
            <br className="desktop-break" /> 어디로 향하는지 지켜봅니다.
          </p>
          <p>
            그 관심이 누군가를 찾는 데에도 쓰일 수 있다면.
            <br />
            EKATA는 그 질문에서 시작했습니다.
          </p>
          <p>
            웰뉴스의 하루 한 장의 스토리.
            <br />한 사람의 정보를 이곳에서도 함께 확인합니다.
          </p>
        </div>
        <div className="name-note" data-reveal>
          <h3>에카타.</h3>
          <p>
            ‘애가 탄다’는 말에서 시작했습니다.
            <br />한 사람을 찾는 일이 남의 일이 되지 않도록.
          </p>
        </div>
        <PrinciplesLink />
      </div>
    </section>
  )
}
