import { useCallback, useEffect } from 'react'
import Card from '../components/common/Card'
import Icon from '../components/common/Icon'
import { IC } from '../data/icons'
import { face, img } from '../data/images'
import { reviewLeft, reviewList } from '../data/selectors'
import useAdmin from '../hooks/useAdmin'

const WEDDING_NAMES = { 'AISHA-ZAIN-26': 'Aisha and Zain', 'SIMRAN-ARJUN-26': 'Simran and Arjun' }
const HISTORY = {
  '@waleed.butt': '2 posts removed in the last 30 days. Suspended once before.',
  '@rohan.m': 'Banned. 9 posts removed before.',
  '@imran.sh': 'New account, 6 days old.',
  '@dholi.brothers': 'Business account, waiting to be verified.',
}

const reasonOf = (m) =>
  m.reps > 0
    ? (m.reps === 1 ? '1 person reported this' : m.reps + ' people reported this') + (m.reasons[0] && !/^(Report|Appeal|Hide)/.test(m.reasons[0]) ? ' as ' + m.reasons[0].toLowerCase() : '')
    : 'Our system thinks this may be inappropriate'

const whereOf = (w) => {
  const p = w.split(' . ')
  if (WEDDING_NAMES[p[0]]) return WEDDING_NAMES[p[0]] + (p[1] ? ', ' + p[1] : '')
  if (/Public feed/.test(w)) return 'Public feed'
  if (/stories/i.test(w)) return 'Stories'
  if (/ad/i.test(w)) return 'Ad in the feed'
  return w
}

const reasonColor = (m) => (m.reps > 0 ? '#A6192E' : '#8A6A12')
const keyHint = (border) => ({ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, border: '1px solid ' + border, borderRadius: 4, padding: '0 5px' })

export default function ReviewPosts() {
  const { state, setState, getState, toast } = useAdmin()

  // Keep or remove the selected post, then move to the next one.
  const act = useCallback((kind) => {
    const st = getState()
    const items = reviewList(st)
    if (!items.length) return
    const cur = items.find((m) => m.id === st.rvSel) || items[0]
    const i = items.indexOf(cur)
    const next = items[i + 1] || items[i - 1]
    setState((s) => ({ rvDone: { ...s.rvDone, [cur.id]: kind }, rvSel: next ? next.id : null }))
    toast(kind === 'keep' ? 'Kept. The post stays up.' : 'Removed. ' + cur.who.n + ' has been told why.')
  }, [getState, setState, toast])

  const move = useCallback((d) => {
    const st = getState()
    const items = reviewList(st)
    if (!items.length) return
    const i = Math.max(0, items.findIndex((m) => m.id === st.rvSel))
    setState({ rvSel: items[Math.min(items.length - 1, Math.max(0, i + d))].id })
  }, [getState, setState])

  useEffect(() => {
    const onKey = (e) => {
      const t = (e.target.tagName || '').toLowerCase()
      if (t === 'input' || t === 'textarea' || t === 'select' || getState().confirm) return
      if (e.key === 'k' || e.key === 'K') act('keep')
      if (e.key === 'r' || e.key === 'R') act('remove')
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        move(e.key === 'ArrowDown' ? 1 : -1)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [act, move, getState])

  const items = reviewList(state)
  const all = reviewLeft(state)
  const cur = items.find((m) => m.id === state.rvSel) || items[0]
  const done = Object.values(state.rvDone)

  const stats = [
    ['Waiting for review', String(205 + all.length)],
    ['Reported by people', String(all.filter((m) => m.reps > 0).length + 138)],
    ['Reviewed today', String(326 + done.length)],
    ['Removed today', String(41 + done.filter((v) => v === 'remove').length)],
  ]
  const tabs = [['all', 'All', all.length], ['rep', 'Reported', all.filter((m) => m.reps > 0).length], ['sys', 'By system', all.filter((m) => m.reps === 0).length]]
  const sensitive = cur && cur.img && cur.ai[1] >= 25 && cur.ai[2] !== 'green' && !state.reveal[cur.id]

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 12, marginBottom: 14 }}>
        {stats.map(([l, v]) => (
          <Card key={l} style={{ padding: '13px 16px' }}>
            <div style={{ fontSize: 13, color: '#6F6A78' }}>{l}</div>
            <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1.15 }}>{v}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '360px minmax(0,1fr)', gap: 12, alignItems: 'start' }}>
        <Card style={{ overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 4, padding: 8, borderBottom: '1px solid #EFEAE2' }}>
            {tabs.map(([key, t, n]) => {
              const on = state.rvTab === key
              return (
                <div key={key} onClick={() => setState({ rvTab: key, rvSel: null })} style={{ flex: 1, height: 30, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', background: on ? '#14142B' : 'transparent', color: on ? '#fff' : '#3d3a4a' }}>
                  {t}
                  <span style={{ fontSize: 11.5, opacity: 0.75 }}>{n}</span>
                </div>
              )
            })}
          </div>
          <div style={{ maxHeight: 620, overflowY: 'auto' }}>
            {items.map((m) => {
              const on = cur && m.id === cur.id
              return (
                <div key={m.id} onClick={() => setState({ rvSel: m.id })} style={{ display: 'flex', gap: 11, padding: '11px 12px', borderBottom: '1px solid #F4F0E9', cursor: 'pointer', background: on ? '#FBF6EA' : '#fff', boxShadow: on ? 'inset 3px 0 0 #A6192E' : 'none' }}>
                  <div style={{ width: 46, height: 52, borderRadius: 8, overflow: 'hidden', background: '#F4F0E9', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {m.img ? <img src={img(m.img, 120, 140)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icon d={IC.chat} size={18} stroke="#8A8590" sw={1.8} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.who.n}</span>
                      <span style={{ fontSize: 12, color: '#A8A29A', whiteSpace: 'nowrap' }}>{m.at}</span>
                    </div>
                    <div style={{ fontSize: 12.5, color: '#6F6A78', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.type} . {whereOf(m.where)}</div>
                    <div style={{ fontSize: 12, fontWeight: 500, color: reasonColor(m), marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{reasonOf(m)}</div>
                  </div>
                </div>
              )
            })}
            {!items.length && <div style={{ padding: '40px 16px', textAlign: 'center', fontSize: 13.5, color: '#8A8590' }}>Nothing left in this list.</div>}
          </div>
        </Card>

        {cur ? (
          <Card style={{ overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid #EFEAE2' }}>
              <img src={face(cur.who.img, 80)} alt="" style={{ width: 36, height: 40, borderRadius: '18px 18px 6px 6px', objectFit: 'cover', background: '#F0EBE3' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {cur.who.n} <span style={{ fontWeight: 400, color: '#8A8590' }}>{cur.who.s}</span>
                </div>
                <div style={{ fontSize: 12.5, color: '#6F6A78' }}>{cur.type} . {whereOf(cur.where)} . {cur.at}</div>
              </div>
              <span style={{ fontSize: 12.5, color: '#6F6A78' }}>{items.indexOf(cur) + 1 + ' of ' + items.length}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 280px' }}>
              <div style={{ height: 520, background: '#16141c', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {cur.img ? (
                  <img src={img(cur.img, 900, 1000)} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: sensitive ? 'blur(24px) brightness(.7)' : 'none' }} />
                ) : (
                  <div style={{ maxWidth: 420, background: '#fff', borderRadius: '16px 16px 16px 4px', padding: '16px 18px', fontSize: 15, lineHeight: 1.55 }}>{cur.text}</div>
                )}
                {sensitive && (
                  <div onClick={() => setState((s) => ({ reveal: { ...s.reveal, [cur.id]: true } }))} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#fff', cursor: 'pointer', fontSize: 13.5, fontWeight: 500 }}>
                    <Icon size={26} stroke="#fff" sw={1.8}>
                      <path d={IC.eye} />
                      <circle cx="12" cy="12" r="3" />
                    </Icon>
                    May be sensitive. Click to show.
                  </div>
                )}
              </div>
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14, borderLeft: '1px solid #EFEAE2' }}>
                <div>
                  <div style={{ fontSize: 12.5, color: '#8A8590' }}>Why it is here</div>
                  <div style={{ fontSize: 13.5, fontWeight: 500, marginTop: 3, color: reasonColor(cur), lineHeight: 1.45 }}>{reasonOf(cur) + '.'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: '#8A8590' }}>Caption</div>
                  <div style={{ fontSize: 13.5, marginTop: 3, lineHeight: 1.45 }}>{cur.cap}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12.5, color: '#8A8590' }}>About the person</div>
                  <div style={{ fontSize: 13.5, marginTop: 3, lineHeight: 1.45 }}>{HISTORY[cur.who.s] || 'No problems before. On Mubarakan since 2025.'}</div>
                </div>
                <div style={{ flex: 1 }} />
                <div className="hv-keep" onClick={() => act('keep')} style={{ height: 38, borderRadius: 8, border: '1px solid #1E5A4A', color: '#1E5A4A', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                  Keep it<span style={keyHint('rgba(30,90,74,.4)')}>K</span>
                </div>
                <div className="hv-remove" onClick={() => act('remove')} style={{ height: 38, borderRadius: 8, background: '#A6192E', color: '#fff', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer' }}>
                  Remove it<span style={keyHint('rgba(255,255,255,.5)')}>R</span>
                </div>
                <div style={{ fontSize: 12, color: '#A8A29A', textAlign: 'center' }}>Use the up and down arrows to move through the list</div>
              </div>
            </div>
          </Card>
        ) : (
          <Card style={{ height: 420, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 600 }}>All caught up</div>
            <div style={{ fontSize: 13.5, color: '#8A8590' }}>New posts show up here when someone reports them.</div>
          </Card>
        )}
      </div>
    </>
  )
}
