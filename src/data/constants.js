// Pill colours: [background, text].
export const TONE = {
  green: ['#E7F2EE', '#1E5A4A'],
  gold: ['#FBF3DC', '#8A6A12'],
  maroon: ['#FBEAEC', '#A6192E'],
  grey: ['#F1EEE8', '#6F6A78'],
  blue: ['#EAF0F7', '#3A4A6B'],
}

export const tone = (t) => TONE[t] || TONE.grey

export const RANGES = ['Today', 'Last 7 days', 'Last 30 days', 'This month', 'Custom']

export const ROLES = {
  Owner: { desc: 'Sees everything', pages: 'dash users weddings businesses review ads enquiries payments messages settings' },
  Operations: { desc: 'Users, weddings and reviews', pages: 'dash users weddings businesses review messages' },
  Sales: { desc: 'Businesses, ads and enquiries', pages: 'dash businesses ads enquiries payments' },
  Support: { desc: 'Helps people with accounts', pages: 'dash users weddings enquiries messages' },
  Finance: { desc: 'Payments and ad spend', pages: 'dash ads payments' },
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

// A blank add a business form.
export const EMPTY_BUSINESS = { name: '', cat: '', city: '', owner: '', phone: '', email: '', link: '', plan: 'Starter', ver: false }
