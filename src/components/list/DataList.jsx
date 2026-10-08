import { IC } from '../../data/icons'
import useAdmin from '../../hooks/useAdmin'
import Button from '../common/Button'
import { StatTile } from '../common/Card'
import Icon, { DotsIcon, SearchIcon } from '../common/Icon'
import Popover, { MenuItem, Option } from '../common/Popover'
import Cell from './Cell'

const PER_PAGE = 10
const DATE_OPTS = ['Any time', 'Last 7 days', 'Last 30 days']

function Checkbox({ on, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ width: 16, height: 16, borderRadius: 4, border: '1.5px solid ' + (on ? '#A6192E' : '#CFC8BC'), background: on ? '#A6192E' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
    >
      <Icon d={IC.check} size={10} stroke="#fff" sw={3.6} />
    </div>
  )
}

function FilterDropdown({ id, label, value, options, isSet, onPick }) {
  const { state, togglePop } = useAdmin()
  return (
    <div data-pop="1" style={{ position: 'relative' }}>
      <div
        onClick={() => togglePop(id)}
        style={{ height: 34, padding: '0 11px', borderRadius: 8, border: '1px solid ' + (isSet ? '#A6192E' : '#E4E0DA'), background: isSet ? '#FFF8F8' : '#fff', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13.5, cursor: 'pointer', whiteSpace: 'nowrap', color: '#14142B' }}
      >
        <span style={{ color: '#8A8590' }}>{label}:</span>
        <span style={{ fontWeight: 500 }}>{value}</span>
        <Icon d={IC.chevDown} size={12} stroke="#8A8590" sw={2.4} />
      </div>
      {state.pop === id && (
        <Popover style={{ top: 40, left: 0, minWidth: 180, zIndex: 20 }}>
          {options.map((o) => (
            <Option key={o} label={o} on={o === value} bold={false} padding="7px 10px" tick={13} onClick={() => onPick(o)} />
          ))}
        </Popover>
      )}
    </div>
  )
}

/*
 * A searchable, filterable, sortable table with bulk actions and a menu on each row.
 * `cfg` describes it:
 *   rows, search(row) -> text, noun/one, sub, ph, btns, stats, tabs
 *   cols: { key, label, type: person|text|code|num|pill, w, sort(row), value(row) }
 *   bulk: { label, msg with {n}, danger }, menu(row): { label, run, danger }, open(row)
 */
export default function DataList({ listKey: k, cfg }) {
  const { state, setState, ls, lset, togglePop, ask, toast } = useAdmin()
  const s = ls(k)
  const gcity = state.city

  let rows = cfg.rows.filter((r) => {
    if (s.q && !cfg.search(r).toLowerCase().includes(s.q.toLowerCase())) return false
    if (s.st !== 'All' && r.st[0] !== s.st) return false
    const c = s.city !== 'Any' ? s.city : gcity !== 'All cities' ? gcity : null
    if (c && !String(r.city).includes(c)) return false
    if (s.date === 'Last 7 days' && r.age > 7) return false
    if (s.date === 'Last 30 days' && r.age > 30) return false
    return true
  })
  if (s.sort) {
    const col = cfg.cols.find((c) => c.key === s.sort)
    rows = rows.slice().sort((a, b) => {
      const x = col.sort(a), y = col.sort(b)
      return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * s.dir
    })
  }

  const total = rows.length
  const pages = Math.max(1, Math.ceil(total / PER_PAGE))
  const pg = Math.min(s.pg, pages - 1)
  const view = rows.slice(pg * PER_PAGE, pg * PER_PAGE + PER_PAGE)
  const allOn = view.length > 0 && view.every((r) => s.sel[r.id])
  const selIds = Object.keys(s.sel).filter((x) => s.sel[x])
  const statuses = ['All', ...new Set(cfg.rows.map((r) => r.st[0]))]
  // The cities that actually appear in this list.
  const cityOpts = ['Any', ...[...new Set(cfg.rows.map((r) => r.city).filter((c) => c && c !== '—'))].sort((a, b) => a.localeCompare(b))]
  const hasFilters = s.q || s.st !== 'All' || s.city !== 'Any' || s.date !== 'Any time'
  const grid = '16px ' + cfg.cols.map((c) => 'minmax(0,' + c.w + ')').join(' ') + ' 28px'
  const clear = () => lset(k, { q: '', st: 'All', city: 'Any', date: 'Any time', pg: 0 })
  const pick = (key) => (v) => { lset(k, { [key]: v, pg: 0 }); setState({ pop: '' }) }

  // A bulk action either saves through `run(ids)`, or (with `off`) says it is not connected yet.
  const runBulk = (b) => {
    const n = selIds.length
    if (b.off) return toast(b.off)
    const run = () => { lset(k, { sel: {} }); if (b.run) b.run(selIds); else toast(b.msg.replace('{n}', n)) }
    if (b.danger) ask({ title: b.label + ' ' + n + ' ' + (n === 1 ? cfg.one : cfg.noun) + '?', body: 'This applies to every selected row and is saved in the activity log.', label: b.label, then: run })
    else run()
  }

  const pageBtn = { height: 30, padding: '0 11px', borderRadius: 7, border: '1px solid #E4E0DA', display: 'flex', alignItems: 'center', fontSize: 13, cursor: 'pointer' }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1, fontSize: 14, color: '#6F6A78' }}>{cfg.sub}</div>
        {(cfg.btns || []).map((b) => (
          <Button key={b.label} primary={b.primary} onClick={b.run}>{b.label}</Button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cfg.stats.length}, minmax(0,1fr))`, gap: 12, marginBottom: 14 }}>
        {cfg.stats.map(([l, v, d]) => (
          <StatTile key={l} label={l} value={v} delta={d} deltaColor={/^↓|^-/.test(d || '') ? '#A6192E' : '#1E5A4A'} />
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #E4E0DA', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px' }}>
          <div style={{ height: 34, width: 280, border: '1px solid #E4E0DA', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
            <SearchIcon size={14} />
            <input value={s.q} onChange={(e) => lset(k, { q: e.target.value, pg: 0 })} placeholder={cfg.ph || 'Search'} style={{ flex: 1, minWidth: 0, border: 0, outline: 0, background: 'transparent' }} />
          </div>
          <FilterDropdown id={'dd:' + k + ':st'} label="Status" value={s.st} options={statuses} isSet={s.st !== 'All'} onPick={pick('st')} />
          <FilterDropdown id={'dd:' + k + ':city'} label="City" value={s.city} options={cityOpts} isSet={s.city !== 'Any'} onPick={pick('city')} />
          <FilterDropdown id={'dd:' + k + ':date'} label="Date" value={s.date} options={DATE_OPTS} isSet={s.date !== 'Any time'} onPick={pick('date')} />
          {hasFilters && <span onClick={clear} style={{ fontSize: 13, color: '#A6192E', fontWeight: 500, cursor: 'pointer', marginLeft: 4 }}>Clear filters</span>}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 13, color: '#8A8590' }}>{total + ' ' + (total === 1 ? cfg.one : cfg.noun)}</span>
        </div>

        {selIds.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: '#FBF6EA', borderTop: '1px solid #F1E6CC', borderBottom: '1px solid #F1E6CC', animation: 'fadeIn .12s' }}>
            <span style={{ fontSize: 13.5, fontWeight: 600, marginRight: 6 }}>{selIds.length} selected</span>
            {(cfg.bulk || []).map((b) => (
              <div key={b.label} onClick={() => runBulk(b)} style={{ height: 30, padding: '0 12px', borderRadius: 7, border: '1px solid ' + (b.danger ? '#E3B9BF' : '#E4E0DA'), background: '#fff', color: b.danger ? '#A6192E' : '#14142B', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                {b.label}
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <span onClick={() => lset(k, { sel: {} })} style={{ fontSize: 13, color: '#6F6A78', cursor: 'pointer' }}>Clear selection</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, alignItems: 'center', padding: '0 14px', height: 38, background: '#FBF9F5', borderTop: '1px solid #EFEAE2', borderBottom: '1px solid #EFEAE2' }}>
          <Checkbox
            on={allOn}
            onClick={(e) => {
              e.stopPropagation()
              const sel = { ...s.sel }
              view.forEach((r) => { sel[r.id] = !allOn })
              lset(k, { sel })
            }}
          />
          {cfg.cols.map((c) => {
            const on = s.sort === c.key
            return (
              <div
                key={c.key}
                onClick={() => lset(k, { sort: c.key, dir: on ? -s.dir : 1 })}
                style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: c.type === 'num' ? 'flex-end' : 'flex-start', fontSize: 12.5, fontWeight: 500, color: on ? '#14142B' : '#8A8590', cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}
              >
                {c.label}
                <Icon d={on && s.dir < 0 ? IC.chevDown : IC.chevUp} size={10} sw={2.6} style={{ opacity: on ? 1 : 0.3 }} />
              </div>
            )
          })}
          <div />
        </div>

        {view.map((r) => {
          const on = !!s.sel[r.id]
          const menuKey = 'm:' + k + ':' + r.id
          const menu = cfg.menu(r)
          return (
            <div
              key={r.id}
              className="hv-row"
              onClick={() => cfg.open(r)}
              style={{ display: 'grid', gridTemplateColumns: grid, gap: 12, alignItems: 'center', padding: '0 14px', minHeight: 52, borderBottom: '1px solid #F4F0E9', cursor: 'pointer', background: on ? '#FFFBF5' : '#fff' }}
            >
              <Checkbox on={on} onClick={(e) => { e.stopPropagation(); lset(k, { sel: { ...s.sel, [r.id]: !on } }) }} />
              {cfg.cols.map((c) => (
                <div key={c.key} style={{ minWidth: 0, display: 'flex', justifyContent: c.type === 'num' ? 'flex-end' : 'flex-start' }}>
                  <Cell type={c.type} value={c.value(r)} />
                </div>
              ))}
              <div data-pop="1" style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end' }}>
                <div className="hv-icon" onClick={(e) => { e.stopPropagation(); togglePop(menuKey) }} title="Actions" style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <DotsIcon />
                </div>
                {state.pop === menuKey && (
                  <Popover style={{ right: 0, top: 32, minWidth: 200, boxShadow: '0 12px 30px rgba(20,20,43,.14)', zIndex: 25 }}>
                    {menu.map((m, i) => (
                      <MenuItem
                        key={m.label}
                        label={m.label}
                        danger={m.danger}
                        borderTop={m.danger && i && !menu[i - 1].danger ? '1px solid #F1ECE4' : 'none'}
                        onClick={(e) => { e.stopPropagation(); setState({ pop: '' }); m.run() }}
                      />
                    ))}
                  </Popover>
                )}
              </div>
            </div>
          )
        })}

        {total === 0 && (
          <div style={{ padding: '48px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 14.5, fontWeight: 600 }}>Nothing matches these filters</div>
            <div style={{ fontSize: 13, color: '#8A8590', marginTop: 4 }}>Try another search or clear the filters.</div>
            <div onClick={clear} style={{ display: 'inline-flex', marginTop: 12, height: 32, padding: '0 14px', alignItems: 'center', borderRadius: 8, border: '1px solid #E4E0DA', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Clear filters</div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px' }}>
          <span style={{ fontSize: 13, color: '#8A8590', flex: 1 }}>
            {total ? 'Showing ' + (pg * PER_PAGE + 1) + ' to ' + Math.min(total, pg * PER_PAGE + PER_PAGE) + ' of ' + total : 'No results'}
          </span>
          <div onClick={() => pg > 0 && lset(k, { pg: pg - 1 })} style={{ ...pageBtn, color: pg > 0 ? '#14142B' : '#C9C2B6' }}>Previous</div>
          {Array.from({ length: pages }, (_, i) => (
            <div
              key={i}
              onClick={() => lset(k, { pg: i })}
              style={{ minWidth: 30, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, cursor: 'pointer', background: i === pg ? '#14142B' : '#fff', color: i === pg ? '#fff' : '#3d3a4a', border: '1px solid ' + (i === pg ? '#14142B' : '#E4E0DA') }}
            >
              {i + 1}
            </div>
          ))}
          <div onClick={() => pg < pages - 1 && lset(k, { pg: pg + 1 })} style={{ ...pageBtn, color: pg < pages - 1 ? '#14142B' : '#C9C2B6' }}>Next</div>
        </div>
      </div>
    </>
  )
}
