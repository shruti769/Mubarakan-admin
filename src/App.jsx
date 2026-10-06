import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import RoleGuard from './components/layout/RoleGuard'
import AdminProvider from './context/AdminProvider'
import Ads from './pages/Ads'
import Businesses from './pages/Businesses'
import Dashboard from './pages/Dashboard'
import Enquiries from './pages/Enquiries'
import Messages from './pages/Messages'
import Payments from './pages/Payments'
import ReviewPosts from './pages/ReviewPosts'
import Settings from './pages/Settings'
import Users from './pages/Users'
import Weddings from './pages/Weddings'
import AdDetail from './pages/details/AdDetail'
import BusinessDetail from './pages/details/BusinessDetail'
import EnquiryDetail from './pages/details/EnquiryDetail'
import PaymentDetail from './pages/details/PaymentDetail'
import UserDetail from './pages/details/UserDetail'
import WeddingDetail from './pages/details/WeddingDetail'

// [path, list page, detail page under /path/:id]
const SECTIONS = [
  ['users', Users, UserDetail],
  ['weddings', Weddings, WeddingDetail],
  ['businesses', Businesses, BusinessDetail],
  ['review', ReviewPosts],
  ['ads', Ads, AdDetail],
  ['enquiries', Enquiries, EnquiryDetail],
  ['payments', Payments, PaymentDetail],
  ['messages', Messages],
  ['settings', Settings],
]

export default function App() {
  return (
    <AdminProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            {SECTIONS.map(([path, List, Detail]) => (
              <Route key={path} path={path}>
                <Route index element={<RoleGuard page={path}><List /></RoleGuard>} />
                {Detail && <Route path=":id" element={<Detail />} />}
              </Route>
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AdminProvider>
  )
}
