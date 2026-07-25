import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200',
      isActive
        ? 'text-white bg-white/10 border border-white/[6%]'
        : 'text-zinc-400 hover:text-white hover:bg-white/[4%]'
    )

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-50 border-b border-white/[7%] bg-zinc-950/80 backdrop-blur-2xl">
        <div className="flex items-center justify-between px-4 h-14">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white rounded-xl flex items-center justify-center">
              <span className="text-zinc-900 font-bold text-xs">H</span>
            </div>
            <span className="font-semibold text-white">HIMTI Admin</span>
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="px-3 pb-3 space-y-1 animate-slide-in">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.exact}
                onClick={() => setMobileOpen(false)}
                className={linkClass}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            ))}
            <div className="border-t border-white/[6%] pt-2 mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3.5 py-2.5 text-sm text-zinc-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 transition-all w-full"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-zinc-900/50 backdrop-blur-2xl border-r border-white/[6%] min-h-screen">
        <div className="p-6">
          <Link to="/admin" className="flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
              <span className="text-zinc-900 font-bold text-sm">H</span>
            </div>
            <span className="font-semibold text-white text-lg tracking-tight">
              HIMTI
            </span>
          </Link>

          <nav className="space-y-1">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.exact} className={linkClass}>
                <l.icon className="h-4 w-4" />
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/[6%]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-sm text-zinc-500 hover:text-zinc-300 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
