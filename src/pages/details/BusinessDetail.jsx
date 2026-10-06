import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, PhotosBlock, TableBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face, img } from '../../data/images'
import { getAds, getBusinesses, getEnquiries, getPayments } from '../../data/selectors'
import useActions from '../../hooks/useActions'
import useAdmin from '../../hooks/useAdmin'
import useDetailTab from '../../hooks/useDetailTab'
import useNavigation from '../../hooks/useNavigation'

const MONO = "'JetBrains Mono',monospace"
const WORK = ['decorCeiling', 'canopy', 'flowerArrangement', 'roseBouquet', 'celebration', 'couplePose3', 'flowerGroup', 'ritualObject']

export default function BusinessDetail() {
  const { id } = useParams()
  const { state } = useAdmin()
  const { open } = useNavigation()
  const { businessAction } = useActions()
  const all = getBusinesses(state)
  const b = all.find((x) => x.id === id) || all[0]
  const tabs = ['Overview', 'Ads', 'Enquiries', 'Payments']
  const [tab, setTab] = useDetailTab('business', b.id, tabs)
  const waiting = b.st[0] === 'Waiting for approval'
  const verified = b.st[0] === 'Verified'

  return (
    <DetailView
      img={face(b.img, 160)}
      title={b.name}
      sub={b.cat + ' . ' + b.city}
      status={b.st}
      stats={[['Rating', b.rating], ['Weddings done', b.weds], ['Enquiries this month', b.leads], ['Usually replies in', b.resp]]}
      actions={
        waiting
          ? [{ label: 'Reject', run: () => businessAction('reject', b) }, { label: 'Approve', run: () => businessAction('approve', b), primary: 1 }]
          : [{ label: verified ? 'Remove verification' : 'Verify', run: () => businessAction('verify', b) }, { label: 'Create an ad', run: () => businessAction('ad', b), primary: 1 }]
      }
      more={[{ label: 'Suspend business', run: () => businessAction('suspend', b), danger: 1 }]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Overview' &&
        (waiting ? (
          <BlockCard title="Application">
            <KvBlock pairs={[['Applied', b.app.at], ['Type of work', b.cat], ['City', b.city], ['Documents', b.app.docs.join(', ')], ['Links', b.app.links.join(', ')], ['Note', b.app.note]]} />
          </BlockCard>
        ) : (
          <>
            <BlockCard title="Details">
              <KvBlock pairs={[['Type of work', b.cat], ['City', b.city], ['Plan', b.plan], ['Rating', b.rating + ' out of 5'], ['Weddings done', b.weds], ['Usually replies in', b.resp]]} />
            </BlockCard>
            <BlockCard title="Recent work">
              <PhotosBlock photos={WORK.map((k) => img(k, 240, 300))} />
            </BlockCard>
          </>
        ))}
      {tab === 'Ads' && (
        <BlockCard>
          <TableBlock
            cols={['Ad', 'Type', 'Seen by', 'Enquiries', 'Status']}
            grid="minmax(0,1.8fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,.8fr) minmax(0,.8fr)"
            rows={getAds(state).filter((a) => a.biz === b.name).map((a) => ({ c: [{ t: a.head, fw: 600 }, a.type, a.seen, a.enq, a.st], go: () => open('ad', a.id) }))}
          />
        </BlockCard>
      )}
      {tab === 'Enquiries' && (
        <BlockCard>
          <TableBlock
            cols={['Reference', 'Customer', 'Date', 'Status']}
            grid="minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,.8fr)"
            rows={getEnquiries().filter((e) => e.biz === b.name).map((e) => ({ c: [{ t: e.ref, f: MONO }, { t: e.cust, fw: 600 }, e.date, e.st], go: () => open('enquiry', e.id) }))}
          />
        </BlockCard>
      )}
      {tab === 'Payments' && (
        <BlockCard>
          <TableBlock
            cols={['Bill', 'What for', 'Amount', 'Status']}
            grid="minmax(0,1fr) minmax(0,1.5fr) minmax(0,1fr) minmax(0,.8fr)"
            rows={getPayments().filter((p) => p.biz === b.name).map((p) => ({ c: [{ t: p.ref, f: MONO }, p.item, p.amt, p.st], go: () => open('payment', p.id) }))}
          />
        </BlockCard>
      )}
    </DetailView>
  )
}
