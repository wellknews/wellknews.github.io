/** Server-side, read-only connectivity check. Never run this in browser code. */
const id = process.env.SAFE182_ESNTL_ID
const key = process.env.SAFE182_AUTH_KEY

if (!id || !key) {
  console.error(
    'SAFE182_ESNTL_ID와 SAFE182_AUTH_KEY 환경변수가 필요합니다. 키를 소스에 적지 마세요.',
  )
  process.exitCode = 1
} else {
  try {
    const response = await fetch('https://www.safe182.go.kr/api/lcm/findChildList.do', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        esntlId: id,
        authKey: key,
        rowSize: '1',
        page: '1',
        'writngTrgetDscds[]': '010',
      }),
      signal: AbortSignal.timeout(15000),
      redirect: 'error',
    })
    if (!response.ok) throw new Error('HTTP failure')
    const data = await response.json()
    if (data.result !== '00' || !Array.isArray(data.list)) {
      throw new Error('Invalid API response')
    }
    // Do not log names, photos, addresses, keys, or raw error responses.
    console.log(
      '안전Dream 실종검색 API 인증 및 목록 응답 확인 성공. 사건 원문은 출력·저장하지 않았습니다.',
    )
  } catch {
    console.error(
      'API 확인 실패. 인증·호출 한도·네트워크·공식 응답 명세를 확인하세요. 원문은 기록하지 않습니다.',
    )
    process.exitCode = 1
  }
}
