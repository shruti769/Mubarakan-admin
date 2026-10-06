import { fmt } from '../../data/selectors'
import useAdmin from '../../hooks/useAdmin'
import Card from '../common/Card'

const SEG_COLOR = { Guests: '#A6192E', Couples: '#C9A227', Businesses: '#1E5A4A' }
const POINTS = { Today: 12, 'Last 7 days': 7, 'Last 30 days': 30, 'This month': 5, Custom: 8 }

// Daily sign ups for the last 30 days, per kind of user.
const DAILY = {
  Guests: [820, 860, 910, 1010, 1240, 1380, 990, 880, 940, 1020, 1110, 1310, 1460, 1204, 1150, 1220, 1290, 1340, 1180, 1240, 1300, 1380, 1420, 1500, 1360, 1280, 1330, 1410, 1460, 1204],
  Couples: [180, 170, 190, 210, 230, 260, 200, 190, 200, 210, 220, 250, 270, 236, 220, 240, 250, 260, 230, 240, 250, 270, 280, 300, 260, 240, 250, 270, 280, 236],
  Businesses: [12, 9, 14, 11, 16, 18, 10, 12, 13, 9, 15, 17, 19, 14, 12, 13, 15, 16, 11, 14, 15, 16, 18, 20, 15, 13, 14, 16, 17, 14],
}
const HOURLY = [3, 2, 1, 1, 2, 5, 9, 14, 18, 22, 26, 24]
const HOURLY_SCALE = { Guests: 4, Couples: 1, Businesses: 0.08 }

const W = 600, H = 210

function xLabels(range, n) {
  if (range === 'Today') return ['8am', '10am', '12pm', '2pm', '4pm', '6pm', '8pm']
  if (n >= 30) return ['6 Sep', '12 Sep', '18 Sep', '24 Sep', '30 Sep', '5 Oct']
  if (n === 7) return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  if (n === 5) return ['1 Oct', '2 Oct', '3 Oct', '4 Oct', '5 Oct']
  return ['28 Sep', '30 Sep', '2 Oct', '4 Oct', '5 Oct']
}

export default function NewUsersChart({ factor }) {
  const { state, setState } = useAdmin()
  const { seg, range, city } = state
  const n = POINTS[range] || 7
  const pts = (range === 'Today' ? HOURLY.map((v) => v * HOURLY_SCALE[seg]) : DAILY[seg].slice(-n)).map((v) => v * factor)

  const max = Math.max(...pts) * 1.12
  const step = W / (pts.length - 1)
  const line = pts.map((v, i) => (i ? 'L' : 'M') + (i * step).toFixed(1) + ' ' + (H - (v / max) * H).toFixed(1)).join(' ')
  const area = line + ' L' + W + ' ' + H + ' L0 ' + H + ' Z'
  const total = pts.reduce((a, b) => a + b, 0)
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
          {xLabels(range, n).map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </Card>
  )
}
