import useAdmin from './useAdmin'

// Actions on users, weddings, businesses and ads, shared by list rows and detail pages.
export default function useActions() {
  const { setState, toast, ask } = useAdmin()

  const userAction = (a, u) => {
    const set = (st) => setState((s) => ({ ust: { ...s.ust, [u.id]: st } }))
    const handle = u.handle.replace('@', '')
    const run = {
      reset: () => toast('Password reset link sent to ' + u.name),
      verify: () => toast(u.name + ' is now verified'),
      signout: () => toast(u.name + ' signed out of all devices'),
      suspend: () => ask({ title: 'Suspend ' + u.name + ' for 7 days?', body: 'They can still look around but cannot post, comment, upload or message.', label: 'Suspend', then: () => { set(['Suspended', 'gold']); toast(u.name + ' suspended for 7 days') } }),
      unsuspend: () => { set(['Active', 'green']); toast(u.name + ' can post again') },
      ban: () => ask({ title: 'Ban ' + u.name + '?', body: 'Their posts are hidden and their phone number cannot make a new account.', type: handle, label: 'Ban user', then: () => { set(['Banned', 'maroon']); toast(u.name + ' banned') } }),
      del: () => ask({ title: 'Delete ' + u.name + '’s account?', body: 'Everything is deleted after a 14 day hold. This cannot be undone after that.', type: handle, label: 'Delete account', then: () => toast(u.name + '’s account will be deleted in 14 days') }),
    }
    run[a]()
  }

  const weddingAction = (a, w) => {
    const run = {
      feature: () => toast(w.name + ' is now shown on the home feed'),
      remind: () => toast('Reminder sent to ' + (w.invited - w.joined) + ' guests who have not replied'),
      zip: () => toast('Preparing all ' + w.photos + ' photos. The couple will get a link.'),
      lock: () => ask({ title: 'Lock ' + w.name + '?', body: 'Nobody can post, comment or chat until it is unlocked.', label: 'Lock wedding', then: () => toast(w.name + ' locked') }),
      del: () => ask({ title: 'Delete ' + w.name + '?', body: 'Every photo, message and guest list is deleted. Guests lose their memories.', type: w.code, label: 'Delete wedding', then: () => toast(w.name + ' will be deleted') }),
    }
    run[a]()
  }

  const businessAction = (a, b) => {
    const id = b.app ? b.app.id : null
    const run = {
      approve: () => { setState((s) => ({ apps: { ...s.apps, [id]: 'ok' } })); toast(b.name + ' approved and verified') },
      reject: () => ask({ title: 'Reject ' + b.name + '?', body: 'They are told what was missing and can apply again.', label: 'Reject', then: () => { setState((s) => ({ apps: { ...s.apps, [id]: 'no' } })); toast(b.name + ' rejected') } }),
      verify: () => toast(b.name + (b.st[0] === 'Verified' ? ' is no longer verified' : ' is now verified')),
      ad: () => setState({ modal: { biz: b.name, head: '', cities: [b.city] } }),
      suspend: () => ask({ title: 'Suspend ' + b.name + '?', body: 'Their profile and ads are hidden until you turn them back on.', label: 'Suspend', then: () => toast(b.name + ' suspended') }),
    }
    run[a]()
  }

  const togglePaused = (ad, message) => {
    const paused = ad.st[0] === 'Paused'
    setState((s) => ({ paused: { ...s.paused, [ad.id]: !paused } }))
    toast(message(paused))
  }

  const endAd = (body) => ask({ title: 'End this ad?', body, label: 'End ad', then: () => toast('Ad ended') })

  return { userAction, weddingAction, businessAction, togglePaused, endAd }
}
