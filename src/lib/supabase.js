import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY in .env.local')

// The same project as the mobile app. Admins sign in like any user; what they may see and change
// comes from the admin policies in the database, never from a secret key in the browser.
export const supabase = createClient(url, key)
