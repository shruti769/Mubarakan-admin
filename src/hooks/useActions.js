import { setAdActive, setBusinessActive } from '../lib/data/business'
import { supabase } from '../lib/supabase'
import { updateProfile, userEmail } from '../lib/data/users'
import { deleteWedding, updateWedding } from '../lib/data/weddings'
import useAdmin from './useAdmin'

// Actions on users, weddings, businesses and ads, shared by list rows and detail pages.
export default function useActions() {
  const { setState, toast, ask } = useAdmin()

  // Users. `after` reloads the page once a change is saved.
  const userAction = (a, u, after) => {
    const run = {
      reset: async () => {
        const { data: email, error } = await userEmail(u.id)
        if (error) return toast('Could not send: ' + error.message)
        if (!email) return toast(u.name + ' has no email to send a reset link to')
        const r = await supabase.auth.resetPasswordForEmail(email)
        if (r.error) return toast('Could not send: ' + r.error.message)
        toast('Password reset link sent to ' + u.name)
      },
      verify: async () => {
        const on = !u.verified
        const { error } = await updateProfile(u.id, { verified: on })
        saved(error, u.name + (on ? ' is now verified' : ' is no longer verified'), after)
      },
      // Not in the backend: there is no suspension, ban, session revoking or admin delete.
      signout: () => toast('Signing out of all devices is not connected yet'),
      suspend: () => toast('Suspending users is not connected yet'),
      unsuspend: () => toast('Suspending users is not connected yet'),
      ban: () => toast('Banning users is not connected yet'),
      del: () => toast('Deleting accounts from the admin is not connected yet'),
    }
    run[a]()
  }

  // A privacy switch on a user's profile: face_grouping, allow_downloads or show_in_explore.
  const userSetting = async (u, patch, msg, after) => saved((await updateProfile(u.id, patch)).error, msg, after)

  // Weddings.
  const weddingAction = (a, w, after) => {
    const run = {
      // Not in the backend: featuring, reminders, photo downloads and locking.
      feature: () => toast('Showing weddings on the home feed is not connected yet'),
      remind: () => toast('Reminding guests is not connected yet'),
      zip: () => toast('Downloading all photos is not connected yet'),
      lock: () => toast('Locking weddings is not connected yet'),
      del: () =>
        ask({
          title: 'Delete ' + w.name + '?', body: 'Every photo, message and guest list is deleted. Guests lose their memories.', type: w.code, label: 'Delete wedding',
          then: async () => saved((await deleteWedding(w.id)).error, w.name + ' deleted', after),
        }),
    }
    run[a]()
  }

  // A setting on a wedding: privacy or allow_downloads.
  const weddingSetting = async (w, patch, msg, after) => saved((await updateWedding(w.id, patch)).error, msg, after)

  // `after` reloads the page's data once a change is saved.
  const saved = (error, msg, after) => {
    if (error) return toast('Could not save: ' + (error.message || error))
    toast(msg)
    if (after) after()
  }

  const businessAction = (a, b, after) => {
    const run = {
      // Applications, verification of businesses and plans are not in the backend.
      approve: () => toast('Business applications are not connected yet'),
      reject: () => toast('Business applications are not connected yet'),
      verify: () => toast('Verifying businesses is not connected yet'),
      ad: () => setState({ modal: { biz: b.name, head: '', cities: b.city && b.city !== '—' ? [b.city] : [], after } }),
      suspend: () =>
        b.active
          ? ask({ title: 'Suspend ' + b.name + '?', body: 'Their profile and ads are hidden until you turn them back on.', label: 'Suspend', then: async () => saved((await setBusinessActive(b, false)).error, b.name + ' suspended', after) })
          : setBusinessActive(b, true).then((r) => saved(r.error, b.name + ' is shown in the app again', after)),
    }
    run[a]()
  }

  const togglePaused = (ad, message, after) => {
    const paused = !ad.active
    setAdActive(ad.id, paused).then((r) => saved(r.error, message(paused), after))
  }

  // There is no separate "ended" state in the backend: ending an ad stops it showing, like a pause.
  const endAd = (body, ad, after) =>
    ask({ title: 'End this ad?', body, label: 'End ad', then: async () => saved((await setAdActive(ad.id, false)).error, 'Ad ended', after) })

  return { userAction, userSetting, weddingAction, weddingSetting, businessAction, togglePaused, endAd }
}
