import { IC } from '../../data/icons'
import useAdmin from '../../hooks/useAdmin'
import Icon from './Icon'

export default function Toasts() {
  const { state } = useAdmin()
  return (
    <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
      {state.toasts.map((t) => (
        <div
          key={t.id}
          style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#14142B', color: '#fff', fontSize: 13.5, padding: '10px 16px 10px 12px', borderRadius: 10, animation: 'toastIn .18s ease-out', boxShadow: '0 10px 24px rgba(0,0,0,.24)' }}
        >
          <Icon d={IC.check} size={15} stroke="#E8C86A" sw={2.6} />
          {t.msg}
        </div>
      ))}
    </div>
  )
}
