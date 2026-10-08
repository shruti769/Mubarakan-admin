import { supabase } from '../supabase'
import { daysAgo, fetchAll, firstError, fmtCount, fmtDate, fmtRange, fmtWhen, isoDay } from './core'

// Weddings (public.events) for the Weddings list, the wedding page, the dashboard and search.

export const EVENT_COLS = 'id, title, invite_code, host_id, starts_on, ends_on, venue, city, privacy, allow_downloads, cover_url, published_at, created_at'

/** Draft until published; then Upcoming, Live (today within its dates) or Ended. */
export function weddingStatus(e, today = isoDay(new Date())) {
  if (!e.published_at) return ['Draft', 'grey']
  if (!e.starts_on) return ['Upcoming', 'gold']
  const end = e.ends_on || e.starts_on
  if (today < e.starts_on) return ['Upcoming', 'gold']
  if (today > end) return ['Ended', 'grey']
  return ['Live', 'maroon']
}

export const PRIVACY = { private: 'Private', invite: 'Invite only', public: 'Public' }

/** Phone numbers that belong to an account (admins only), for "has the app". */
export async function accountPhones() {
  const r = await fetchAll(() => supabase.rpc('admin_user_auth').select('id, phone'))
  if (r.error) return r
  const map = new Map()
  r.data.forEach((u) => u.phone && map.set(u.phone, u.id))
  return { data: map, error: null }
}

/** Photos and videos per wedding: { event_id: count }. `ids` narrows it to some weddings. */
export async function photoCounts(ids) {
  const r = await fetchAll(() => {
    let q = supabase.from('post_media').select('post_id, posts!inner(event_id)').not('posts.event_id', 'is', null)
    if (ids) q = q.in('posts.event_id', ids)
    return q
  })
  if (r.error) return r
  const out = {}
  r.data.forEach((m) => {
    const ev = m.posts && m.posts.event_id
    if (ev) out[ev] = (out[ev] || 0) + 1
  })
  return { data: out, error: null }
}

/** Joined guests (not hosts) and host names per wedding. */
async function guestsByEvent(ids) {
  const r = await fetchAll(() => {
    let q = supabase.from('guest_view').select('event_id, role, full_name')
    if (ids) q = q.in('event_id', ids)
    return q
  })
  if (r.error) return r
  const joined = {}
  const hosts = {}
  r.data.forEach((g) => {
    if (g.role === 'host') (hosts[g.event_id] = hosts[g.event_id] || []).push(g.full_name || '—')
    else joined[g.event_id] = (joined[g.event_id] || 0) + 1
  })
  return { data: { joined, hosts }, error: null }
}

/** Invites per wedding, and how many of those numbers have an account. */
async function invitesByEvent(ids, phones) {
  const r = await fetchAll(() => {
    let q = supabase.from('invites').select('event_id, phone')
    if (ids) q = q.in('event_id', ids)
    return q
  })
  if (r.error) return r
  const invited = {}
  const withApp = {}
  r.data.forEach((i) => {
    invited[i.event_id] = (invited[i.event_id] || 0) + 1
    if (phones && phones.has(i.phone)) withApp[i.event_id] = (withApp[i.event_id] || 0) + 1
  })
  return { data: { invited, withApp }, error: null }
}

/** Rows in the shape the Weddings list, dashboard table and search use. */
export function toWeddingRow(e, extra = {}) {
  const invited = extra.invited || 0
  const photos = extra.photos || 0
  return {
    id: e.id,
    name: e.title,
    code: e.invite_code,
    img: e.cover_url || '',
    hosts: extra.hosts && extra.hosts.length ? extra.hosts.join(', ') : '—',
    dates: fmtRange(e.starts_on, e.ends_on),
    venue: [e.venue, e.city].filter(Boolean).join(', ') || '—',
    venueName: e.venue || '—',
    city: e.city || '—',
    priv: PRIVACY[e.privacy] || '—',
    st: weddingStatus(e),
    invited,
    joined: extra.joined || 0,
    rate: invited ? Math.round(((extra.withApp || 0) / invited) * 100) : null,
    withApp: extra.withApp || 0,
    photos: fmtCount(photos),
    photosN: photos,
    storage: '—',
    age: daysAgo(e.created_at),
    starts: e.starts_on || '',
    created: fmtDate(e.created_at),
    raw: e,
  }
}

/** Counts for a set of weddings (null = all) merged into list rows. */
export async function weddingRows(events, ids = null) {
  const phones = await accountPhones()
  const [g, inv, ph] = await Promise.all([guestsByEvent(ids), invitesByEvent(ids, phones.data), photoCounts(ids)])
  const error = firstError(phones, g, inv, ph)
  if (error) return { data: null, error }
  const rows = events.map((e) =>
    toWeddingRow(e, {
      hosts: g.data.hosts[e.id], joined: g.data.joined[e.id], invited: inv.data.invited[e.id],
      withApp: inv.data.withApp[e.id], photos: ph.data[e.id],
    }),
  )
  return { data: rows, error: null }
}

/** Every wedding, newest first, with the list's numbers. */
export async function loadWeddings() {
  const ev = await fetchAll(() => supabase.from('events').select(EVENT_COLS).order('created_at', { ascending: false }))
  if (ev.error) return ev
  return weddingRows(ev.data)
}

const RSVP = { going: ['Coming', 'green'], maybe: ['Maybe', 'gold'], not_going: ['Not coming', 'maroon'] }

/** Function status on the schedule: Upcoming, Live (started in the last six hours) or Done. */
function functionStatus(startsAt) {
  if (!startsAt) return ['—', 'grey']
  const t = new Date(startsAt).getTime()
  const now = Date.now()
  if (now < t) return ['Upcoming', 'gold']
  if (now < t + 6 * 3600 * 1000) return ['Live', 'maroon']
  return ['Done', 'grey']
}

/** One wedding with its guests, invites, functions and album. */
export async function loadWedding(id) {
  const { data: e, error } = await supabase.from('events').select(EVENT_COLS).eq('id', id).maybeSingle()
  if (error) return { data: null, error }
  if (!e) return { data: { missing: true }, error: null }

  const [guests, fns, invites, posts, phones] = await Promise.all([
    supabase.from('guest_view').select('user_id, role, label, rsvp, rsvp_functions, full_name, joined_at').eq('event_id', id).order('role', { ascending: false }).order('full_name'),
    supabase.from('event_functions').select('key, name, sort, starts_at, venue, dress_code').eq('event_id', id).order('sort'),
    fetchAll(() => supabase.from('invites').select('id, name, phone, created_at').eq('event_id', id).order('created_at', { ascending: false })),
    fetchAll(() => supabase.from('posts').select('id, function_key, created_at, post_media(url, kind, poster_url, sort)').eq('event_id', id).order('created_at', { ascending: false })),
    accountPhones(),
  ])
  const err = firstError(guests, fns, invites, posts, phones)
  if (err) return { data: null, error: err }

  let hostNames = (guests.data || []).filter((g) => g.role === 'host').map((g) => g.full_name || '—')
  if (!hostNames.length && e.host_id) {
    const { data: p } = await supabase.from('profiles').select('full_name').eq('id', e.host_id).maybeSingle()
    if (p) hostNames = [p.full_name || '—']
  }

  const fnName = Object.fromEntries((fns.data || []).map((f) => [f.key, f.name]))
  const fnCount = (fns.data || []).length
  const joinedIds = new Set((guests.data || []).map((g) => g.user_id))
  const withApp = invites.data.filter((i) => phones.data.has(i.phone)).length

  const guestRows = (guests.data || []).map((g) => {
    const picked = g.rsvp_functions || []
    const fnText = picked.length ? (fnCount && picked.length === fnCount ? 'All' : picked.map((k) => fnName[k] || k).join(', ')) : '—'
    return [
      { t: g.full_name || '—', fw: 600 },
      g.role === 'host' ? 'Couple' : g.label || '—',
      g.role === 'host' ? ['Host', 'blue'] : RSVP[g.rsvp] || ['Not replied', 'grey'],
      'Yes',
      fnText,
    ]
  })
  // People invited by number who have not joined yet.
  invites.data
    .filter((i) => !joinedIds.has(phones.data.get(i.phone)))
    .forEach((i) => guestRows.push([{ t: i.name || '—', fw: 600 }, '—', ['Not replied', 'grey'], phones.data.has(i.phone) ? 'Yes' : 'Not yet', '—']))

  // The album, grouped by function, in the order of the schedule.
  const albums = new Map()
  ;(fns.data || []).forEach((f) => albums.set(f.key, []))
  let photoTotal = 0
  posts.data.forEach((p) => {
    const media = (p.post_media || []).slice().sort((a, b) => a.sort - b.sort)
    photoTotal += media.length
    const key = p.function_key && albums.has(p.function_key) ? p.function_key : p.function_key || ''
    if (!albums.has(key)) albums.set(key, [])
    media.forEach((m) => albums.get(key).push(m.kind === 'video' ? m.poster_url || m.url : m.url))
  })
  const albumList = [...albums.entries()]
    .filter(([, list]) => list.length)
    .map(([key, list]) => [(fnName[key] || (key ? key : 'Other photos')) + ' . ' + list.length + (list.length === 1 ? ' photo' : ' photos'), list.slice(0, 16)])

  const row = toWeddingRow(e, { hosts: hostNames, joined: (guests.data || []).filter((g) => g.role !== 'host').length, invited: invites.data.length, withApp, photos: photoTotal })

  return {
    data: {
      ...row,
      guests: guestRows,
      albums: albumList,
      schedule: (fns.data || []).map((f) => [{ t: f.name, fw: 600 }, fmtWhen(f.starts_at), f.venue || '—', f.dress_code || '—', functionStatus(f.starts_at)]),
      privacy: e.privacy,
      allowDownloads: e.allow_downloads,
    },
    error: null,
  }
}

/** Weddings one person hosts or joined, for the user page. */
export async function loadUserWeddings(userId) {
  const [mem, hosted] = await Promise.all([
    supabase.from('event_guests').select('role, label, joined_at, events(' + EVENT_COLS + ')').eq('user_id', userId),
    supabase.from('events').select(EVENT_COLS).eq('host_id', userId),
  ])
  const error = firstError(mem, hosted)
  if (error) return { data: null, error }
  const out = new Map()
  ;(mem.data || []).forEach((m) => m.events && out.set(m.events.id, { e: m.events, role: m.role, label: m.label, joined_at: m.role === 'host' ? null : m.joined_at }))
  ;(hosted.data || []).forEach((e) => out.set(e.id, { e, role: 'host', label: null, joined_at: null }))
  const list = [...out.values()].sort((a, b) => String(b.e.starts_on || '').localeCompare(String(a.e.starts_on || '')))
  return { data: list, error: null }
}

/** Admin changes to a wedding's settings. Returns an error when nothing was changed. */
export async function updateWedding(id, patch) {
  const { data, error } = await supabase.from('events').update(patch).eq('id', id).select('id')
  if (error) return { error }
  if (!data || !data.length) return { error: { message: 'This wedding could not be changed' } }
  return { error: null }
}

export async function deleteWedding(id) {
  const { data, error } = await supabase.from('events').delete().eq('id', id).select('id')
  if (error) return { error }
  if (!data || !data.length) return { error: { message: 'This wedding could not be deleted' } }
  return { error: null }
}
