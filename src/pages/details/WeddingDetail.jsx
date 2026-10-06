import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, PhotosBlock, TableBlock, TogglesBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face, img } from '../../data/images'
import { GUESTS } from '../../data/mock'
import { getWeddings } from '../../data/selectors'
import useActions from '../../hooks/useActions'
import useDetailTab from '../../hooks/useDetailTab'

const RSVP = { Going: ['Coming', 'green'], Maybe: ['Maybe', 'gold'], 'No reply': ['Not replied', 'grey'], 'Not going': ['Not coming', 'maroon'] }

const ALBUMS = [
  ['Mehndi . 142 photos', ['mehndiHands', 'mehndiHandsTwo', 'haldiYellow', 'mehndiArm', 'handsGold', 'celebration', 'sariGreen', 'diyaGirl']],
  ['Nikah . 118 photos', ['ceremony', 'ringHands', 'brideWhite', 'couplePose3', 'coupleTrad', 'groomSehra', 'handsClose', 'beadsClose']],
  ['Walima . 158 photos', ['canopy', 'couplePose', 'decorCeiling', 'couplePose2', 'flowerArrangement', 'roseBouquet', 'coupleWalk', 'redGoldOutfit']],
]

export default function WeddingDetail() {
  const { id } = useParams()
  const { weddingAction } = useActions()
  const weddings = getWeddings()
  const w = weddings.find((x) => x.id === id) || weddings[0]
  const tabs = ['Guests', 'Photos', 'Schedule', 'Settings']
  const [tab, setTab] = useDetailTab('wedding', w.id, tabs)

  return (
    <DetailView
      cover={img(w.img, 1600, 300)}
      img={face(w.img, 160)}
      title={w.name}
      code={w.code}
      sub={w.dates + ' . ' + w.venue}
      status={w.st}
      stats={[['Guests invited', String(w.invited)], ['Guests joined', String(w.joined)], ['Photos uploaded', w.photos], ['Downloaded the app', w.rate + '%']]}
      actions={[
        { label: 'Remind guests', run: () => weddingAction('remind', w) },
        { label: 'Download photos', run: () => weddingAction('zip', w), primary: 1 },
      ]}
      more={[
        { label: 'Show on home feed', run: () => weddingAction('feature', w) },
        { label: 'Lock wedding', run: () => weddingAction('lock', w), danger: 1 },
        { label: 'Delete wedding', run: () => weddingAction('del', w), danger: 1 },
      ]}
      tabs={tabs}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Guests' && (
        <BlockCard title="Guests">
          <TableBlock
            cols={['Guest', 'Side', 'Coming?', 'Has the app', 'Functions']}
            grid="minmax(0,1.4fr) minmax(0,1.3fr) minmax(0,.9fr) minmax(0,.8fr) minmax(0,1fr)"
            rows={GUESTS.map((g) => [{ t: g[0], fw: 600 }, g[2], RSVP[g[3]], g[4] === 'Installed' ? 'Yes' : 'Not yet', g[7] || '—'])}
          />
        </BlockCard>
      )}
      {tab === 'Photos' &&
        ALBUMS.map(([title, keys]) => (
          <BlockCard key={title} title={title}>
            <PhotosBlock photos={keys.map((k) => img(k, 240, 300))} />
          </BlockCard>
        ))}
      {tab === 'Schedule' && (
        <BlockCard>
          <TableBlock
            cols={['Event', 'Date and time', 'Place', 'Dress code', 'Status']}
            grid="minmax(0,.9fr) minmax(0,1.5fr) minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,.8fr)"
            rows={[
              [{ t: 'Mehndi', fw: 600 }, 'Sat 12 Oct, 7:00 pm', 'Lawn, Royal Palm', 'Yellow and green', ['Done', 'grey']],
              [{ t: 'Nikah', fw: 600 }, 'Sun 13 Oct, 4:00 pm', 'Grand hall, Royal Palm', 'Ivory and gold', ['Done', 'grey']],
              [{ t: 'Walima', fw: 600 }, 'Mon 14 Oct, 8:00 pm', 'Grand hall, Royal Palm', 'Formal, jewel tones', ['Live', 'maroon']],
            ]}
          />
        </BlockCard>
      )}
      {tab === 'Settings' && (
        <>
          <BlockCard title="Wedding settings">
            <TogglesBlock
              scope={'w' + w.id}
              items={[
                ['priv', 'Only invited guests can see it', 'Turn off to make the photos public', true],
                ['dl', 'Guests can download photos', 'Guests can save photos to their phone', true],
                ['faces', 'Find yourself in photos', 'Turning this off deletes face data for this wedding', true],
                ['chat', 'Guest chat', 'Guests can message each other', true],
              ]}
            />
          </BlockCard>
          <BlockCard title="Details">
            <KvBlock
              pairs={[['Wedding code', w.code, 1], ['Couple', w.hosts], ['Storage used', w.storage], ['Who can see it', w.priv], ['Invite link', 'mubarakan.app/i/' + w.code.toLowerCase(), 1], ['Created', '14 Jan 2026']]}
            />
          </BlockCard>
        </>
      )}
    </DetailView>
  )
}
