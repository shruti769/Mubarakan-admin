import DataList from '../components/list/DataList'
import { face } from '../data/images'
import { getWeddings, num } from '../data/selectors'
import useActions from '../hooks/useActions'
import useNavigation from '../hooks/useNavigation'

export default function Weddings() {
  const { open } = useNavigation()
  const { weddingAction } = useActions()
  const rows = getWeddings()

  return (
    <DataList
      listKey="weddings"
      cfg={{
        sub: 'Every wedding created on Mubarakan.', noun: 'weddings', one: 'wedding', ph: 'Search by couple or wedding code',
        rows, search: (r) => r.name + r.code + r.venue,
        stats: [['Total weddings', '18,402', '+7%'], ['Live now', '37', '+8%'], ['Created this month', '1,284', '+18%'], ['Guests who downloaded the app', '63.6%', '+4.2 pts']],
        cols: [
          { key: 'name', label: 'Wedding', type: 'person', w: '2fr', sort: (r) => r.name, value: (r) => [r.name, r.code, face(r.img, 96), 1] },
          { key: 'dates', label: 'Dates', type: 'text', w: '1.3fr', sort: (r) => r.age, value: (r) => r.dates },
          { key: 'city', label: 'Place', type: 'text', w: '1.3fr', sort: (r) => r.city, value: (r) => [r.city, r.venue.split(', ')[0]] },
          { key: 'joined', label: 'Guests joined', type: 'num', w: '.9fr', sort: (r) => r.joined, value: (r) => (r.invited ? r.joined + ' of ' + r.invited : '—') },
          { key: 'photos', label: 'Photos', type: 'num', w: '.7fr', sort: (r) => num(r.photos), value: (r) => r.photos },
          { key: 'st', label: 'Status', type: 'pill', w: '.8fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Show on home feed', msg: '{n} weddings added to the home feed' }, { label: 'Export', msg: 'Exported {n} weddings' }, { label: 'Lock', msg: '{n} weddings locked', danger: 1 }],
        menu: (r) => [
          { label: 'Open wedding', run: () => open('wedding', r.id) },
          { label: 'Show on home feed', run: () => weddingAction('feature', r) },
          { label: 'Remind guests who have not replied', run: () => weddingAction('remind', r) },
          { label: 'Lock wedding', run: () => weddingAction('lock', r), danger: 1 },
          { label: 'Delete wedding', run: () => weddingAction('del', r), danger: 1 },
        ],
        open: (r) => open('wedding', r.id),
      }}
    />
  )
}
