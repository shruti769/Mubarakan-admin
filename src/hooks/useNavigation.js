import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { PAGE_ENT, PAGE_PATH, detailPath } from '../data/constants'
import useAdmin from './useAdmin'

// Where the app is: `page` is the list section, `ent`/`id` are set on a detail page.
export function useRoute() {
  const { pathname } = useLocation()
  const [seg, id] = pathname.split('/').filter(Boolean)
  const page = seg && PAGE_PATH[seg] ? seg : 'dash'
  const ent = id ? PAGE_ENT[page] : null
  return { page, ent, id: id ? decodeURIComponent(id) : null, isDetail: !!ent }
}

export default function useNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { can, setState, toast } = useAdmin()

  // Go to a section. `extra` is merged into state on the way, e.g. a settings tab.
  const go = useCallback(
    (page, extra) => {
      if (!can(page)) {
        toast('Not available in your view')
        return
      }
      setState({ pop: '', q: '', ...(extra || {}) })
      navigate(PAGE_PATH[page])
    },
    [can, navigate, setState, toast],
  )

  // Open a detail page, remembering where we came from for the back button.
  const open = useCallback(
    (ent, id) => {
      setState({ pop: '', q: '' })
      navigate(detailPath(ent, id), { state: { back: location.pathname } })
    },
    [location.pathname, navigate, setState],
  )

  const back = useCallback(() => {
    const [seg] = location.pathname.split('/').filter(Boolean)
    setState({ pop: '', q: '' })
    navigate(location.state?.back || PAGE_PATH[seg] || '/')
  }, [location, navigate, setState])

  return { go, open, back }
}
