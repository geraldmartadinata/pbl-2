import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../services/api'
import { formatDate, daysLeft } from '../utils/format'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react'

const categoryStyles = {
  workshop: 'border-l-sky-500',
  seminar: 'border-l-emerald-500',
  bootcamp: 'border-l-amber-500',
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const sorted = [...events].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  )

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-white/[2%] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] left-[20%] w-[400px] h-[400px] bg-white/[1.5%] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <BackButton to="/" label="Back to Dashboard" />

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-zinc-400" />
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Explore
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white">All Events</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Discover workshops, seminars, and bootcamps
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Spinner />
          </div>
        ) : sorted.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-zinc-500">No events available right now.</p>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((event) => {
              const dl = daysLeft(event.closing_date)
              const isOpen = event.registered < event.capacity || event.capacity === 9999
              return (
                <Link key={event.id} to={`/events/${event.id}`}>
                  <Card
                    className={`p-6 h-full flex flex-col hover:border-white/[15%] transition-all duration-300 group cursor-pointer border-l-2 ${categoryStyles[event.category] || 'border-l-white/10'}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Badge
                        variant={
                          event.category === 'workshop'
                            ? 'info'
                            : event.category === 'seminar'
                              ? 'success'
                              : 'warning'
                        }
                      >
                        {event.category}
                      </Badge>
                      {dl !== null && dl <= 3 && (
                        <span className="text-xs font-medium text-red-300 bg-red-500/15 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {dl === 0
                            ? 'Last day'
                            : `${dl} day${dl > 1 ? 's' : ''} left`}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-zinc-200 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-xs text-zinc-500 line-clamp-2 mb-4 flex-1">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-zinc-500 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                        {event.location}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[6%]">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Users className="h-3.5 w-3.5" />
                          <span>
                            {event.registered}/{event.capacity === 9999 ? '∞' : event.capacity}
                          </span>
                        </div>
                        <span className={isOpen ? 'text-zinc-500' : 'text-red-400'}>
                          {isOpen
                            ? `${Math.round((event.registered / event.capacity) * 100)}% filled`
                            : 'Full'}
                        </span>
                      </div>
                      {event.capacity !== 9999 && (
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-zinc-400 to-white rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (event.registered / event.capacity) * 100)}%`,
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {event.price > 0 && (
                      <div className="mt-3">
                        <span className="text-xs text-zinc-400">
                          Rp {event.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
