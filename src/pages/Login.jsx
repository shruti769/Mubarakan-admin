import { useState } from 'react'
import logo from '../assets/logo.png'
import Card from '../components/common/Card'
import Icon from '../components/common/Icon'
import { IC } from '../data/icons'
import { supabase } from '../lib/supabase'

// Sign in for the team. Only accounts listed as admins in the database get past this screen.
export default function Login({ notice }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [show, setShow] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    if (!email.trim() || !password) return setError('Enter your email and password.')
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setBusy(false)
    if (err) setError(err.message === 'Invalid login credentials' ? 'That email and password do not match.' : err.message)
  }

  const field = { width: '100%', height: 40, border: '1px solid #E4E0DA', borderRadius: 8, padding: '0 12px', background: '#fff', outline: 'none' }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F7F4EF', fontFamily: "'Poppins',sans-serif", color: '#14142B' }}>
      <Card style={{ width: 380, padding: '30px 28px 26px' }}>
        <img src={logo} alt="Mubarakan" style={{ height: 26, display: 'block' }} />
        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 22 }}>Sign in to the admin</div>
        <div style={{ fontSize: 13, color: '#6F6A78', marginTop: 4 }}>For the Mubarakan team only.</div>
        <form onSubmit={submit} style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label style={{ fontSize: 12.5, color: '#6F6A78' }}>
            Email
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} style={{ ...field, marginTop: 5 }} />
          </label>
          <label style={{ fontSize: 12.5, color: '#6F6A78' }}>
            Password
            <div style={{ position: 'relative', marginTop: 5 }}>
              <input
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...field, paddingRight: 40 }}
              />
              {/* Eye open shows the password; the struck-through eye hides it again. */}
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? 'Hide password' : 'Show password'}
                title={show ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: 6, top: 6, width: 28, height: 28, border: 'none', background: 'transparent', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#8A8590' }}
              >
                <Icon d={IC.eye} size={17} sw={1.9}>
                  <circle cx="12" cy="12" r="3" />
                  {!show && <path d="M3 3l18 18" />}
                </Icon>
              </button>
            </div>
          </label>
          {(error || notice) && <div style={{ fontSize: 12.5, color: '#A6192E', lineHeight: 1.5 }}>{error || notice}</div>}
          <button
            type="submit"
            disabled={busy}
            style={{ height: 40, marginTop: 4, borderRadius: 8, border: '1px solid #A6192E', background: '#A6192E', color: '#fff', fontWeight: 500, cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1 }}
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </Card>
    </div>
  )
}
