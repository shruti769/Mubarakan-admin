// Outline button by default; `primary` makes it solid maroon.
export default function Button({ children, primary, onClick, height = 34, padding = '0 14px', style }) {
  return (
    <div
      onClick={onClick}
      style={{
        height, padding, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
        background: primary ? '#A6192E' : '#fff', color: primary ? '#fff' : '#14142B', border: '1px solid ' + (primary ? '#A6192E' : '#E4E0DA'),
        whiteSpace: 'nowrap', ...style,
      }}
    >
      {children}
    </div>
  )
}
