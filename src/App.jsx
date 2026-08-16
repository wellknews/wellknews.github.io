import './App.css'

const channels = [
  { name: 'Instagram', href: '#' },
  { name: 'YouTube', href: '#' },
  { name: 'Facebook', href: '#' },
]

function Arrow() {
  return <span className="arrow" aria-hidden="true">↗</span>
}

function Header() {
  return (
    <header className="header">
      <a href="#top" className="brand" aria-label="WELLKNEWS home">
        <img
          src="/logo.png"
          alt="WELLKNEWS logo"
          className="brand-logo"
        />
      </a>

      <nav className="nav" aria-label="Primary navigation">
        <a href="#report">REPORT</a>
        <a href="#channels">CHANNELS</a>
        <a href="#about">ABOUT</a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-logo-wrap">
        <img
          src="/logo.png"
          alt="WELLKNEWS logo"
          className="hero-logo"
        />
      </div>

      <div className="hero-bottom">
        <h1 className="hero-copy">
          <span>EVERY NEWS,</span>
          <span>WELL KNEW.</span>
        </h1>

        <span className="scroll-label">
          SCROLL ↓
        </span>
      </div>
    </section>
  )
}

function Report() {
  return (
    <section className="section report" id="report">
      <div className="section-index">
        01 / REPORT
      </div>

      <div className="report-grid">
        <h2 className="section-heading">
          세상에 알려야 할
          <br />
          이야기가 있다면.
        </h2>

        <div className="report-meta">
          <p>
            WELLKNEWS는 기사화를 위한
            <br />
            다양한 제보를 기다립니다.
          </p>

          <div className="report-types">
            <span>사진</span>
            <span>영상</span>
            <span>문서</span>
            <span>링크</span>
          </div>
        </div>
      </div>

      <a
        className="editorial-link report-link"
        href="#"
        onClick={(event) => event.preventDefault()}
      >
        <span>제보하기</span>
        <Arrow />
      </a>
    </section>
  )
}

function Channels() {
  return (
    <section className="section" id="channels">
      <div className="section-index">
        02 / CHANNELS
      </div>

      <div className="channels">
        {channels.map((channel) => (
          <a
            className="editorial-link channel-link"
            href={channel.href}
            key={channel.name}
            onClick={(event) => {
              if (channel.href === '#') event.preventDefault()
            }}
          >
            <span>{channel.name}</span>
            <Arrow />
          </a>
        ))}
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="section-index">
        03 / ABOUT
      </div>

      <div className="about-grid">
        <h2 className="about-name">
          WELLKNEWS
        </h2>

        <p className="about-copy">
          Every news,
          <br />
          well knew.
        </p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <span>WELLKNEWS</span>
      <span>© 2026 WELLKNEWS</span>
    </footer>
  )
}

function App() {
  return (
    <div className="site">
      <Header />

      <main>
        <Hero />
        <Report />
        <Channels />
        <About />
      </main>

      <Footer />
    </div>
  )
}

export default App
