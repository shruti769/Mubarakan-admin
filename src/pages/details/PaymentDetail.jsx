import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import useAdmin from '../../hooks/useAdmin'

// Bills and payments are not in the backend yet, so there is no payment to open.
const PAYMENTS = []

export default function PaymentDetail() {
  const { id } = useParams()
  const p = PAYMENTS.find((x) => x.id === id)
  if (!p) return null
  return <Payment p={p} />
}

function Payment({ p }) {
  const { toast } = useAdmin()
  const notConnected = () => toast('Payments are not connected yet')

  return (
    <DetailView
      img={p.img}
      title={p.biz}
      code={p.ref}
      sub={p.item}
      status={p.st}
      stats={[['Amount', p.amt], ['Sent', p.date], ['Due', '—'], ['Paid by', '—']]}
      actions={[
        { label: 'Download the bill', run: notConnected },
        { label: 'Send reminder', run: notConnected, primary: 1 },
      ]}
      more={[{ label: 'Refund', run: notConnected, danger: 1 }]}
      tabs={['Details']}
      tab="Details"
      onTab={() => {}}
    >
      <BlockCard title="Bill">
        <KvBlock pairs={[['Bill number', p.ref, 1], ['Business', p.biz], ['For', p.item], ['Amount', p.amt], ['Date', p.date], ['Status', p.st[0]]]} />
      </BlockCard>
    </DetailView>
  )
}
