import { useState, useEffect } from 'react'
import { getAllParticipants, toggleCheckIn } from '../services/api'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import Sidebar from '../components/Sidebar'
import { Search, Users, CheckCircle, Clock, XCircle } from 'lucide-react'

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

  const load = () => {
    setLoading(true)
    getAllParticipants()
      .then(setParticipants)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleCheckIn = async (id) => {
    setCheckingId(id)
    try {
      const updated = await toggleCheckIn(id)
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      )
    } catch {
      // noop
    } finally {
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

  const statCards = [
    {
      label: 'Total',
      count: participants.length,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Confirmed',
      count: participants.filter((p) => p.status === 'confirmed').length,
      icon: CheckCircle,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Attended',
      count: participants.filter((p) => p.status === 'attended').length,
      icon: CheckCircle,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
    },
    {
      label: 'Pending',
      count: participants.filter((p) => p.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage participants and check-ins
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <Card key={s.label} className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{s.count}</p>
                  <p className="text-xs text-slate-500">{s.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Table Card */}
          <Card className="overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-slate-800/60">
              <div className="relative max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search name, NIM, event..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="block w-full rounded-lg bg-slate-900/80 border border-slate-700/60 pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800/60">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                      Name
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                      NIM
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                      Event
                    </th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                      Status
                    </th>
                    <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-4 py-3">
                      Check-in
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-12 text-center text-slate-500"
                      >
                        No participants found
                      </td>
                    </tr>
                  ) : (
                    filtered.map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div>
                            <p className="text-white font-medium">
                              {p.full_name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {p.email}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 font-mono text-xs">
                          {p.nim}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 max-w-[200px] truncate hidden sm:table-cell">
                          {p.event_title}
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <Badge variant={statusConfig[p.status]?.variant}>
                            {statusConfig[p.status]?.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {p.status === 'attended' ? (
                            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                              <CheckCircle className="h-3.5 w-3.5" />
                              Done
                            </span>
                          ) : p.status === 'cancelled' ? (
                            <span className="text-xs text-slate-600">—</span>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              loading={checkingId === p.id}
                              onClick={() => handleCheckIn(p.id)}
                              className="text-xs"
                            >
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

            <div className="px-4 py-3 border-t border-slate-800/60 text-xs text-slate-600">
              Showing {filtered.length} of {participants.length} participants
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
