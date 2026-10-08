import { supabase } from '../supabase'
import { fetchAll, firstError, fmtDate } from './core'

// Privacy requests: data copies people asked for (data_requests) and account deletions waiting out
// their 14 days (account_deletions; a daily job deletes them, nothing for an admin to do).

const NEXT = { pending: 'ready', ready: 'sent' }
const CHIP = { pending: 'To do', ready: 'Ready', sent: 'Done' }
const nameOf = (p) => (p && (p.full_name || (p.username ? '@' + p.username : ''))) || '—'

export async function loadPrivacyRequests() {
  const [reqs, dels] = await Promise.all([
    fetchAll(() => supabase.from('data_requests').select('id, items, status, created_at, profiles(full_name, username)').order('created_at', { ascending: false })),
    fetchAll(() => supabase.from('account_deletions').select('user_id, requested_at, purge_after').order('purge_after')),
  ])
  let error = firstError(reqs, dels)
  if (error) return { error }
  // account_deletions points at auth.users, so the names come from profiles separately.
  const ids = dels.data.map((d) => d.user_id)
  const profs = ids.length ? await supabase.from('profiles').select('id, full_name, username').in('id', ids) : { data: [] }
  error = firstError(profs)
  if (error) return { error }
  const byId = Object.fromEntries(profs.data.map((p) => [p.id, p]))
  return {
    data: [
      ...reqs.data.map((r) => ({
        id: r.id, name: nameOf(r.profiles), what: 'Send me my data . ' + r.items.join(', ') + ' . asked ' + fmtDate(r.created_at),
        chip: CHIP[r.status] || r.status, status: r.status, next: NEXT[r.status] || null,
      })),
      ...dels.data.map((d) => ({
        id: 'del:' + d.user_id, name: nameOf(byId[d.user_id]), what: 'Delete my account . deleted automatically on ' + fmtDate(d.purge_after),
        chip: 'Automatic', next: null,
      })),
    ],
  }
}

/** pending → ready (the export is prepared) → sent (the link was emailed). */
export const advanceDataRequest = (r) => supabase.from('data_requests').update({ status: r.next }).eq('id', r.id)
