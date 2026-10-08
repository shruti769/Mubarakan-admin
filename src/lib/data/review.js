import { supabase } from '../supabase'
import { fetchAll, firstError } from './core'

// The review queue: posts and comments people reported (public.reports), plus posts waiting for
// approval (posts.status = 'pending'). Reports have no status, so a report stays in the queue until
// its post is removed (status 'rejected') or its comment is deleted. Stories cannot be reported in
// the app, so they never appear here.

/** "2m ago", "3h ago", "4d ago". */
export function ago(v) {
  const s = Math.max(0, (Date.now() - new Date(v).getTime()) / 1000)
  if (s < 3600) return Math.max(1, Math.round(s / 60)) + 'm ago'
  if (s < 86400) return Math.round(s / 3600) + 'h ago'
  return Math.round(s / 86400) + 'd ago'
}

const chunks = (ids, n = 150) => Array.from({ length: Math.ceil(ids.length / n) }, (_, i) => ids.slice(i * n, i * n + n))

/** Rows whose `col` is one of `ids`, a chunk at a time to keep URLs short. */
async function whereIn(table, select, col, ids, extra = (q) => q) {
  if (!ids.length) return { data: [], error: null }
  const rs = await Promise.all(chunks([...new Set(ids)]).map((part) => extra(supabase.from(table).select(select).in(col, part))))
  const error = firstError(...rs)
  return error ? { data: null, error } : { data: rs.flatMap((r) => r.data || []), error: null }
}

const titleCase = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '')
const person = (r) => ({ n: r.full_name || (r.username ? '@' + r.username : '—'), s: r.username ? '@' + r.username : '', img: r.avatar_url || '' })
const whereOfPost = (p) => (p.event_id ? (p.event_title || 'A wedding') + (p.function_key ? ' . ' + titleCase(p.function_key) : '') : 'Public feed')
const typeOfPost = (p) => (p.event_id ? 'Album upload' : p.kind === 'reel' ? 'Reel' : p.kind === 'video' ? 'Video' : 'Post')
const cover = (p) => {
  const m = (p.media || [])[0]
  if (!m) return ''
  return m.kind === 'video' ? m.poster || '' : m.url
}

const POST_COLS = 'id, author_id, event_id, function_key, kind, caption, status, created_at, username, full_name, avatar_url, event_title, media'

export async function loadReview() {
  const [reports, pending] = await Promise.all([
    fetchAll(() => supabase.from('reports').select('id, post_id, comment_id, reason, created_at').order('created_at', { ascending: false })),
    supabase.from('post_view').select(POST_COLS).eq('status', 'pending').order('created_at', { ascending: false }).limit(1000),
  ])
  let error = firstError(reports, pending)
  if (error) return { error }

  const postIds = reports.data.filter((r) => r.post_id).map((r) => r.post_id)
  const commentIds = reports.data.filter((r) => r.comment_id).map((r) => r.comment_id)
  const comments = await whereIn('comment_view', 'id, post_id, user_id, body, created_at, username, full_name, avatar_url', 'id', commentIds)
  if (comments.error) return { error: comments.error }
  const posts = await whereIn('post_view', POST_COLS, 'id', [...postIds, ...comments.data.map((c) => c.post_id)])
  if (posts.error) return { error: posts.error }
  const postById = Object.fromEntries([...posts.data, ...pending.data].map((p) => [p.id, p]))

  // Group the reports per post and per comment.
  const groups = {}
  for (const r of reports.data) {
    const key = r.comment_id ? 'c:' + r.comment_id : 'p:' + r.post_id
    const g = (groups[key] = groups[key] || { reps: 0, reasons: [], last: r.created_at })
    g.reps++
    if (r.reason && !g.reasons.includes(r.reason)) g.reasons.push(r.reason)
    if (r.created_at > g.last) g.last = r.created_at
  }

  const items = []
  const addPost = (p, g) => {
    // Already removed: nothing left to review.
    if (!p || p.status === 'rejected') return
    const img = cover(p)
    items.push({
      id: 'p:' + p.id, target: 'post', targetId: p.id, authorId: p.author_id, pending: p.status === 'pending',
      type: typeOfPost(p), img, text: img ? undefined : p.caption || '—', who: person(p), where: whereOfPost(p),
      ai: [null, 0, 'grey'], reps: g ? g.reps : 0, reasons: g ? g.reasons : [],
      why: !g && p.status === 'pending' ? 'Waiting for approval before it shows in the wedding' : null,
      at: ago(g ? g.last : p.created_at), ts: g ? g.last : p.created_at, cap: p.caption || '—',
    })
  }
  const seen = new Set()
  for (const id of postIds) {
    if (seen.has(id)) continue
    seen.add(id)
    addPost(postById[id], groups['p:' + id])
  }
  for (const p of pending.data) if (!seen.has(p.id)) addPost(p, null)
  for (const c of comments.data) {
    const g = groups['c:' + c.id]
    const parent = postById[c.post_id]
    items.push({
      id: 'c:' + c.id, target: 'comment', targetId: c.id, authorId: c.user_id, pending: false,
      type: 'Comment', img: '', text: c.body, who: person(c), where: parent ? whereOfPost(parent) : '—',
      ai: [null, 0, 'grey'], reps: g.reps, reasons: g.reasons, why: null, at: ago(g.last), ts: g.last,
      cap: parent ? 'On ' + person(parent).n + '’s post' + (parent.caption ? ': ' + parent.caption : '') : '—',
    })
  }

  // What we know about each person: posts removed before and when they joined.
  const authors = [...new Set(items.map((m) => m.authorId))]
  const [removed, profiles] = await Promise.all([
    whereIn('posts', 'author_id', 'author_id', authors, (q) => q.eq('status', 'rejected')),
    whereIn('profiles', 'id, created_at', 'id', authors),
  ])
  error = firstError(removed, profiles)
  if (error) return { error }
  const joined = Object.fromEntries(profiles.data.map((p) => [p.id, new Date(p.created_at).getFullYear()]))
  for (const m of items) {
    const n = removed.data.filter((r) => r.author_id === m.authorId).length
    m.about = (n ? n + (n === 1 ? ' post' : ' posts') + ' removed before.' : 'No problems before.') + (joined[m.authorId] ? ' On Mubarakan since ' + joined[m.authorId] + '.' : '')
  }

  items.sort((a, b) => (a.ts < b.ts ? 1 : -1))
  return { data: items }
}

/** Remove: a post is rejected (the app shows it only to its author and, in a wedding, the hosts); a comment is deleted. */
export const removeItem = (m) =>
  m.target === 'comment' ? supabase.from('comments').delete().eq('id', m.targetId) : supabase.from('posts').update({ status: 'rejected' }).eq('id', m.targetId)

/** Keep a post that waits for approval: it is approved, and the app tells its author. */
export const approvePost = (m) => supabase.from('posts').update({ status: 'approved' }).eq('id', m.targetId)
