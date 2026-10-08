import DataList from '../components/list/DataList'
import { img } from '../data/images'
import { num } from '../data/selectors'
import useActions from '../hooks/useActions'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'
import { loadAds, setAdsActive } from '../lib/data/business'
import useLoad from '../lib/useLoad'

export default function Ads() {
  const { setState, toast } = useAdmin()
  const { open } = useNavigation()
  const { togglePaused, endAd } = useActions()
  const { data, reload } = useLoad(loadAds, [])
  const rows = data ? data.rows : []
  const firstBiz = rows.length ? rows[0].biz : ''
  // Pausing and ending both stop the ads showing (ads.active = false).
  const stopMany = (word) => async (ids) => {
    const { error } = await setAdsActive(ids, false)
    if (error) return toast('Could not save: ' + error.message)
    toast(ids.length + (ids.length === 1 ? ' ad ' : ' ads ') + word)
    reload()
  }

  return (
    <DataList
      listKey="ads"
      cfg={{
        sub: 'Ads businesses are running inside the app.', noun: 'ads', one: 'ad', ph: 'Search ads',
        rows, search: (r) => r.biz + r.head + r.type,
        btns: [{ label: 'Create an ad', run: () => setState({ modal: { biz: firstBiz, head: '', cities: [], after: reload } }), primary: 1 }],
        // Impressions and spend are not tracked in the backend.
        stats: [['Ads running', data ? String(data.running) : '—', ''], ['Seen this month', '—', ''], ['Enquiries from ads', data ? String(data.fromAds) : '—', ''], ['Spent this month', '—', '']],
        cols: [
          { key: 'biz', label: 'Business and ad', type: 'person', w: '2.1fr', sort: (r) => r.biz, value: (r) => [r.biz, r.head, img(r.img, 96, 110)] },
          { key: 'type', label: 'Ad type', type: 'text', w: '1fr', sort: (r) => r.type, value: (r) => r.type },
          { key: 'seen', label: 'Seen by', type: 'num', w: '.8fr', sort: (r) => r.seen, value: (r) => r.seen },
          { key: 'enq', label: 'Enquiries', type: 'num', w: '.7fr', sort: (r) => num(r.enq), value: (r) => r.enq },
          { key: 'spend', label: 'Spent', type: 'num', w: '1fr', sort: (r) => r.spend, value: (r) => r.spend },
          { key: 'st', label: 'Status', type: 'pill', w: '.8fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [
          { label: 'Pause', run: stopMany('paused') },
          { label: 'Export', off: 'Export is not connected yet' },
          { label: 'End', run: stopMany('ended'), danger: 1 },
        ],
        menu: (r) => [
          { label: 'Open', run: () => open('ad', r.id) },
          { label: r.st[0] === 'Paused' ? 'Resume' : 'Pause', run: () => togglePaused(r, (wasPaused) => r.biz + (wasPaused ? ' ad running again' : ' ad paused'), reload) },
          { label: 'End ad', run: () => endAd(r.biz + '’s ad stops showing now.', r, reload), danger: 1 },
        ],
        open: (r) => open('ad', r.id),
      }}
    />
  )
}
