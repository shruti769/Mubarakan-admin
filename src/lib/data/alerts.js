import { supabase } from '../supabase'
import { firstError } from './core'
import { ago } from './review'

// The top bar bell: things in the backend that wait for an admin. [text, when, page, extra state]
const newest = (table, col, build = (q) => q) => build(supabase.from(table).select(col, { count: 'exact' }).order(col, { ascending: false }).limit(1))

export async function loadAlerts() {
  const [reports, pending, data, deletions] = await Promise.all([
    newest('reports', 'created_at'),
    newest('posts', 'created_at', (q) => q.eq('status', 'pending')),
    newest('data_requests', 'created_at', (q) => q.eq('status', 'pending')),
    newest('account_deletions', 'requested_at'),
  ])
  const error = firstError(reports, pending, data, deletions)
  if (error) return { error }
  const when = (r, col) => (r.data[0] ? ago(r.data[0][col]) : '')
  const n = (c, one, many) => c + ' ' + (c === 1 ? one : many)
  const out = []
  if (reports.count) out.push([n(reports.count, 'report', 'reports') + ' on posts and comments to review', when(reports, 'created_at'), 'review'])
  if (pending.count) out.push([n(pending.count, 'post waits', 'posts wait') + ' for approval', when(pending, 'created_at'), 'review'])
  if (data.count) out.push([n(data.count, 'person', 'people') + ' asked for a copy of their data', when(data, 'created_at'), 'settings', { setTab: 'privacy' }])
  if (deletions.count) out.push([n(deletions.count, 'account is', 'accounts are') + ' waiting to be deleted', when(deletions, 'requested_at'), 'settings', { setTab: 'privacy' }])
  return { data: out }
}
