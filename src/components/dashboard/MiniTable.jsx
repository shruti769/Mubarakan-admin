import { tone } from '../../data/constants'

const ellipsis = { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }

/*
 * A short table on the dashboard with a "View all" link.
 * cols: [label, align]; rows: { go, cells: [{ t, fw, fg, al } | { pill: [label, tone] } | { link }] }
 */
export default function MiniTable({ title, cols, grid, rows, onAll }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E4E0DA', borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px' }}>
        <span style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{title}</span>
        <span onClick={onAll} style={{ fontSize: 13, fontWeight: 500, color: '#A6192E', cursor: 'pointer' }}>View all</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 10, padding: '8px 18px', background: '#FBF9F5', borderTop: '1px solid #EFEAE2', borderBottom: '1px solid #EFEAE2', fontSize: 12, color: '#8A8590', fontWeight: 500 }}>
        {cols.map(([t, al], i) => <span key={i} style={{ textAlign: al || 'left' }}>{t}</span>)}
      </div>
      {rows.map((r) => (
        <div key={r.key} className="hv-row" onClick={r.go} style={{ display: 'grid', gridTemplateColumns: grid, gap: 10, alignItems: 'center', padding: '9px 18px', borderBottom: '1px solid #F4F0E9', cursor: 'pointer', fontSize: 13.5 }}>
          {r.cells.map((c, i) => (
            <div key={i} style={{ minWidth: 0, textAlign: c.al || 'left' }}>
              {c.pill ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 500, padding: '2px 9px', borderRadius: 20, background: tone(c.pill[1])[0], color: tone(c.pill[1])[1], whiteSpace: 'nowrap' }}>{c.pill[0]}</span>
              ) : c.link ? (
                <span style={{ fontSize: 13, fontWeight: 500, color: '#A6192E' }}>{c.link}</span>
              ) : (
                <div style={{ ...ellipsis, fontWeight: c.fw || 400, color: c.fg || '#14142B' }}>{c.t}</div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
