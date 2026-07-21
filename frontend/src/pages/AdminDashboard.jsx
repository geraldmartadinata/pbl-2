import { useState, useEffect } from 'react'
import { registrationService } from '../services/authService'
import { useToast } from '../contexts/ToastContext'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { PageSpinner } from '../components/Spinner'
import { formatDateTime } from '../utils/format'

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [eventFilter, setEventFilter] = useState('all')
  const [checking, setChecking] = useState(null)
  const [confirmModal, setConfirmModal] = useState(null)
  const { addToast } = useToast()

  const loadData = () => {
    setLoading(true)
    registrationService
      .getAllRegistrations()
      .then((res) => setRegistrations(res.data))
      .catch((err) => addToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCheckIn = async (id) => {
    setChecking(id)
    try {
      await registrationService.checkIn(id)
      setRegistrations((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: 'attended' } : r
        )
      )
      addToast('Check-in berhasil!', 'success')
      setConfirmModal(null)
    } catch (err) {
      addToast(err.message || 'Check-in gagal', 'error')
    } finally {
      setChecking(null)
    }
  }

  const statuses = ['all', 'pending', 'confirmed', 'attended', 'cancelled']
  const eventNames = [
    'all',
    ...new Set(registrations.map((r) => r.event_title)),
  ]

  const filtered = registrations.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (eventFilter !== 'all' && r.event_title !== eventFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        r.event_title?.toLowerCase().includes(q) ||
        r.ticket_code?.toLowerCase().includes(q) ||
        String(r.id).includes(q)
      )
    }
    return true
  })

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Admin Dashboard
      </h1>
      <p className="text-sm text-muted mb-6">
        Kelola pendaftaran dan check-in peserta
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: 'Total',
            count: registrations.length,
            color: 'text-gray-900',
          },
          {
            label: 'Pending',
            count: registrations.filter((r) => r.status === 'pending').length,
            color: 'text-yellow-600',
          },
          {
            label: 'Confirmed',
            count: registrations.filter((r) => r.status === 'confirmed').length,
            color: 'text-green-600',
          },
          {
            label: 'Attended',
            count: registrations.filter((r) => r.status === 'attended').length,
            color: 'text-blue-600',
          },
        ].map((s) => (
          <Card key={s.label} className="p-4">
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari event, kode tiket..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-himti-500 focus:ring-himti-500 focus:outline-none focus:ring-1"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-himti-500 focus:ring-himti-500 focus:outline-none focus:ring-1"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === 'all' ? 'Semua Status' : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-himti-500 focus:ring-himti-500 focus:outline-none focus:ring-1"
          >
            <option value="all">Semua Acara</option>
            {eventNames
              .filter((n) => n !== 'all')
              .map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
          </select>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-muted uppercase tracking-wider">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Acara</th>
                <th className="px-4 py-3">Tanggal Daftar</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tiket</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted">
                    Tidak ada data
                  </td>
                </tr>
              ) : (
                filtered.map((reg, i) => (
                  <tr
                    key={reg.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-muted">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">User #{reg.user_id}</p>
                        <p className="text-xs text-muted">ID: {reg.id}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-[200px] truncate">
                      {reg.event_title}
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {formatDateTime(reg.registration_date)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={reg.status} />
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {reg.ticket_code || '-'}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {reg.status === 'confirmed' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          loading={checking === reg.id}
                          onClick={() => setConfirmModal(reg)}
                        >
                          Check-in
                        </Button>
                      ) : reg.status === 'attended' ? (
                        <span className="text-xs text-green-600 font-medium">
                          ✓ Hadir
                        </span>
                      ) : (
                        <span className="text-xs text-muted">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-muted">
          Menampilkan {filtered.length} dari {registrations.length} pendaftaran
        </div>
      </Card>

      {/* Confirm Modal */}
      <Modal
        open={!!confirmModal}
        onClose={() => setConfirmModal(null)}
        title="Konfirmasi Check-in"
        size="sm"
      >
        {confirmModal && (
          <div>
            <p className="text-sm text-gray-700 mb-4">
              Yakin check-in peserta{' '}
              <strong>User #{confirmModal.user_id}</strong> untuk acara{' '}
              <strong>{confirmModal.event_title}</strong>?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setConfirmModal(null)}
              >
                Batal
              </Button>
              <Button
                variant="primary"
                loading={checking === confirmModal.id}
                onClick={() => handleCheckIn(confirmModal.id)}
              >
                Ya, Check-in
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
