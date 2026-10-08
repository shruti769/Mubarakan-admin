import DataList from '../components/list/DataList'
import { num } from '../data/selectors'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'

// Bills and payments are not in the backend yet, so the list is empty and the numbers are '—'.
const ROWS = []

export default function Payments() {
  const { toast } = useAdmin()
  const { open } = useNavigation()
  const notConnected = () => toast('Payments are not connected yet')

  return (
    <DataList
      listKey="payments"
      cfg={{
        sub: 'Bills sent to businesses and what has been paid.', noun: 'payments', one: 'payment', ph: 'Search by business or bill number',
        rows: ROWS, search: (r) => r.biz + r.ref + r.item,
        stats: [['Earned this month', '—', ''], ['Waiting to be paid', '—', ''], ['Late', '—', ''], ['Refunded', '—', '']],
        cols: [
          { key: 'ref', label: 'Bill', type: 'code', w: '1fr', sort: (r) => r.ref, value: (r) => r.ref },
          { key: 'biz', label: 'Business', type: 'text', w: '1.5fr', sort: (r) => r.biz, value: (r) => [r.biz, r.item] },
          { key: 'amt', label: 'Amount', type: 'num', w: '1fr', sort: (r) => num(r.amt), value: (r) => r.amt },
          { key: 'date', label: 'Date', type: 'text', w: '1fr', sort: (r) => r.age, value: (r) => r.date },
          { key: 'st', label: 'Status', type: 'pill', w: '.9fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Send reminder', off: 'Payments are not connected yet' }, { label: 'Download bills', off: 'Payments are not connected yet' }],
        menu: (r) => [
          { label: 'Open', run: () => open('payment', r.id) },
          { label: 'Download the bill', run: notConnected },
          { label: 'Send reminder', run: notConnected },
          { label: 'Refund', run: notConnected, danger: 1 },
        ],
        open: (r) => open('payment', r.id),
      }}
    />
  )
}
