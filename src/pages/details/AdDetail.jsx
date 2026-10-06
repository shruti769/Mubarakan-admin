import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, PhotosBlock, TableBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { img } from '../../data/images'
import { getAds, getEnquiries } from '../../data/selectors'
import useActions from '../../hooks/useActions'
import useAdmin from '../../hooks/useAdmin'
import useDetailTab from '../../hooks/useDetailTab'
import useNavigation from '../../hooks/useNavigation'

const MONO = "'JetBrains Mono',monospace"

// "about 1,928 PKR" from spend and enquiry count.
const costPerEnquiry = (a) =>
  a.enq !== '0' ? 'about ' + Math.round(parseFloat(a.spend.replace(/[^0-9.]/g, '')) / parseFloat(a.enq)).toLocaleString('en-US') + ' ' + a.spend.split(' ')[0] : '—'

export default function AdDetail() {
  const { id } = useParams()
  const { state, setState } = useAdmin()
  const { open } = useNavigation()
  const { togglePaused, endAd } = useActions()
  const ads = getAds(state)
  const a = ads.find((x) => x.id === id) || ads[0]
  const tabs = ['Overview', 'Enquiries']
  const [tab, setTab] = useDetailTab('ad', a.id, tabs)

  return (
    <DetailView
      img={img(a.img, 160, 180)}
      title={a.biz}
      sub={a.head}
      status={a.st}
      stats={[['Seen by', a.seen], ['Clicks', a.clicks], ['Enquiries', a.enq], ['Spent', a.spend]]}
      actions={[
        { label: a.st[0] === 'Paused' ? 'Resume' : 'Pause', run: () => togglePaused(a, (wasPaused) => (wasPaused ? 'Ad running again' : 'Ad paused')) },
        { label: 'Edit ad', run: () => setState({ modal: { biz: a.biz, head: a.head, cities: a.city.split(', ') } }), primary: 1 },
      ]}
      more={[{ label: 'End ad', run: () => endAd('It stops showing now.'), danger: 1 }]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Overview' && (
        <>
          <BlockCard title="The ad">
            <KvBlock pairs={[['Headline', a.head], ['Ad type', a.type], ['Shown in', a.city], ['Runs', '1 Oct to 31 Oct 2026'], ['Clicks', a.clicks], ['Cost per enquiry', costPerEnquiry(a)]]} />
          </BlockCard>
          <BlockCard title="Photos in this ad">
            <PhotosBlock photos={[a.img, 'canopy', 'flowerArrangement', 'roseBouquet'].map((k) => img(k, 240, 300))} />
          </BlockCard>
        </>
      )}
      {tab === 'Enquiries' && (
        <BlockCard>
          <TableBlock
            cols={['Reference', 'Customer', 'Date', 'Status']}
            grid="minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.2fr) minmax(0,.8fr)"
            rows={getEnquiries().filter((e) => e.biz === a.biz).map((e) => ({ c: [{ t: e.ref, f: MONO }, { t: e.cust, fw: 600 }, e.date, e.st], go: () => open('enquiry', e.id) }))}
          />
        </BlockCard>
      )}
    </DetailView>
  )
}
