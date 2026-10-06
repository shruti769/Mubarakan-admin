import { CITIES, RANGES } from '../../data/constants'
import { IC } from '../../data/icons'
import useAdmin from '../../hooks/useAdmin'
import Icon from '../common/Icon'
import Popover, { Option } from '../common/Popover'

const chip = { height: 34, padding: '0 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }
const dateInput = { height: 32, border: '1px solid #E4E0DA', borderRadius: 7, padding: '0 8px' }

// "06/10" from "2026-10-06".
const shortDate = (d) => d.slice(5).split('-').reverse().join('/')

// Date range, city and export, shown in the top bar on the dashboard only.
export default function DashboardFilters() {
  const { state, setState, togglePop, toast } = useAdmin()
  const { range, city, custom, pop } = state
  const rangeLabel = range === 'Custom' ? shortDate(custom.from) + ' to ' + shortDate(custom.to) : range
  const cityOn = city !== 'All cities'

  return (
    <>
      <div data-pop="1" style={{ position: 'relative' }}>
        <div onClick={() => togglePop('rng')} style={{ ...chip, border: '1px solid #E4E0DA', background: '#fff' }}>
          <Icon d={IC.cal} size={15} stroke="#6F6A78" />
          {rangeLabel}
          <Icon d={IC.chevDown} size={12} stroke="#8A8590" sw={2.4} />
        </div>
        {pop === 'rng' && (
          <Popover style={{ top: 40, left: 0, width: 230 }}>
            {RANGES.map((r) => (
              <Option key={r} label={r} on={r === range} onClick={() => setState({ range: r, pop: r === 'Custom' ? 'rng' : '' })} />
            ))}
            {range === 'Custom' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '8px 10px 6px', borderTop: '1px solid #F1ECE4', marginTop: 4 }}>
                <input type="date" value={custom.from} onChange={(e) => setState({ custom: { ...custom, from: e.target.value } })} style={dateInput} />
                <input type="date" value={custom.to} onChange={(e) => setState({ custom: { ...custom, to: e.target.value } })} style={dateInput} />
              </div>
            )}
          </Popover>
        )}
      </div>
      <div data-pop="1" style={{ position: 'relative' }}>
        <div onClick={() => togglePop('cty')} style={{ ...chip, border: '1px solid ' + (cityOn ? '#A6192E' : '#E4E0DA'), background: cityOn ? '#FFF8F8' : '#fff' }}>
          <Icon size={15} stroke="#6F6A78">
            <path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" />
            <circle cx="12" cy="10" r="2.5" />
          </Icon>
          {city}
          <Icon d={IC.chevDown} size={12} stroke="#8A8590" sw={2.4} />
        </div>
        {pop === 'cty' && (
          <Popover style={{ top: 40, left: 0, width: 190 }}>
            {CITIES.map((c) => (
              <Option key={c} label={c} on={c === city} onClick={() => setState({ city: c, pop: '' })} />
            ))}
          </Popover>
        )}
      </div>
      <div
        className="hv-soft"
        onClick={() => toast('Exporting the dashboard for ' + range.toLowerCase() + (cityOn ? ', ' + city : ''))}
        style={{ ...chip, gap: 7, border: '1px solid #E4E0DA', background: '#fff' }}
      >
        <Icon d={IC.download} size={14} stroke="#6F6A78" sw={2.2} />
        Export
      </div>
    </>
  )
}
