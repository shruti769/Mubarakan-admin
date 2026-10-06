export default function Card({ children, style, className, onClick }) {
  return (
    <div className={className} onClick={onClick} style={{ background: '#fff', border: '1px solid #E4E0DA', borderRadius: 12, ...style }}>
      {children}
    </div>
  )
}

// A small number tile: label on top, big value below, optional change beside it.
export function StatTile({ label, value, delta, deltaColor, padding = '13px 16px' }) {
  return (
    <Card style={{ padding }}>
      <div style={{ fontSize: 13, color: '#6F6A78' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 2 }}>
        <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1.15 }}>{value}</span>
        {delta ? <span style={{ fontSize: 12, fontWeight: 500, color: deltaColor }}>{delta}</span> : null}
      </div>
    </Card>
  )
}
