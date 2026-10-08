import { useNavigate } from 'react-router-dom'
import { ROLES } from '../../data/constants'
import { IC } from '../../data/icons'
import useAdmin from '../../hooks/useAdmin'
import { useRoute } from '../../hooks/useNavigation'
import Icon from '../common/Icon'
import Popover from '../common/Popover'

// Avatar menu. Switching role shows the admin as that team member sees it.
export default function ProfileMenu() {
  const { state, setState, togglePop, toast, auth, signOut } = useAdmin()
  const navigate = useNavigate()
  const { page, isDetail } = useRoute()
  const role = state.role
  // The signed in admin from the database; their own role decides whether they may view as others.
  const real = auth.me
  const me = { who: real.name, mono: (real.name || '?').trim()[0].toUpperCase() }
  const isOwner = real.role === 'Owner'

  const switchTo = (k) => {
    const keep = isDetail || ROLES[k].pages.split(' ').includes(page)
    setState({ role: k, pop: '' })
    if (!keep) navigate('/')
    toast('Viewing as ' + k)
  }

  return (
    <div data-pop="1" style={{ position: 'relative' }}>
      <div className="hv-opt" onClick={() => togglePop('me')} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '3px 8px 3px 3px', borderRadius: 20, cursor: 'pointer' }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#6E1218', color: '#E8C86A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>{me.mono}</div>
        <div style={{ lineHeight: 1.25 }}>
          <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>{me.who}</div>
          <div style={{ fontSize: 11.5, color: '#8A8590', whiteSpace: 'nowrap' }}>{role}</div>
        </div>
      </div>
      {state.pop === 'me' && (
        <Popover style={{ top: 44, right: 0, width: 280 }}>
          <div style={{ padding: '8px 10px 6px', fontSize: 12, color: '#8A8590', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{real.email}</div>
          {isOwner && <div style={{ padding: '8px 10px 4px', fontSize: 12, color: '#8A8590' }}>View the admin as</div>}
          {isOwner && Object.keys(ROLES).map((k) => (
            <div key={k} className="hv-opt" onClick={() => switchTo(k)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, cursor: 'pointer' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{k}</div>
                <div style={{ fontSize: 12, color: '#8A8590' }}>{ROLES[k].desc}</div>
              </div>
              {k === role && <Icon d={IC.check} size={14} stroke="#A6192E" sw={2.6} />}
            </div>
          ))}
          <div className="hv-opt" onClick={() => { setState({ pop: '' }); signOut() }} style={{ padding: '9px 10px', borderRadius: 7, cursor: 'pointer', fontSize: 13.5, color: '#A6192E', borderTop: '1px solid #F1EEE8', marginTop: 4 }}>
            Sign out
          </div>
        </Popover>
      )}
    </div>
  )
}
