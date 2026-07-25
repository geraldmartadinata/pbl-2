import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getEventById } from '../services/api'
import { formatDate, formatTime, daysLeft } from '../utils/format'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import { CalendarDays, MapPin, Clock, Users, ArrowLeft, Ticket } from 'lucide-react'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEventById(Number(id))
      .then(setEvent)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>
  if (!event) return null

  const dl = daysLeft(event.closing_date)
  const isFull = event.registered >= event.capacity && event.capacity !== 9999
  const pct = event.capacity === 9999 ? 0 : Math.round((event.registered / event.capacity) * 100)

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-white/[2%] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-zinc-700/[3%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </Link>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-4">
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
                    {dl === 0 ? 'Last day' : `${dl} day${dl > 1 ? 's' : ''} left`}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">{event.title}</h1>

              <p className="text-zinc-400 leading-relaxed mb-6">{event.description}</p>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-white/[6%]">
                  <CalendarDays className="h-5 w-5 text-zinc-500 shrink-0" />
                  <div>
                    <p className="text-zinc-300">{formatDate(event.date)}</p>
                    <p className="text-xs text-zinc-500">{formatTime(event.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-white/[6%]">
                  <MapPin className="h-5 w-5 text-zinc-500 shrink-0" />
                  <div>
                    <p className="text-zinc-300">{event.location}</p>
                    <p className="text-xs text-zinc-500">Location</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Registration</h3>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Capacity</span>
                  <span className="text-zinc-300">{event.capacity === 9999 ? 'Unlimited' : event.capacity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Registered</span>
                  <span className="text-zinc-300">{event.registered}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">{pct}% filled</span>
                  <Users className="h-4 w-4 text-zinc-500" />
                </div>
                {event.price > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">Price</span>
                    <span className="text-zinc-300">Rp {event.price.toLocaleString('id-ID')}</span>
                  </div>
                )}
              </div>

              <div className="h-2 bg-zinc-800 rounded-full overflow-hidden mb-5">
                <div
                  className="h-full bg-gradient-to-r from-zinc-400 to-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>

              {isFull ? (
                <p className="text-sm text-red-300 text-center py-2">This event is full</p>
              ) : (
                <Link to={`/register/${event.id}`}>
                  <Button className="w-full">
                    <Ticket className="h-4 w-4" /> Register Now
                  </Button>
                </Link>
              )}
            </Card>

            {/* Closing info */}
            <Card className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
                <Clock className="h-4 w-4" />
                Closing {formatDate(event.closing_date)}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
