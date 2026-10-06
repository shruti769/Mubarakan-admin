import { IC } from '../../data/icons'
import Icon from './Icon'

// The floating white panel used by every dropdown and menu.
export default function Popover({ style, children }) {
  return (
    <div
      style={{
        position: 'absolute', background: '#fff', border: '1px solid #E4E0DA', borderRadius: 10,
        boxShadow: '0 12px 30px rgba(20,20,43,.12)', padding: 5, animation: 'popIn .12s ease-out', ...style,
      }}
    >
      {children}
    </div>
  )
}

// One choice in a dropdown, with a tick when selected.
export function Option({ label, on, onClick, bold = true, padding = '8px 10px', tick = 14 }) {
  return (
    <div
      className="hv-opt"
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', padding, borderRadius: 7, cursor: 'pointer', fontSize: 13.5, fontWeight: bold && on ? 600 : 400 }}
    >
      <span style={{ flex: 1 }}>{label}</span>
      {on && <Icon d={IC.check} size={tick} stroke="#A6192E" sw={2.6} />}
    </div>
  )
}

// A plain menu action; red when it is destructive.
export function MenuItem({ label, danger, onClick, borderTop }) {
  return (
    <div
      className="hv-opt"
      onClick={onClick}
      style={{ padding: '8px 10px', borderRadius: 7, fontSize: 13.5, cursor: 'pointer', color: danger ? '#A6192E' : '#14142B', borderTop: borderTop || 'none' }}
    >
      {label}
    </div>
  )
}
