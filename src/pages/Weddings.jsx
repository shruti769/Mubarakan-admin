import DataList from '../components/list/DataList'
import { face } from '../data/images'
import useActions from '../hooks/useActions'
import useNavigation from '../hooks/useNavigation'
import { fmtNum } from '../lib/data/core'
import { loadWeddings } from '../lib/data/weddings'
import useLoad from '../lib/useLoad'

const thisMonth = () => {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0')
}

export default function Weddings() {
  const { open } = useNavigation()
  const { weddingAction } = useActions()
  const { data, error, reload } = useLoad(loadWeddings, [])
  const rows = data || []

  const month = thisMonth()
  const invited = rows.reduce((a, r) => a + r.invited, 0)
  const withApp = rows.reduce((a, r) => a + r.withApp, 0)

  return (
    <DataList
      listKey="weddings"
      cfg={{
        sub: error ? 'Could not load weddings: ' + error : 'Every wedding created on Mubarakan.', noun: 'weddings', one: 'wedding', ph: 'Search by couple or wedding code',
        rows, search: (r) => r.name + r.code + r.venue,
        stats: data
          ? [
              ['Total weddings', fmtNum(rows.length), ''],
              ['Live now', fmtNum(rows.filter((r) => r.st[0] === 'Live').length), ''],
              ['Created this month', fmtNum(rows.filter((r) => String(r.raw.created_at).slice(0, 7) === month).length), ''],
              ['Guests who downloaded the app', invited ? ((withApp / invited) * 100).toFixed(1) + '%' : '—', ''],
            ]
          : [['Total weddings', '—', ''], ['Live now', '—', ''], ['Created this month', '—', ''], ['Guests who downloaded the app', '—', '']],
        cols: [
          { key: 'name', label: 'Wedding', type: 'person', w: '2fr', sort: (r) => r.name, value: (r) => [r.name, r.code, face(r.img, 96), 1] },
          { key: 'dates', label: 'Dates', type: 'text', w: '1.3fr', sort: (r) => r.starts, value: (r) => r.dates },
          { key: 'city', label: 'Place', type: 'text', w: '1.3fr', sort: (r) => r.city, value: (r) => [r.city, r.venueName] },
          { key: 'joined', label: 'Guests joined', type: 'num', w: '.9fr', sort: (r) => r.joined, value: (r) => (r.invited ? r.joined + ' of ' + r.invited : r.joined ? String(r.joined) : '—') },
          { key: 'photos', label: 'Photos', type: 'num', w: '.7fr', sort: (r) => r.photosN, value: (r) => r.photos },
          { key: 'st', label: 'Status', type: 'pill', w: '.8fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [
          { label: 'Show on home feed', off: 'Showing weddings on the home feed is not connected yet' },
          { label: 'Export', off: 'Exporting weddings is not connected yet' },
          { label: 'Lock', off: 'Locking weddings is not connected yet', danger: 1 },
        ],
        menu: (r) => [
          { label: 'Open wedding', run: () => open('wedding', r.id) },
          { label: 'Show on home feed', run: () => weddingAction('feature', r) },
          { label: 'Remind guests who have not replied', run: () => weddingAction('remind', r) },
          { label: 'Lock wedding', run: () => weddingAction('lock', r), danger: 1 },
          { label: 'Delete wedding', run: () => weddingAction('del', r, reload), danger: 1 },
        ],
        open: (r) => open('wedding', r.id),
      }}
    />
  )
}
