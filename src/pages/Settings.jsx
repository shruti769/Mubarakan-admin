import Card from '../components/common/Card'
import Toggle from '../components/common/Toggle'
import { ROLES } from '../data/constants'
import { WEDDING_EVENTS } from '../data/mock'
import useAdmin from '../hooks/useAdmin'

const TABS = [['team', 'Team and roles'], ['events', 'Wedding events'], ['app', 'App features and photos'], ['privacy', 'Privacy and data']]

const TEAM = [
  ['Hamza Qureshi', 'Owner . Lahore', 'Active now'], ['Mahnoor Baig', 'Operations . Lahore', '4 min ago'], ['Bilal Saeed', 'Operations . Karachi', '1 hour ago'],
  ['Usman Tariq', 'Sales . Lahore', '12 min ago'], ['Areeba Siddiqui', 'Support . Islamabad', '26 min ago'], ['Kamran Shah', 'Finance . London', 'Yesterday'],
]

const DATA_REQUESTS = [
  ['r1', 'Faiza Rehman', 'Delete my face data . must be done by 1 Nov'], ['r2', 'Omar Abbasi', 'Send me my data . must be done by 31 Oct'],
  ['r3', 'Rohan Mehta', 'Delete my account . must be done by 28 Oct'], ['r4', 'Imran Sheikh', 'Delete my face data . must be done by 4 Nov'],
  ['r5', 'Mehreen Javed', 'Delete my face data . must be done by 24 Oct'], ['r6', 'Kiran Sandhu', 'Send me my data . must be done by 20 Oct'],
]

// A settings row shows either a value chip or a switch.
const row = (t, s, v) => ({ t, s, v })
const tog = (k, t, s, def) => ({ t, s, tog: k, def })

function blocksFor(tab, state) {
  if (tab === 'team') {
    return [
      { title: 'Team', sub: 'People who can use this admin', rows: TEAM.map((r) => row(...r)) },
      { title: 'Roles', sub: 'What each role can see', rows: Object.keys(ROLES).map((k) => row(k, ROLES[k].desc, ROLES[k].pages.split(' ').length + ' sections')) },
    ]
  }
  if (tab === 'events') {
    return [{ title: 'Wedding events', sub: 'Events couples can choose when they create a wedding', rows: WEDDING_EVENTS.map((f) => tog('fn' + f[0], f[0], f[1] + ' . usually ' + f[3], f[6])) }]
  }
  if (tab === 'app') {
    return [
      {
        title: 'App features', sub: 'Turn features on or off for everyone',
        rows: [
          tog('reels', 'Reels', 'Short videos in the app', true), tog('explore', 'Explore', 'Discover weddings and businesses', true),
          tog('faces', 'Find yourself in photos', 'Groups photos by face, only for people who turn it on', true), tog('captions', 'Suggested captions', 'Suggests a caption when someone uploads', false),
          tog('video', 'Highlight video after the wedding', 'Made the day after the last event', true), tog('urdu', 'Urdu app layout', 'Right to left, still being tested', false),
        ],
      },
      {
        title: 'Photos', sub: 'How photos are stored',
        rows: [
          row('Stories disappear after', 'For everyone except the person who posted', '24 hours'),
          row('Finished weddings move to cheaper storage after', 'Photos still open for families', '90 days'),
          row('Photo features cost this month', 'Sorting, faces and highlight videos', 'USD 3,840 of 5,000'),
        ],
      },
    ]
  }
  return [
    { title: 'Data requests', sub: 'People who asked us to delete or send them their data', rows: DATA_REQUESTS.map((r) => row(r[1], r[2], state.reqDone[r[0]] ? 'Done' : 'To do')) },
    { title: 'Policies', sub: 'What people agree to when they join', rows: [row('Terms of use', 'Last changed 2 August 2026', 'Version 2.8'), row('Privacy policy', 'Last changed 18 September 2026', 'Version 3.3')] },
  ]
}

export default function Settings() {
  const { state, setState, toast } = useAdmin()
  const tab = state.setTab || 'team'

  const flip = (r, on) => {
    setState((s) => ({ tg: { ...s.tg, ['s:' + r.tog]: !on } }))
    toast(r.t + (on ? ' turned off' : ' turned on'))
  }

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
        {blocksFor(tab, state).map((b) => (
          <Card key={b.title} style={{ overflow: 'hidden' }}>
            <div style={{ padding: '13px 18px', borderBottom: '1px solid #EFEAE2' }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{b.title}</div>
              <div style={{ fontSize: 12.5, color: '#8A8590' }}>{b.sub}</div>
            </div>
            {b.rows.map((r) => {
              const on = r.tog ? state.tg['s:' + r.tog] ?? r.def : false
              return (
                <div key={r.t} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 18px', borderBottom: '1px solid #F4F0E9' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.t}</div>
                    <div style={{ fontSize: 12.5, color: '#8A8590' }}>{r.s}</div>
                  </div>
                  {r.tog ? (
                    <Toggle on={on} onClick={() => flip(r, on)} />
                  ) : (
                    <span style={{ fontSize: 13, color: '#3d3a4a', background: '#F7F4EF', borderRadius: 6, padding: '3px 9px' }}>{r.v}</span>
                  )}
                </div>
              )
            })}
          </Card>
        ))}
      </div>
    </div>
  )
}
