import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, PhotosBlock, TableBlock, TimelineBlock, TogglesBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face } from '../../data/images'
import useActions from '../../hooks/useActions'
import useDetailTab from '../../hooks/useDetailTab'
import useNavigation from '../../hooks/useNavigation'
import { fmtNum, fmtRange } from '../../lib/data/core'
import { loadUser } from '../../lib/data/users'
import useLoad from '../../lib/useLoad'

const TABS = ['Profile', 'Weddings', 'Posts', 'Activity']

// The profile columns behind each privacy switch.
const PRIVACY = { faces: 'face_grouping', dl: 'allow_downloads', ex: 'show_in_explore' }

export default function UserDetail() {
  const { id } = useParams()
  const { open } = useNavigation()
  const { userAction, userSetting } = useActions()
  const { data: u, error, reload } = useLoad(() => loadUser(id), [id])
  const [tab, setTab] = useDetailTab('user', id, TABS)

  if (error) return <div style={{ fontSize: 14, color: '#6F6A78' }}>{'Could not load this user: ' + error}</div>
  if (!u) return null
  if (u.missing) return <div style={{ fontSize: 14, color: '#6F6A78' }}>This user does not exist.</div>

  return (
    <DetailView
      img={face(u.img, 160)}
      title={u.name}
      sub={u.type + ' . ' + u.city + ' . joined ' + u.joined}
      status={u.st}
      stats={[['Followers', u.followers], ['Posts', fmtNum(u.posts)], ['Weddings', fmtNum(u.weddings.length)], ['Reports against them', fmtNum(u.reports)]]}
      actions={[
        { label: 'Send password reset', run: () => userAction('reset', u, reload) },
        { label: 'Suspend', run: () => userAction('suspend', u, reload) },
      ]}
      more={[
        { label: u.verified ? 'Remove verification' : 'Verify', run: () => userAction('verify', u, reload) },
        { label: 'Sign out of all devices', run: () => userAction('signout', u, reload) },
        { label: 'Ban', run: () => userAction('ban', u, reload), danger: 1 },
        { label: 'Delete account', run: () => userAction('del', u, reload), danger: 1 },
      ]}
      tabs={TABS}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Profile' && (
        <>
          <BlockCard title="Details">
            <KvBlock
              pairs={[['Full name', u.name], ['Username', u.handle, 1], ['Type', u.type], ['City', u.city], ['Signed up with', u.method], ['Joined', u.joined], ['Phone', u.phone, 1], ['Email', u.email], ['Languages', '—']]}
            />
          </BlockCard>
          <BlockCard title="Privacy">
            <TogglesBlock
              scope={'u' + u.id}
              items={[
                ['faces', 'Find yourself in photos', 'Groups photos by their face', u.privacy.face_grouping],
                ['dl', 'Guests can download their photos', 'Applies to weddings they host', u.privacy.allow_downloads],
                ['ex', 'Show their posts in Explore', 'Public posts can be discovered', u.privacy.show_in_explore],
              ]}
              onChange={(key, on, title) => userSetting(u, { [PRIVACY[key]]: on }, title + (on ? ' turned on' : ' turned off'), reload)}
            />
          </BlockCard>
        </>
      )}
      {tab === 'Weddings' && (
        <BlockCard>
          <TableBlock
            cols={['Wedding', 'Role', 'Date', 'Status']}
            grid="minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr)"
            rows={u.weddings.map((w) => ({ c: [{ t: w.title, fw: 600 }, w.role, fmtRange(w.dates, w.ends), w.st], go: () => open('wedding', w.id) }))}
          />
        </BlockCard>
      )}
      {tab === 'Posts' && (
        <BlockCard>
          <PhotosBlock photos={u.photos} />
        </BlockCard>
      )}
      {tab === 'Activity' && (
        <BlockCard>
          <TimelineBlock items={u.activity} />
        </BlockCard>
      )}
    </DetailView>
  )
}
