// Pill colours: [background, text].
export const TONE = {
  green: ['#E7F2EE', '#1E5A4A'],
  gold: ['#FBF3DC', '#8A6A12'],
  maroon: ['#FBEAEC', '#A6192E'],
  grey: ['#F1EEE8', '#6F6A78'],
  blue: ['#EAF0F7', '#3A4A6B'],
}

export const tone = (t) => TONE[t] || TONE.grey

// Share of the platform each city accounts for. Scales dashboard numbers.
export const CITY_FACTOR = { 'All cities': 1, Lahore: 0.36, Karachi: 0.22, Islamabad: 0.09, Delhi: 0.12, London: 0.08 }

export const CITIES = ['All cities', 'Lahore', 'Karachi', 'Islamabad', 'Delhi', 'London']
export const RANGES = ['Today', 'Last 7 days', 'Last 30 days', 'This month', 'Custom']

export const ROLES = {
  Owner: { who: 'Hamza Qureshi', mono: 'H', desc: 'Sees everything', pages: 'dash users weddings businesses review ads enquiries payments messages settings' },
  Operations: { who: 'Mahnoor Baig', mono: 'M', desc: 'Users, weddings and reviews', pages: 'dash users weddings businesses review messages' },
  Sales: { who: 'Usman Tariq', mono: 'U', desc: 'Businesses, ads and enquiries', pages: 'dash businesses ads enquiries payments' },
  Support: { who: 'Areeba Siddiqui', mono: 'A', desc: 'Helps people with accounts', pages: 'dash users weddings enquiries messages' },
  Finance: { who: 'Kamran Shah', mono: 'K', desc: 'Payments and ad spend', pages: 'dash ads payments' },
}

export const NAV = [
  ['Overview', [['dash', 'Dashboard', 'dash']]],
  ['Manage', [['users', 'Users', 'users'], ['weddings', 'Weddings', 'rings'], ['businesses', 'Businesses', 'store'], ['review', 'Review posts', 'shield']]],
  ['Earn', [['ads', 'Ads', 'ads'], ['enquiries', 'Enquiries', 'inbox'], ['payments', 'Payments', 'card']]],
  ['System', [['messages', 'Messages and invites', 'chat'], ['settings', 'Settings', 'gear']]],
]

export const TITLES = {
  dash: 'Dashboard', users: 'Users', weddings: 'Weddings', businesses: 'Businesses', review: 'Review posts',
  ads: 'Ads', enquiries: 'Enquiries', payments: 'Payments', messages: 'Messages and invites', settings: 'Settings',
}

export const DETAIL_TITLES = { user: 'User', wedding: 'Wedding', business: 'Business', ad: 'Ad', enquiry: 'Enquiry', payment: 'Payment' }

// Routing. Each list page owns one kind of detail page under it.
export const PAGE_PATH = {
  dash: '/', users: '/users', weddings: '/weddings', businesses: '/businesses', review: '/review',
  ads: '/ads', enquiries: '/enquiries', payments: '/payments', messages: '/messages', settings: '/settings',
}
export const ENT_PAGE = { user: 'users', wedding: 'weddings', business: 'businesses', ad: 'ads', enquiry: 'enquiries', payment: 'payments' }
export const PAGE_ENT = Object.fromEntries(Object.entries(ENT_PAGE).map(([e, p]) => [p, e]))

export const detailPath = (ent, id) => PAGE_PATH[ENT_PAGE[ent]] + '/' + encodeURIComponent(id)

export const NOTIFICATIONS = [
  ['Gulnar Mehndi applied to join as a business', '24 min ago', 'businesses'],
  ['Invites to 112 guests did not arrive today', '1 hour ago', 'messages'],
  ['6 people asked for their data to be deleted', '2 hours ago', 'settings'],
  ['Hafeez and Sons ad ends in 5 days', '4 hours ago', 'ads'],
]
