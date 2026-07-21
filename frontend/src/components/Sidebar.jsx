import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '../utils/cn'
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react'

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
]

export default function Sidebar() {
  const { pathname } = useLocation()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/80 min-h-screen">
      <div className="p-6">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/30">
            <span className="text-white font-bold text-sm">H</span>
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            HIMTI
          </span>
        </div>

        <nav className="space-y-1">
          {sidebarLinks.map(({ to, label, icon: Icon, exact }) => {
            const active = exact ? pathname === to : pathname.startsWith(to)
            return (
              <NavLink
                key={to}
                to={to}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg transition-colors',
                  active
                    ? 'text-white bg-blue-600/15 border border-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-slate-800/80">
        <button className="flex items-center gap-3 text-sm text-slate-500 hover:text-slate-300 transition-colors w-full">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  )
}
