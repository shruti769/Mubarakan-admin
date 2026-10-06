import { fmt } from '../../data/selectors'
import useAdmin from '../../hooks/useAdmin'

const FUNNEL = [['Invites sent', 412880], ['Delivered', 398214], ['Opened', 341560], ['Downloaded the app', 262410], ['Said yes to the wedding', 219980]]
const GOAL_ROW = 3

export default function InvitesFunnel({ factor }) {
  const { state } = useAdmin()
  const city = state.city

  return (
    <div style={{ background: '#fff', border: '1px solid #EAE3D8', borderRadius: 12, padding: '16px 18px' }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>Invites sent vs app downloads</div>
      <div style={{ fontSize: 12.5, color: '#8A8590' }}>{'Last 30 days' + (city !== 'All cities' ? ', ' + city : '') + '. Percentages are of invites sent.'}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 16 }}>
        {FUNNEL.map(([t, n], i) => {
          const p = (n / FUNNEL[0][1]) * 100
          const goal = i === GOAL_ROW
          return (
            <div key={t}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 13, marginBottom: 5 }}>
                <span style={{ flex: 1, fontWeight: 500 }}>{t}</span>
                <span style={{ fontWeight: 600 }}>{fmt(n * factor)}</span>
                <span style={{ color: '#8A8590', width: 46, textAlign: 'right' }}>{i ? p.toFixed(1) + '%' : '100%'}</span>
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
