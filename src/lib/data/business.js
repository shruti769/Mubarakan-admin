import { supabase } from '../supabase'
import { countRows, daysAgo, fetchAll, firstError, fmtCount, fmtDate } from './core'

// Businesses (vendors), their ads and the enquiries (leads) customers send through those ads.
// vendors and ads are not linked by a key in the database: an ad belongs to the business whose
// name matches ads.brand, and an enquiry to the business named in leads.brand.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "05 Oct 2026, 14:12". */
export function fmtDateTime(v) {
  if (!v) return '—'
  const d = new Date(v)
  return String(d.getDate()).padStart(2, '0') + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear() + ', ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0')
}

const monthStart = () => {
  const d = new Date()
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString()
}

// What the app calls each ad format, as the admin names them.
export const AD_FORMAT = { ba: 'Before and after', film: 'Wedding film', dates: 'Open dates calendar', edit: 'Single photo', cat: 'Product grid', pack: 'Menu and prices' }

// vendors.category is "Category, City", as the app's Explore list shows it.
export const splitCategory = (s) => {
  const i = String(s || '').lastIndexOf(', ')
  return i < 0 ? [s || '—', '—'] : [s.slice(0, i), s.slice(i + 2)]
}

const BIZ_ST = (active) => (active ? ['Active', 'green'] : ['Suspended', 'maroon'])
const AD_ST = (active) => (active ? ['Running', 'green'] : ['Paused', 'gold'])

/** Every enquiry, just enough to count them per business and per ad. */
const leadStubs = () => fetchAll(() => supabase.from('leads').select('id, brand, ad_id, created_at').order('created_at', { ascending: false }))

function toBusiness(v, leads) {
  const [cat, city] = splitCategory(v.category)
  const mine = leads.filter((l) => l.brand === v.name)
  const since = monthStart()
  return {
    id: v.id, name: v.name, cat, city, img: v.image, rating: Number(v.rating).toFixed(1), weds: fmtCount(v.jobs),
    plan: '—', resp: '—', leads: fmtCount(mine.length), leadsMonth: fmtCount(mine.filter((l) => l.created_at >= since).length),
    st: BIZ_ST(v.active), active: v.active, sponsored: v.sponsored, age: daysAgo(v.created_at), vendor: v,
  }
}

function toAd(a, leads) {
  return {
    id: a.id, biz: a.brand, type: AD_FORMAT[a.format] || a.format, head: a.line, city: a.city, category: a.category,
    seen: '—', clicks: '—', spend: '—', enq: fmtCount(leads.filter((l) => l.ad_id === a.id).length),
    img: (a.photos || [])[0] || '', photos: a.photos || [], st: AD_ST(a.active), active: a.active, age: daysAgo(a.created_at), raw: a,
  }
}

function toEnquiry(x, vendorCat) {
  const ad = x.ads
  const prof = x.profiles
  return {
    id: x.id, ref: x.reference, cust: x.name, phone: x.phone, biz: x.brand, adId: x.ad_id,
    ad: ad ? AD_FORMAT[ad.format] || ad.format : '—',
    cat: (ad && ad.category) || vendorCat[x.brand] || '—',
    date: fmtDateTime(x.created_at), day: fmtDate(x.created_at), reply: '—', prefers: x.contact_pref || '—',
    // There is no status, delivery or reply tracking on an enquiry: it was received, nothing more is known.
    st: ['Received', 'grey'], city: (prof && prof.city) || '—', avatar: (prof && prof.avatar_url) || '',
    answers: x.answers || {}, note: x.note || '', leadKey: x.ad_key, age: daysAgo(x.created_at),
  }
}

const vendorCategories = async () => {
  const { data, error } = await supabase.from('vendors').select('name, category')
  return { data: Object.fromEntries((data || []).map((v) => [v.name, splitCategory(v.category)[0]])), error }
}

const enquiryQuery = () => supabase.from('leads').select('*, profiles(city, avatar_url), ads(format, category)').order('created_at', { ascending: false })

// Businesses ---------------------------------------------------------------------------------

export async function loadBusinesses() {
  const [v, l] = await Promise.all([supabase.from('vendors').select('*').order('sort'), leadStubs()])
  const error = firstError(v, l)
  if (error) return { error }
  const rows = v.data.map((x) => toBusiness(x, l.data))
  return { data: { rows, total: rows.length } }
}

/** One business with its ads and enquiries, or null. */
export async function loadBusiness(id) {
  const v = await supabase.from('vendors').select('*').eq('id', id).maybeSingle()
  if (v.error) return { error: v.error }
  if (!v.data) return { data: null }
  const name = v.data.name
  const [ads, leads, cats] = await Promise.all([
    supabase.from('ads').select('*').eq('brand', name).order('sort'),
    fetchAll(() => enquiryQuery().eq('brand', name)),
    vendorCategories(),
  ])
  const error = firstError(ads, leads, cats)
  if (error) return { error }
  const stubs = leads.data.map((x) => ({ brand: x.brand, ad_id: x.ad_id, created_at: x.created_at }))
  return {
    data: {
      b: toBusiness(v.data, stubs),
      ads: ads.data.map((a) => toAd(a, stubs)),
      enquiries: leads.data.map((x) => toEnquiry(x, cats.data)),
    },
  }
}

/** Names and the vendor row of every business, for the ad form. */
export async function loadBusinessChoices() {
  const { data, error } = await supabase.from('vendors').select('*').order('name')
  return { data: data || [], error }
}

/** Suspend hides the business and all its ads in the app; turning it back on shows the business only. */
export async function setBusinessActive(b, active) {
  const r = await supabase.from('vendors').update({ active }).eq('id', b.id)
  if (r.error || active) return r
  return supabase.from('ads').update({ active: false }).eq('brand', b.name)
}

/** Suspends several businesses and their ads. */
export async function suspendBusinesses(rows) {
  const ids = rows.map((r) => r.id)
  const r = await supabase.from('vendors').update({ active: false }).in('id', ids)
  if (r.error) return r
  return supabase.from('ads').update({ active: false }).in('brand', rows.map((x) => x.name))
}

// Ads ----------------------------------------------------------------------------------------

export async function loadAds() {
  const [a, l, withAd] = await Promise.all([
    supabase.from('ads').select('*').order('sort'),
    leadStubs(),
    countRows('leads', (q) => q.not('ad_id', 'is', null)),
  ])
  const error = firstError(a, l, withAd)
  if (error) return { error }
  const rows = a.data.map((x) => toAd(x, l.data))
  return { data: { rows, running: rows.filter((r) => r.active).length, fromAds: withAd.count } }
}

/** One ad with its enquiries, or null. */
export async function loadAd(id) {
  const a = await supabase.from('ads').select('*').eq('id', id).maybeSingle()
  if (a.error) return { error: a.error }
  if (!a.data) return { data: null }
  const [leads, cats] = await Promise.all([fetchAll(() => enquiryQuery().eq('ad_id', id)), vendorCategories()])
  const error = firstError(leads, cats)
  if (error) return { error }
  const stubs = leads.data.map((x) => ({ ad_id: x.ad_id }))
  return { data: { a: toAd(a.data, stubs), enquiries: leads.data.map((x) => toEnquiry(x, cats.data)) } }
}

export const setAdActive = (id, active) => supabase.from('ads').update({ active }).eq('id', id)

/** Several ads at once, by id. */
export const setAdsActive = (ids, active) => supabase.from('ads').update({ active }).in('id', ids)

// The enquiry form the app opens for an ad, guessed from the business's category.
const LEAD_KEYS = [
  [/decor|flor|flower/i, 'decor'], [/film|photo|video/i, 'film'], [/venue|banquet|hall|marquee/i, 'venue'],
  [/makeup|make up|beauty|henna|mehndi/i, 'makeup'], [/jewel|polki|gold/i, 'jewel'], [/cater|food|sweet/i, 'cater'],
  [/invit|card|stationery/i, 'invite'], [/couture|wear|bridal|dress|lehenga|outfit/i, 'wear'],
]
const leadKeyFor = (cat) => (LEAD_KEYS.find(([re]) => re.test(cat)) || [null, 'decor'])[1]

/**
 * Creates an ad from the form (business, headline, cities). Everything else the app needs is
 * filled from the business's vendor row, or a default: a single photo ad using the business's
 * photo, no supporting line, "Get a quote", running now, last in the order.
 */
export async function createAd({ vendor, head, cities }) {
  const [cat, city] = splitCategory(vendor.category)
  const last = await supabase.from('ads').select('sort').order('sort', { ascending: false }).limit(1)
  if (last.error) return { error: last.error }
  return supabase.from('ads').insert({
    brand: vendor.name, category: cat, city: cities.length ? cities.join(', ') : city, format: 'edit', line: head.trim(),
    support: '', cta: 'Get a quote', lead_key: leadKeyFor(cat), photos: vendor.image ? [vendor.image] : [], extra: '',
    active: true, sort: ((last.data[0] && last.data[0].sort) || 0) + 1,
  })
}

/** Edits the business, headline and cities of an existing ad; other columns stay as they are. */
export const updateAd = (id, { vendor, head, cities }) =>
  supabase.from('ads').update({ brand: vendor.name, category: splitCategory(vendor.category)[0], line: head.trim(), ...(cities.length ? { city: cities.join(', ') } : {}) }).eq('id', id)

// Enquiries ----------------------------------------------------------------------------------

export async function loadEnquiries() {
  const [l, cats] = await Promise.all([fetchAll(enquiryQuery), vendorCategories()])
  const error = firstError(l, cats)
  if (error) return { error }
  const rows = l.data.map((x) => toEnquiry(x, cats.data))
  return { data: { rows, week: rows.filter((r) => r.age < 7).length } }
}

export async function loadEnquiry(id) {
  const [l, cats] = await Promise.all([enquiryQuery().eq('id', id).maybeSingle(), vendorCategories()])
  const error = firstError(l, cats)
  if (error) return { error }
  return { data: l.data ? toEnquiry(l.data, cats.data) : null }
}

// The questions of the app's enquiry form (LEADCFG in the app), so answers read as they were asked.
export const ANSWER_LABELS = {
  date: 'Wedding date', fn: 'Functions', venue: 'Venue', guests: 'Guests', where: 'Indoor or outdoor', style: 'Style', budget: 'Budget',
  cov: 'What they need', crew: 'How many shooters', deliv: 'Delivery timeline', seat: 'Seating style', cat: 'Catering needed',
  sil: 'Silhouette', weeks: 'Timeline', size: 'Size', fab: 'Fabric', slot: 'Appointment slot', loc: 'Where', party: 'Party size',
  trial: 'Trial needed', mode: 'Rent or buy', pieces: 'Which pieces', menu: 'Menu type', serv: 'Service style', qty: 'How many', fin: 'Finish',
}

export const answerPairs = (e) => {
  const pairs = Object.entries(e.answers).map(([k, v]) => [ANSWER_LABELS[k] || k, Array.isArray(v) ? v.join(', ') || '—' : v === true ? 'Yes' : v === false ? 'No' : String(v ?? '—')])
  if (e.note) pairs.push(['Note', e.note])
  return pairs
}
