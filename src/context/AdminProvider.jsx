import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ROLES } from '../data/constants'
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
    () => ({ state, setState, getState, toast, ask, togglePop, closePop, can, ls, lset }),
    [state, setState, getState, toast, ask, togglePop, closePop, can, ls, lset],
  )

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}
