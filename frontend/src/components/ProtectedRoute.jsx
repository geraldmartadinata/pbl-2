import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuth, user } = useAuth()
  const location = useLocation()

  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}
