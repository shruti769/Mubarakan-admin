import { useState } from 'react'
import useAdmin from '../../hooks/useAdmin'
import { createAd, loadBusinessChoices, updateAd } from '../../lib/data/business'
import { loadCities } from '../../lib/data/cities'
import useLoad from '../../lib/useLoad'
import Dialog, { DialogButtons } from './Dialog'

const field = { height: 36, border: '1px solid #E4E0DA', borderRadius: 8, padding: '0 10px' }
const label = { display: 'flex', flexDirection: 'column', gap: 5 }

// Creates an ad, or edits the headline and cities of one when `modal.id` is set.
export default function CreateAdModal() {
  const { state, setState, toast } = useAdmin()
  const m = state.modal
  const { data: vendors } = useLoad(loadBusinessChoices, [!!m])
  const { data: cities } = useLoad(loadCities, [!!m])
  const [busy, setBusy] = useState(false)
  if (!m) return null
  const names = (vendors || []).map((v) => v.name)
  const biz = m.biz || names[0] || ''
  const update = (patch) => setState((s) => ({ modal: { ...s.modal, ...patch } }))
  const close = () => setState({ modal: null })
  const toggleCity = (c) => update({ cities: m.cities.includes(c) ? m.cities.filter((x) => x !== c) : [...m.cities, c] })

  const save = async () => {
    if (busy) return
    const vendor = (vendors || []).find((v) => v.name === biz)
    if (!vendor) return toast('Pick a business first')
    if (!m.head.trim()) return toast('Add a headline first')
    setBusy(true)
    const { error } = m.id ? await updateAd(m.id, { vendor, head: m.head, cities: m.cities }) : await createAd({ vendor, head: m.head, cities: m.cities })
    setBusy(false)
    if (error) return toast('Could not save: ' + error.message)
    close()
    toast(m.id ? 'Ad for ' + biz + ' updated' : 'Ad for ' + biz + ' is now running')
    if (m.after) m.after()
  }

  return (
    <Dialog width={520} zIndex={75} onClose={close}>
      <div style={{ fontSize: 17, fontWeight: 600 }}>Create an ad</div>
      <div style={{ fontSize: 13, color: '#8A8590', marginTop: 2 }}>It goes live after a quick check, usually within an hour.</div>
      <label style={{ ...label, marginTop: 16 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Business</span>
        <select value={biz} onChange={(e) => update({ biz: e.target.value })} style={{ ...field, background: '#fff' }}>
          {!names.includes(biz) && <option value={biz}>{biz}</option>}
          {names.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      <label style={{ ...label, marginTop: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 500 }}>Headline</span>
        <input value={m.head} onChange={(e) => update({ head: e.target.value })} style={field} />
      </label>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 12 }}>Cities</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
        {[...new Set([...(cities || []), ...(m.cities || [])])].map((c) => {
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
      <DialogButtons onCancel={close} onOk={save} okLabel="Create ad" />
    </Dialog>
  )
}
