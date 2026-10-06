import DataList from '../components/list/DataList'
import { img } from '../data/images'
import { getAds, num } from '../data/selectors'
import useActions from '../hooks/useActions'
import useAdmin from '../hooks/useAdmin'
import useNavigation from '../hooks/useNavigation'

export default function Ads() {
  const { state, setState } = useAdmin()
  const { open } = useNavigation()
  const { togglePaused, endAd } = useActions()
  const rows = getAds(state)
  const running = rows.filter((r) => r.st[0] === 'Running').length

  return (
    <DataList
      listKey="ads"
      cfg={{
        sub: 'Ads businesses are running inside the app.', noun: 'ads', one: 'ad', ph: 'Search ads',
        rows, search: (r) => r.biz + r.head + r.type,
        btns: [{ label: 'Create an ad', run: () => setState({ modal: { biz: 'Shalimar Decor Studio', head: '', cities: ['Lahore'] } }), primary: 1 }],
        stats: [['Ads running', String(running + 55), ''], ['Seen this month', '9.1M', '+14%'], ['Enquiries from ads', '1,936', '+9%'], ['Spent this month', 'PKR 18.4M', '+16%']],
        cols: [
          { key: 'biz', label: 'Business and ad', type: 'person', w: '2.1fr', sort: (r) => r.biz, value: (r) => [r.biz, r.head, img(r.img, 96, 110)] },
          { key: 'type', label: 'Ad type', type: 'text', w: '1fr', sort: (r) => r.type, value: (r) => r.type },
          { key: 'seen', label: 'Seen by', type: 'num', w: '.8fr', sort: (r) => num(r.seen) * (/M/.test(r.seen) ? 1e6 : 1e3), value: (r) => r.seen },
          { key: 'enq', label: 'Enquiries', type: 'num', w: '.7fr', sort: (r) => num(r.enq), value: (r) => r.enq },
          { key: 'spend', label: 'Spent', type: 'num', w: '1fr', sort: (r) => num(r.spend), value: (r) => r.spend },
          { key: 'st', label: 'Status', type: 'pill', w: '.8fr', sort: (r) => r.st[0], value: (r) => r.st },
        ],
        bulk: [{ label: 'Pause', msg: '{n} ads paused' }, { label: 'Export', msg: 'Exported {n} ads' }, { label: 'End', msg: '{n} ads ended', danger: 1 }],
        menu: (r) => [
          { label: 'Open', run: () => open('ad', r.id) },
          { label: r.st[0] === 'Paused' ? 'Resume' : 'Pause', run: () => togglePaused(r, (wasPaused) => r.biz + (wasPaused ? ' ad running again' : ' ad paused')) },
          { label: 'End ad', run: () => endAd(r.biz + '’s ad stops showing now.'), danger: 1 },
        ],
        open: (r) => open('ad', r.id),
      }}
    />
  )
}
