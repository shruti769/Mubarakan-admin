import useAdmin from '../../hooks/useAdmin'
import { fmtNum as fmt } from '../../lib/data/core'

const GOAL_ROW = 3

/*
 * Invites sent in the period and how far they got. funnel: { sent, delivered, opened, app, yes };
 * null is a step the backend does not record (delivery and opens), shown as '—'.
 */
export default function InvitesFunnel({ funnel }) {
  const { state } = useAdmin()
  const city = state.city
  const f = funnel || {}
  const rows = [['Invites sent', f.sent], ['Delivered', f.delivered], ['Opened', f.opened], ['Downloaded the app', f.app], ['Said yes to the wedding', f.yes]]
  const sent = f.sent || 0

  return (
    <div style={{ background: '#fff', border: '1px solid #EAE3D8', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>Invites sent vs app downloads</div>
      <div style={{ fontSize: 12.5, color: '#8A8590' }}>{state.range + (city !== 'All cities' ? ', ' + city : '') + '. Percentages are of invites sent.'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 16 }}>
        {rows.map(([t, n], i) => {
          const known = typeof n === 'number'
          const p = known && sent ? (n / sent) * 100 : 0
          const goal = i === GOAL_ROW
          return (
            <div key={t}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 13, marginBottom: 5 }}>
                <span style={{ flex: 1, fontWeight: 500 }}>{t}</span>
                <span style={{ fontWeight: 600 }}>{known ? fmt(n) : '—'}</span>
                <span style={{ color: '#8A8590', width: 46, textAlign: 'right' }}>{!known || !sent ? '—' : i ? p.toFixed(1) + '%' : '100%'}</span>
              </div>
              <div style={{ position: 'relative', height: 10, borderRadius: 5, background: '#F4F0E9' }}>
                <div style={{ width: p.toFixed(1) + '%', height: '100%', borderRadius: 5, background: i === 3 ? '#A6192E' : i === 4 ? '#C9A227' : '#D8CFBF' }} />
                {goal && (
                  <>
                    <div style={{ position: 'absolute', left: '60%', top: -4, height: 18, borderLeft: '2px dashed #14142B' }} />
                    <div style={{ position: 'absolute', left: '60%', top: 13, transform: 'translateX(-50%)', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>Goal 60%</div>
                  </>
                )}
              </div>
              {goal && <div style={{ height: 12 }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
