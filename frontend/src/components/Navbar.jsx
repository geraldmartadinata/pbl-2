import { Link, useLocation } from 'react-router-dom'
import { cn } from '../utils/cn'
import { Menu, X, Calendar, LayoutDashboard, UserPlus } from 'lucide-react'
import { useState } from 'react'

const navLinks = [
  { to: '/', label: 'Events', icon: Calendar },
  { to: '/admin', label: 'Admin', icon: LayoutDashboard },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">
              HIMTI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors',
                  pathname === to
                    ? 'text-white bg-slate-800/80'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-800/60 px-4 py-3 space-y-1 animate-slide-in">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors',
                pathname === to
                  ? 'text-white bg-slate-800/80'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
