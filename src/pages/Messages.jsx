import DataList from '../components/list/DataList'
import useAdmin from '../hooks/useAdmin'
import { loadMessages } from '../lib/data/messages'
import useLoad from '../lib/useLoad'

export default function Messages() {
  const { toast } = useAdmin()
  const { data } = useLoad(loadMessages, [])
  const rows = data || []
  const notConnected = () => toast('Sending messages by WhatsApp, SMS or email is not connected yet')

  return (
    <DataList
      listKey="messages"
      cfg={{
        sub: 'Invites, reminders and alerts sent by WhatsApp, SMS, email and app notification.', noun: 'messages', one: 'message', ph: 'Search by person or message',
        rows, search: (r) => r.to + r.kind + r.ref,
        btns: [{ label: 'Resend undelivered', run: notConnected, primary: 1 }],
        // There is no delivery log or messaging cost in the backend.
        stats: [['Invites sent, 30 days', '—', ''], ['Delivered', '—', ''], ['Not delivered today', '—', ''], ['WhatsApp cost this month', '—', '']],
        cols: [
          { key: 'ref', label: 'Message', type: 'code', w: '1fr', sort: (r) => r.ref, value: (r) => r.ref },
          { key: 'kind', label: 'What', type: 'text', w: '1.2fr', sort: (r) => r.kind, value: (r) => r.kind },
          { key: 'ch', label: 'Sent by', type: 'text', w: '1fr', sort: (r) => r.ch, value: (r) => r.ch },
          { key: 'to', label: 'To', type: 'text', w: '1.3fr', sort: (r) => r.to, value: (r) => [r.to, r.city] },
          { key: 'at', label: 'Time', type: 'text', w: '.9fr', sort: (r) => r.ts, value: (r) => r.at },
          { key: 'st', label: 'Status', type: 'pill', w: '.9fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Resend', off: 'Resending messages is not connected yet' }],
        menu: () => [
          { label: 'Resend', run: notConnected },
          { label: 'Send by SMS instead', run: notConnected },
        ],
        open: () => {},
      }}
    />
  )
}
