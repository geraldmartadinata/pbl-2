import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'
import {
  ChevronDown,
  LogOut,
  LayoutDashboard,
  User,
  Ticket,
  Send,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, isAuth, logout } = useAuth()
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

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[7%] bg-zinc-950/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/images/himti-icon.svg" alt="HIMTI" className="w-8 h-8 object-contain" />
            <span className="font-semibold text-white text-lg tracking-tight">HIMTI</span>
          </Link>

          <div className="flex items-center gap-2">
            {isAuth ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium text-zinc-300">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name}</span>
                  <ChevronDown className={cn('h-3.5 w-3.5 text-zinc-500 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/[8%] bg-zinc-900/90 backdrop-blur-2xl shadow-2xl p-1.5 animate-slide-in">
                    <div className="px-3 py-2 border-b border-white/[6%] mb-1">
                      <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-zinc-500 capitalize">{user?.role}</p>
                    </div>

                    {user?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/[6%] transition-all">
                        <LayoutDashboard className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}

                    <Link to="/dashboard" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/[6%] transition-all">
                      <Ticket className="h-4 w-4" /> My Application
                    </Link>

                    <Link to="/apply" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/[6%] transition-all">
                      <Send className="h-4 w-4" /> Apply
                    </Link>

                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-300 hover:text-white rounded-xl hover:bg-white/[6%] transition-all">
                      <User className="h-4 w-4" /> Profile
                    </Link>

                    <button onClick={() => { logout(); setDropdownOpen(false) }}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 transition-all w-full">
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-900 bg-white rounded-xl hover:bg-zinc-100 transition-all shadow-lg shadow-white/10">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}