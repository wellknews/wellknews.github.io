import { useState } from 'react'

const officialUrl = 'https://www.safe182.go.kr/'
const campaignUrl = 'https://wellknews.github.io/ekata/'
const instagramUrl = 'https://www.instagram.com/wellknews/'

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

function Publisher({ linked = false }: { linked?: boolean }) {
  const mark = (
    <>
      <img src="/logo.svg" width="28" height="28" alt="" />
      <span>WELLKNEWS</span>
    </>
  )
  return linked ? (
    <a className="publisher" href="/" aria-label="웰뉴스 홈페이지">
      {mark}
    </a>
  ) : (
    <span className="publisher">{mark}</span>
  )
}

export default function App() {
  const [copyStatus, setCopyStatus] = useState('')
  const [showAddress, setShowAddress] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(campaignUrl)
      setCopyStatus('에카타 주소를 복사했습니다.')
      setShowAddress(false)
    } catch {
      setShowAddress(true)
      setCopyStatus('아래 주소를 선택해 복사해 주세요.')
    }
  }

  return (
    <>
      <a className="skip-link" href="#main">
        본문으로 이동
      </a>
      <header className="masthead page-width">
        <div className="masthead-top">
          <Publisher linked />
          <a className="header-contact" href="#report">
            제보 안내 <Arrow diagonal />
          </a>
        </div>
        <div className="masthead-title">
          <a href="/ekata/" className="ekata-wordmark" aria-label="에카타 홈">
            EKATA<span aria-hidden="true">.</span>
          </a>
          <p>
            실종아동 찾기
            <br />
            웰뉴스 캠페인
          </p>
        </div>
        <div className="edition-line">
          <span>함께 찾고, 함께 기억합니다.</span>
          <span>WELLKNEWS CAMPAIGN</span>
        </div>
      </header>

      <main id="main" className="page-width">
        <section className="campaign-spread" aria-labelledby="campaign-title">
          <figure className="campaign-figure">
            <div className="story-sheet" aria-label="에카타 캠페인 안내 포스터">
              <div className="sheet-top">
                <span>EKATA</span>
                <span>실종아동 찾기 캠페인</span>
              </div>
              <div className="sheet-light" aria-hidden="true" />
              <div className="sheet-copy">
                <p>
                  한 번 더,
                  <br />
                  기억해
                  <br />
                  <span>주세요.</span>
                </p>
                <div className="sheet-rule" />
                <p className="sheet-caption">
                  누군가에겐,
                  <br />
                  돌아오길 기다리는 한 사람.
                </p>
              </div>
              <div className="sheet-publisher">
                <Publisher />
                <span>AN EKATA CAMPAIGN</span>
              </div>
            </div>
            <figcaption>
              <span>에카타 캠페인 안내</span>
              <span>공식 정보 연동 준비 중</span>
            </figcaption>
          </figure>

          <div className="campaign-desk">
            <div className="desk-heading">
              <p className="kicker">
                <span /> 실종아동 찾기
              </p>
              <h1 id="campaign-title">
                기억하는 눈길이
                <br />더 많아지도록.
              </h1>
              <p className="desk-intro">
                웰뉴스와 함께 실종아동을 찾습니다.
                <br />
                사진과 특징을 살펴보고,
                <br />
                기억나는 단서를 전해주세요.
              </p>
            </div>
            <div className="information-note">
              <span className="note-label">캠페인 소식</span>
              <h2>첫 번째 소식을 준비하고 있습니다.</h2>
              <p>
                에카타에서 실종아동의 공식 정보를 연결할 준비를 하고 있습니다. 현재 공개된 정보는
                경찰청 안전Dream에서 볼 수 있습니다.
              </p>
              <a className="primary-link" href={officialUrl} target="_blank" rel="noreferrer">
                <span>
                  안전Dream에서 실종아동 찾기<span className="sr-only"> (새 창)</span>
                </span>
                <Arrow diagonal />
              </a>
            </div>
            <div className="desk-bottom">
              <span className="desk-rule" />
              <p>
                스토리에서 시작된 관심이
                <br />
                찾는 마음으로 이어지기를.
              </p>
            </div>
          </div>
        </section>

        <section className="report-strip" id="report" aria-labelledby="report-title">
          <div className="report-heading">
            <span className="kicker">제보 안내</span>
            <h2 id="report-title">
              떠오르는 기억이 <br />
              있다면.
            </h2>
          </div>
          <div className="report-content">
            <p>
              목격한 시간과 장소, 기억나는 특징을
              <br className="desktop-break" /> 공식 창구로 직접 전해주세요.
            </p>
            <div className="report-links">
              <a className="telephone" href="tel:182" aria-label="실종아동 찾기 182 전화 연결">
                <span className="phone-label">실종아동 찾기</span>
                <span className="phone-number">
                  182
                  <Arrow diagonal />
                </span>
              </a>
              <div className="report-secondary">
                <a href={officialUrl} target="_blank" rel="noreferrer">
                  안전Dream 방문 <Arrow diagonal />
                  <span className="sr-only"> (새 창)</span>
                </a>
                <p>
                  긴급한 상황은{' '}
                  <a href="tel:112" aria-label="긴급 신고 112 전화 연결">
                    112
                  </a>
                </p>
              </div>
            </div>
            <small>에카타는 제보를 대신 접수하지 않습니다.</small>
          </div>
        </section>

        <section className="colophon" aria-labelledby="name-title">
          <div className="name-note">
            <span className="kicker">이름에 담은 마음</span>
            <h2 id="name-title">에카타.</h2>
            <p>
              ‘애가 탄다’는 말에서 시작했습니다.
              <br />
              돌아오기를 기다리는 마음에 함께합니다.
            </p>
          </div>
          <div className="publication-note">
            <p>웰뉴스의 실종아동 찾기 캠페인을 지원합니다.</p>
            <a className="text-link" href={instagramUrl} target="_blank" rel="noreferrer">
              웰뉴스 Instagram <Arrow diagonal />
              <span className="sr-only"> (새 창)</span>
            </a>
            <button className="text-link" type="button" onClick={() => void copyAddress()}>
              에카타 주소 복사 <span aria-hidden="true">＋</span>
            </button>
            <output className="copy-status">{copyStatus}</output>
            {showAddress && (
              <input
                className="copy-address"
                aria-label="복사할 에카타 주소"
                readOnly
                value={campaignUrl}
                onFocus={(event) => event.target.select()}
              />
            )}
            <details>
              <summary>공식 정보와 캠페인 안내</summary>
              <p>
                현재는 공식 정보 연동 준비 단계로, 실종아동의 사진이나 사건 목록을 게시하지
                않습니다. 에카타는 웰뉴스가 운영하는 캠페인 지원 페이지이며 경찰청의 공식 사업이나
                제휴 기관이 아닙니다. 정보 확인과 제보는 안전Dream 또는 182를 이용해 주세요.
              </p>
            </details>
          </div>
        </section>
      </main>
      <footer className="footer page-width">
        <span>
          EKATA <span className="footer-separator">/</span> WELLKNEWS
        </span>
        <span>© {new Date().getFullYear()}</span>
        <a href="#main">
          위로 <span aria-hidden="true">↑</span>
        </a>
      </footer>
    </>
  )
}
