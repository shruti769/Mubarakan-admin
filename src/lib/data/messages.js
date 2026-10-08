import { supabase } from '../supabase'
import { daysAgo, fmtStamp } from './core'

// The only messages the backend records are in-app notifications (public.notifications). There is
// no WhatsApp, SMS, email or push delivery log, so the list shows those notifications only.

const KIND = {
  like: 'Like on a post', comment: 'New comment', follow: 'New follower', mention: 'Mention', join: 'Guest joined a wedding',
  rsvp: 'Reply to an invite', announcement: 'Wedding announcement', invite: 'Wedding invite', approved: 'Post approved', photo: 'New photos',
}

/** The latest 1000 notifications, newest first. */
export async function loadMessages() {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, read_at, created_at, profiles!notifications_user_id_fkey(full_name, username, city)')
    .order('created_at', { ascending: false })
    .limit(1000)
  if (error) return { error }
  return {
    data: data.map((n) => {
      const to = n.profiles || {}
      return {
        id: n.id, ref: 'APP-' + n.id.slice(0, 6).toUpperCase(), kind: KIND[n.type] || n.type, ch: 'App notification',
        to: to.full_name || (to.username ? '@' + to.username : '—'), city: to.city || '—', at: fmtStamp(n.created_at),
        st: n.read_at ? ['Read', 'green'] : ['Not read', 'gold'], age: daysAgo(n.created_at), ts: new Date(n.created_at).getTime(),
      }
    }),
  }
}
