import { AD_BUSINESSES } from '../../data/selectors'
import useAdmin from '../../hooks/useAdmin'
import Dialog, { DialogButtons } from './Dialog'

const AD_CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Delhi', 'London', 'Birmingham']
const field = { height: 36, border: '1px solid #E4E0DA', borderRadius: 8, padding: '0 10px' }
const label = { display: 'flex', flexDirection: 'column', gap: 5 }

export default function CreateAdModal() {
  const { state, setState, toast } = useAdmin()
  const m = state.modal
  if (!m) return null
  const update = (patch) => setState((s) => ({ modal: { ...s.modal, ...patch } }))
  const close = () => setState({ modal: null })
  const toggleCity = (c) => update({ cities: m.cities.includes(c) ? m.cities.filter((x) => x !== c) : [...m.cities, c] })

  return (
    <Dialog width={520} zIndex={75} onClose={close}>
      <div style={{ fontSize: 17, fontWeight: 600 }}>Create an ad</div>
      <div style={{ fontSize: 13, color: '#8A8590', marginTop: 2 }}>It goes live after a quick check, usually within an hour.</div>
      <label style={{ ...label, marginTop: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Business</span>
        <select value={m.biz} onChange={(e) => update({ biz: e.target.value })} style={{ ...field, background: '#fff' }}>
          {!AD_BUSINESSES.includes(m.biz) && <option value={m.biz}>{m.biz}</option>}
          {AD_BUSINESSES.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      <label style={{ ...label, marginTop: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Headline</span>
        <input value={m.head} onChange={(e) => update({ head: e.target.value })} style={field} />
      </label>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 12 }}>Cities</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
        {AD_CITIES.map((c) => {
          const on = m.cities.includes(c)
          return (
            <div
              key={c}
              onClick={() => toggleCity(c)}
              style={{ height: 30, padding: '0 11px', borderRadius: 7, border: '1px solid ' + (on ? '#14142B' : '#E4E0DA'), background: on ? '#14142B' : '#fff', color: on ? '#fff' : '#3d3a4a', fontSize: 13, display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              {c}
            </div>
          )
        })}
      </div>
      <DialogButtons onCancel={close} onOk={() => { close(); toast('Ad for ' + m.biz + ' sent for a quick check') }} okLabel="Create ad" />
    </Dialog>
  )
}
