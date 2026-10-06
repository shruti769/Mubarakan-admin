// Centered dialog over a dimmed backdrop. Clicking the backdrop closes it.
export default function Dialog({ width, zIndex, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,43,.4)', animation: 'fadeIn .14s' }} />
      <div style={{ position: 'relative', width, background: '#fff', borderRadius: 14, padding: 22, boxShadow: '0 24px 60px rgba(20,20,43,.22)', animation: 'modalIn .16s ease-out' }}>
        {children}
      </div>
    </div>
  )
}

export function DialogButtons({ onCancel, onOk, okLabel, okBg = '#A6192E' }) {
  const base = { height: 34, padding: '0 14px', borderRadius: 8, display: 'flex', alignItems: 'center', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
      <div onClick={onCancel} style={{ ...base, border: '1px solid #E4E0DA' }}>Cancel</div>
      <div onClick={onOk} style={{ ...base, background: okBg, color: '#fff' }}>{okLabel}</div>
    </div>
  )
}
