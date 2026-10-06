import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face } from '../../data/images'
import { getPayments } from '../../data/selectors'
import useAdmin from '../../hooks/useAdmin'

export default function PaymentDetail() {
  const { id } = useParams()
  const { toast, ask } = useAdmin()
  const all = getPayments()
  const p = all.find((x) => x.id === id) || all[0]

  return (
    <DetailView
      img={face('decorCeiling', 160)}
      title={p.biz}
      code={p.ref}
      sub={p.item}
      status={p.st}
      stats={[['Amount', p.amt], ['Sent', p.date], ['Due', '15 days after'], ['Paid by', p.st[0] === 'Paid' ? 'Card' : '—']]}
      actions={[
        { label: 'Download the bill', run: () => toast(p.ref + '.pdf downloaded') },
        { label: 'Send reminder', run: () => toast('Reminder sent to ' + p.biz), primary: 1 },
      ]}
      more={[{ label: 'Refund', run: () => ask({ title: 'Refund ' + p.biz + '?', body: p.amt + ' goes back in 5 to 10 days.', label: 'Refund', then: () => toast('Refunded') }), danger: 1 }]}
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
