import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, isAuth, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 bg-himti-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              H
            </span>
            <span className="font-bold text-gray-900 text-lg hidden sm:block">
              HIMTI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-himti-600 transition-colors"
            >
              Beranda
            </Link>

            {isAuth ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className="text-sm text-gray-600 hover:text-himti-600 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-himti-600"
                  >
                    <div className="w-7 h-7 bg-himti-100 rounded-full flex items-center justify-center text-xs font-medium text-himti-700">
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-400 hover:text-coral-500 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="text-sm font-medium text-white bg-himti-600 hover:bg-himti-700 px-4 py-2 rounded-lg transition-colors"
              >
                Masuk
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-2 space-y-2">
            <Link to="/" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
              Beranda
            </Link>
            {isAuth ? (
              <>
                <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/profile" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="block w-full text-left px-3 py-2 text-sm text-coral-500 hover:bg-gray-50 rounded-lg">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-sm text-himti-600 font-medium hover:bg-gray-50 rounded-lg" onClick={() => setMenuOpen(false)}>
                Masuk
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
