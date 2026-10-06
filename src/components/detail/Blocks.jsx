import useAdmin from '../../hooks/useAdmin'
import Pill from '../common/Pill'
import Toggle from '../common/Toggle'

const MONO = "'JetBrains Mono',monospace"
const SANS = "'Poppins',sans-serif"

// Label and value pairs, three to a row. pairs: [label, value, monospace?]
export function KvBlock({ pairs }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
      {pairs.map(([k, v, mono]) => (
        <div key={k} style={{ padding: '12px 18px', borderBottom: '1px solid #F4F0E9' }}>
          <div style={{ fontSize: 12.5, color: '#8A8590' }}>{k}</div>
          <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 2, fontFamily: mono ? MONO : SANS }}>{v}</div>
        </div>
      ))}
    </div>
  )
}

/*
 * A small table. rows: array of cells, or { c: cells, go }.
 * A cell is a string, [label, tone] for a pill, or { t, fw, f } for styled text.
 */
export function TableBlock({ cols, grid, rows }) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 10, padding: '8px 18px', background: '#FBF9F5', borderBottom: '1px solid #EFEAE2', fontSize: 12, color: '#8A8590', fontWeight: 500 }}>
        {cols.map((t) => <span key={t}>{t}</span>)}
      </div>
      {rows.map((r, ri) => {
        const cells = r.c || r
        return (
          <div key={ri} onClick={r.go} style={{ display: 'grid', gridTemplateColumns: grid, gap: 10, alignItems: 'center', padding: '10px 18px', borderBottom: '1px solid #F4F0E9', fontSize: 13.5, cursor: r.go ? 'pointer' : 'default' }}>
            {cells.map((c, i) => (
              <div key={i} style={{ minWidth: 0 }}>
                {Array.isArray(c) ? (
                  <Pill label={c[0]} tone={c[1]} />
                ) : (
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: (typeof c === 'object' && c.fw) || 400, fontFamily: (typeof c === 'object' && c.f) || SANS }}>
                    {typeof c === 'object' ? c.t : c}
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      })}
    </>
  )
}

export function PhotosBlock({ photos }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(0,1fr))', gap: 6, padding: '14px 18px' }}>
      {photos.map((src, i) => (
        <img key={i} src={src} alt="" style={{ width: '100%', aspectRatio: '4 / 5', objectFit: 'cover', borderRadius: 8, display: 'block', background: '#F0EBE3' }} />
      ))}
    </div>
  )
}

// items: [when, what, dot colour]
export function TimelineBlock({ items }) {
  return (
    <div style={{ padding: '6px 18px' }}>
      {items.map(([at, t, c], i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '120px 12px minmax(0,1fr)', gap: 12, alignItems: 'center', padding: '8px 0' }}>
          <span style={{ fontSize: 12.5, color: '#8A8590' }}>{at}</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: c || '#D8CFBF' }} />
          <span style={{ fontSize: 13.5 }}>{t}</span>
        </div>
      ))}
    </div>
  )
}

// On/off settings that remember their state. items: [key, title, sub, on by default]
export function TogglesBlock({ items, scope }) {
  const { state, setState, toast } = useAdmin()
  return items.map(([key, t, s, def]) => {
    const k = scope + ':' + key
    const on = state.tg[k] ?? def
    return (
      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 18px', borderBottom: '1px solid #F4F0E9' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t}</div>
          <div style={{ fontSize: 12.5, color: '#8A8590' }}>{s}</div>
        </div>
        <Toggle
          on={on}
          onClick={() => {
            setState((st) => ({ tg: { ...st.tg, [k]: !on } }))
            toast(t + (on ? ' turned off' : ' turned on'))
          }}
        />
      </div>
    )
  })
}

// White card around one block, with an optional title bar.
export function BlockCard({ title, children }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E4E0DA', borderRadius: 12, overflow: 'hidden' }}>
      {title && <div style={{ padding: '13px 18px', fontSize: 14.5, fontWeight: 600, borderBottom: '1px solid #EFEAE2' }}>{title}</div>}
      {children}
    </div>
  )
}
