import DataList from '../components/list/DataList'
import { face } from '../data/images'
import { getBusinesses, num, pendingApplications } from '../data/selectors'
import useActions from '../hooks/useActions'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'

export default function Businesses() {
  const { state, toast } = useAdmin()
  const { open } = useNavigation()
  const { businessAction } = useActions()
  const rows = getBusinesses(state)

  return (
    <DataList
      listKey="businesses"
      cfg={{
        sub: 'Wedding businesses that take enquiries through Mubarakan.', noun: 'businesses', one: 'business', ph: 'Search businesses',
        rows, search: (r) => r.name + r.cat + r.city,
        btns: [{ label: 'Add business', run: () => toast('New business form opened'), primary: 1 }],
        stats: [['Total businesses', '2,418', '+5%'], ['Verified', '1,962', ''], ['Waiting for approval', String(pendingApplications(state)), ''], ['Usually reply within', '41 min', '↓ 6 min']],
        cols: [
          { key: 'name', label: 'Business', type: 'person', w: '2fr', sort: (r) => r.name, value: (r) => [r.name, r.cat, face(r.img, 96)] },
          { key: 'city', label: 'City', type: 'text', w: '.9fr', sort: (r) => r.city, value: (r) => r.city },
          { key: 'rating', label: 'Rating', type: 'num', w: '.6fr', sort: (r) => num(r.rating), value: (r) => r.rating },
          { key: 'leads', label: 'Enquiries', type: 'num', w: '.8fr', sort: (r) => num(r.leads), value: (r) => r.leads },
          { key: 'plan', label: 'Plan', type: 'text', w: '.8fr', sort: (r) => r.plan, value: (r) => r.plan },
          { key: 'st', label: 'Status', type: 'pill', w: '1.1fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Verify', msg: '{n} businesses verified' }, { label: 'Export', msg: 'Exported {n} businesses' }, { label: 'Suspend', msg: '{n} businesses suspended', danger: 1 }],
        menu: (r) =>
          r.st[0] === 'Waiting for approval'
            ? [
                { label: 'Open', run: () => open('business', r.id) },
                { label: 'Approve', run: () => businessAction('approve', r) },
                { label: 'Reject', run: () => businessAction('reject', r), danger: 1 },
              ]
            : [
                { label: 'Open', run: () => open('business', r.id) },
                { label: 'Create an ad', run: () => businessAction('ad', r) },
                { label: r.st[0] === 'Verified' ? 'Remove verification' : 'Verify', run: () => businessAction('verify', r) },
                { label: 'Suspend', run: () => businessAction('suspend', r), danger: 1 },
              ],
        open: (r) => open('business', r.id),
      }}
    />
  )
}
