import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Apply from './pages/Apply'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Profile from './pages/Profile'
import FAQ from './pages/FAQ'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          {/* Public with Navbar */}
          <Route path="/" element={<><Navbar /><Landing /></>} />

          {/* Standalone pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected with Navbar */}
          <Route path="/dashboard" element={<ProtectedRoute><Navbar /><UserDashboard /></ProtectedRoute>} />
          <Route path="/apply" element={<ProtectedRoute><Navbar /><Apply /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Navbar /><Profile /></ProtectedRoute>} />
          <Route path="/faq" element={<><Navbar /><FAQ /></>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><Navbar /><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute adminOnly><Navbar /><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}