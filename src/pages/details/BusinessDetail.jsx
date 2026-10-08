import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, PhotosBlock, TableBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face, img } from '../../data/images'
import useActions from '../../hooks/useActions'
import useDetailTab from '../../hooks/useDetailTab'
import useNavigation from '../../hooks/useNavigation'
import { loadBusiness } from '../../lib/data/business'
import useLoad from '../../lib/useLoad'

const MONO = "'JetBrains Mono',monospace"

export default function BusinessDetail() {
  const { id } = useParams()
  const { data, reload } = useLoad(() => loadBusiness(id), [id])
  // Nothing to show while loading, or when no business has this id.
  if (!data) return null
  return <Business {...data} after={reload} />
}

function Business({ b, ads, enquiries, after }) {
  const { open } = useNavigation()
  const { businessAction } = useActions()
  const tabs = ['Overview', 'Ads', 'Enquiries', 'Payments']
  const [tab, setTab] = useDetailTab('business', b.id, tabs)
  // The photos the business shows in the app: its own picture and the photos in its ads.
  const work = [b.img, ...ads.flatMap((a) => a.photos)].filter(Boolean)

  return (
    <DetailView
      img={face(b.img, 160)}
      title={b.name}
      sub={b.cat + ' . ' + b.city}
      status={b.st}
      stats={[['Rating', b.rating], ['Weddings done', b.weds], ['Enquiries this month', b.leadsMonth], ['Usually replies in', b.resp]]}
      actions={[{ label: 'Verify', run: () => businessAction('verify', b) }, { label: 'Create an ad', run: () => businessAction('ad', b, after), primary: 1 }]}
      more={[b.active ? { label: 'Suspend business', run: () => businessAction('suspend', b, after), danger: 1 } : { label: 'Turn business back on', run: () => businessAction('suspend', b, after) }]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Overview' && (
        <>
          <BlockCard title="Details">
            <KvBlock pairs={[['Type of work', b.cat], ['City', b.city], ['Plan', b.plan], ['Rating', b.rating + ' out of 5'], ['Weddings done', b.weds], ['Usually replies in', b.resp]]} />
          </BlockCard>
          <BlockCard title="Recent work">
            <PhotosBlock photos={work.slice(0, 8).map((k) => img(k, 240, 300))} />
          </BlockCard>
        </>
      )}
      {tab === 'Ads' && (
        <BlockCard>
          <TableBlock
            cols={['Ad', 'Type', 'Seen by', 'Enquiries', 'Status']}
            grid="minmax(0,1.8fr) minmax(0,1fr) minmax(0,.8fr) minmax(0,.8fr) minmax(0,.8fr)"
            rows={ads.map((a) => ({ c: [{ t: a.head, fw: 600 }, a.type, a.seen, a.enq, a.st], go: () => open('ad', a.id) }))}
          />
        </BlockCard>
      )}
      {tab === 'Enquiries' && (
        <BlockCard>
          <TableBlock
            cols={['Reference', 'Customer', 'Date', 'Status']}
            grid="minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,.8fr)"
            rows={enquiries.map((e) => ({ c: [{ t: e.ref, f: MONO }, { t: e.cust, fw: 600 }, e.date, e.st], go: () => open('enquiry', e.id) }))}
          />
        </BlockCard>
      )}
      {tab === 'Payments' && (
        <BlockCard>
          {/* Payments are not in the backend. */}
          <TableBlock cols={['Bill', 'What for', 'Amount', 'Status']} grid="minmax(0,1fr) minmax(0,1.5fr) minmax(0,1fr) minmax(0,.8fr)" rows={[]} />
        </BlockCard>
      )}
    </DetailView>
  )
}
