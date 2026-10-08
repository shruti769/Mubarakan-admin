import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, PhotosBlock, TableBlock, TogglesBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face, img } from '../../data/images'
import useActions from '../../hooks/useActions'
import useAdmin from '../../hooks/useAdmin'
import useDetailTab from '../../hooks/useDetailTab'
import useNavigation from '../../hooks/useNavigation'
import { fmtNum } from '../../lib/data/core'
import { loadWedding } from '../../lib/data/weddings'
import useLoad from '../../lib/useLoad'

const TABS = ['Guests', 'Photos', 'Schedule', 'Settings']

export default function WeddingDetail() {
  const { id } = useParams()
  const { toast } = useAdmin()
  const { back } = useNavigation()
  const { weddingAction, weddingSetting } = useActions()
  const { data: w, error, reload } = useLoad(() => loadWedding(id), [id])
  const [tab, setTab] = useDetailTab('wedding', id, TABS)

  if (error) return <div style={{ fontSize: 14, color: '#6F6A78' }}>{'Could not load this wedding: ' + error}</div>
  if (!w) return null
  if (w.missing) return <div style={{ fontSize: 14, color: '#6F6A78' }}>This wedding does not exist.</div>

  // Privacy and downloads are saved on the wedding. Face grouping per wedding and turning guest
  // chat off do not exist in the backend (chat is always on), so those switches only say so.
  const onSetting = (key, on, title) => {
    const msg = title + (on ? ' turned on' : ' turned off')
    if (key === 'priv') return weddingSetting(w, { privacy: on ? 'invite' : 'public' }, msg, reload)
    if (key === 'dl') return weddingSetting(w, { allow_downloads: on }, msg, reload)
    toast(title + ' is not connected yet')
  }

  return (
    <DetailView
      cover={w.img ? img(w.img, 1600, 300) : ''}
      img={face(w.img, 160)}
      title={w.name}
      code={w.code}
      sub={w.dates + ' . ' + w.venue}
      status={w.st}
      stats={[['Guests invited', fmtNum(w.invited)], ['Guests joined', fmtNum(w.joined)], ['Photos uploaded', w.photos], ['Downloaded the app', w.rate === null ? '—' : w.rate + '%']]}
      actions={[
        { label: 'Remind guests', run: () => weddingAction('remind', w) },
        { label: 'Download photos', run: () => weddingAction('zip', w), primary: 1 },
      ]}
      more={[
        { label: 'Show on home feed', run: () => weddingAction('feature', w) },
        { label: 'Lock wedding', run: () => weddingAction('lock', w), danger: 1 },
        { label: 'Delete wedding', run: () => weddingAction('del', w, back), danger: 1 },
      ]}
      tabs={TABS}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Guests' && (
        <BlockCard title="Guests">
          <TableBlock
            cols={['Guest', 'Side', 'Coming?', 'Has the app', 'Functions']}
            grid="minmax(0,1.4fr) minmax(0,1.3fr) minmax(0,.9fr) minmax(0,.8fr) minmax(0,1fr)"
            rows={w.guests}
          />
        </BlockCard>
      )}
      {tab === 'Photos' &&
        w.albums.map(([title, photos]) => (
          <BlockCard key={title} title={title}>
            <PhotosBlock photos={photos.map((u) => img(u, 240, 300))} />
          </BlockCard>
        ))}
      {tab === 'Schedule' && (
        <BlockCard>
          <TableBlock
            cols={['Event', 'Date and time', 'Place', 'Dress code', 'Status']}
            grid="minmax(0,.9fr) minmax(0,1.5fr) minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,.8fr)"
            rows={w.schedule}
          />
        </BlockCard>
      )}
      {tab === 'Settings' && (
        <>
          <BlockCard title="Wedding settings">
            <TogglesBlock
              scope={'w' + w.id}
              items={[
                ['priv', 'Only invited guests can see it', 'Turn off to make the photos public', w.privacy !== 'public'],
                ['dl', 'Guests can download photos', 'Guests can save photos to their phone', w.allowDownloads],
                ['faces', 'Find yourself in photos', 'Turning this off deletes face data for this wedding', true],
                ['chat', 'Guest chat', 'Guests can message each other', true],
              ]}
              onChange={onSetting}
            />
          </BlockCard>
          <BlockCard title="Details">
            <KvBlock
              pairs={[['Wedding code', w.code, 1], ['Couple', w.hosts], ['Storage used', '—'], ['Who can see it', w.priv], ['Invite link', 'mubarakan.app/j/' + w.code, 1], ['Created', w.created]]}
            />
          </BlockCard>
        </>
      )}
    </DetailView>
  )
}
