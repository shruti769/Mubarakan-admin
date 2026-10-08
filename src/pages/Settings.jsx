import Card from '../components/common/Card'
import Toggle from '../components/common/Toggle'
import { ROLES } from '../data/constants'
import useAdmin from '../hooks/useAdmin'
import { advanceDataRequest, loadPrivacyRequests } from '../lib/data/settings'
import useLoad from '../lib/useLoad'

const TABS = [['team', 'Team and roles'], ['events', 'Wedding events'], ['app', 'App features and photos'], ['privacy', 'Privacy and data']]

// A settings row shows either a value chip or a switch. `run` makes the chip a button.
const row = (t, s, v, extra) => ({ t, s, v, ...extra })

// Not in the backend: the list of admins (only the signed in admin is known), the wedding events
// catalog, feature switches, photo storage rules and costs, and policy versions.
function blocksFor(tab, me, requests, runRequest) {
  if (tab === 'team') {
    return [
      { title: 'Team', sub: 'People who can use this admin', rows: me ? [row(me.name, me.role + ' . ' + me.email, 'Active now')] : [] },
      { title: 'Roles', sub: 'What each role can see', rows: Object.keys(ROLES).map((k) => row(k, ROLES[k].desc, ROLES[k].pages.split(' ').length + ' sections')) },
    ]
  }
  if (tab === 'events') {
    return [{ title: 'Wedding events', sub: 'Events couples can choose when they create a wedding', rows: [], empty: 'Not connected yet.' }]
  }
  if (tab === 'app') {
    return [
      { title: 'App features', sub: 'Turn features on or off for everyone', rows: [], empty: 'Not connected yet.' },
      {
        title: 'Photos', sub: 'How photos are stored',
        rows: [
          row('Stories disappear after', 'For everyone except the person who posted', '24 hours'),
          row('Finished weddings move to cheaper storage after', 'Photos still open for families', '—'),
          row('Photo features cost this month', 'Sorting, faces and highlight videos', '—'),
        ],
      },
    ]
  }
  return [
    {
      title: 'Data requests', sub: 'People who asked us to delete or send them their data',
      rows: (requests || []).map((r) => row(r.name, r.what, r.chip, { key: r.id, run: r.next ? () => runRequest(r) : null })),
    },
    { title: 'Policies', sub: 'What people agree to when they join', rows: [row('Terms of use', 'Last changed —', '—'), row('Privacy policy', 'Last changed —', '—')] },
  ]
}

export default function Settings() {
  const { state, setState, toast, ask, auth } = useAdmin()
  const tab = state.setTab || 'team'
  const { data: requests, reload } = useLoad(loadPrivacyRequests, [])

  const flip = () => toast('Feature switches are not connected yet')

  // A data request moves from To do, to Ready (export prepared), to Done (link sent).
  const runRequest = (r) =>
    ask({
      title: r.next === 'ready' ? 'Mark ' + r.name + '’s data as ready?' : 'Mark ' + r.name + '’s data as sent?',
      body: r.next === 'ready' ? 'Do this once their copy of the data is prepared.' : 'Do this once the link to their data has been emailed to them.',
      label: r.next === 'ready' ? 'Mark as ready' : 'Mark as sent',
      then: async () => {
        const { error } = await advanceDataRequest(r)
        if (error) return toast('Could not save: ' + error.message)
        toast(r.name + (r.next === 'ready' ? '’s data is marked as ready' : '’s data is marked as sent'))
        reload()
      },
    })

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px minmax(0,1fr)', gap: 16, alignItems: 'start' }}>
      <Card style={{ padding: 6 }}>
        {TABS.map(([key, t]) => {
          const on = key === tab
          return (
            <div key={key} onClick={() => setState({ setTab: key })} style={{ padding: '9px 12px', borderRadius: 7, fontSize: 13.5, fontWeight: on ? 600 : 400, cursor: 'pointer', background: on ? '#F7F1E7' : 'transparent', color: on ? '#A6192E' : '#3d3a4a' }}>
              {t}
            </div>
          )
        })}
      </Card>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {blocksFor(tab, auth.me, requests, runRequest).map((b) => (
          <Card key={b.title} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid #EFEAE2' }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{b.title}</div>
              <div style={{ fontSize: 12.5, color: '#8A8590' }}>{b.sub}</div>
            </div>
            {b.rows.map((r) => {
              const on = r.tog ? state.tg['s:' + r.tog] ?? r.def : false
              return (
                <div key={r.key || r.t} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 18px', borderBottom: '1px solid #F4F0E9' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.t}</div>
                    <div style={{ fontSize: 12.5, color: '#8A8590' }}>{r.s}</div>
                  </div>
                  {r.tog ? (
                    <Toggle on={on} onClick={flip} />
                  ) : (
                    <span onClick={r.run || undefined} style={{ fontSize: 13, color: '#3d3a4a', background: '#F7F4EF', borderRadius: 6, padding: '3px 9px', cursor: r.run ? 'pointer' : 'default' }}>{r.v}</span>
                  )}
                </div>
              )
            })}
            {!b.rows.length && <div style={{ padding: '22px 18px', fontSize: 13, color: '#8A8590' }}>{b.empty || 'Nothing here yet.'}</div>}
          </Card>
        ))}
      </div>
    </div>
  )
}
