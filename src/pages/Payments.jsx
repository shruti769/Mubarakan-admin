import DataList from '../components/list/DataList'
import { getPayments, num } from '../data/selectors'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'

const count = (rows, t) => rows.filter((r) => r.st[0] === t).length

export default function Payments() {
  const { toast, ask } = useAdmin()
  const { open } = useNavigation()
  const rows = getPayments()

  return (
    <DataList
      listKey="payments"
      cfg={{
        sub: 'Bills sent to businesses and what has been paid.', noun: 'payments', one: 'payment', ph: 'Search by business or bill number',
        rows, search: (r) => r.biz + r.ref + r.item,
        stats: [['Earned this month', 'PKR 18.4M', '+16%'], ['Waiting to be paid', 'PKR 312,000', ''], ['Late', String(count(rows, 'Late') + count(rows, 'Card declined')), ''], ['Refunded', 'PKR 18,000', '']],
        cols: [
          { key: 'ref', label: 'Bill', type: 'code', w: '1fr', sort: (r) => r.ref, value: (r) => r.ref },
          { key: 'biz', label: 'Business', type: 'text', w: '1.5fr', sort: (r) => r.biz, value: (r) => [r.biz, r.item] },
          { key: 'amt', label: 'Amount', type: 'num', w: '1fr', sort: (r) => num(r.amt), value: (r) => r.amt },
          { key: 'date', label: 'Date', type: 'text', w: '1fr', sort: (r) => r.age, value: (r) => r.date },
          { key: 'st', label: 'Status', type: 'pill', w: '.9fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Send reminder', msg: 'Reminder sent to {n} businesses' }, { label: 'Download bills', msg: '{n} bills downloaded' }],
        menu: (r) => [
          { label: 'Open', run: () => open('payment', r.id) },
          { label: 'Download the bill', run: () => toast(r.ref + '.pdf downloaded') },
          { label: 'Send reminder', run: () => toast('Reminder sent to ' + r.biz) },
          { label: 'Refund', run: () => ask({ title: 'Refund ' + r.biz + '?', body: r.amt + ' goes back to their card in 5 to 10 days.', label: 'Refund', then: () => toast(r.biz + ' refunded') }), danger: 1 },
        ],
        open: (r) => open('payment', r.id),
      }}
    />
  )
}
