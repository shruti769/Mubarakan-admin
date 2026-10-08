import { face } from '../../data/images'
import useAdmin from '../../hooks/useAdmin'
import useNavigation from '../../hooks/useNavigation'
import { searchAll } from '../../lib/data/search'
import useLoad from '../../lib/useLoad'
import { SearchIcon } from '../common/Icon'
import Popover from '../common/Popover'

// Finds people, weddings, businesses and enquiry references from anywhere, after a short pause in typing.
const search = async (q) => {
  if (!q) return { data: [], error: null }
  await new Promise((r) => setTimeout(r, 200))
  return searchAll(q)
}

export default function GlobalSearch() {
  const { state, setState } = useAdmin()
  const { open } = useNavigation()
  const q = state.q.trim().toLowerCase()
  const focused = state.pop === 'search'
  const show = focused && q.length > 0
  const { data, loading } = useLoad(() => search(q), [q])
  const items = show && data ? data : []

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
            <div key={r.key} className="hv-opt" onClick={() => open(r.ent, r.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 9px', borderRadius: 7, cursor: 'pointer' }}>
              <img src={face(r.img, 64)} alt="" style={{ width: 28, height: 32, borderRadius: '14px 14px 5px 5px', objectFit: 'cover', background: '#F0EBE3' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{r.n}</div>
                <div style={{ fontSize: 12, color: '#8A8590' }}>{r.s}</div>
              </div>
              <span style={{ fontSize: 11.5, color: '#A8A29A' }}>{r.k}</span>
            </div>
          ))}
          {!items.length && !loading && <div style={{ padding: 16, textAlign: 'center', fontSize: 13, color: '#8A8590' }}>No matches</div>}
        </Popover>
      )}
    </div>
  )
}
