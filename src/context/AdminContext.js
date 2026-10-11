import { createContext } from 'react'

export const AdminContext = createContext(null)

export const DEFAULT_LIST = { q: '', st: 'All', city: 'Any', date: 'Any time', sort: '', dir: 1, sel: {}, pg: 0 }

export const INITIAL_STATE = {
  role: 'Owner',
  side: true, // sidebar open
  range: 'Last 7 days',
  city: 'All cities',
  custom: { from: '2026-09-28', to: '2026-10-05' },
  pop: '', // key of the one open popover, '' when none
  q: '', // top bar search
  lists: {}, // filters, sort, selection and page per list
  dtab: {}, // open tab per detail page
  setTab: 'team',
  seg: 'Guests',
  rvTab: 'all',
  rvSel: null,
  rvDone: {},
  reveal: {},
  toasts: [],
  confirm: null,
  ctext: '',
  modal: null,
  bzForm: null, // the add a business form while it is open
  ust: {}, // user status changes
  apps: {}, // business application decisions
  paused: {},
  reqDone: {},
  read: false,
  tg: {}, // toggle switches
}
