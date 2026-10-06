import { useParams } from 'react-router-dom'
import { BlockCard, KvBlock, PhotosBlock, TableBlock, TimelineBlock, TogglesBlock } from '../../components/detail/Blocks'
import DetailView from '../../components/detail/DetailView'
import { face, img } from '../../data/images'
import { getUsers } from '../../data/selectors'
import useActions from '../../hooks/useActions'
import useAdmin from '../../hooks/useAdmin'
import useDetailTab from '../../hooks/useDetailTab'
import useNavigation from '../../hooks/useNavigation'

const POSTS = ['brideRed', 'mehndiHands', 'couplePose', 'bangles', 'decorCeiling', 'canopy', 'celebration', 'ringHands', 'handsGold', 'couplePose2', 'flowerArrangement', 'sariRed', 'roseBouquet', 'haldiYellow', 'brideFloral', 'ceremony']

export default function UserDetail() {
  const { id } = useParams()
  const { state } = useAdmin()
  const { open } = useNavigation()
  const { userAction } = useActions()
  const users = getUsers(state)
  const u = users.find((x) => x.id === id) || users[0]
  const [tab, setTab] = useDetailTab('user', u.id, ['Profile', 'Weddings', 'Posts', 'Activity'])
  const suspended = u.st[0] === 'Suspended'

  return (
    <DetailView
      img={face(u.img, 160)}
      title={u.name}
      sub={u.type + ' . ' + u.city + ' . joined ' + u.joined}
      status={u.st}
      stats={[['Followers', u.followers], ['Posts', '64'], ['Weddings', String(u.weds || 0)], ['Reports against them', '2']]}
      actions={[
        { label: 'Send password reset', run: () => userAction('reset', u) },
        { label: suspended ? 'Lift suspension' : 'Suspend', run: () => userAction(suspended ? 'unsuspend' : 'suspend', u) },
      ]}
      more={[
        { label: 'Verify', run: () => userAction('verify', u) },
        { label: 'Sign out of all devices', run: () => userAction('signout', u) },
        { label: 'Ban', run: () => userAction('ban', u), danger: 1 },
        { label: 'Delete account', run: () => userAction('del', u), danger: 1 },
      ]}
      tabs={['Profile', 'Weddings', 'Posts', 'Activity']}
      tab={tab}
      onTab={setTab}
    >
      {tab === 'Profile' && (
        <>
          <BlockCard title="Details">
            <KvBlock
              pairs={[['Full name', u.name], ['Username', u.handle, 1], ['Type', u.type], ['City', u.city], ['Signed up with', u.method], ['Joined', u.joined], ['Phone', '+92 300 4418 270', 1], ['Email', u.handle.replace('@', '') + '@gmail.com'], ['Languages', 'English, Urdu']]}
            />
          </BlockCard>
          <BlockCard title="Privacy">
            <TogglesBlock
              scope={'u' + u.id}
              items={[['faces', 'Find yourself in photos', 'Groups photos by their face', true], ['dl', 'Guests can download their photos', 'Applies to weddings they host', true], ['ex', 'Show their posts in Explore', 'Public posts can be discovered', false]]}
            />
          </BlockCard>
        </>
      )}
      {tab === 'Weddings' && (
        <BlockCard>
          <TableBlock
            cols={['Wedding', 'Role', 'Date', 'Status']}
            grid="minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr) minmax(0,.8fr)"
            rows={[
              { c: [{ t: 'Aisha and Zain', fw: 600 }, 'Couple', '12 to 14 Oct 2026', ['Live', 'maroon']], go: () => open('wedding', 'az') },
              { c: [{ t: 'Zoya and Faris', fw: 600 }, 'Guest, bride side', '19 to 21 Dec 2025', ['Ended', 'grey']], go: () => open('wedding', 'zf') },
              { c: [{ t: 'Hina and Ali', fw: 600 }, 'Guest', '24 to 26 Oct 2026', ['Upcoming', 'gold']], go: () => open('wedding', 'ha') },
            ]}
          />
        </BlockCard>
      )}
      {tab === 'Posts' && (
        <BlockCard>
          <PhotosBlock photos={POSTS.map((k) => img(k, 240, 300))} />
        </BlockCard>
      )}
      {tab === 'Activity' && (
        <BlockCard>
          <TimelineBlock
            items={[
              ['Today, 14:22', 'Uploaded 12 photos to Walima', '#A6192E'],
              ['Today, 13:05', 'Posted an announcement: Walima starts 8 pm sharp', '#C9A227'],
              ['Today, 09:40', 'Signed in on iPhone 15 Pro'],
              ['Yesterday, 21:18', 'Changed who can see their wedding to invited guests only', '#C9A227'],
              ['Yesterday, 18:02', 'Sent a reply reminder to 34 guests', '#1E5A4A'],
              ['3 Oct, 11:30', 'Sent an enquiry to Shalimar Decor Studio', '#1E5A4A'],
              ['14 Jan, 10:12', 'Created an account'],
            ]}
          />
        </BlockCard>
      )}
    </DetailView>
  )
}
