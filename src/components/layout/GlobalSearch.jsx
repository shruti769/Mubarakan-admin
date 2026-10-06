import { face } from '../../data/images'
import { getBusinesses, getEnquiries, getUsers, getWeddings } from '../../data/selectors'
import useAdmin from '../../hooks/useAdmin'
import useNavigation from '../../hooks/useNavigation'
import { SearchIcon } from '../common/Icon'
import Popover from '../common/Popover'

// Finds people, weddings, businesses and enquiry references from anywhere.
function search(state, q, open) {
  const has = (s) => s.toLowerCase().includes(q)
  const out = []
  getUsers(state).filter((u) => has(u.name + u.handle)).slice(0, 3)
    .forEach((u) => out.push({ key: 'u' + u.id, n: u.name, s: u.handle, k: 'User', img: face(u.img, 64), go: () => open('user', u.id) }))
  getWeddings().filter((w) => has(w.name + w.code)).slice(0, 3)
    .forEach((w) => out.push({ key: 'w' + w.id, n: w.name, s: w.code, k: 'Wedding', img: face(w.img, 64), go: () => open('wedding', w.id) }))
  getBusinesses(state).filter((b) => has(b.name)).slice(0, 3)
    .forEach((b) => out.push({ key: 'b' + b.id, n: b.name, s: b.cat, k: 'Business', img: face(b.img, 64), go: () => open('business', b.id) }))
  getEnquiries().filter((e) => has(e.ref)).slice(0, 2)
    .forEach((e) => out.push({ key: 'e' + e.id, n: e.ref, s: e.cust + ' to ' + e.biz, k: 'Enquiry', img: face('sariRed', 64), go: () => open('enquiry', e.id) }))
  return out
}

export default function GlobalSearch() {
  const { state, setState } = useAdmin()
  const { open } = useNavigation()
  const q = state.q.trim().toLowerCase()
  const focused = state.pop === 'search'
  const show = focused && q.length > 0
  const items = show ? search(state, q, open) : []

  return (
    <div data-pop="1" style={{ position: 'relative', width: 260 }}>
      <div style={{ height: 34, borderRadius: 8, background: '#F7F4EF', border: '1px solid ' + (focused ? '#C9A227' : '#EAE3D8'), display: 'flex', alignItems: 'center', gap: 8, padding: '0 11px' }}>
        <SearchIcon />
        <input
          value={state.q}
          onChange={(e) => setState({ q: e.target.value, pop: 'search' })}
          onFocus={() => setState({ pop: 'search' })}
          placeholder="Search people, weddings, codes"
          style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent', fontSize: 13.5 }}
        />
      </div>
      {show && (
        <Popover style={{ top: 40, right: 0, width: 340 }}>
          {items.map((r) => (
            <div key={r.key} className="hv-opt" onClick={r.go} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 9px', borderRadius: 7, cursor: 'pointer' }}>
              <img src={r.img} alt="" style={{ width: 28, height: 32, borderRadius: '14px 14px 5px 5px', objectFit: 'cover', background: '#F0EBE3' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.n}</div>
                <div style={{ fontSize: 12, color: '#8A8590' }}>{r.s}</div>
              </div>
              <span style={{ fontSize: 11.5, color: '#A8A29A' }}>{r.k}</span>
            </div>
          ))}
          {!items.length && <div style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#8A8590' }}>No matches</div>}
        </Popover>
      )}
    </div>
  )
}
