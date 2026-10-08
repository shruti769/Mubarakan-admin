import DataList from '../components/list/DataList'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'
import { loadEnquiries } from '../lib/data/business'
import useLoad from '../lib/useLoad'

export default function Enquiries() {
  const { toast } = useAdmin()
  const { open } = useNavigation()
  const { data } = useLoad(loadEnquiries, [])
  const rows = data ? data.rows : []
  const notConnected = (what) => () => toast(what + ' is not connected yet')

  return (
    <DataList
      listKey="enquiries"
      cfg={{
        sub: 'Customers who contacted a business through an ad.', noun: 'enquiries', one: 'enquiry', ph: 'Search by customer, business or reference',
        rows, search: (r) => r.cust + r.biz + r.ref,
        // Replies and delivery to the business are not tracked in the backend.
        stats: [['This week', data ? String(data.week) : '—', ''], ['Not replied yet', '—', ''], ['Usually replied within', '—', ''], ['Reached the business', '—', '']],
        cols: [
          { key: 'ref', label: 'Reference', type: 'code', w: '1fr', sort: (r) => r.ref, value: (r) => r.ref },
          { key: 'cust', label: 'Customer', type: 'text', w: '1.3fr', sort: (r) => r.cust, value: (r) => [r.cust, r.phone] },
          { key: 'biz', label: 'Business', type: 'text', w: '1.4fr', sort: (r) => r.biz, value: (r) => [r.biz, r.cat] },
          { key: 'date', label: 'Date', type: 'text', w: '1.1fr', sort: (r) => r.age, value: (r) => r.date },
          { key: 'reply', label: 'Replied in', type: 'num', w: '.7fr', sort: (r) => r.reply, value: (r) => r.reply },
          { key: 'st', label: 'Status', type: 'pill', w: '.7fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [
          { label: 'Send to business again', off: 'Sending enquiries to businesses is not connected yet' },
          { label: 'Export', off: 'Export is not connected yet' },
          { label: 'Close', off: 'Closing enquiries is not connected yet', danger: 1 },
        ],
        menu: (r) => [
          { label: 'Open', run: () => open('enquiry', r.id) },
          { label: 'Send to business again', run: notConnected('Sending enquiries to businesses') },
          { label: 'Mark as a problem', run: notConnected('Marking an enquiry as a problem'), danger: 1 },
        ],
        open: (r) => open('enquiry', r.id),
      }}
    />
  )
}
