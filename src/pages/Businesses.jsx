import DataList from '../components/list/DataList'
import { face } from '../data/images'
import { num } from '../data/selectors'
import useActions from '../hooks/useActions'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'
import { loadBusinesses, suspendBusinesses } from '../lib/data/business'
import useLoad from '../lib/useLoad'

export default function Businesses() {
  const { toast } = useAdmin()
  const { open } = useNavigation()
  const { businessAction } = useActions()
  const { data, reload } = useLoad(loadBusinesses, [])
  const rows = data ? data.rows : []
  const suspendMany = async (ids) => {
    const { error } = await suspendBusinesses(rows.filter((r) => ids.includes(r.id)))
    if (error) return toast('Could not save: ' + error.message)
    toast(ids.length + (ids.length === 1 ? ' business suspended' : ' businesses suspended'))
    reload()
  }

  return (
    <DataList
      listKey="businesses"
      cfg={{
        sub: 'Wedding businesses that take enquiries through Mubarakan.', noun: 'businesses', one: 'business', ph: 'Search businesses',
        rows, search: (r) => r.name + r.cat + r.city,
        btns: [{ label: 'Add business', run: () => toast('Adding a business is not connected yet'), primary: 1 }],
        // Verification, applications and reply times are not in the backend.
        stats: [['Total businesses', data ? String(data.total) : '—', ''], ['Verified', '—', ''], ['Waiting for approval', '—', ''], ['Usually reply within', '—', '']],
        cols: [
          { key: 'name', label: 'Business', type: 'person', w: '2fr', sort: (r) => r.name, value: (r) => [r.name, r.cat, face(r.img, 96)] },
          { key: 'city', label: 'City', type: 'text', w: '.9fr', sort: (r) => r.city, value: (r) => r.city },
          { key: 'rating', label: 'Rating', type: 'num', w: '.6fr', sort: (r) => num(r.rating), value: (r) => r.rating },
          { key: 'leads', label: 'Enquiries', type: 'num', w: '.8fr', sort: (r) => num(r.leads), value: (r) => r.leads },
          { key: 'plan', label: 'Plan', type: 'text', w: '.8fr', sort: (r) => r.plan, value: (r) => r.plan },
          { key: 'st', label: 'Status', type: 'pill', w: '1.1fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [
          { label: 'Verify', off: 'Verifying businesses is not connected yet' },
          { label: 'Export', off: 'Export is not connected yet' },
          { label: 'Suspend', run: suspendMany, danger: 1 },
        ],
        menu: (r) => [
          { label: 'Open', run: () => open('business', r.id) },
          { label: 'Create an ad', run: () => businessAction('ad', r, reload) },
          { label: 'Verify', run: () => businessAction('verify', r) },
          r.active ? { label: 'Suspend', run: () => businessAction('suspend', r, reload), danger: 1 } : { label: 'Turn back on', run: () => businessAction('suspend', r, reload) },
        ],
        open: (r) => open('business', r.id),
      }}
    />
  )
}
