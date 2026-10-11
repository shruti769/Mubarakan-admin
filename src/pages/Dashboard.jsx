import Card from '../components/common/Card'
import InvitesFunnel from '../components/dashboard/InvitesFunnel'
import MiniTable from '../components/dashboard/MiniTable'
import NewUsersChart from '../components/dashboard/NewUsersChart'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'
import { fmtNum as fmt } from '../lib/data/core'
import { loadDashboard } from '../lib/data/dashboard'
import useLoad from '../lib/useLoad'

const VS = { Today: 'vs yesterday', 'Last 7 days': 'vs last week', 'Last 30 days': 'vs last month', 'This month': 'vs last month', Custom: 'vs previous period' }

// The period in a card label: "today", "last 7 days", "this month", "28/09 to 05/10".
const shortDate = (d) => d.slice(5).split('-').reverse().join('/')
const periodText = (range, custom) => (range === 'Custom' ? shortDate(custom.from) + ' to ' + shortDate(custom.to) : range.toLowerCase())

// Revenue is not in the backend: the ad types stay as labels, with no amounts.
const REVENUE = [['Single photo', '#A6192E'], ['Before and after', '#C9A227'], ['Product cards', '#6E1218'], ['Open dates calendar', '#1E5A4A'], ['Other ad types', '#D8CFBF']]

function StatCards({ s }) {
  const { state } = useAdmin()
  const { go } = useNavigation()
  const period = periodText(state.range, state.custom)
  const today = state.range === 'Today'
  // [label, value ('—' when unknown), change or null, page it opens]
  const stats = [
    ['Total users', s ? fmt(s.total) : '—', s && s.totalChange, 'users'],
    [today ? 'New users today' : 'New users, ' + period, s ? fmt(s.fresh) : '—', s && s.freshChange, 'users'],
    ['Live weddings', s ? fmt(s.live) : '—', s && s.liveChange, 'weddings'],
    [today ? 'Photos today' : 'Photos, ' + period, s ? fmt(s.photos) : '—', s && s.photosChange, 'weddings'],
    ['Enquiries, ' + period, s ? fmt(s.leads) : '—', s && s.leadsChange, 'enquiries'],
    ['Revenue, ' + new Date().toLocaleString('en-US', { month: 'long' }), '—', null, 'payments'],
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px,1fr))', gap: 12 }}>
      {stats.map(([l, v, d, page]) => {
        const down = !!d && d.startsWith('↓')
        return (
          <Card key={l} className="hv-card" onClick={() => go(page)} style={{ padding: '14px 16px 12px', cursor: 'pointer' }}>
            <div style={{ fontSize: 13, color: '#6F6A78', lineHeight: 1.35, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l}</div>
            <div style={{ fontSize: 28, fontWeight: 600, letterSpacing: -0.5, lineHeight: 1.1, marginTop: 4, whiteSpace: 'nowrap' }}>{v}</div>
            <div style={{ fontSize: 12.5, marginTop: 4, lineHeight: 1.4 }}>
              {d ? (
                <span style={{ color: down ? '#A6192E' : '#1E5A4A', fontWeight: 600 }}>{(down ? '↓' : '↑') + ' ' + d.replace('↓ ', '−')}</span>
              ) : (
                <span style={{ color: '#8A8590', fontWeight: 600 }}>—</span>
              )}{' '}
              <span style={{ color: '#8A8590' }}>{VS[state.range]}</span>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function NeedsAttention({ a }) {
  const { can } = useAdmin()
  const { go } = useNavigation()
  // [label, count (null = not in the backend, hidden), link text, action, dot colour, page needed to see it]
  const items = [
    ['Posts to review', a ? a.review : null, 'Review', () => go('review'), '#A6192E', 'review'],
    ['Businesses to approve', null, 'Open', () => go('businesses'), '#C9A227', 'businesses'],
    ['Data deletion requests', a ? a.requests : null, 'Open', () => go('settings', { setTab: 'privacy' }), '#C9A227', 'settings'],
    ['Invites not delivered', null, 'Resend', () => go('messages'), '#C9A227', 'messages'],
    ['Photos not processed', null, 'Retry', () => {}, '#8A8590', 'dash'],
  ].filter((x) => x[1] > 0 && can(x[5]))

  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Needs attention</div>
      {items.map(([t, n, link, run, c], i) => (
        <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i ? '1px solid #F4F0E9' : 'none' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
          <span style={{ flex: 1, fontSize: 13.5 }}>{t}</span>
          <span style={{ fontSize: 14, fontWeight: 600, minWidth: 34, textAlign: 'right' }}>{fmt(n)}</span>
          <span onClick={run} style={{ fontSize: 13, fontWeight: 500, color: '#A6192E', cursor: 'pointer', width: 58, textAlign: 'right' }}>{link}</span>
        </div>
      ))}
    </Card>  
  )
}      

function RevenueDonut() {
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>Revenue by ad type</div> 
      <div style={{ fontSize: 12.5, color: '#8A8590' }}>This month, in PKR</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12 }}>
        <div style={{ position: 'relative', width: 150, height: 150, flexShrink: 0 }}>
          <svg width="150" height="150" viewBox="0 0 42 42" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="21" cy="21" r="15.9" fill="none" stroke="#F4F0E9" strokeWidth="6" />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#8A8590', letterSpacing: 0.3 }}>PKR</div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1 }}>—</div>
            <div style={{ fontSize: 11.5, color: '#8A8590' }}>total</div>
          </div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          {REVENUE.map(([t, c]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5 }}>
              <span style={{ width: 9, height: 9, borderRadius: 2, background: c, flexShrink: 0 }} />
              <span style={{ flex: 1, color: '#3d3a4a' }}>{t}</span>
              <span style={{ fontWeight: 600 }}>—</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

function TopCities({ cities }) {
  const { state } = useAdmin()
  const list = cities || []
  const max = list.length ? list[0][1] : 1
  const color = (c, i) => (state.city === c || (state.city === 'All cities' && i === 0) ? '#A6192E' : '#E6D3B0')
  return (
    <Card style={{ padding: '16px 18px' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>Top cities</div>
      <div style={{ fontSize: 12.5, color: '#8A8590' }}>Weddings in the selected period</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 132, marginTop: 16 }}>
        {list.map(([c, v], i) => (
          <div key={c} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
            <div style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', marginBottom: 4 }}>{v}</div>
            <div style={{ height: Math.round((v / max) * 100) + '%', borderRadius: '5px 5px 2px 2px', background: color(c, i) }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        {list.map(([c]) => (
          <div key={c} style={{ flex: 1, textAlign: 'center', fontSize: 11.5, color: '#6F6A78', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c}</div>
        ))}
      </div>
    </Card>
  )
}

// There is no activity log in the backend, so this stays empty.
function RecentActivity() {
  return (
    <Card style={{ padding: '14px 18px', marginTop: 12 }}>
      <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Recent activity</div>
      <div style={{ padding: '8px 0', fontSize: 13, color: '#8A8590' }}>—</div>
    </Card>
  )
}

export default function Dashboard() {
  const { state } = useAdmin()
  const { go, open } = useNavigation()
  const { range, custom, city } = state
  const { data } = useLoad(() => loadDashboard({ range, custom, city }), [range, custom.from, custom.to, city])
  const d = data || {}

  return (
    <>
      <StatCards s={d.stats} />

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.65fr) minmax(0,1fr)', gap: 12, marginTop: 12 }}>
        <NewUsersChart chart={d.chart} />
        <InvitesFunnel funnel={d.funnel} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12, marginTop: 12 }}>
        <NeedsAttention a={d.attention} />
        <RevenueDonut />
        <TopCities cities={d.cities} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 12, marginTop: 12 }}>
        <MiniTable
          title="Live weddings"
          cols={[['Couple'], ['City'], ['Date'], ['Joined', 'right'], ['Photos', 'right'], ['Status'], ['', 'right']]}
          grid="minmax(0,1.6fr) minmax(0,.9fr) minmax(0,1.3fr) minmax(0,.7fr) minmax(0,.7fr) minmax(0,.9fr) 40px"
          onAll={() => go('weddings')}
          rows={(d.weddings || []).map((w) => ({
            key: w.id,
            go: () => open('wedding', w.id),
            cells: [
              { t: w.name, fw: 600 }, { t: w.city }, { t: w.dates, fg: '#6F6A78' },
              { t: w.invited ? w.joined + ' / ' + w.invited : w.joined ? String(w.joined) : '—', al: 'right' }, { t: w.photos, al: 'right' },
              { pill: w.st }, { link: 'Open', al: 'right' },
            ],
          }))}
        />
        <MiniTable
          title="Latest enquiries"
          cols={[['Customer'], ['Business'], ['Category'], ['Date'], ['Status']]}
          grid="minmax(0,1.2fr) minmax(0,1.5fr) minmax(0,1.1fr) minmax(0,.9fr) minmax(0,.8fr)"
          onAll={() => go('enquiries')}
          rows={(d.enquiries || []).map((e) => ({
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
