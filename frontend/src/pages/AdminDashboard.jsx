import { useState, useEffect } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { getAllParticipants, toggleCheckIn, getEvents } from '../services/api'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { PageSpinner } from '../components/Spinner'
import Sidebar from '../components/Sidebar'
import { useToast } from '../contexts/ToastContext'
import { cn } from '../utils/cn'
import { Search, Users, CheckCircle, Clock, UserCheck, ChevronLeft, ChevronRight, LayoutDashboard, Calendar } from 'lucide-react'

const statusConfig = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  attended: { label: 'Attended', variant: 'primary' },
  pending: { label: 'Pending', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
}

const adminTabs = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/participants', label: 'Participants', icon: Users },
  { to: '/admin/events', label: 'Events', icon: Calendar },
]

export default function AdminDashboard() {
  const { pathname } = useLocation()
  const [participants, setParticipants] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkingId, setCheckingId] = useState(null)
  const toast = useToast()
  const PAGE_SIZE = 5

  useEffect(() => {
    Promise.all([getAllParticipants(), getEvents()])
      .then(([p, e]) => {
        setParticipants(p)
        setEvents(e)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCheckIn = async (id) => {
    setCheckingId(id)
    try {
      const updated = await toggleCheckIn(id)
      setParticipants((prev) => prev.map((p) => (p.id === id ? updated : p)))
      toast.success(`${updated.full_name} checked in successfully`)
    } catch { toast.error('Check-in failed') } finally {
      setCheckingId(null)
    }
  }

  const tabLabel = adminTabs.find((t) =>
    t.to === '/admin' ? pathname === '/admin' : pathname.startsWith(t.to)
  )?.label || 'Admin'

  const filtered = participants.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.nim.toLowerCase().includes(q) ||
      p.event_title.toLowerCase().includes(q)
    )
  })
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const stats = [
    { label: 'Total', count: participants.length, icon: Users, color: 'text-zinc-300' },
    { label: 'Confirmed', count: participants.filter((p) => p.status === 'confirmed').length, icon: CheckCircle, color: 'text-emerald-300' },
    { label: 'Attended', count: participants.filter((p) => p.status === 'attended').length, icon: UserCheck, color: 'text-sky-300' },
    { label: 'Pending', count: participants.filter((p) => p.status === 'pending').length, icon: Clock, color: 'text-amber-300' },
  ]

  if (loading) return <PageSpinner />

  const isEventsTab = pathname.startsWith('/admin/events')
  const isParticipantsTab = pathname.startsWith('/admin/participants') || pathname === '/admin'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 flex">
      <Sidebar />

      <div className="flex-1 min-w-0 overflow-auto">
        <div className="p-6 lg:p-8">

          {/* Mobile tab bar */}
          <div className="lg:hidden flex border-b border-white/[6%] mb-6 -mx-6 px-6">
            {adminTabs.map((t) => {
              const isActive = t.to === '/admin' ? pathname === '/admin' : pathname.startsWith(t.to)
              return (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.to === '/admin'}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors -mb-[1px]',
                    isActive
                      ? 'text-white border-white'
                      : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  )}
                >
                  <t.icon className="h-4 w-4" />
                  {t.label}
                </NavLink>
              )
            })}
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{tabLabel}</h1>
            <p className="text-sm text-zinc-500 mt-1">
              {isEventsTab ? 'View and manage events' : 'Manage participants and check-ins'}
            </p>
          </div>

          {isEventsTab ? (
            /* ── Events View ── */
            <div className="space-y-4">
              {events.map((evt) => (
                <Card key={evt.id} className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{evt.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                      {evt.date} &middot; {evt.registered}/{evt.capacity} registered
                    </p>
                  </div>
                  <Badge variant={evt.category === 'workshop' ? 'info' : evt.category === 'seminar' ? 'success' : 'warning'}>
                    {evt.category}
                  </Badge>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden">
            <div className="p-4 border-b border-white/[6%]">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search name, NIM, event..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                  className="block w-full rounded-xl bg-zinc-900/80 border border-zinc-700/50 pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20 transition-colors"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[6%]">
                    <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">NIM</th>
                    <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Event</th>
                    <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Status</th>
                    <th className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Check-in</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[4%]">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-12 text-center text-zinc-500">No participants found</td>
                    </tr>
                  ) : (
                    paginated.map((p) => (
                      <tr key={p.id} className="hover:bg-white/[2%] transition-colors">
                        <td className="px-4 py-3.5">
                          <p className="text-white font-medium">{p.full_name}</p>
                          <p className="text-xs text-zinc-500">{p.email}</p>
                        </td>
                        <td className="px-4 py-3.5 text-zinc-400 font-mono text-xs">{p.nim}</td>
                        <td className="px-4 py-3.5 text-zinc-400 max-w-[200px] truncate hidden sm:table-cell">{p.event_title}</td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <Badge variant={statusConfig[p.status]?.variant}>{statusConfig[p.status]?.label}</Badge>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {p.status === 'attended' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                              <CheckCircle className="h-3.5 w-3.5" /> Done
                            </span>
                          ) : p.status === 'cancelled' ? (
                            <span className="text-xs text-zinc-600">—</span>
                          ) : (
                            <Button size="sm" variant="secondary" loading={checkingId === p.id} onClick={() => handleCheckIn(p.id)}>
                              Check In
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-white/[6%] flex items-center justify-between text-xs text-zinc-600">
              <span>
                {filtered.length === 0
                  ? 'No participants'
                  : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(safePage - 1)}
                    disabled={safePage <= 1}
                    className="p-1.5 rounded-lg hover:bg-white/[6%] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-zinc-500">{safePage} / {totalPages}</span>
                  <button
                    onClick={() => setPage(safePage + 1)}
                    disabled={safePage >= totalPages}
                    className="p-1.5 rounded-lg hover:bg-white/[6%] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </Card>
          )}
        </div>
      </div>
    </div>
  )
}
