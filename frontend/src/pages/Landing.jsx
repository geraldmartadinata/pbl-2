import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../services/api'
import { formatDate, formatTime } from '../utils/format'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import { CalendarDays, MapPin, Clock, Users } from 'lucide-react'

const categoryIcons = {
  workshop: 'bg-blue-500/10 text-blue-400',
  seminar: 'bg-emerald-500/10 text-emerald-400',
  bootcamp: 'bg-amber-500/10 text-amber-400',
}

export default function Landing() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEvents()
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 pt-24 pb-16 text-center">
          <Badge variant="primary" className="mb-5">
            HIMTI BINUS University
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-4">
            Where Innovation
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Meets Registration
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover and register for HIMTI's workshops, seminars, and bootcamps.
            One portal for every event.
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="#events"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-colors text-sm"
            >
              Browse Events
            </a>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800/80 text-slate-200 font-medium rounded-lg border border-slate-700 hover:bg-slate-700/80 transition-colors text-sm"
            >
              Admin Panel
            </Link>
          </div>
        </section>

        {/* Events Grid */}
        <section id="events" className="max-w-7xl mx-auto px-4 pb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
              <p className="text-sm text-slate-500 mt-1">
                {loading ? 'Loading...' : `${events.length} events available`}
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event) => (
                <Link key={event.id} to={`/register/${event.id}`}>
                  <Card className="p-5 h-full flex flex-col hover:border-slate-700 transition-colors cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <Badge
                        variant={
                          event.category === 'workshop'
                            ? 'primary'
                            : event.category === 'seminar'
                              ? 'success'
                              : 'warning'
                        }
                      >
                        {event.category}
                      </Badge>
                      {event.price === 0 ? (
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Free
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-blue-400">
                          Rp {event.price.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
                      {event.description}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        {formatDate(event.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        {formatTime(event.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        {event.location}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/60">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Users className="h-3.5 w-3.5" />
                          <span>
                            {event.registered}/{event.capacity === 9999 ? '∞' : event.capacity}
                          </span>
                        </div>
                        <div className="flex-1 mx-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500/70 rounded-full transition-all"
                            style={{
                              width:
                                event.capacity === 9999
                                  ? 0
                                  : `${Math.min(100, (event.registered / event.capacity) * 100)}%`,
                            }}
                          />
                        </div>
                        {event.registered >= event.capacity &&
                        event.capacity !== 9999 ? (
                          <span className="text-red-400 font-medium">Full</span>
                        ) : (
                          <span className="text-blue-400 font-medium">Open</span>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
