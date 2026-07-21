import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { registrationService } from '../services/authService'
import { useToast } from '../contexts/ToastContext'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { PageSpinner } from '../components/Spinner'
import { formatDateTime } from '../utils/format'

export default function UserDashboard() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  useEffect(() => {
    registrationService
      .getMyRegistrations()
      .then((res) => setRegistrations(res.data))
      .catch((err) => addToast(err.message, 'error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Saya</h1>
          <p className="text-sm text-muted mt-1">
            Riwayat pendaftaran acara kamu
          </p>
        </div>
        <Link
          to="/"
          className="text-sm font-medium text-himti-600 hover:text-himti-700"
        >
          Cari Acara →
        </Link>
      </div>

      {registrations.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted mb-4">Belum ada pendaftaran acara.</p>
          <Link
            to="/"
            className="inline-block text-sm font-medium text-white bg-himti-600 hover:bg-himti-700 px-5 py-2.5 rounded-lg"
          >
            Jelajahi Acara
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <Card key={reg.id} className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">
                      {reg.event_title}
                    </h3>
                    <Badge status={reg.status} />
                  </div>
                  <p className="text-sm text-muted">
                    {formatDateTime(reg.event_date)}
                  </p>
                  {reg.ticket_code && (
                    <p className="text-xs text-himti-600 font-mono mt-1">
                      Tiket: {reg.ticket_code}
                    </p>
                  )}
                </div>
                <div className="text-right text-sm shrink-0">
                  <p className="text-muted">
                    Daftar {formatDateTime(reg.registration_date)}
                  </p>
                  <Badge status={reg.payment_status} className="mt-1" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      {registrations.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            {
              label: 'Pending',
              count: registrations.filter((r) => r.status === 'pending')
                .length,
              color: 'bg-yellow-50 text-yellow-700',
            },
            {
              label: 'Confirmed',
              count: registrations.filter((r) => r.status === 'confirmed')
                .length,
              color: 'bg-green-50 text-green-700',
            },
            {
              label: 'Attended',
              count: registrations.filter((r) => r.status === 'attended')
                .length,
              color: 'bg-blue-50 text-blue-700',
            },
          ].map((stat) => (
            <Card key={stat.label} className={`p-4 text-center ${stat.color}`}>
              <p className="text-2xl font-bold">{stat.count}</p>
              <p className="text-sm">{stat.label}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
