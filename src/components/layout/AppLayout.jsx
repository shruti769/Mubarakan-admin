import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AddBusinessModal from '../common/AddBusinessModal'
import ConfirmDialog from '../common/ConfirmDialog'
import CreateAdModal from '../common/CreateAdModal'
import Toasts from '../common/Toasts'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  const { pathname } = useLocation()
  const scroller = useRef(null)

  // Every new page starts at the top.
  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = 0
  }, [pathname])

  return (
    <div style={{ height: '100vh', minWidth: 1280, display: 'flex', background: '#F7F4EF', color: '#14142B', fontFamily: "'Poppins',sans-serif", fontSize: 14 }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div ref={scroller} style={{ flex: 1, overflowY: 'auto' }}>
          <div key={pathname} style={{ maxWidth: 1480, margin: '0 auto', padding: '20px 24px 48px' }}>
            <Outlet />
          </div>
        </div>
      </div>
      <CreateAdModal />
      <AddBusinessModal />
      <ConfirmDialog />
      <Toasts />
    </div>
  )
}
