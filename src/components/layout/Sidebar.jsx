import logo from '../../assets/logo.png'
import { ENT_PAGE, NAV } from '../../data/constants'
import { IC } from '../../data/icons'
import useAdmin from '../../hooks/useAdmin'
import useNavigation, { useRoute } from '../../hooks/useNavigation'
import { loadReview } from '../../lib/data/review'
import useLoad from '../../lib/useLoad'
import Icon from '../common/Icon'

const collapseBtn = { width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8A8590' }

export default function Sidebar() {
  const { state, setState, can } = useAdmin()
  const { go } = useNavigation()
  const { page, ent } = useRoute()
  const open = state.side
  const active = ent ? ENT_PAGE[ent] : page
  // Posts and comments waiting in the review queue; counted again after each review.
  const { data: queue } = useLoad(loadReview, [state.rvDone])
  const reviewLeft = queue ? queue.filter((m) => !state.rvDone[m.id]).length : '—'
  const toggle = () => setState({ side: !open })

  const groups = NAV.map(([g, items]) => [g, items.filter((i) => can(i[0]))]).filter(([, items]) => items.length)

  return (
    <aside style={{ width: open ? 232 : 64, flexShrink: 0, height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff', borderRight: '1px solid #E4E0DA', transition: 'width .16s ease' }}>
      <div style={{ height: 60, display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', borderBottom: '1px solid #EFEAE2', flexShrink: 0 }}>
        {open ? (
          <img src={logo} alt="Mubarakan" style={{ height: 21, display: 'block' }} />
        ) : (
          <div style={{ width: 32, height: 32, overflow: 'hidden', borderRadius: 6 }}>
            <img src={logo} alt="Mubarakan" style={{ height: 32, display: 'block' }} />
          </div>
        )}
        <div style={{ flex: 1 }} />
        {open && (
          <div className="hv-icon" onClick={toggle} title="Collapse" style={collapseBtn}>
            <Icon d={IC.chevLeft} size={15} />
          </div>
        )}
      </div>
      {!open && (
        <div className="hv-icon" onClick={toggle} title="Expand" style={{ ...collapseBtn, margin: '10px auto 0', width: 32 }}>
          <Icon d={IC.chevRight} size={15} />
        </div>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 10px 16px' }}>
        {groups.map(([g, items]) => (
          <div key={g} style={{ marginTop: 14 }}>
            {open && <div style={{ padding: '0 10px 6px', fontSize: 11.5, fontWeight: 600, color: '#A8A29A' }}>{g}</div>}
            {items.map(([key, label, icon]) => {
              const on = key === active
              return (
                <div
                  key={key}
                  className="hv-nav"
                  onClick={() => go(key)}
                  title={label}
                  style={{ display: 'flex', alignItems: 'center', gap: 11, height: 36, padding: '0 10px', marginBottom: 2, borderRadius: 8, cursor: 'pointer', background: on ? '#F7F1E7' : 'transparent', color: on ? '#A6192E' : '#3d3a4a', fontSize: 14, fontWeight: on ? 600 : 400 }}
                >
                  <Icon d={IC[icon]} size={18} stroke={on ? '#A6192E' : '#8A8590'} sw={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }} />
                  {open && <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>}
                  {key === 'review' && open && (
                    <span style={{ minWidth: 24, height: 19, padding: '0 6px', borderRadius: 10, background: '#A6192E', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{reviewLeft}</span>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </aside>
  )
}
