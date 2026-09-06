const SANSKRIT_SOURCE =
  'https://www.sanskrit-lexicon.uni-koeln.de/scans/MWScan/2020/web/webtc/indexcaller.php?key=ekatA&input=slp1&output=deva'

export function WhyPage() {
  return (
    <article className="why-page">
      <header className="why-hero" data-reveal>
        <span className="why-label">WHY</span>
        <h1>
          받은 관심을
          <br />
          <em>다시 사람에게.</em>
        </h1>
        <p>
          WELLKNEWS는 매일 뉴스를 전하며 사람들의 관심이 가진 힘을 보아 왔습니다. 하루 한 번, 그
          시선을 누군가를 찾는 데 보탤 수 있다면. EKATA는 그 생각에서 시작했습니다.
        </p>
      </header>

      <section className="why-origin" aria-labelledby="origin-title">
        <div className="why-origin-heading" data-reveal>
          <span className="why-label">THE NAME</span>
          <h2 id="origin-title">두 뜻이 만난 이름.</h2>
        </div>

        <div className="origin-pair">
          <div className="origin-card origin-card--ko" data-reveal>
            <span>먼저, 한국어</span>
            <strong>애가 탄다</strong>
            <p>누군가의 소식을 기다리는 애타는 마음. 에카타라는 이름은 여기에서 시작했습니다.</p>
          </div>

          <div className="origin-thread" aria-hidden="true">
            <span />
          </div>

          <div className="origin-card origin-card--sa" data-reveal>
            <span>그리고, 산스크리트어</span>
            <strong lang="sa">एकता</strong>
            <i>ekatā</i>
            <p>
              ‘하나’를 뜻하는 <i>eka</i>와 추상명사 접미사 <i>-tā</i>가 결합한 말로, ‘하나
              됨·통합·결합’을 뜻합니다.
            </p>
          </div>
        </div>

        <div className="origin-meaning" data-reveal>
          <p>
            한국어에서 이름을 얻은 뒤, 비슷한 소리의 산스크리트어 <i>ekatā</i>를 발견했습니다. 두
            말의 뿌리는 다르지만, 애타게 기다리는 마음과 하나가 된다는 뜻은 누군가를 함께 찾는
            EKATA의 일과 맞닿았습니다.
          </p>
          <a href={SANSKRIT_SOURCE} target="_blank" rel="noreferrer">
            Monier–Williams 사전에서 뜻 확인 ↗<span className="sr-only"> (새 창)</span>
          </a>
        </div>
      </section>

      <section className="why-closing" data-reveal>
        <p>
          한 사람을 찾는 일이
          <br />
          남의 일이 되지 않도록.
        </p>
        <div>
          <span>
            EKATA는 공식 공개정보를 한 번 더 또렷하게 전하고, 공식 제보창구 182로 안내합니다.
          </span>
          <a href="/ekata/">
            캠페인 보기 <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </article>
  )
}
