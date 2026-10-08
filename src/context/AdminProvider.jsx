import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ROLES } from '../data/constants'
import { supabase } from '../lib/supabase'
import { AdminContext, DEFAULT_LIST, INITIAL_STATE } from './AdminContext'

export default function AdminProvider({ children }) {
  const [state, setRaw] = useState(INITIAL_STATE)
  const ref = useRef(state)
  useLayoutEffect(() => {
    ref.current = state
  }, [state])

  // Merges a patch (or the result of a patch function) into state, like a class component.
  const setState = useCallback((patch) => setRaw((prev) => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) })), [])
  const getState = useCallback(() => ref.current, [])

  // The signed in admin: `auth` is 'loading', 'out' (show the login), or 'in'. The role and name
  // come from the database (rpc admin_me), so nobody can grant themselves a role in the browser.
  const [auth, setAuth] = useState({ status: 'loading', me: null, notice: '' })
  useEffect(() => {
    const check = async (session) => {
      if (!session) return setAuth((a) => ({ status: 'out', me: null, notice: a.notice }))
      const { data } = await supabase.rpc('admin_me')
      const me = data && data[0]
      if (!me) {
        await supabase.auth.signOut()
        return setAuth({ status: 'out', me: null, notice: 'This account is not an admin.' })
      }
      setRaw((prev) => ({ ...prev, role: me.role }))
      setAuth({ status: 'in', me: { ...me, id: session.user.id, email: session.user.email }, notice: '' })
    }
    supabase.auth.getSession().then(({ data }) => check(data.session))
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      // Deferred: Supabase calls made inside this callback can deadlock the auth client.
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') setTimeout(() => check(session), 0)
    })
    return () => data.subscription.unsubscribe()
  }, [])
  const signOut = useCallback(() => supabase.auth.signOut(), [])

  const toast = useCallback((msg) => {
    const id = Date.now() + Math.random()
    setState((s) => ({ toasts: [...s.toasts, { id, msg }] }))
    setTimeout(() => setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2600)
  }, [setState])

  const ask = useCallback((o) => setState({ confirm: o, ctext: '', pop: '' }), [setState])
  const togglePop = useCallback((key) => setState((s) => ({ pop: s.pop === key ? '' : key })), [setState])
  const closePop = useCallback(() => setState({ pop: '' }), [setState])

  const can = useCallback((page) => ROLES[state.role].pages.split(' ').includes(page), [state.role])

  const ls = useCallback((k) => state.lists[k] || DEFAULT_LIST, [state.lists])
  const lset = useCallback(
    (k, p) => setState((s) => ({ lists: { ...s.lists, [k]: { ...(s.lists[k] || DEFAULT_LIST), ...p } } })),
    [setState],
  )

  // Clicking outside any popover closes it; Escape closes popovers and dialogs.
  useEffect(() => {
    const down = (e) => {
      if (ref.current.pop && !(e.target.closest && e.target.closest('[data-pop]'))) setState({ pop: '' })
    }
    const key = (e) => {
      if (e.key === 'Escape') setState({ pop: '', confirm: null, modal: null })
    }
    document.addEventListener('mousedown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', down)
      document.removeEventListener('keydown', key)
    }
  }, [setState])

  const value = useMemo(
    () => ({ state, setState, getState, toast, ask, togglePop, closePop, can, ls, lset, auth, signOut }),
    [state, setState, getState, toast, ask, togglePop, closePop, can, ls, lset, auth, signOut],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
