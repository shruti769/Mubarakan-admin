import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Loads data for a page: `load` runs on mount and when `deps` change; `reload` runs it again
 * after an action. `data` keeps its last value while reloading, so lists do not flash empty.
 * `load` returns { data, error } like a Supabase call.
 */
export default function useLoad(load, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const ref = useRef(load)
  useLayoutEffect(() => {
    ref.current = load
  })
  const seq = useRef(0)

  const run = useCallback(async () => {
    const n = ++seq.current
    // State changes happen after the first await, never synchronously inside the effect.
    await null
    if (n !== seq.current) return
    setLoading(true)
    const res = await ref.current()
    if (n !== seq.current) return
    if (res.error) setError(res.error.message || String(res.error))
    else {
      setError(null)
      setData(res.data)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    run()
    // `deps` is the caller's dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, error, loading, reload: run, setData }
}
