import Card from '../components/common/Card'
import Icon from '../components/common/Icon'
import InvitesFunnel from '../components/dashboard/InvitesFunnel'
import MiniTable from '../components/dashboard/MiniTable'
import NewUsersChart from '../components/dashboard/NewUsersChart'
import { CITY_FACTOR, tone } from '../data/constants'
import { IC } from '../data/icons'
import { RECENT_ACTIVITY } from '../data/mock'
import { fmt, getEnquiries, getWeddings, pendingApplications } from '../data/selectors'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'

const VS = { Today: 'vs yesterday', 'Last 7 days': 'vs last week', 'Last 30 days': 'vs last month', 'This month': 'vs last month', Custom: 'vs previous period' }

const REVENUE = [['Single photo', 4.2, '#A6192E'], ['Before and after', 3.1, '#C9A227'], ['Product cards', 2.6, '#6E1218'], ['Open dates calendar', 2.4, '#1E5A4A'], ['Other ad types', 6.1, '#D8CFBF']]
const TOP_CITIES = [['Lahore', 412], ['Karachi', 268], ['London', 196], ['Delhi', 172], ['Islamabad', 121], ['Amritsar', 84]]

function StatCards({ f }) {
  const { state } = useAdmin()
  const { go } = useNavigation()
  // [label, value (null = revenue), change, page it opens]
  const stats = [
    ['Total users', 248610 * f, '+2.1%', 'users'],
    ['New users today', 1204 * f, '+12%', 'users'],
    ['Live weddings', Math.max(1, Math.round(37 * f)), '+8%', 'weddings'],
    ['Photos today', 96412 * f, '↓ 4%', 'weddings'],
    ['Enquiries, 7 days', 1936 * f, '+9%', 'enquiries'],
    ['Revenue, October', null, '+16%', 'payments'],
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))', gap: 12 }}>
      {stats.map(([l, v, d, page]) => {
        const down = d.startsWith('↓')
        return (
          <Card key={l} className="hv-card" onClick={() => go(page)} style={{ padding: '14px 16px 12px', cursor: 'pointer' }}>
            <div style={{ fontSize: 13, color: '#6F6A78', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l}</div>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 4, whiteSpace: 'nowrap' }}>{v === null ? 'PKR ' + (18.4 * f).toFixed(1) + 'M' : fmt(v)}</div>
            <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.4 }}>
              <span style={{ color: down ? '#A6192E' : '#1E5A4A', fontWeight: 600 }}>{(down ? '↓' : '↑') + ' ' + d.replace('↓ ', '−')}</span>{' '}
              <span style={{ color: '#8A8590' }}>{VS[state.range]}</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function NeedsAttention() {
  const { state, can, lset, toast } = useAdmin()
  const { go } = useNavigation()
  // [label, count, link text, action, dot colour, page needed to see it]
  const items = [
    ['Posts to review', 214 - Object.keys(state.rvDone).length, 'Review', () => go('review'), '#A6192E', 'review'],
    ['Businesses to approve', pendingApplications(state), 'Open', () => { lset('businesses', { st: 'Waiting for approval', pg: 0 }); go('businesses') }, '#C9A227', 'businesses'],
    ['Data deletion requests', 6 - Object.keys(state.reqDone).length, 'Open', () => go('settings', { setTab: 'privacy' }), '#C9A227', 'settings'],
    ['Invites not delivered', 112, 'Resend', () => go('messages'), '#C9A227', 'messages'],
    ['Photos not processed', 6, 'Retry', () => toast('Trying those 6 photos again'), '#8A8590', 'dash'],
  ].filter((a) => a[1] > 0 && can(a[5]))

  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Needs attention</div>
      {items.map(([t, n, link, run, c], i) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i ? '1px solid #F4F0E9' : 'none' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          <span style={{ flex: 1, fontSize: 13.5 }}>{t}</span>
          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 34, textAlign: 'right' }}>{n}</span>
          <span onClick={run} style={{ fontSize: 13, fontWeight: 500, color: '#A6192E', cursor: 'pointer', width: 58, textAlign: 'right' }}>{link}</span>
        </div>
      ))}
    </Card>
  )
}

// Donut slices: each circle's dash covers its share, offset by the shares before it.
const REVENUE_TOTAL = REVENUE.reduce((a, b) => a + b[1], 0)
const DONUT = REVENUE.map(([t, v, c], i) => {
  const p = (v / REVENUE_TOTAL) * 100
  const before = REVENUE.slice(0, i).reduce((a, b) => a + (b[1] / REVENUE_TOTAL) * 100, 0)
  return { t, c, p: Math.round(p) + '%', da: p.toFixed(2) + ' ' + (100 - p).toFixed(2), off: (-before).toFixed(2) }
})

function RevenueDonut({ f }) {
  const parts = DONUT
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>Revenue by ad type</div>
      <div style={{ fontSize: 12.5, color: '#8A8590' }}>This month, in PKR</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
        <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
          <svg width="150" height="150" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="#F4F0E9" strokeWidth="6" />
            {parts.map((d) => <circle key={d.t} cx="21" cy="21" r="15.9" fill="none" stroke={d.c} strokeWidth="6" strokeDasharray={d.da} strokeDashoffset={d.off} />)}
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#8A8590', letterSpacing: 0.3 }}>PKR</div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1 }}>{(18.4 * f).toFixed(1) + 'M'}</div>
            <div style={{ fontSize: 11.5, color: '#8A8590' }}>total</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {parts.map((d) => (
            <div key={d.t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: d.c, flexShrink: 0 }} />
              <span style={{ flex: 1, color: '#3d3a4a' }}>{d.t}</span>
              <span style={{ fontWeight: 600 }}>{d.p}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function TopCities() {
  const { state } = useAdmin()
  const max = TOP_CITIES[0][1]
  const color = (c, i) => (state.city === c || (state.city === 'All cities' && i === 0) ? '#A6192E' : '#E6D3B0')
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>Top cities</div>
      <div style={{ fontSize: 12.5, color: '#8A8590' }}>Weddings in the selected period</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 132, marginTop: 16 }}>
        {TOP_CITIES.map(([c, v], i) => (
          <div key={c} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
            <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', marginBottom: 4 }}>{v}</div>
            <div style={{ height: Math.round((v / max) * 100) + '%', borderRadius: '5px 5px 2px 2px', background: color(c, i) }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        {TOP_CITIES.map(([c]) => (
          <div key={c} style={{ flex: 1, textAlign: 'center', fontSize: 11.5, color: '#6F6A78', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c}</div>
        ))}
      </div>
    </Card>
  )
}

function RecentActivity() {
  return (
    <Card style={{ padding: '14px 18px', marginTop: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Recent activity</div>
      {RECENT_ACTIVITY.map(([who, t, at, icon, tn], i) => {
        const [bg, fg] = tone(tn)
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '22px minmax(0,1fr) auto', gap: 10, alignItems: 'center', padding: '8px 0', borderTop: i ? '1px solid #F4F0E9' : 'none' }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={IC[icon]} size={11} stroke={fg} sw={2.4} />
            </span>
            <span style={{ fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <b style={{ fontWeight: 600 }}>{who}</b> {t}
            </span>
            <span style={{ fontSize: 12.5, color: '#A8A29A', whiteSpace: 'nowrap' }}>{at}</span>
          </div>
        )
      })}
    </Card>
  )
}

export default function Dashboard() {
  const { state } = useAdmin()
  const { go, open } = useNavigation()
  const f = CITY_FACTOR[state.city]
  const cityOk = (c) => state.city === 'All cities' || String(c).includes(state.city)

  const weddings = getWeddings().filter((w) => cityOk(w.city) && w.st[0] !== 'Draft').slice(0, 6)
  const enquiries = getEnquiries().filter((e) => cityOk(e.city)).slice(0, 6)

  return (
    <>
      <StatCards f={f} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.65fr) minmax(0,1fr)', gap: 12, marginTop: 12 }}>
        <NewUsersChart factor={f} />
        <InvitesFunnel factor={f} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, marginTop: 12 }}>
        <NeedsAttention />
        <RevenueDonut f={f} />
        <TopCities />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12, marginTop: 12 }}>
        <MiniTable
          title="Live weddings"
          cols={[['Couple'], ['City'], ['Date'], ['Joined', 'right'], ['Photos', 'right'], ['Status'], ['', 'right']]}
          grid="minmax(0,1.6fr) minmax(0,.9fr) minmax(0,1.3fr) minmax(0,.7fr) minmax(0,.7fr) minmax(0,.9fr) 40px"
          onAll={() => go('weddings')}
          rows={weddings.map((w) => ({
            key: w.id,
            go: () => open('wedding', w.id),
            cells: [
              { t: w.name, fw: 600 }, { t: w.city }, { t: w.dates, fg: '#6F6A78' },
              { t: w.invited ? w.joined + ' / ' + w.invited : '—', al: 'right' }, { t: w.photos, al: 'right' },
              { pill: w.st }, { link: 'Open', al: 'right' },
            ],
          }))}
        />
        <MiniTable
          title="Latest enquiries"
          cols={[['Customer'], ['Business'], ['Category'], ['Date'], ['Status']]}
          grid="minmax(0,1.2fr) minmax(0,1.5fr) minmax(0,1.1fr) minmax(0,.9fr) minmax(0,.8fr)"
          onAll={() => go('enquiries')}
          rows={enquiries.map((e) => ({
            key: e.id,
            go: () => open('enquiry', e.id),
            cells: [{ t: e.cust, fw: 600 }, { t: e.biz }, { t: e.cat, fg: '#6F6A78' }, { t: e.day, fg: '#6F6A78' }, { pill: e.st }],
          }))}
        />
      </div>

      <RecentActivity />
    </>
  )
}
