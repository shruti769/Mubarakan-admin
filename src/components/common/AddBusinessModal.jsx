import { useEffect, useMemo, useRef, useState } from 'react'
import useAdmin from '../../hooks/useAdmin'
import { createBusiness } from '../../lib/data/business'
import { loadCities } from '../../lib/data/cities'
import useLoad from '../../lib/useLoad'
import Dialog from './Dialog'

const CATS = ['Decor and flowers', 'Wedding venue', 'Photo and film', 'Bridal wear', 'Makeup', 'Jewellery', 'Catering', 'Wedding cards', 'Mehndi artist', 'Dhol']
const CITIES = ['Lahore', 'Karachi', 'Islamabad', 'Delhi', 'Amritsar', 'London', 'Birmingham', 'Leicester', 'Southall']
const PLANS = [['Starter', 'PKR 18,000 a month'], ['Growth', 'PKR 72,000 a month'], ['Premium', 'PKR 180,000 a month']]

const label = { display: 'flex', flexDirection: 'column', gap: 5 }
const caption = { fontSize: 13, fontWeight: 500 }
const field = (bad) => ({ height: 36, border: '1px solid ' + (bad ? '#A6192E' : '#E4E0DA'), borderRadius: 8, padding: '0 10px', fontSize: 13.5, outline: 'none', background: '#fff' })

// Adds a business (vendors row) with its name, type of work, city and photo. The owner, contact
// details, plan and verification are not in the backend yet, so those fields are not saved.
export default function AddBusinessModal() {
  const { state } = useAdmin()
  // Mounted only while open, so every new form starts without the last photo.
  return state.bzForm ? <Form bz={state.bzForm} /> : null
}

function Form({ bz }) {
  const { setState, toast } = useAdmin()
  const { data: known } = useLoad(loadCities, [])
  const [file, setFile] = useState(null)
  const [busy, setBusy] = useState(false)
  const picker = useRef(null)
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])

  const f = bz.f
  const set = (k, v) => setState((s) => ({ bzForm: { ...s.bzForm, f: { ...s.bzForm.f, [k]: v } } }))
  const close = () => setState({ bzForm: null })

  const errs = {
    name: !f.name.trim(),
    cat: !f.cat,
    city: !f.city,
    phone: !!f.phone.trim() && f.phone.replace(/\D/g, '').length < 10,
    email: !!f.email.trim() && !/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(f.email.trim()),
  }
  const ok = !Object.values(errs).some(Boolean)
  const bad = (k) => bz.tried && errs[k]
  const cities = [...new Set([...CITIES, ...(known || [])])]

  const save = async () => {
    if (busy) return
    if (!ok) return setState((s) => ({ bzForm: { ...s.bzForm, tried: true } }))
    setBusy(true)
    const { error } = await createBusiness({ name: f.name, cat: f.cat, city: f.city, file })
    setBusy(false)
    if (error) return toast('Could not save: ' + error.message)
    close()
    toast(f.name.trim() + ' added')
    if (bz.after) bz.after()
  }

  return (
    <Dialog width={560} zIndex={75} onClose={close} style={{ maxHeight: '88vh', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 17, fontWeight: 600 }}>Add a business</div>
          <div style={{ fontSize: 13, color: '#8A8590', marginTop: 2 }}>They show up in the app and can start taking enquiries.</div>
        </div>
        <div onClick={close} style={{ width: 30, height: 30, borderRadius: 8, border: '1px solid #E4E0DA', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#14142B" strokeWidth="2.4"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
        <div onClick={() => picker.current && picker.current.click()} style={{ width: 58, height: 68, borderRadius: '29px 29px 9px 9px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', background: '#F6F3EE', border: '1px dashed #D8CFBF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {preview ? (
            <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8A8590" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
          )}
        </div>
        <input ref={picker} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0] || null)} />
        <div style={{ flex: 1 }}>
          <div style={caption}>Profile photo</div>
          <div style={{ fontSize: 12.5, color: '#8A8590', marginTop: 2 }}>Click to choose. You can change it later.</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 16 }}>
        <label style={{ ...label, gridColumn: 'span 2' }}>
          <span style={caption}>Business name</span>
          <input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="For example, Gul Decor" style={field(bad('name'))} />
        </label>
        <label style={label}>
          <span style={caption}>Type of work</span>
          <select value={f.cat} onChange={(e) => set('cat', e.target.value)} style={field(bad('cat'))}>
            <option value="">Choose one</option>
            {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label style={label}>
          <span style={caption}>City</span>
          <select value={f.city} onChange={(e) => set('city', e.target.value)} style={field(bad('city'))}>
            <option value="">Choose one</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label style={label}>
          <span style={caption}>Owner name</span>
          <input value={f.owner} onChange={(e) => set('owner', e.target.value)} placeholder="Full name" style={field(false)} />
        </label>
        <label style={label}>
          <span style={caption}>Mobile</span>
          <input value={f.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+92 300 1234567" style={field(bad('phone'))} />
        </label>
        <label style={{ ...label, gridColumn: 'span 2' }}>
          <span style={caption}>Email</span>
          <input value={f.email} onChange={(e) => set('email', e.target.value)} placeholder="name@business.com" style={field(bad('email'))} />
        </label>
        <label style={{ ...label, gridColumn: 'span 2' }}>
          <span style={caption}>Instagram or website</span>
          <input value={f.link} onChange={(e) => set('link', e.target.value)} placeholder="Optional" style={field(false)} />
        </label>
      </div>

      <div style={{ ...caption, marginTop: 16 }}>Plan</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 6 }}>
        {PLANS.map(([t, p]) => {
          const on = f.plan === t
          return (
            <div key={t} onClick={() => set('plan', t)} style={{ border: '1px solid ' + (on ? '#A6192E' : '#E4E0DA'), background: on ? '#FFF8F8' : '#fff', borderRadius: 10, padding: '10px 12px', cursor: 'pointer' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{t}</div>
              <div style={{ fontSize: 12, color: '#8A8590', marginTop: 2 }}>{p}</div>
            </div>
          )
        })}
      </div>

      <div onClick={() => set('ver', !f.ver)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, cursor: 'pointer' }}>
        <span style={{ width: 18, height: 18, borderRadius: 5, border: '1.5px solid ' + (f.ver ? '#A6192E' : '#D8D2C6'), background: f.ver ? '#A6192E' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4"><path d="M20 6L9 17l-5-5" /></svg>
        </span>
        <span style={{ fontSize: 13.5 }}>Mark as verified, I have checked their documents</span>
      </div>

      {bz.tried && !ok && <div style={{ fontSize: 12.5, color: '#A6192E', marginTop: 12 }}>Please fill in the fields marked in red.</div>}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18, paddingTop: 14, borderTop: '1px solid #F1ECE4' }}>
        <div onClick={close} style={{ height: 34, padding: '0 14px', borderRadius: 8, border: '1px solid #E4E0DA', display: 'flex', alignItems: 'center', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>Cancel</div>
        <div onClick={save} style={{ height: 34, padding: '0 14px', borderRadius: 8, background: ok && !busy ? '#A6192E' : '#E3B9BF', color: '#fff', display: 'flex', alignItems: 'center', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>
          {busy ? 'Adding…' : 'Add business'}
        </div>
      </div>
    </Dialog>
  )
}
