import useAdmin from './useAdmin'

// The open tab on a detail page, remembered per record for the session.
export default function useDetailTab(ent, id, names) {
  const { state, setState } = useAdmin()
  const key = ent + id
  const saved = state.dtab[key]
  const tab = names.includes(saved) ? saved : names[0]
  const setTab = (name) => setState((s) => ({ dtab: { ...s.dtab, [key]: name } }))
  return [tab, setTab]
}
