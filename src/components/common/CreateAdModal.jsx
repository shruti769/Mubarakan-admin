import { useEffect, useMemo, useRef, useState } from 'react'
import { img } from '../../data/images'
import useAdmin from '../../hooks/useAdmin'
import { createAd, loadBusinessChoices, updateAd } from '../../lib/data/business'
import { loadCities } from '../../lib/data/cities'
import useLoad from '../../lib/useLoad'
import Dialog, { DialogButtons } from './Dialog'

const field = { height: 36, border: '1px solid #E4E0DA', borderRadius: 8, padding: '0 10px' }
const label = { display: 'flex', flexDirection: 'column', gap: 5 }

// Creates an ad, or edits the headline, cities and photo of one when `modal.id` is set.
export default function CreateAdModal() {
  const { state } = useAdmin()
  // Mounted only while open, so every new form starts without the last photo.
  return state.modal ? <Form m={state.modal} /> : null
}

function Form({ m }) {
  const { setState, toast } = useAdmin()
  const { data: vendors } = useLoad(loadBusinessChoices, [!!m])
  const { data: cities } = useLoad(loadCities, [!!m])
  const [busy, setBusy] = useState(false)
  const [file, setFile] = useState(null)
  const picker = useRef(null)
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])
  const names = (vendors || []).map((v) => v.name)
  const biz = m.biz || names[0] || ''
  const vendorPhoto = ((vendors || []).find((v) => v.name === biz) || {}).image
  const current = preview || (m.photos && m.photos[0] ? img(m.photos[0], 120, 150) : vendorPhoto || '')
  const update = (patch) => setState((s) => ({ modal: { ...s.modal, ...patch } }))
  const close = () => setState({ modal: null })
  const toggleCity = (c) => update({ cities: m.cities.includes(c) ? m.cities.filter((x) => x !== c) : [...m.cities, c] })

  const save = async () => {
    if (busy) return
    const vendor = (vendors || []).find((v) => v.name === biz)
    if (!vendor) return toast('Pick a business first')
    if (!m.head.trim()) return toast('Add a headline first')
    setBusy(true)
    const { error } = m.id
      ? await updateAd(m.id, { vendor, head: m.head, cities: m.cities, file, photos: m.photos })
      : await createAd({ vendor, head: m.head, cities: m.cities, file })
    setBusy(false)
    if (error) return toast('Could not save: ' + error.message)
    close()
    toast(m.id ? 'Ad for ' + biz + ' updated' : 'Ad for ' + biz + ' is now running')
    if (m.after) m.after()
  }

  return (
    <Dialog width={520} zIndex={75} onClose={close}>
      <div style={{ fontSize: 17, fontWeight: 600 }}>{m.id ? 'Edit ad' : 'Create an ad'}</div>
      <div style={{ fontSize: 13, color: '#8A8590', marginTop: 2 }}>{m.id ? 'Changes show in the app right away.' : 'It goes live after a quick check, usually within an hour.'}</div>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12 }}>
        <div onClick={() => picker.current && picker.current.click()} style={{ width: 58, height: 72, borderRadius: 9, overflow: 'hidden', flexShrink: 0, cursor: 'pointer', background: '#F6F3EE', border: '1px dashed #D8CFBF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {current ? (
            <img src={current} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8590" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          )}
        </div>
        <input ref={picker} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0] || null)} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Ad photo</div>
          <div style={{ fontSize: 12.5, color: '#8A8590', marginTop: 2 }}>{current ? 'Click to change.' : 'Click to choose. Without one the ad shows up blank in the app.'}</div>
        </div>
      </div>
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
      <DialogButtons onCancel={close} onOk={save} okLabel={m.id ? 'Save changes' : 'Create ad'} />
    </Dialog>
  )
}
