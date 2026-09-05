export function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}
export function Publisher() {
  return (
    <span className="publisher">
      <img src="/logo.svg" width="28" height="28" alt="" />
      <span>WELLKNEWS</span>
    </span>
  )
}
