import { supabase } from '../supabase'

// Helpers shared by the users, weddings, dashboard and search queries.

const PAGE = 1000

/**
 * Every row of a query, fetched 1000 at a time (the API returns at most 1000 per request).
 * `build` returns a fresh query each call, e.g. () => supabase.from('events').select('id').
 */
export async function fetchAll(build, cap = 50) {
  const out = []
  for (let i = 0; i < cap; i++) {
    const { data, error } = await build().range(i * PAGE, i * PAGE + PAGE - 1)
    if (error) return { data: null, error }
    out.push(...(data || []))
    if (!data || data.length < PAGE) break
  }
  return { data: out, error: null }
}

/** How many rows match, without fetching them. `build(q)` adds filters to the counting query. */
export async function countRows(table, build = (q) => q, select = '*') {
  const { count, error } = await build(supabase.from(table).select(select, { count: 'exact', head: true }))
  return { count: count ?? 0, error }
}

/** First error of several results, or null. */
export const firstError = (...rs) => rs.find((r) => r && r.error)?.error || null

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// A 'YYYY-MM-DD' date is a calendar day; read it as local midnight, not UTC.
const asDate = (v) => (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) ? new Date(v + 'T00:00:00') : new Date(v))

/** "14 Jan 2026", or '—'. */
export function fmtDate(v) {
  if (!v) return '—'
  const d = asDate(v)
  return String(d.getDate()).padStart(2, '0') + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear()
}

/** "12 to 14 Oct 2026", "30 Sep to 2 Oct 2026", or '—'. */
export function fmtRange(a, b) {
  if (!a) return '—'
  const x = asDate(a)
  const y = b ? asDate(b) : x
  if (x.getTime() === y.getTime()) return x.getDate() + ' ' + MONTHS[x.getMonth()] + ' ' + x.getFullYear()
  if (x.getFullYear() !== y.getFullYear()) return x.getDate() + ' ' + MONTHS[x.getMonth()] + ' ' + x.getFullYear() + ' to ' + y.getDate() + ' ' + MONTHS[y.getMonth()] + ' ' + y.getFullYear()
  if (x.getMonth() !== y.getMonth()) return x.getDate() + ' ' + MONTHS[x.getMonth()] + ' to ' + y.getDate() + ' ' + MONTHS[y.getMonth()] + ' ' + y.getFullYear()
  return x.getDate() + ' to ' + y.getDate() + ' ' + MONTHS[y.getMonth()] + ' ' + y.getFullYear()
}

/** "Sat 12 Oct, 7:00 pm", or '—'. */
export function fmtWhen(v) {
  if (!v) return '—'
  const d = new Date(v)
  const h = d.getHours()
  return DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ', ' + (h % 12 || 12) + ':' + String(d.getMinutes()).padStart(2, '0') + ' ' + (h < 12 ? 'am' : 'pm')
}

/** "Today, 14:22", "Yesterday, 09:10", "3 Oct, 11:30". */
export function fmtStamp(v) {
  if (!v) return '—'
  const d = new Date(v)
  const t = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
  const day = Math.round((startOfDay(new Date()) - startOfDay(d)) / 86400000)
  if (day === 0) return 'Today, ' + t
  if (day === 1) return 'Yesterday, ' + t
  return d.getDate() + ' ' + MONTHS[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? ' ' + d.getFullYear() : '') + ', ' + t
}

export const shortDay = (v) => {
  const d = asDate(v)
  return d.getDate() + ' ' + MONTHS[d.getMonth()]
}

export const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

/** Local calendar day as 'YYYY-MM-DD'. */
export const isoDay = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')

/** Whole days since a timestamp. */
export const daysAgo = (v) => (v ? Math.max(0, Math.floor((Date.now() - new Date(v).getTime()) / 86400000)) : 9999)

/** "2,418", or "12.4k" from 10,000 up. */
export const fmtCount = (n) => (n >= 10000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : Math.round(n).toLocaleString('en-US'))

/** Escapes text for a PostgREST ilike pattern inside an or() filter. */
export const likeText = (s) => String(s).replace(/[%_,()*\\]/g, ' ').trim()

/** "248,610". */
export const fmtNum = (n) => Math.round(n || 0).toLocaleString('en-US')
