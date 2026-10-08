import { fmtNum as fmt } from '../../lib/data/core'
import useAdmin from '../../hooks/useAdmin'
import Card from '../common/Card'

const SEG_COLOR = { Guests: '#A6192E', Couples: '#C9A227', Businesses: '#1E5A4A' }

const W = 600, H = 210

// Sign ups per day (per hour for a single day) in the chosen period. chart: { series: { Guests: [...] }, labels }
export default function NewUsersChart({ chart }) {
  const { state, setState } = useAdmin()
  const { seg, range, city } = state
  const raw = (chart && chart.series[seg]) || []
  // A line needs two points.
  const pts = raw.length > 1 ? raw : raw.length === 1 ? [raw[0], raw[0]] : [0, 0]
  const labels = (chart && chart.labels) || []

  const max = Math.max(1, ...pts) * 1.12
  const step = W / (pts.length - 1)
  const line = pts.map((v, i) => (i ? 'L' : 'M') + (i * step).toFixed(1) + ' ' + (H - (v / max) * H).toFixed(1)).join(' ')
  const area = line + ' L' + W + ' ' + H + ' L0 ' + H + ' Z'
  const total = raw.reduce((a, b) => a + b, 0)
  const yLabels = [max, (max * 2) / 3, max / 3, 0].map((v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v))))
  const color = SEG_COLOR[seg]
  const sub = fmt(total) + ' new ' + seg.toLowerCase() + ' . ' + range.toLowerCase() + (city !== 'All cities' ? ' . ' + city : '')

  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>New users</div>
          <div style={{ fontSize: 12.5, color: '#8A8590' }}>{sub}</div>
        </div>
        <div style={{ display: 'flex', background: '#F7F4EF', borderRadius: 8, padding: 3 }}>
          {Object.keys(SEG_COLOR).map((s) => {
            const on = s === seg
            return (
              <div
                key={s}
                onClick={() => setState({ seg: s })}
                style={{ height: 28, padding: '0 12px', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, cursor: 'pointer', background: on ? '#fff' : 'transparent', boxShadow: on ? '0 1px 2px rgba(20,20,43,.12)' : 'none', color: on ? '#14142B' : '#6F6A78' }}
              >
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: SEG_COLOR[s] }} />
                {s}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '44px minmax(0,1fr)', gap: 6, marginTop: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 210, fontSize: 11.5, color: '#A8A29A', textAlign: 'right', paddingBottom: 2 }}>
          {yLabels.map((t, i) => <span key={i}>{t}</span>)}
        </div>
        <div style={{ position: 'relative', height: 210 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ borderTop: '1px dashed #EFEAE2' }} />
            <div style={{ borderTop: '1px dashed #EFEAE2' }} />
            <div style={{ borderTop: '1px dashed #EFEAE2' }} />
            <div style={{ borderTop: '1px solid #E4E0DA' }} />
          </div>
          <svg width="100%" height="210" viewBox="0 0 600 210" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
            <path d={area} fill={color} opacity=".12" />
            <path d={line} fill="none" stroke={color} strokeWidth="2.2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          </svg>
        </div>
        <div />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: '#A8A29A' }}>
          {labels.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </Card>
  )
}
