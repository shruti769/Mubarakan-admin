import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, TimelineBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face } from '../../data/images'
import useAdmin from '../../hooks/useAdmin'
import useDetailTab from '../../hooks/useDetailTab'
import { answerPairs, loadEnquiry } from '../../lib/data/business'
import useLoad from '../../lib/useLoad'

export default function EnquiryDetail() {
  const { id } = useParams()
  const { data } = useLoad(() => loadEnquiry(id), [id])
  // Nothing to show while loading, or when no enquiry has this id.
  if (!data) return null
  return <Enquiry e={data} />
}

function Enquiry({ e }) {
  const { toast } = useAdmin()
  const tabs = ['Details', 'What happened']
  const [tab, setTab] = useDetailTab('enquiry', e.id, tabs)
  const asked = answerPairs(e)

  return (
    <DetailView
      img={face(e.avatar, 160)}
      title={e.cust}
      code={e.ref}
      sub={'to ' + e.biz + ' . ' + e.date}
      status={e.st}
      stats={[['Business', e.biz], ['Category', e.cat], ['From ad', e.ad], ['Replied in', e.reply]]}
      actions={[
        { label: 'Send to business again', run: () => toast('Sending enquiries to businesses is not connected yet') },
        { label: 'Call customer', run: () => { window.location.href = 'tel:' + e.phone.replace(/\s/g, '') }, primary: 1 },
      ]}
      more={[{ label: 'Mark as a problem', run: () => toast('Marking an enquiry as a problem is not connected yet'), danger: 1 }]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Details' && (
        <>
          <BlockCard title="Customer">
            {/* The app only sends an enquiry after the customer agrees to share their number. */}
            <KvBlock pairs={[['Name', e.cust], ['Phone', e.phone, 1], ['Prefers', e.prefers], ['Agreed to share their number', 'Yes, ' + e.date]]} />
          </BlockCard>
          <BlockCard title="What they asked">
            <KvBlock pairs={asked} />
          </BlockCard>
        </>
      )}
      {tab === 'What happened' && (
        <BlockCard>
          {/* Delivery to the business and its reply are not tracked in the backend. */}
          <TimelineBlock items={[[e.date, 'Customer sent the enquiry' + (e.ad !== '—' ? ' from the ' + e.ad.toLowerCase() + ' ad' : ''), '#1E5A4A']]} />
        </BlockCard>
      )}
    </DetailView>
  )
}
