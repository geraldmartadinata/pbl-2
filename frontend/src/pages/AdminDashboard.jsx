import { useState, useEffect } from 'react'
import { useLocation, NavLink } from 'react-router-dom'
import { getAdminStats, getAdminApplications, updateApplicationStatus } from '../services/api'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { PageSpinner } from '../components/Spinner'
import Sidebar from '../components/Sidebar'
import { useToast } from '../contexts/ToastContext'
import { cn } from '../utils/cn'
import { LayoutDashboard, Users, Search, Clock, CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react'

const statusBadge = {
  PENDING: { label: 'Pending', variant: 'warning' },
  ACCEPTED: { label: 'Accepted', variant: 'success' },
  REJECTED: { label: 'Rejected', variant: 'danger' },
}

const adminTabs = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/participants', label: 'Applications', icon: Users },
]

export default function AdminDashboard() {
  const { pathname } = useLocation()
  const toast = useToast()
  const [stats, setStats] = useState(null)
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionId, setActionId] = useState(null)
  const [pagination, setPagination] = useState(null)

  useEffect(() => {
    loadData()
  }, [page, statusFilter])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, appsData] = await Promise.all([
        getAdminStats(),
        getAdminApplications({ page, limit: 10, search: search || undefined, status: statusFilter || undefined }),
      ])
      setStats(statsData)
      setApplications(appsData.items)
      setPagination(appsData.pagination)
    } catch {} finally {
      setLoading(false)
    }
  }

  const handleAction = async (id, status) => {
    setActionId(id)
    try {
      await updateApplicationStatus(id, { status })
      toast.success(`Application ${status.toLowerCase()}`)
      loadData()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setActionId(null)
    }
  }

  useEffect(() => {
    setPage(1)
  }, [search])

  const tabLabel = pathname === '/admin' ? 'Dashboard' : 'Applications'

  if (loading && !stats) return <PageSpinner />

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
                <NavLink key={t.to} to={t.to} end={t.to === '/admin'}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-colors -mb-[1px]',
                    isActive ? 'text-white border-white' : 'text-zinc-500 border-transparent hover:text-zinc-300'
                  )}
                >
                  <t.icon className="h-4 w-4" /> {t.label}
                </NavLink>
              )
            })}
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">{tabLabel}</h1>
            <p className="text-sm text-zinc-500 mt-1">{tabLabel === 'Dashboard' ? 'Application overview' : 'Review applications'}</p>
          </div>

          {pathname === '/admin' ? (
            /* ── DASHBOARD VIEW ── */
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total', count: stats?.totalApplications || 0, icon: Users, color: 'text-zinc-300' },
                  { label: 'Pending', count: stats?.pendingApplications || 0, icon: Clock, color: 'text-amber-300' },
                  { label: 'Accepted', count: stats?.acceptedApplications || 0, icon: CheckCircle, color: 'text-emerald-300' },
                  { label: 'Rejected', count: stats?.rejectedApplications || 0, icon: XCircle, color: 'text-red-300' },
                ].map((s) => (
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

              <h2 className="text-sm font-semibold text-white mb-4">Recent Pending Applications</h2>
              <Card className="overflow-hidden">
                <ApplicantsTable
                  applications={applications.filter((a) => a.status === 'PENDING').slice(0, 5)}
                  actionId={actionId}
                  onAction={handleAction}
                  compact
                />
              </Card>
            </>
          ) : (
            /* ── APPLICATIONS VIEW ── */
            <>
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                  <input type="text" placeholder="Search name, NIM, email..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full rounded-xl bg-zinc-900/80 border border-zinc-700/50 pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10"
                  />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl bg-zinc-900/80 border border-zinc-700/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10"
                >
                  <option value="">All status</option>
                  <option value="PENDING">Pending</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <Card className="overflow-hidden">
                <ApplicantsTable applications={applications} actionId={actionId} onAction={handleAction} />
                {pagination && pagination.totalPages > 1 && (
                  <div className="px-4 py-3 border-t border-white/[6%] flex items-center justify-between text-xs text-zinc-600">
                    <span>Page {pagination.page} of {pagination.totalPages}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={pagination.page <= 1}
                        className="p-1.5 rounded-lg hover:bg-white/[6%] disabled:opacity-30 transition-colors">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button onClick={() => setPage((p) => p + 1)} disabled={pagination.page >= pagination.totalPages}
                        className="p-1.5 rounded-lg hover:bg-white/[6%] disabled:opacity-30 transition-colors">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ApplicantsTable({ applications, actionId, onAction, compact }) {
  if (applications.length === 0) {
    return <div className="p-8 text-center text-zinc-500">No applications found</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[6%]">
            <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Name</th>
            <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">NIM</th>
            {!compact && <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Division</th>}
            {!compact && <th className="text-left text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Status</th>}
            <th className="text-center text-xs font-medium text-zinc-500 uppercase tracking-wider px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[4%]">
          {applications.map((a) => (
            <tr key={a.application_id} className="hover:bg-white/[2%] transition-colors">
              <td className="px-4 py-3.5">
                <p className="text-white font-medium">{a.full_name}</p>
                <p className="text-xs text-zinc-500">{a.email}</p>
              </td>
              <td className="px-4 py-3.5 text-zinc-400 font-mono text-xs">{a.nim}</td>
              {!compact && <td className="px-4 py-3.5 text-zinc-400 hidden sm:table-cell">{a.division_name}</td>}
              {!compact && (
                <td className="px-4 py-3.5 hidden md:table-cell">
                  <Badge variant={statusBadge[a.status]?.variant}>{statusBadge[a.status]?.label}</Badge>
                </td>
              )}
              <td className="px-4 py-3.5 text-center">
                {a.status === 'PENDING' ? (
                  <div className="flex items-center justify-center gap-2">
                    <Button size="sm" variant="secondary" loading={actionId === a.application_id} onClick={() => onAction(a.application_id, 'ACCEPTED')}>Approve</Button>
                    <Button size="sm" variant="danger" loading={actionId === a.application_id} onClick={() => onAction(a.application_id, 'REJECTED')}>Reject</Button>
                  </div>
                ) : (
                  <span className={`text-xs font-medium ${a.status === 'ACCEPTED' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {a.status === 'ACCEPTED' ? 'Approved' : 'Rejected'}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}