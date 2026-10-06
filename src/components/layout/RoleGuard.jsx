import { Navigate } from 'react-router-dom'
import useAdmin from '../../hooks/useAdmin'

// Sends people to the dashboard when their role cannot see a section.
export default function RoleGuard({ page, children }) {
  const { can } = useAdmin()
  return can(page) ? children : <Navigate to="/" replace />
}
