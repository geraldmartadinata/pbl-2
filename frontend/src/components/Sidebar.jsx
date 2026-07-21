import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
} from 'lucide-react'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-zinc-900/50 backdrop-blur-2xl border-r border-white/[6%] min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
            <span className="text-zinc-900 font-bold text-sm">H</span>
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            HIMTI
          </span>
        </div>

        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200',
                  isActive
                    ? 'text-white bg-white/10 border border-white/[6%]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[4%]'
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
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
  )
}
