import { DETAIL_TITLES, TITLES } from '../../data/constants'
import { IC } from '../../data/icons'
import useNavigation, { useRoute } from '../../hooks/useNavigation'
import Icon from '../common/Icon'
import DashboardFilters from './DashboardFilters'
import GlobalSearch from './GlobalSearch'
import Notifications from './Notifications'
import ProfileMenu from './ProfileMenu'

export default function Topbar() {
  const { page, ent, isDetail } = useRoute()
  const { back } = useNavigation()
  const title = isDetail ? DETAIL_TITLES[ent] : TITLES[page]

  return (
    <header style={{ height: 60, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px', background: '#fff', borderBottom: '1px solid #E4E0DA', position: 'relative', zIndex: 30 }}>
      {isDetail && (
        <div onClick={back} title="Back" style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E4E0DA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Icon d={IC.chevLeft} size={14} stroke="#14142B" sw={2.2} />
        </div>
      )}
      <div style={{ fontSize: 22, fontWeight: 600, whiteSpace: 'nowrap', marginRight: 8 }}>{title}</div>
      {page === 'dash' && <DashboardFilters />}
      <div style={{ flex: 1 }} />
      <GlobalSearch />
      <Notifications />
      <ProfileMenu />
    </header>
  )
}
