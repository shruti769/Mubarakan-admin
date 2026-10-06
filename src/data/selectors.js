import { ADS, APPLICATIONS, BUSINESS_CATEGORY, LEADS, MESSAGES, PAYMENTS, REVIEW_QUEUE, USERS, VENDORS, WEDDINGS } from './mock'

// Each selector returns plain rows with `st` = [status label, tone], applying any changes made in this session.

const USER_TYPE = { Host: 'Couple', Guest: 'Guest', Vendor: 'Business', 'Feature page': 'Business' }
const USER_ST = { Active: ['Active', 'green'], Suspended: ['Suspended', 'gold'], Banned: ['Banned', 'maroon'], Pending: ['Not verified', 'grey'] }

export const getUsers = (state) =>
  USERS.map((r, i) => ({
    id: r[0], name: r[1], handle: r[2], img: r[3], type: USER_TYPE[r[4]], city: r[5], method: r[6], joined: r[10], followers: r[8],
    st: state.ust[r[0]] || USER_ST[r[7]], age: (i * 5) % 40, weds: r[4] === 'Host' ? 2 : r[4] === 'Guest' ? 3 : 0,
  }))

const WED_ST = { Live: ['Live', 'maroon'], Published: ['Upcoming', 'gold'], Ended: ['Ended', 'grey'], Archived: ['Ended', 'grey'], Draft: ['Draft', 'grey'] }

export const getWeddings = () =>
  WEDDINGS.map((r, i) => ({
    id: r[0], name: r[1], code: r[2], img: r[3], hosts: r[4], dates: r[5], venue: r[6], city: r[6].split(', ').pop(), priv: r[7],
    st: WED_ST[r[8]], invited: +r[9], joined: +r[10], rate: r[11], photos: r[12], storage: r[13], age: (i * 7) % 45,
  }))

export const getBusinesses = (state) => {
  const out = VENDORS.map((r, i) => ({
    id: r[0], name: r[1], cat: r[2], city: r[3], img: r[4], rating: r[5], weds: r[6], plan: r[8], leads: r[9], resp: r[10],
    st: r[7] ? ['Verified', 'gold'] : ['Not verified', 'grey'], age: (i * 9) % 60,
  }))
  APPLICATIONS.forEach((a) => {
    const decided = state.apps[a.id]
    const row = { id: 'app_' + a.id, app: a, name: a.n, cat: a.cat, img: a.img, city: a.city, rating: '—', weds: '0', leads: '0', resp: '—', age: 1 }
    if (!decided) out.unshift({ ...row, plan: 'None yet', st: ['Waiting for approval', 'blue'] })
    else if (decided === 'ok') out.unshift({ ...row, plan: 'Starter', st: ['Verified', 'gold'] })
  })
  return out
}

export const pendingApplications = (state) => APPLICATIONS.filter((a) => !state.apps[a.id]).length

export const getAds = (state) =>
  ADS.map((a, i) => ({
    id: a[0], biz: a[1], type: a[2], head: a[3], city: a[4], seen: a[5], clicks: a[6], enq: a[7], spend: a[8], img: a[9],
    st: state.paused[a[0]] ? ['Paused', 'gold'] : i === 7 ? ['Finished', 'grey'] : ['Running', 'green'], age: i * 4,
  }))

export const AD_BUSINESSES = Array.from(new Set(ADS.map((a) => a[1])))

const cityOfPhone = (p) => (p.startsWith('+44') ? 'London' : p.startsWith('+91') ? 'Delhi' : /(321|322)/.test(p) ? 'Islamabad' : 'Lahore')

export const getEnquiries = () =>
  LEADS.map((x, i) => {
    const replied = x[8] !== '—'
    const st = i === 9 ? ['Closed', 'grey'] : replied ? ['Replied', 'green'] : ['New', 'maroon']
    return {
      id: x[0], ref: x[0], cust: x[3], phone: x[4], biz: x[1], ad: x[2], cat: BUSINESS_CATEGORY[x[1]] || 'Other', date: x[9],
      day: x[9].split(', ')[0], reply: x[8], prefers: x[5], st, city: cityOfPhone(x[4]), age: i < 6 ? 0 : 1,
    }
  })

export const getPayments = () =>
  PAYMENTS.map((p, i) => ({
    id: p[0], ref: p[0], biz: p[1], item: p[2], amt: p[3], date: p[5], city: p[6],
    st: [p[4], p[4] === 'Paid' ? 'green' : p[4] === 'Refunded' ? 'grey' : 'maroon'], age: i * 3,
  }))

export const getMessages = () =>
  MESSAGES.map((m) => ({
    id: m[0], ref: m[0], kind: m[1], ch: m[2], to: m[3], at: 'Today, ' + m[5], city: m[6],
    st: [m[4], m[4] === 'Read' || m[4] === 'Delivered' ? 'green' : m[4] === 'Sent' ? 'gold' : 'maroon'], age: 0,
  }))

// Review queue: what is still waiting, optionally narrowed to one tab.
export const reviewLeft = (state) => REVIEW_QUEUE.filter((m) => !state.rvDone[m.id])

export const reviewList = (state) =>
  reviewLeft(state).filter((m) => state.rvTab === 'all' || (state.rvTab === 'rep' ? m.reps > 0 : m.reps === 0))

export const fmt = (n) => Math.round(n).toLocaleString('en-US')
export const num = (v) => parseFloat(String(v).replace(/[^0-9.]/g, '')) || 0
