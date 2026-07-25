import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import AdminDashboard from './pages/AdminDashboard'
import UserDashboard from './pages/UserDashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
        <Routes>
          {/* Public with Navbar */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Landing />
              </>
            }
          />
          <Route
            path="/events"
            element={
              <>
                <Navbar />
                <Events />
              </>
            }
          />
          <Route
            path="/events/:id"
            element={
              <>
                <Navbar />
                <EventDetail />
              </>
            }
          />
          <Route
            path="/register/:id"
            element={
              <>
                <Navbar />
                <Registration />
              </>
            }
          />

          {/* Standalone pages */}
          <Route path="/login" element={<Login />} />

          {/* Protected with Navbar */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Navbar />
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin — top navbar + collapsible sidebar */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><Navbar /><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute adminOnly><Navbar /><AdminDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
