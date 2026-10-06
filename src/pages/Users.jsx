import DataList from '../components/list/DataList'
import { face } from '../data/images'
import { getUsers, num } from '../data/selectors'
import useActions from '../hooks/useActions'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'

const count = (rows, t) => rows.filter((r) => r.st[0] === t).length

export default function Users() {
  const { state } = useAdmin()
  const { open } = useNavigation()
  const { userAction } = useActions()
  const rows = getUsers(state)

  return (
    <DataList
      listKey="users"
      cfg={{
        sub: 'Everyone with a Mubarakan account.', noun: 'users', one: 'user', ph: 'Search by name or username',
        rows, search: (r) => r.name + r.handle + r.city,
        stats: [['Total users', '248,610', '+2.1%'], ['Joined today', '1,204', '+12%'], ['Opened the app today', '41,204', '+3%'], ['Suspended or banned', String(count(rows, 'Suspended') + count(rows, 'Banned') + 12), '']],
        cols: [
          { key: 'name', label: 'Name', type: 'person', w: '2fr', sort: (r) => r.name, value: (r) => [r.name, r.handle, face(r.img, 96), 1] },
          { key: 'type', label: 'Type', type: 'text', w: '.9fr', sort: (r) => r.type, value: (r) => r.type },
          { key: 'city', label: 'City', type: 'text', w: '.9fr', sort: (r) => r.city, value: (r) => r.city },
          { key: 'joined', label: 'Joined', type: 'text', w: '1fr', sort: (r) => r.age, value: (r) => r.joined },
          { key: 'followers', label: 'Followers', type: 'num', w: '.8fr', sort: (r) => num(r.followers) * (/k/.test(r.followers) ? 1000 : 1), value: (r) => r.followers },
          { key: 'st', label: 'Status', type: 'pill', w: '.9fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Send password reset', msg: 'Password reset sent to {n} users' }, { label: 'Export', msg: 'Exported {n} users' }, { label: 'Suspend', msg: '{n} users suspended', danger: 1 }],
        menu: (r) => {
          const suspended = r.st[0] === 'Suspended'
          return [
            { label: 'Open profile', run: () => open('user', r.id) },
            { label: 'Send password reset', run: () => userAction('reset', r) },
            { label: suspended ? 'Lift suspension' : 'Suspend', run: () => userAction(suspended ? 'unsuspend' : 'suspend', r) },
            { label: 'Ban', run: () => userAction('ban', r), danger: 1 },
            { label: 'Delete account', run: () => userAction('del', r), danger: 1 },
          ]
        },
        open: (r) => open('user', r.id),
      }}
    />
  )
}
