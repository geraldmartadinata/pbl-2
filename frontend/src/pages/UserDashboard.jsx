import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllParticipants, getEvents } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { formatDate } from '../utils/format'
import Card from '../components/Card'
import Badge from '../components/Badge'
import { PageSpinner } from '../components/Spinner'
import BackButton from '../components/BackButton'
import { CalendarDays, Ticket, ArrowRight } from 'lucide-react'

const statusLabel = {
  confirmed: { label: 'Confirmed', variant: 'success' },
  attended: { label: 'Attended', variant: 'primary' },
  pending: { label: 'Pending', variant: 'warning' },
  cancelled: { label: 'Cancelled', variant: 'danger' },
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [registrations, setRegistrations] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAllParticipants(), getEvents()])
      .then(([participants, evts]) => {
        setRegistrations(
          participants.filter((p) => p.email === user?.email)
        )
        setEvents(evts)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <PageSpinner />

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-white/[2%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <BackButton to="/" label="Back to Dashboard" />
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Registrations</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Track your event registrations and check-in status
          </p>
        </div>

        {registrations.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[6%] flex items-center justify-center mx-auto mb-4">
              <Ticket className="h-6 w-6 text-zinc-500" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">No registrations yet</h2>
            <p className="text-sm text-zinc-500 mb-6">
              You haven&apos;t registered for any events.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-900 font-medium rounded-xl hover:bg-zinc-100 transition-all text-sm"
            >
              Browse Events <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {registrations.map((reg) => {
              const evt = events.find((e) => e.id === reg.event_id)
              return (
                <Card key={reg.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-white truncate">
                      {reg.event_title}
                    </h3>
                    {evt && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                        {formatDate(evt.date)}
                      </div>
                    )}
                    <p className="text-xs text-zinc-600 mt-1">
                      Registered {formatDate(reg.registered_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={statusLabel[reg.status]?.variant}>
                      {statusLabel[reg.status]?.label}
                    </Badge>
                    <Link
                      to={`/register/${reg.event_id}`}
                      className="text-xs text-zinc-400 hover:text-white transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
