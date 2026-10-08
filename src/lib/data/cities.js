import { supabase } from '../supabase'

/**
 * Every city that appears in the data: people's profiles, weddings and businesses (whose
 * category is stored as "Category, City"). Sorted, without duplicates or blanks.
 */
export async function loadCities() {
  const [people, weddings, vendors] = await Promise.all([
    supabase.from('profiles').select('city').not('city', 'is', null).limit(5000),
    supabase.from('events').select('city').not('city', 'is', null).limit(5000),
    supabase.from('vendors').select('category'),
  ])
  const error = people.error || weddings.error || vendors.error
  const all = [
    ...(people.data || []).map((r) => r.city),
    ...(weddings.data || []).map((r) => r.city),
    ...(vendors.data || []).map((r) => (r.category.includes(',') ? r.category.split(',').pop() : '')),
  ]
  const cities = [...new Set(all.map((c) => (c || '').trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  return { data: cities, error }
}
