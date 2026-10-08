import DataList from '../components/list/DataList'
import { face } from '../data/images'
import useActions from '../hooks/useActions'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'
import { fmtNum } from '../lib/data/core'
import { loadUsers, userEmail } from '../lib/data/users'
import { supabase } from '../lib/supabase'
import useLoad from '../lib/useLoad'

export default function Users() {
  const { toast } = useAdmin()
  const { open } = useNavigation()
  const { userAction } = useActions()
  const { data, error, reload } = useLoad(loadUsers, [])
  const rows = data ? data.rows : []

  // Sends a reset link to each selected account that has an email.
  const resetMany = async (ids) => {
    let sent = 0
    for (const id of ids) {
      const { data: email } = await userEmail(id)
      if (email && !(await supabase.auth.resetPasswordForEmail(email)).error) sent++
    }
    toast('Password reset sent to ' + sent + (sent === 1 ? ' user' : ' users'))
  }

  return (
    <DataList
      listKey="users"
      cfg={{
        sub: error ? 'Could not load users: ' + error : 'Everyone with a Mubarakan account.', noun: 'users', one: 'user', ph: 'Search by name or username',
        rows, search: (r) => r.name + r.handle + r.city,
        // When someone last opened the app, and suspensions, are not recorded in the backend.
        stats: [['Total users', data ? fmtNum(rows.length) : '—', ''], ['Joined today', data ? fmtNum(data.joinedToday) : '—', ''], ['Opened the app today', '—', ''], ['Suspended or banned', '—', '']],
        cols: [
          { key: 'name', label: 'Name', type: 'person', w: '2fr', sort: (r) => r.name, value: (r) => [r.name, r.handle, face(r.img, 96), 1] },
          { key: 'type', label: 'Type', type: 'text', w: '.9fr', sort: (r) => r.type, value: (r) => r.type },
          { key: 'city', label: 'City', type: 'text', w: '.9fr', sort: (r) => r.city, value: (r) => r.city },
          { key: 'joined', label: 'Joined', type: 'text', w: '1fr', sort: (r) => r.age, value: (r) => r.joined },
          { key: 'followers', label: 'Followers', type: 'num', w: '.8fr', sort: (r) => r.followersN, value: (r) => r.followers },
          { key: 'st', label: 'Status', type: 'pill', w: '.9fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [
          { label: 'Send password reset', run: resetMany },
          { label: 'Export', off: 'Exporting users is not connected yet' },
          { label: 'Suspend', off: 'Suspending users is not connected yet', danger: 1 },
        ],
        menu: (r) => [
          { label: 'Open profile', run: () => open('user', r.id) },
          { label: 'Send password reset', run: () => userAction('reset', r, reload) },
          { label: 'Suspend', run: () => userAction('suspend', r, reload) },
          { label: 'Ban', run: () => userAction('ban', r, reload), danger: 1 },
          { label: 'Delete account', run: () => userAction('del', r, reload), danger: 1 },
        ],
        open: (r) => open('user', r.id),
      }}
    />
  )
}
