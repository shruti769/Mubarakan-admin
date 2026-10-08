import { supabase } from '../supabase'
import { firstError, likeText } from './core'

// The top bar search: people, weddings, businesses and enquiry references.

export async function searchAll(q) {
  const t = likeText(q)
  if (!t) return { data: [], error: null }
  const p = '%' + t + '%'
  const code = '%' + t.replace(/[^A-Za-z0-9]/g, '%').toUpperCase() + '%'
  const [users, weddings, businesses, enquiries] = await Promise.all([
    supabase.from('profiles').select('id, full_name, username, avatar_url').or('full_name.ilike.' + p + ',username.ilike.' + p).limit(3),
    supabase.from('events').select('id, title, invite_code, cover_url').or('title.ilike.' + p + ',invite_code.ilike.' + code).limit(3),
    supabase.from('vendors').select('id, name, category, image').ilike('name', p).limit(3),
    supabase.from('leads').select('id, reference, name, brand').ilike('reference', p).limit(2),
  ])
  const error = firstError(users, weddings, businesses, enquiries)
  if (error) return { data: null, error }
  return {
    data: [
      ...users.data.map((u) => ({ key: 'u' + u.id, n: u.full_name || u.username || '—', s: u.username ? '@' + u.username : '—', k: 'User', img: u.avatar_url || '', ent: 'user', id: u.id })),
      ...weddings.data.map((w) => ({ key: 'w' + w.id, n: w.title, s: w.invite_code, k: 'Wedding', img: w.cover_url || '', ent: 'wedding', id: w.id })),
      ...businesses.data.map((b) => ({ key: 'b' + b.id, n: b.name, s: b.category, k: 'Business', img: b.image || '', ent: 'business', id: b.id })),
      ...enquiries.data.map((e) => ({ key: 'e' + e.id, n: e.reference, s: (e.name || '—') + ' to ' + (e.brand || '—'), k: 'Enquiry', img: '', ent: 'enquiry', id: e.id })),
    ],
    error: null,
  }
}
