import { supabase } from '../supabase'
import { countRows, fetchAll, firstError, isoDay, shortDay, startOfDay } from './core'
import { hostIds } from './users'
import { EVENT_COLS, accountPhones, weddingRows, weddingStatus } from './weddings'

// Numbers for the dashboard. Every query follows the date range and city chosen in the top bar.

const DAY = 86400000
const addDays = (d, n) => new Date(d.getTime() + n * DAY)

/** The chosen period [from, to) and the one before it of the same length. */
export function periodOf(range, custom) {
  const today = startOfDay(new Date())
  const tomorrow = addDays(today, 1)
  let from = today
  let to = tomorrow
  let prevFrom
  let prevTo
  if (range === 'Last 7 days') from = addDays(today, -6)
  else if (range === 'Last 30 days') from = addDays(today, -29)
  else if (range === 'This month') {
    from = new Date(today.getFullYear(), today.getMonth(), 1)
    prevFrom = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    prevTo = new Date(prevFrom.getTime() + (to - from))
    if (prevTo > from) prevTo = from
  } else if (range === 'Custom' && custom && custom.from && custom.to) {
    const a = new Date(custom.from + 'T00:00:00')
    const b = new Date(custom.to + 'T00:00:00')
    from = a <= b ? a : b
    to = addDays(a <= b ? b : a, 1)
  }
  if (!prevFrom) {
    prevTo = from
    prevFrom = new Date(from.getTime() - (to - from))
  }
  return { from, to, prevFrom, prevTo, days: Math.round((to - from) / DAY) }
}

const cityOn = (city) => city && city !== 'All cities'
const like = (city) => '%' + city + '%'
const inPeriod = (q, col, a, b) => q.gte(col, a.toISOString()).lt(col, b.toISOString())

/** Weddings whose dates touch [from, to). */
function overlaps(q, from, to) {
  const a = isoDay(from)
  const b = isoDay(addDays(to, -1))
  return q.lte('starts_on', b).or('ends_on.gte.' + a + ',and(ends_on.is.null,starts_on.gte.' + a + ')')
}

/** Percent change as the cards show it: "+12%", "↓ 4%", or null when there is nothing to compare. */
export function change(now, before) {
  if (!before) return null
  const p = ((now - before) / before) * 100
  const t = Math.abs(p) >= 10 ? Math.round(Math.abs(p)) : Math.abs(p).toFixed(1).replace(/\.0$/, '')
  return p < 0 ? '↓ ' + t + '%' : '+' + t + '%'
}

const countUsers = (city, a, b) =>
  countRows('profiles', (q) => {
    if (cityOn(city)) q = q.ilike('city', like(city))
    if (a) q = inPeriod(q, 'created_at', a, b)
    return q
  })

const countLive = (city, day) =>
  countRows('events', (q) => {
    q = q.not('published_at', 'is', null).lte('starts_on', day).or('ends_on.gte.' + day + ',and(ends_on.is.null,starts_on.eq.' + day + ')')
    if (cityOn(city)) q = q.ilike('city', like(city))
    return q
  })

// Photos and videos posted in the period; with a city, those inside weddings in that city.
const countPhotos = (city, a, b) =>
  cityOn(city)
    ? countRows('post_media', (q) => inPeriod(q, 'posts.created_at', a, b).ilike('posts.events.city', like(city)), 'id, posts!inner(created_at, events!inner(city))')
    : countRows('post_media', (q) => inPeriod(q, 'posts.created_at', a, b), 'id, posts!inner(created_at)')

// Enquiries sent in the period; with a city, those from people who live there.
const countLeads = (city, a, b) =>
  cityOn(city)
    ? countRows('leads', (q) => inPeriod(q, 'created_at', a, b).ilike('profiles.city', like(city)), 'id, profiles!inner(city)')
    : countRows('leads', (q) => inPeriod(q, 'created_at', a, b))

async function stats(city, p) {
  const yesterdayOfPrev = isoDay(addDays(p.prevTo, -1))
  const today = isoDay(new Date())
  const r = await Promise.all([
    countUsers(city), countUsers(city, p.from, p.to), countUsers(city, p.prevFrom, p.prevTo),
    countLive(city, today), countLive(city, yesterdayOfPrev),
    countPhotos(city, p.from, p.to), countPhotos(city, p.prevFrom, p.prevTo),
    countLeads(city, p.from, p.to), countLeads(city, p.prevFrom, p.prevTo),
  ])
  const error = firstError(...r)
  if (error) return { error }
  const [total, fresh, freshPrev, live, livePrev, photos, photosPrev, leads, leadsPrev] = r.map((x) => x.count)
  return {
    data: {
      total, totalChange: change(total, total - fresh),
      fresh, freshChange: change(fresh, freshPrev),
      live, liveChange: change(live, livePrev),
      photos, photosChange: change(photos, photosPrev),
      leads, leadsChange: change(leads, leadsPrev),
    },
  }
}

/** Sign ups per day (or per hour for a single day), split into guests, couples and businesses. */
async function signups(city, p) {
  const [profiles, hosts] = await Promise.all([
    fetchAll(() => {
      let q = inPeriod(supabase.from('profiles').select('id, created_at, account_type'), 'created_at', p.from, p.to)
      if (cityOn(city)) q = q.ilike('city', like(city))
      return q
    }),
    hostIds(),
  ])
  const error = firstError(profiles, hosts)
  if (error) return { error }
  const hourly = p.days <= 1
  const n = hourly ? 24 : p.days
  const series = { Guests: Array(n).fill(0), Couples: Array(n).fill(0), Businesses: Array(n).fill(0) }
  profiles.data.forEach((u) => {
    const t = new Date(u.created_at)
    const i = hourly ? t.getHours() : Math.floor((startOfDay(t) - p.from) / DAY)
    if (i < 0 || i >= n) return
    const seg = u.account_type === 'vendor' ? 'Businesses' : hosts.data.has(u.id) ? 'Couples' : 'Guests'
    series[seg][i]++
  })
  // About six labels spread along the axis.
  const step = Math.max(1, Math.round((n - 1) / 5))
  const labels = []
  for (let i = 0; i < n; i += step) labels.push(hourly ? (i % 12 || 12) + (i < 12 ? 'am' : 'pm') : shortDay(addDays(p.from, i)))
  return { data: { series, labels } }
}

/** Invites sent in the period, how many of those numbers have the app, and how many said yes. */
async function funnel(city, p) {
  const [invites, phones, going] = await Promise.all([
    fetchAll(() => {
      let q = inPeriod(supabase.from('invites').select(cityOn(city) ? 'event_id, phone, events!inner(city)' : 'event_id, phone'), 'created_at', p.from, p.to)
      if (cityOn(city)) q = q.ilike('events.city', like(city))
      return q
    }),
    accountPhones(),
    fetchAll(() => supabase.from('event_guests').select('event_id, user_id').eq('rsvp', 'going')),
  ])
  const error = firstError(invites, phones, going)
  if (error) return { error }
  const yes = new Set(going.data.map((g) => g.event_id + ':' + g.user_id))
  let app = 0
  let said = 0
  invites.data.forEach((i) => {
    const uid = phones.data.get(i.phone)
    if (!uid) return
    app++
    if (yes.has(i.event_id + ':' + uid)) said++
  })
  return { data: { sent: invites.data.length, delivered: null, opened: null, app, yes: said } }
}

async function attention() {
  const r = await Promise.all([
    countRows('posts', (q) => q.eq('status', 'pending')),
    countRows('account_deletions'),
    countRows('data_requests', (q) => q.eq('status', 'pending')),
  ])
  const error = firstError(...r)
  if (error) return { error }
  return { data: { review: r[0].count, requests: r[1].count + r[2].count } }
}

/** Weddings taking place in the period, by city, most first. */
async function topCities(p) {
  const r = await fetchAll(() => overlaps(supabase.from('events').select('city').not('published_at', 'is', null), p.from, p.to))
  if (r.error) return r
  const by = {}
  r.data.forEach((e) => {
    const c = (e.city || '').trim()
    if (c) by[c] = (by[c] || 0) + 1
  })
  return { data: Object.entries(by).sort((a, b) => b[1] - a[1]).slice(0, 6) }
}

const ORDER = { Live: 0, Upcoming: 1, Ended: 2, Draft: 3 }

/** Up to six published weddings in the period, live ones first. */
async function weddingsTable(city, p) {
  let q = overlaps(supabase.from('events').select(EVENT_COLS).not('published_at', 'is', null), p.from, p.to).order('starts_on').limit(200)
  if (cityOn(city)) q = q.ilike('city', like(city))
  const { data, error } = await q
  if (error) return { error }
  const top = data.slice().sort((a, b) => ORDER[weddingStatus(a)[0]] - ORDER[weddingStatus(b)[0]]).slice(0, 6)
  if (!top.length) return { data: [] }
  return weddingRows(top, top.map((e) => e.id))
}

/** The latest six enquiries in the period. */
async function enquiriesTable(city, p) {
  let q = inPeriod(supabase.from('leads').select(cityOn(city) ? 'id, name, brand, created_at, ads(category), profiles!inner(city)' : 'id, name, brand, created_at, ads(category)'), 'created_at', p.from, p.to)
  if (cityOn(city)) q = q.ilike('profiles.city', like(city))
  const { data, error } = await q.order('created_at', { ascending: false }).limit(6)
  if (error) return { error }
  return {
    data: data.map((l) => ({ id: l.id, cust: l.name || '—', biz: l.brand || '—', cat: (l.ads && l.ads.category) || '—', day: shortDay(l.created_at), st: ['Received', 'grey'] })),
  }
}

export async function loadDashboard({ range, custom, city }) {
  const p = periodOf(range, custom)
  const parts = await Promise.all([stats(city, p), signups(city, p), funnel(city, p), attention(), topCities(p), weddingsTable(city, p), enquiriesTable(city, p)])
  const error = firstError(...parts)
  if (error) return { data: null, error }
  const [s, chart, fun, att, cities, weddings, enquiries] = parts.map((x) => x.data)
  return { data: { stats: s, chart, funnel: fun, attention: att, cities, weddings, enquiries }, error: null }
}

