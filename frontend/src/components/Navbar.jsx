import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'
import {
  Menu,
  X,
  Calendar,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, isAuth, logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setDropdownOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const navLinks = [
    { to: '/', label: 'Events', icon: Calendar },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[7%] bg-zinc-950/80 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left — Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10 group-hover:shadow-white/20 transition-shadow">
              <span className="text-zinc-900 font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">
              HIMTI
            </span>
          </Link>

          {/* Right — Desktop */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl transition-all duration-200',
                  pathname === to
                    ? 'text-white bg-white/10'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}

            {/* Auth */}
            {isAuth ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/5 transition-all duration-200"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-zinc-300">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown
                    className={cn(
                      'h-3.5 w-3.5 text-zinc-500 transition-transform duration-200',
                      dropdownOpen && 'rotate-180'
                    )}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/[8%] bg-zinc-900/90 backdrop-blur-2xl shadow-2xl p-1.5 animate-slide-in">
                    <div className="px-3 py-2 border-b border-white/[6%] mb-1">
                      <p className="text-sm text-white font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-zinc-500 capitalize">
                        {user?.role}
                      </p>
                    </div>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/[6%] transition-all"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}

                    <Link
                      to="/"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/[6%] transition-all"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        logout()
                        setDropdownOpen(false)
                      }}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 transition-all w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-all duration-200 shadow-lg shadow-white/10"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/[7%] px-4 py-3 space-y-1 animate-slide-in bg-zinc-950/95 backdrop-blur-2xl">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors',
                pathname === to
                  ? 'text-white bg-white/10'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <div className="border-t border-white/[6%] pt-2 mt-2">
            {isAuth ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user?.name}</p>
                    <p className="text-xs text-zinc-500 capitalize">{user?.role}</p>
                  </div>
                </div>
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/5"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-3 py-2.5 text-sm font-medium text-zinc-900 bg-white rounded-xl w-full"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
