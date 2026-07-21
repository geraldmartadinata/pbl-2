import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { eventService } from '../services/eventService'
import { formatDate, formatTime } from '../utils/format'
import { PageSpinner } from '../components/Spinner'
import Badge from '../components/Badge'
import Card from '../components/Card'
import { useAuth } from '../contexts/AuthContext'

export default function Landing() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { isAuth, user } = useAuth()

  useEffect(() => {
    eventService
      .getAll()
      .then((res) => {
        setEvents(res.data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const categories = ['all', 'seminar', 'workshop', 'bootcamp']

  const filtered =
    filter === 'all'
      ? events
      : events.filter((e) => e.category === filter)

  const upcoming = filtered.filter((e) => e.status === 'active' || e.status === 'upcoming')
  const ended = filtered.filter((e) => e.status === 'ended')

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Portal Registrasi Acara HIMTI
        </h1>
        <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto">
          Daftar dan ikuti acara-acara terbaik dari HIMTI BINUS University.
          Seminar, workshop, bootcamp — semuanya di satu tempat.
        </p>
        {!isAuth && (
          <Link
            to="/login"
            className="inline-block mt-6 text-sm font-medium text-white bg-himti-600 hover:bg-himti-700 px-6 py-3 rounded-lg transition-colors"
          >
            Mulai Daftar
          </Link>
        )}
      </section>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 text-sm rounded-full transition-colors ${
              filter === cat
                ? 'bg-himti-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat === 'all' ? 'Semua' : cat.charAt(0).toUpperCase() + cat.slice(1) + 's'}
          </button>
        ))}
      </div>

      {/* Event Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted">
          <p>Tidak ada acara untuk kategori ini.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.map((event) => (
            <Card key={event.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <Badge status={event.category} />
                  {event.price === 0 ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Gratis
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-himti-600">
                      Rp {event.price.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>

                <p className="text-sm text-muted line-clamp-2 mb-4 flex-1">
                  {event.description}
                </p>

                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {formatTime(event.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-muted">
                      {event.registered} / {event.capacity === 9999 ? '∞' : event.capacity} terdaftar
                    </span>
                    <div className="flex-1 mx-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-himti-500 rounded-full"
                        style={{
                          width: `${
                            event.capacity === 9999
                              ? 0
                              : Math.min(
                                  100,
                                  (event.registered / event.capacity) * 100
                                )
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <Link
                    to={isAuth ? `/register/${event.id}` : '/login'}
                    className="block w-full text-center text-sm font-medium text-white bg-himti-600 hover:bg-himti-700 py-2.5 rounded-lg transition-colors"
                  >
                    {event.registered >= event.capacity && event.capacity !== 9999
                      ? 'Penuh'
                      : 'Daftar Sekarang'}
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Ended Events */}
      {ended.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acara Sebelumnya</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ended.map((event) => (
              <Card key={event.id} className="opacity-60 p-6">
                <Badge status="ended" />
                <h3 className="text-lg font-semibold text-gray-900 mt-3 mb-2">{event.title}</h3>
                <p className="text-sm text-muted">{formatDate(event.date)}</p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
