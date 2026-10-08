import { IC } from '../../data/icons'
import useAdmin from '../../hooks/useAdmin'
import useNavigation from '../../hooks/useNavigation'
import { loadAlerts } from '../../lib/data/alerts'
import useLoad from '../../lib/useLoad'
import Icon from '../common/Icon'
import Popover from '../common/Popover'

export default function Notifications() {
  const { state, setState, togglePop } = useAdmin()
  const { go } = useNavigation()
  // Counted again each time the bell is opened.
  const { data } = useLoad(loadAlerts, [state.pop === 'bell'])
  const items = data || []
  const read = state.read || !items.length

  return (
    <div data-pop="1" style={{ position: 'relative' }}>
      <div className="hv-soft" onClick={() => togglePop('bell')} style={{ width: 34, height: 34, borderRadius: 8, border: '1px solid #E4E0DA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
        <Icon d={IC.bell} size={17} stroke="#14142B" sw={1.8} />
        {!read && (
          <span style={{ position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9, background: '#A6192E', color: '#fff', border: '2px solid #fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {items.length}
          </span>
        )}
      </div>
      {state.pop === 'bell' && (
        <Popover style={{ top: 40, right: 0, width: 340, padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 14px', borderBottom: '1px solid #F1ECE4' }}>
            <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>Notifications</span>
            <span onClick={() => setState({ read: true })} style={{ fontSize: 12.5, color: '#A6192E', fontWeight: 500, cursor: 'pointer' }}>Mark all as read</span>
          </div>
          {!items.length && <div style={{ padding: '22px 14px', fontSize: 13, color: '#8A8590', textAlign: 'center' }}>Nothing waiting for you.</div>}
          {items.map(([t, at, page, extra]) => (
            <div
              key={t}
              className="hv-notif"
              onClick={() => { setState({ read: true }); go(page, extra) }}
              style={{ display: 'flex', gap: 10, padding: '10px 14px', borderBottom: '1px solid #F6F2EC', cursor: 'pointer', background: read ? '#fff' : '#FFFCF7' }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', marginTop: 6, background: read ? '#DDD5C8' : '#A6192E', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, lineHeight: 1.45 }}>{t}</div>
                <div style={{ fontSize: 11.5, color: '#A8A29A', marginTop: 2 }}>{at}</div>
              </div>
            </div>
          ))}
        </Popover>
      )}
    </div>
  )
}
