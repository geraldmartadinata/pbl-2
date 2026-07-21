import { useState, useEffect } from 'react'
import { getAllParticipants, toggleCheckIn } from '../services/api'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { PageSpinner } from '../components/Spinner'
import Sidebar from '../components/Sidebar'
import { Search, Users, CheckCircle, Clock, UserCheck } from 'lucide-react'

const statusConfig = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  attended: { label: 'Attended', variant: 'primary' },
  pending: { label: 'Pending', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
}

export default function AdminDashboard() {
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [checkingId, setCheckingId] = useState(null)

  useEffect(() => {
    getAllParticipants()
      .then(setParticipants)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleCheckIn = async (id) => {
    setCheckingId(id)
    try {
      const updated = await toggleCheckIn(id)
      setParticipants((prev) => prev.map((p) => (p.id === id ? updated : p)))
    } catch {} finally {
      setCheckingId(null)
    }
  }

  const filtered = participants.filter((p) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.full_name.toLowerCase().includes(q) ||
      p.nim.toLowerCase().includes(q) ||
      p.event_title.toLowerCase().includes(q)
    )
  })

  const stats = [
    { label: 'Total', count: participants.length, icon: Users, color: 'text-zinc-300' },
    { label: 'Confirmed', count: participants.filter((p) => p.status === 'confirmed').length, icon: CheckCircle, color: 'text-emerald-300' },
    { label: 'Attended', count: participants.filter((p) => p.status === 'attended').length, icon: UserCheck, color: 'text-sky-300' },
    { label: 'Pending', count: participants.filter((p) => p.status === 'pending').length, icon: Clock, color: 'text-amber-300' },
  ]

  if (loading) return <PageSpinner />

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <div className="p-6 lg:p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-zinc-500 mt-1">Manage participants and check-ins</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <Card key={s.label} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/[6%] flex items-center justify-center">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{s.count}</p>
                  <p className="text-xs text-zinc-500">{s.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-white/[6%]">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search name, NIM, event..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                    filtered.map((p) => (
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
            <div className="px-4 py-3 border-t border-white/[6%] text-xs text-zinc-600">
              Showing {filtered.length} of {participants.length} participants
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
