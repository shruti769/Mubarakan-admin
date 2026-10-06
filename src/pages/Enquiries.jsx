import DataList from '../components/list/DataList'
import { getEnquiries } from '../data/selectors'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'

export default function Enquiries() {
  const { toast } = useAdmin()
  const { open } = useNavigation()
  const rows = getEnquiries()

  return (
    <DataList
      listKey="enquiries"
      cfg={{
        sub: 'Customers who contacted a business through an ad.', noun: 'enquiries', one: 'enquiry', ph: 'Search by customer, business or reference',
        rows, search: (r) => r.cust + r.biz + r.ref,
        stats: [['This week', '1,936', '+9%'], ['Not replied yet', String(rows.filter((r) => r.st[0] === 'New').length), ''], ['Usually replied within', '41 min', '↓ 6 min'], ['Reached the business', '97.8%', '']],
        cols: [
          { key: 'ref', label: 'Reference', type: 'code', w: '1fr', sort: (r) => r.ref, value: (r) => r.ref },
          { key: 'cust', label: 'Customer', type: 'text', w: '1.3fr', sort: (r) => r.cust, value: (r) => [r.cust, r.phone] },
          { key: 'biz', label: 'Business', type: 'text', w: '1.4fr', sort: (r) => r.biz, value: (r) => [r.biz, r.cat] },
          { key: 'date', label: 'Date', type: 'text', w: '1.1fr', sort: (r) => r.age, value: (r) => r.date },
          { key: 'reply', label: 'Replied in', type: 'num', w: '.7fr', sort: (r) => r.reply, value: (r) => r.reply },
          { key: 'st', label: 'Status', type: 'pill', w: '.7fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Send to business again', msg: 'Sent {n} enquiries again' }, { label: 'Export', msg: 'Exported {n} enquiries' }, { label: 'Close', msg: '{n} enquiries closed', danger: 1 }],
        menu: (r) => [
          { label: 'Open', run: () => open('enquiry', r.id) },
          { label: 'Send to business again', run: () => toast('Sent again to ' + r.biz) },
          { label: 'Mark as a problem', run: () => toast(r.ref + ' marked as a problem'), danger: 1 },
        ],
        open: (r) => open('enquiry', r.id),
      }}
    />
  )
}
