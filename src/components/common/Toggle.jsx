export default function Toggle({ on, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ width: 38, height: 22, borderRadius: 11, background: on ? '#1E5A4A' : '#D3CCC0', position: 'relative', cursor: 'pointer', transition: 'background .15s', flexShrink: 0 }}
    >
      <div
        style={{ position: 'absolute', top: 2, left: on ? 18 : 2, width: 18, height: 18, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)', transition: 'left .15s' }}
      />
    </div>
  )
}
