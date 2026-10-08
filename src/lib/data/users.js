import { supabase } from '../supabase'
import { countRows, daysAgo, fetchAll, firstError, fmtCount, fmtDate, fmtStamp, isoDay } from './core'
import { loadUserWeddings, weddingStatus } from './weddings'

// People (public.profiles) for the Users list, the user page, the dashboard and search.

const PROFILE_COLS = 'id, full_name, username, avatar_url, city, account_type, verified, created_at, face_grouping, show_in_explore, allow_downloads'

// How they signed up, from auth (rpc admin_user_auth).
const METHOD = { email: 'Email', phone: 'Mobile', google: 'Google', apple: 'Apple', facebook: 'Facebook' }
export const methodLabel = (p) => (p ? METHOD[p] || p[0].toUpperCase() + p.slice(1) : '—')

/** Couple = hosts a wedding, Business = a vendor account, everyone else is a Guest. */
export const userType = (p, hosts) => (p.account_type === 'vendor' ? 'Business' : hosts.has(p.id) ? 'Couple' : 'Guest')

/** A pending account deletion shows first, then verified, then active. Suspensions are not in the backend. */
export const userStatus = (p, deleting) => (deleting ? ['Deleting', 'maroon'] : p.verified ? ['Verified', 'gold'] : ['Active', 'green'])

/** Everyone who hosts a wedding: the creator (events.host_id) and co-hosts (guest role host). */
export async function hostIds() {
  const [a, b] = await Promise.all([
    fetchAll(() => supabase.from('events').select('host_id').not('host_id', 'is', null)),
    fetchAll(() => supabase.from('event_guests').select('user_id').eq('role', 'host')),
  ])
  const error = firstError(a, b)
  if (error) return { data: null, error }
  return { data: new Set([...a.data.map((r) => r.host_id), ...b.data.map((r) => r.user_id)]), error: null }
}

export function toUserRow(p, { hosts, deleting, followers = 0, auth } = {}) {
  return {
    id: p.id,
    name: p.full_name || p.username || '—',
    handle: p.username ? '@' + p.username : '—',
    username: p.username || '',
    img: p.avatar_url || '',
    type: userType(p, hosts || new Set()),
    city: p.city || '—',
    method: methodLabel(auth && auth.provider),
    joined: fmtDate(p.created_at),
    followers: fmtCount(followers),
    followersN: followers,
    st: userStatus(p, deleting),
    age: daysAgo(p.created_at),
    verified: !!p.verified,
    created_at: p.created_at,
    lastSignIn: auth ? auth.last_sign_in_at : null,
    raw: p,
  }
}

/** Every account with its type, status, follower count and sign up method. */
export async function loadUsers() {
  const [profiles, followers, hosts, deletions, auth] = await Promise.all([
    fetchAll(() => supabase.from('profiles').select(PROFILE_COLS).order('created_at', { ascending: false })),
    fetchAll(() => supabase.from('profile_view').select('id, followers_count')),
    hostIds(),
    fetchAll(() => supabase.from('account_deletions').select('user_id')),
    fetchAll(() => supabase.rpc('admin_user_auth').select('id, provider, last_sign_in_at')),
  ])
  const error = firstError(profiles, followers, hosts, deletions, auth)
  if (error) return { data: null, error }
  const fol = new Map(followers.data.map((r) => [r.id, Number(r.followers_count) || 0]))
  const del = new Set(deletions.data.map((r) => r.user_id))
  const au = new Map(auth.data.map((r) => [r.id, r]))
  const rows = profiles.data.map((p) => toUserRow(p, { hosts: hosts.data, deleting: del.has(p.id), followers: fol.get(p.id) || 0, auth: au.get(p.id) }))
  const today = isoDay(new Date())
  const joinedToday = profiles.data.filter((p) => isoDay(new Date(p.created_at)) === today).length
  return { data: { rows, joinedToday }, error: null }
}

const ROLE = (m) => (m.role === 'host' ? 'Couple' : m.label ? 'Guest, ' + m.label.toLowerCase() : 'Guest')

/** One account with everything its page shows. */
export async function loadUser(id) {
  const { data: p, error } = await supabase.from('profiles').select(PROFILE_COLS).eq('id', id).maybeSingle()
  if (error) return { data: null, error }
  if (!p) return { data: { missing: true }, error: null }

  const [view, auth, posts, weddings, deletion, repPosts, repComments, media] = await Promise.all([
    supabase.from('profile_view').select('followers_count').eq('id', id).maybeSingle(),
    supabase.rpc('admin_user_auth', { p_user: id }),
    countRows('posts', (q) => q.eq('author_id', id)),
    loadUserWeddings(id),
    supabase.from('account_deletions').select('purge_after').eq('user_id', id).maybeSingle(),
    countRows('reports', (q) => q.eq('posts.author_id', id), 'id, posts!inner(author_id)'),
    countRows('reports', (q) => q.eq('comments.user_id', id), 'id, comments!inner(user_id)'),
    supabase.from('posts').select('id, created_at, post_media(url, kind, poster_url, sort)').eq('author_id', id).order('created_at', { ascending: false }).limit(48),
  ])
  const err = firstError(view, auth, posts, weddings, deletion, repPosts, repComments, media)
  if (err) return { data: null, error: err }

  const a = (auth.data && auth.data[0]) || null
  const hosts = new Set(weddings.data.some((w) => w.role === 'host') ? [id] : [])
  const row = toUserRow(p, { hosts, deleting: !!deletion.data, followers: Number(view.data && view.data.followers_count) || 0, auth: a })

  const photos = []
  ;(media.data || []).forEach((post) =>
    (post.post_media || []).slice().sort((x, y) => x.sort - y.sort).forEach((m) => photos.push(m.kind === 'video' ? m.poster_url || m.url : m.url)),
  )

  // What the backend records about the account itself. Other activity is not logged.
  const activity = []
  if (deletion.data) activity.push([fmtStamp(deletion.data.purge_after), 'Account is deleted on this day unless they sign in again', '#A6192E'])
  if (a && a.last_sign_in_at) activity.push([fmtStamp(a.last_sign_in_at), 'Signed in'])
  weddings.data.forEach((w) => w.joined_at && activity.push([fmtStamp(w.joined_at), 'Joined ' + w.e.title, '#C9A227']))
  if (p.created_at) activity.push([fmtStamp(p.created_at), 'Created an account'])

  return {
    data: {
      ...row,
      email: (a && a.email) || '—',
      phone: (a && a.phone) || '—',
      posts: posts.count,
      reports: repPosts.count + repComments.count,
      weddings: weddings.data.map((w) => ({ id: w.e.id, title: w.e.title, role: ROLE(w), dates: w.e.starts_on, ends: w.e.ends_on, st: weddingStatus(w.e) })),
      photos: photos.slice(0, 48),
      activity,
      privacy: { face_grouping: p.face_grouping, allow_downloads: p.allow_downloads, show_in_explore: p.show_in_explore },
    },
    error: null,
  }
}

/** The email a password reset goes to (admins only). */
export async function userEmail(id) {
  const { data, error } = await supabase.rpc('admin_user_auth', { p_user: id })
  if (error) return { data: null, error }
  return { data: (data && data[0] && data[0].email) || null, error: null }
}

/** Admin changes to a profile (verified, privacy). Returns an error when nothing was changed. */
export async function updateProfile(id, patch) {
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select('id')
  if (error) return { error }
  if (!data || !data.length) return { error: { message: 'This account could not be changed' } }
  return { error: null }
}
