import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, TimelineBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face } from '../../data/images'
import { getEnquiries } from '../../data/selectors'
import useAdmin from '../../hooks/useAdmin'
import useDetailTab from '../../hooks/useDetailTab'

const FACES = ['sariRed', 'sariGreen', 'redDressPortrait', 'couplePair', 'sariSmile', 'pinkDress', 'purpleDress', 'yellowRedBridal', 'turbanMirror', 'brideWhite']

export default function EnquiryDetail() {
  const { id } = useParams()
  const { toast } = useAdmin()
  const all = getEnquiries()
  const e = all.find((x) => x.id === id) || all[0]
  const tabs = ['Details', 'What happened']
  const [tab, setTab] = useDetailTab('enquiry', e.id, tabs)
  const replied = e.reply !== '—'

  return (
    <DetailView
      img={face(FACES[all.indexOf(e) % 10], 160)}
      title={e.cust}
      code={e.ref}
      sub={'to ' + e.biz + ' . ' + e.date}
      status={e.st}
      stats={[['Business', e.biz], ['Category', e.cat], ['From ad', e.ad], ['Replied in', e.reply]]}
      actions={[
        { label: 'Send to business again', run: () => toast('Sent again to ' + e.biz) },
        { label: 'Call customer', run: () => toast('Calling ' + e.phone), primary: 1 },
      ]}
      more={[{ label: 'Mark as a problem', run: () => toast(e.ref + ' marked as a problem'), danger: 1 }]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Details' && (
        <>
          <BlockCard title="Customer">
            <KvBlock pairs={[['Name', e.cust], ['Phone', e.phone, 1], ['Prefers', e.prefers], ['Agreed to share their number', 'Yes, ' + e.date]]} />
          </BlockCard>
          <BlockCard title="What they asked">
            <KvBlock pairs={[['Wedding date', 'Sat 14 Nov 2026'], ['Events', 'Mehndi, Walima'], ['Venue', 'Royal Palm, Lahore'], ['Guests', '200 to 350'], ['Style', 'Traditional maroon'], ['Budget', '6 to 10 lakh']]} />
          </BlockCard>
        </>
      )}
      {tab === 'What happened' && (
        <BlockCard>
          <TimelineBlock
            items={[
              [e.date, 'Customer sent the enquiry from the ' + e.ad.toLowerCase() + ' ad', '#1E5A4A'],
              [e.date, 'Sent to ' + e.biz + ' on WhatsApp', e.st[0] === 'New' ? '#C9A227' : '#1E5A4A'],
              [replied ? 'after ' + e.reply : 'waiting', replied ? e.biz + ' replied to the customer' : e.biz + ' has not replied yet', replied ? '#1E5A4A' : '#A6192E'],
            ]}
          />
        </BlockCard>
      )}
    </DetailView>
  )
}
