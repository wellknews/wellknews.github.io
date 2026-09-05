import { useState } from 'react'

const official = 'https://www.safe182.go.kr/'
const campaignUrl = 'https://wellknews.github.io/ekata/'

export default function App() {
  const [shareStatus, setShareStatus] = useState('')
  const [showShareLink, setShowShareLink] = useState(false)

  async function share() {
    setShareStatus('')
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EKATA',
          text: '관심이, 돌아오는 길이 되도록.',
          url: campaignUrl,
        })
        setShareStatus('공유 창에서 선택한 동작을 완료했습니다.')
        return
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(campaignUrl)
      setShareStatus('캠페인 주소를 복사했습니다.')
    } catch {
      setShowShareLink(true)
      setShareStatus('아래 주소를 직접 복사해 주세요.')
    }
  }

  return (
    <>
      <a className="skip" href="#main">
        본문으로 이동
      </a>
      <header className="header wrap">
        <a href="/ekata/" className="wordmark" aria-label="에카타 홈">
          ekata<span>✳</span>
        </a>
        <nav aria-label="주 메뉴">
          <a href="#campaign">실종아동 찾기</a>
          <a href="#act" className="nav-action">
            함께하기 <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      <main id="main">
        <section className="hero wrap" aria-labelledby="hero-title">
          <div className="eyebrow">
            <span className="dot" /> 실종아동 찾기 캠페인 · 준비 중
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 id="hero-title">
                관심이,
                <br />
                돌아오는
                <br />
                <span>길이 되도록.</span>
              </h1>
              <p>
                한 번 더 바라본 얼굴이
                <br />
                누군가의 기다림에 닿을 수 있도록.
              </p>
              <a className="button green" href="#campaign">
                실종아동 찾기 안내 <span aria-hidden="true">↘</span>
              </a>
            </div>
            <div className="signal-art" aria-hidden="true">
              <div className="art-top">
                <span>ONE ANOTHER</span>
                <span>EKATA / 001</span>
              </div>
              <svg viewBox="0 0 500 480" fill="none">
                <defs>
                  <linearGradient
                    id="signal"
                    x1="90"
                    y1="50"
                    x2="390"
                    y2="440"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#b6ff3b" />
                    <stop offset="1" stopColor="#517517" />
                  </linearGradient>
                </defs>
                <path
                  d="M-30 80H135C195 80 235 120 235 180V210C235 270 195 310 135 310H110C50 310 35 225 100 205C140 193 172 225 205 255L295 335C335 370 365 382 405 363C465 334 446 253 386 253H365C305 253 265 293 265 353V383C265 443 305 483 365 483H530"
                  stroke="url(#signal)"
                  strokeWidth="34"
                  strokeLinecap="round"
                />
              </svg>
              <div className="art-bottom">
                <span>한 사람에서, 또 한 사람으로.</span>
                <span aria-hidden="true">↓</span>
              </div>
            </div>
          </div>
          <div className="hero-foot">
            <span>A CAMPAIGN INITIATIVE BY WELLKNEWS</span>
            <span>SCROLL TO CONNECT ↓</span>
          </div>
        </section>

        <section id="campaign" className="campaign" aria-labelledby="campaign-title">
          <div className="wrap">
            <div className="section-label">
              <span>01 — FIRST CAMPAIGN</span>
              <span className="status">캠페인 준비 중</span>
            </div>
            <div className="campaign-grid">
              <div>
                <h2 id="campaign-title">
                  아직, 기다리는
                  <br />
                  사람이 있습니다.
                </h2>
                <p className="intro">
                  웰뉴스와 함께하는 실종아동 찾기.
                  <br />한 번 더 보고, 함께 기억하고,
                  <br />
                  작은 단서를 공식 창구로 연결합니다.
                </p>
                <p className="quiet">
                  하루 한 건의 관심을 잇는 캠페인을 준비하고 있습니다. 공개 정보와 이용 범위를
                  확인한 뒤 시작합니다.
                </p>
              </div>
              <div className="notice">
                <div className="notice-head">
                  <span>실종아동 찾기</span>
                  <span aria-hidden="true">↗</span>
                </div>
                <div className="notice-body">
                  <span className="outline-mark" aria-hidden="true">
                    ↗
                  </span>
                  <h3>지금도, 함께 찾을 수 있습니다.</h3>
                  <p>
                    실종아동 정보는 현재 안전Dream에서 확인할 수 있습니다. 에카타의 사건 목록은 공식
                    정보 연동을 준비 중입니다.
                  </p>
                  <a className="button dark" href={official} target="_blank" rel="noreferrer">
                    안전Dream에서 확인하기 ↗<span className="sr-only"> (새 창)</span>
                  </a>
                </div>
                <div className="notice-foot">경찰청 안전Dream 공식 사이트로 이동합니다.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="act wrap" id="act" aria-labelledby="act-title">
          <div className="section-label">
            <span>02 — SMALL ACTIONS, REAL CONNECTIONS</span>
          </div>
          <h2 id="act-title">눈길에서, 행동으로.</h2>
          <div className="actions">
            <article>
              <span className="step">01 / LOOK</span>
              <h3>한 번 더 보기.</h3>
              <p>공식 사이트에서 사진과 인상착의, 발생 장소를 살펴봐 주세요.</p>
              <a href={official} target="_blank" rel="noreferrer">
                공식 정보 확인 ↗<span className="sr-only"> (새 창)</span>
              </a>
            </article>
            <article>
              <span className="step">02 / SHARE</span>
              <h3>관심을 나누기.</h3>
              <p>이 캠페인의 주소를 나눠 주세요. 또 다른 시선이 함께할 수 있도록.</p>
              <button type="button" onClick={() => void share()}>
                캠페인 공유하기 ↗
              </button>
              <output className="share-status">{shareStatus}</output>
              {showShareLink && (
                <input
                  className="share-link"
                  aria-label="복사할 캠페인 주소"
                  readOnly
                  value={campaignUrl}
                  onFocus={(event) => event.target.select()}
                />
              )}
            </article>
            <article>
              <span className="step">03 / CONNECT</span>
              <h3>단서를 연결하기.</h3>
              <p>목격한 시간·장소·특징을 기억해 주세요. 제보는 공식 창구로 직접 전해 주세요.</p>
              <a href="tel:182">182 전화 연결 ↗</a>
              <small>
                긴급한 상황은 <a href="tel:112">112</a>로 신고해 주세요.
              </small>
            </article>
          </div>
        </section>

        <section className="about wrap" aria-labelledby="about-title">
          <div className="about-heading">
            <span className="eyebrow">EKATA — 이름에 담은 마음</span>
            <h2 id="about-title">
              애가 타는
              <br />
              마음을 함께.
            </h2>
          </div>
          <div className="about-copy">
            <p>
              에카타는 ‘애가 탄다’는 말에서 시작한 이름입니다.
              <br />
              돌아오기를 기다리는 마음에
              <br />
              함께하고자 합니다.
            </p>
            <p>
              웰뉴스의 실종아동 찾기 캠페인을 지원하며,
              <br />
              공식 정보와 제보 창구를 안내합니다.
            </p>
            <details>
              <summary>어떤 정보를 보여주나요?</summary>
              <p>
                공식적으로 공개된 실종아동 정보를 연결할 계획입니다. 현재는 연동 준비 단계로, 실제
                사건이나 예시 인물의 사진·이름을 게시하지 않습니다.
              </p>
            </details>
            <details>
              <summary>제보를 에카타에 남길 수 있나요?</summary>
              <p>
                현재 에카타는 제보를 수집하거나 경찰에 대신 접수하지 않습니다. 182 또는 안전Dream의
                공식 창구를 이용해 주세요. 긴급 상황은 112로 신고해 주세요.
              </p>
            </details>
            <details>
              <summary>경찰청과 함께 운영하나요?</summary>
              <p>
                에카타는 웰뉴스가 준비하는 독립 캠페인입니다. 경찰청의 공식 사업이나 제휴 기관이
                아닙니다. 공식 정보 제공기관과 캠페인 운영자를 구분해 안내합니다.
              </p>
            </details>
          </div>
        </section>
        <aside className="closing">
          <div className="wrap">
            <p>
              작은 관심.
              <br />
              <span>이어지는 가능성.</span>
            </p>
            <a href="#act" aria-label="함께하기로 이동">
              ↗
            </a>
          </div>
        </aside>
      </main>
      <footer className="footer wrap">
        <a className="wordmark" href="/ekata/">
          ekata<span>✳</span>
        </a>
        <p>웰뉴스 실종아동 찾기 캠페인 지원.</p>
        <a href="https://instagram.com/wellknews" target="_blank" rel="noreferrer">
          웰뉴스 Instagram ↗<span className="sr-only"> (새 창)</span>
        </a>
        <a href="/">WELLKNEWS ↗</a>
        <span>© {new Date().getFullYear()} EKATA</span>
      </footer>
    </>
  )
}
