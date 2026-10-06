import Pill from '../common/Pill'

const ellipsis = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }

/*
 * One table cell. `value` depends on `type`:
 *   person: [name, sub, photo url, sub in monospace?]   pill: [label, tone]
 *   text: string or [main, sub]                         code / num: string
 */
export default function Cell({ type, value: v }) {
  if (type === 'person') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <img src={v[2]} alt="" style={{ width: 32, height: 36, borderRadius: '16px 16px 6px 6px', objectFit: 'cover', flexShrink: 0, background: '#F0EBE3' }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, ...ellipsis }}>{v[0]}</div>
          <div style={{ fontSize: 12, color: '#8A8590', ...ellipsis, fontFamily: v[3] ? "'JetBrains Mono',monospace" : "'Poppins',sans-serif" }}>{v[1]}</div>
        </div>
      </div>
    )
  }
  if (type === 'pill') return <Pill label={v[0]} tone={v[1]} />
  if (type === 'code') return <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, whiteSpace: 'nowrap' }}>{v}</span>
  if (type === 'num') return <span style={{ fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap' }}>{v}</span>
  const [main, sub] = Array.isArray(v) ? v : [v]
  return (
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: 13.5, ...ellipsis }}>{main}</div>
      {sub && <div style={{ fontSize: 12, color: '#8A8590', ...ellipsis }}>{sub}</div>}
    </div>
  )
}
