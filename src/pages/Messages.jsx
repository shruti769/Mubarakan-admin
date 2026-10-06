import DataList from '../components/list/DataList'
import { getMessages } from '../data/selectors'
import useAdmin from '../hooks/useAdmin'

export default function Messages() {
  const { toast } = useAdmin()
  const rows = getMessages()

  return (
    <DataList
      listKey="messages"
      cfg={{
        sub: 'Invites, reminders and alerts sent by WhatsApp, SMS, email and app notification.', noun: 'messages', one: 'message', ph: 'Search by person or message',
        rows, search: (r) => r.to + r.kind + r.ref,
        btns: [{ label: 'Resend undelivered', run: () => toast('Resending 112 invites by SMS'), primary: 1 }],
        stats: [['Invites sent, 30 days', '412,880', '+11%'], ['Delivered', '96.4%', ''], ['Not delivered today', '112', '↓ 18'], ['WhatsApp cost this month', 'PKR 626,700', '']],
        cols: [
          { key: 'ref', label: 'Message', type: 'code', w: '1fr', sort: (r) => r.ref, value: (r) => r.ref },
          { key: 'kind', label: 'What', type: 'text', w: '1.2fr', sort: (r) => r.kind, value: (r) => r.kind },
          { key: 'ch', label: 'Sent by', type: 'text', w: '1fr', sort: (r) => r.ch, value: (r) => r.ch },
          { key: 'to', label: 'To', type: 'text', w: '1.3fr', sort: (r) => r.to, value: (r) => [r.to, r.city] },
          { key: 'at', label: 'Time', type: 'text', w: '.9fr', sort: (r) => r.at, value: (r) => r.at },
          { key: 'st', label: 'Status', type: 'pill', w: '.9fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Resend', msg: 'Resent {n} messages' }],
        menu: (r) => [
          { label: 'Resend', run: () => toast('Resent to ' + r.to) },
          { label: 'Send by SMS instead', run: () => toast('Sent to ' + r.to + ' by SMS') },
        ],
        open: () => {},
      }}
    />
  )
}
