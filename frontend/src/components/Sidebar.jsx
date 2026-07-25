import { useState } from 'react'
import { NavLink, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../utils/cn'
import {
  LayoutDashboard,
  Users,
  Calendar,
  LogOut,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(true)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    cn(
      'flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl transition-all duration-200 whitespace-nowrap',
      isActive
        ? 'text-white bg-white/10 border border-white/[6%]'
        : 'text-zinc-400 hover:text-white hover:bg-white/[4%]'
    )

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col bg-zinc-900/50 border-r border-white/[6%] min-h-[calc(100vh-4rem)] transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className={cn('p-4 flex-1', collapsed && 'items-center')}>
        <div className={cn('flex', collapsed ? 'justify-center' : 'items-center justify-between')}>
          {!collapsed && (
            <Link to="/admin" className="flex items-center gap-2.5">
              <img src="/images/himti-icon.svg" alt="HIMTI" className="w-7 h-7 object-contain" />
              <span className="font-semibold text-white">Admin</span>
            </Link>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-white/[6%] transition-all"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className={cn('space-y-1', collapsed ? 'mt-6 flex flex-col items-center' : 'mt-6')}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.exact} className={linkClass}>
              <l.icon className="h-4 w-4 shrink-0" />
              {!collapsed && l.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={cn('p-4 border-t border-white/[6%]', collapsed && 'flex justify-center')}>
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 text-sm text-zinc-500 hover:text-zinc-300 transition-colors',
            collapsed ? 'p-2' : 'w-full'
          )}
          title="Logout"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  )
}
