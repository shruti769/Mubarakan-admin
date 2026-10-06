import { tone } from '../../data/constants'
import useAdmin from '../../hooks/useAdmin'
import Button from '../common/Button'
import { DotsIcon } from '../common/Icon'
import Popover, { MenuItem } from '../common/Popover'

const MONO = "'JetBrains Mono',monospace"

/*
 * Header, numbers, tabs and content for any one record.
 *   img, title, sub, status: [label, tone], code?, cover?
 *   stats: [label, value], actions: { label, run, primary }, more: { label, run, danger }
 *   tabs: names, tab: the open one, onTab(name), children: the open tab's blocks
 */
export default function DetailView({ img, cover, title, sub, code, status, stats, actions, more, tabs, tab, onTab, children }) {
  const { state, togglePop, setState } = useAdmin()
  const [stBg, stFg] = tone(status[1])

  return (
    <>
      <div style={{ background: '#fff', border: '1px solid #E4E0DA', borderRadius: 12, overflow: 'hidden' }}>
        {cover && (
          <div style={{ height: 150, position: 'relative', background: '#6E1218' }}>
            <img src={cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(30,4,8,.45))' }} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px' }}>
          <img
            src={img}
            alt=""
            style={{ width: 64, height: 74, borderRadius: '32px 32px 10px 10px', objectFit: 'cover', border: '2px solid #fff', boxShadow: '0 0 0 1px #E4E0DA', flexShrink: 0, background: '#F0EBE3', marginTop: cover ? -44 : 0, position: 'relative' }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22, fontWeight: 600 }}>{title}</span>
              <span style={{ fontSize: 12, fontWeight: 500, padding: '2px 9px', borderRadius: 20, background: stBg, color: stFg }}>{status[0]}</span>
            </div>
            <div style={{ fontSize: 13.5, color: '#6F6A78', marginTop: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
              {code && <span style={{ fontFamily: MONO, fontSize: 12.5, color: '#14142B', background: '#F7F4EF', borderRadius: 5, padding: '1px 7px' }}>{code}</span>}
              {sub}
            </div>
          </div>
          {actions.map((a) => (
            <Button key={a.label} primary={a.primary} onClick={a.run} style={{ gap: 0 }}>{a.label}</Button>
          ))}
          {more.length > 0 && (
            <div data-pop="1" style={{ position: 'relative' }}>
              <div onClick={() => togglePop('xmore')} style={{ height: 34, padding: '0 10px', borderRadius: 8, border: '1px solid #E4E0DA', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <DotsIcon />
              </div>
              {state.pop === 'xmore' && (
                <Popover style={{ right: 0, top: 40, minWidth: 210, boxShadow: '0 12px 30px rgba(20,20,43,.14)', zIndex: 25 }}>
                  {more.map((m) => (
                    <MenuItem key={m.label} label={m.label} danger={m.danger} onClick={() => { setState({ pop: '' }); m.run() }} />
                  ))}
                </Popover>
              )}
            </div>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', borderTop: '1px solid #EFEAE2' }}>
          {stats.map(([l, v], i) => (
            <div key={l} style={{ padding: '12px 20px', borderLeft: i ? '1px solid #EFEAE2' : 'none' }}>
              <div style={{ fontSize: 12.5, color: '#6F6A78' }}>{l}</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.15 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 2, padding: '0 14px', borderTop: '1px solid #EFEAE2' }}>
          {tabs.map((t) => (
            <div key={t} onClick={() => onTab(t)} style={{ padding: '11px 10px', marginTop: -1, borderTop: '2px solid ' + (t === tab ? '#A6192E' : 'transparent'), fontSize: 13.5, fontWeight: 500, color: t === tab ? '#14142B' : '#8A8590', cursor: 'pointer' }}>
              {t}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </>
  )
}
