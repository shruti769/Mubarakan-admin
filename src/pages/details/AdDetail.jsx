import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, PhotosBlock, TableBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { img } from '../../data/images'
import useActions from '../../hooks/useActions'
import useAdmin from '../../hooks/useAdmin'
import useDetailTab from '../../hooks/useDetailTab'
import useNavigation from '../../hooks/useNavigation'
import { loadAd } from '../../lib/data/business'
import useLoad from '../../lib/useLoad'

const MONO = "'JetBrains Mono',monospace"

export default function AdDetail() {
  const { id } = useParams()
  const { data, reload } = useLoad(() => loadAd(id), [id])
  // Nothing to show while loading, or when no ad has this id.
  if (!data) return null
  return <Ad {...data} after={reload} />
}

function Ad({ a, enquiries, after }) {
  const { setState } = useAdmin()
  const { open } = useNavigation()
  const { togglePaused, endAd } = useActions()
  const tabs = ['Overview', 'Enquiries']
  const [tab, setTab] = useDetailTab('ad', a.id, tabs)

  return (
    <DetailView
      img={img(a.img, 160, 180)}
      title={a.biz}
      sub={a.head}
      status={a.st}
      // Impressions, clicks, spend and run dates are not tracked in the backend.
      stats={[['Seen by', a.seen], ['Clicks', a.clicks], ['Enquiries', a.enq], ['Spent', a.spend]]}
      actions={[
        { label: a.st[0] === 'Paused' ? 'Resume' : 'Pause', run: () => togglePaused(a, (wasPaused) => (wasPaused ? 'Ad running again' : 'Ad paused'), after) },
        { label: 'Edit ad', run: () => setState({ modal: { id: a.id, biz: a.biz, head: a.head, cities: a.city.split(', '), photos: a.photos, after } }), primary: 1 },
      ]}
      more={[{ label: 'End ad', run: () => endAd('It stops showing now.', a, after), danger: 1 }]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Overview' && (
        <>
          <BlockCard title="The ad">
            <KvBlock pairs={[['Headline', a.head], ['Ad type', a.type], ['Shown in', a.city], ['Runs', '—'], ['Clicks', a.clicks], ['Cost per enquiry', '—']]} />
          </BlockCard>
          <BlockCard title="Photos in this ad">
            <PhotosBlock photos={a.photos.map((k) => img(k, 240, 300))} />
          </BlockCard>
        </>
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
    </DetailView>
  )
}
