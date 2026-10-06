import { tone } from '../../data/constants'

export default function Pill({ label, tone: t }) {
  const [bg, fg] = tone(t)
  return (
    <span style={{ fontSize: 12, fontWeight: 500, padding: '2px 9px', borderRadius: 20, background: bg, color: fg, whiteSpace: 'nowrap' }}>{label}</span>
  )
}
