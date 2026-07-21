import { useState, useEffect } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { getEvents } from '../services/api'
import { formatDate, daysLeft } from '../utils/format'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Spinner from '../components/Spinner'
import {
  CalendarDays,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  ArrowUpRight,
  Quote,
  Sparkles,
  GraduationCap,
  Globe,
  Link as LinkIcon,
  Mail,
} from 'lucide-react'

const categoryStyles = {
  workshop: 'border-l-sky-500',
  seminar: 'border-l-emerald-500',
  bootcamp: 'border-l-amber-500',
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

  const now = new Date()
  const urgentEvents = events
    .filter((e) => {
      if (e.capacity === 9999) return false
      if (e.registered >= e.capacity) return false
      const close = new Date(e.closing_date)
      return close > now
    })
    .sort(
      (a, b) => new Date(a.closing_date) - new Date(b.closing_date)
    )
    .slice(0, 3)

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-white/[2%] rounded-full blur-[120px]" />
        <div className="absolute top-[30%] right-[-300px] w-[500px] h-[500px] bg-zinc-700/[3%] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-100px] left-[20%] w-[400px] h-[400px] bg-white/[1.5%] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10">
        {/* ===== HERO ===== */}
        <section className="max-w-5xl mx-auto px-4 pt-28 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[6%] border border-white/[8%] text-xs text-zinc-400 mb-8 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5 text-zinc-300" />
            HIMTI BINUS University — Since 2005
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6 animate-fade-in-up">
            Where Technology
            <br />
            <span className="bg-gradient-to-r from-zinc-100 via-zinc-300 to-zinc-400 bg-clip-text text-transparent">
              Meets Opportunity
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up stagger-1">
            The official event registration portal for HIMTI. Discover
            workshops, seminars, and bootcamps — all in one place.
          </p>

          <div className="flex items-center justify-center gap-4 animate-fade-in-up stagger-2">
            <a
              href="#closing-soon"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 font-medium rounded-xl shadow-lg shadow-white/10 hover:shadow-white/20 hover:bg-zinc-100 transition-all duration-300 text-sm"
            >
              Explore Events
              <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800/60 text-zinc-100 font-medium rounded-xl border border-white/10 hover:bg-zinc-700/60 hover:border-white/20 transition-all duration-300 text-sm"
            >
              Learn More
            </a>
          </div>
        </section>

        {/* ===== ABOUT / BENTO GRID ===== */}
        <section id="about" className="max-w-6xl mx-auto px-4 pb-24">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Box 1 — What is HIMTI (tall) */}
            <Card className="md:col-span-1 md:row-span-2 p-8 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <GraduationCap className="h-5 w-5 text-zinc-200" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  What is HIMTI?
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  HIMTI (Himpunan Mahasiswa Teknik Informatika) is the official
                  student body for Informatics Engineering at BINUS University.
                  We organize workshops, seminars, and bootcamps to bridge
                  academic knowledge with industry practice.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-white/[6%]">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Founded</span>
                  <span className="text-white font-medium">2005</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-zinc-500">Members</span>
                  <span className="text-white font-medium">5,000+</span>
                </div>
              </div>
            </Card>

            {/* Box 2 — Quote */}
            <Card className="md:col-span-2 p-8 flex items-start gap-4">
              <Quote className="h-8 w-8 text-zinc-600 shrink-0 mt-1" />
              <div>
                <p className="text-lg text-zinc-200 leading-relaxed italic">
                  "Technology is best when it brings people together. HIMTI is
                  where future innovators connect, learn, and grow."
                </p>
                <p className="text-sm text-zinc-500 mt-4">
                  — HIMTI BINUS University
                </p>
              </div>
            </Card>

            {/* Box 3 — Stats */}
            <Card className="md:col-span-1 p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">10+</p>
                  <p className="text-xs text-zinc-500 mt-1">Events / Year</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">5K+</p>
                  <p className="text-xs text-zinc-500 mt-1">Members</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">15+</p>
                  <p className="text-xs text-zinc-500 mt-1">Years Active</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-white">∞</p>
                  <p className="text-xs text-zinc-500 mt-1">Opportunities</p>
                </div>
              </div>
            </Card>

            {/* Box 4 — Vision */}
            <Card className="md:col-span-1 p-8">
              <Globe className="h-5 w-5 text-zinc-300 mb-3" />
              <h3 className="text-sm font-semibold text-white mb-2">
                Our Vision
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Empowering students with technology skills that matter in the
                real world. Building a community of lifelong learners.
              </p>
            </Card>
          </div>
        </section>

        {/* ===== CLOSING SOON / URGENT ===== */}
        <section id="closing-soon" className="max-w-7xl mx-auto px-4 pb-24">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-300 uppercase tracking-wider">
                  Don't Miss Out
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white">Closing Soon</h2>
              <p className="text-sm text-zinc-500 mt-1">
                Register before registration closes
              </p>
            </div>
            <RouterLink
              to="/"
              className="hidden sm:flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              View all <ChevronRight className="h-4 w-4" />
            </RouterLink>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : urgentEvents.length === 0 ? (
            <Card className="p-10 text-center">
              <p className="text-zinc-500">No urgent events right now.</p>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {urgentEvents.map((event, i) => {
                const dl = daysLeft(event.closing_date)
                return (
                  <RouterLink key={event.id} to={`/register/${event.id}`}>
                    <Card
                      className={`p-6 h-full flex flex-col hover:border-white/[15%] transition-all duration-300 group cursor-pointer border-l-2 ${categoryStyles[event.category] || 'border-l-white/10'}`}
                    >
                      {/* Closing badge */}
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
                        {dl !== null && dl <= 3 ? (
                          <span className="text-xs font-medium text-red-300 bg-red-500/15 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {dl === 0
                              ? 'Last day'
                              : `${dl} day${dl > 1 ? 's' : ''} left`}
                          </span>
                        ) : dl !== null ? (
                          <span className="text-xs text-zinc-500">
                            {dl} days left
                          </span>
                        ) : null}
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
                              {event.registered}/{event.capacity}
                            </span>
                          </div>
                          <span className="text-zinc-500">
                            {Math.round(
                              (event.registered / event.capacity) * 100
                            )}
                            % filled
                          </span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-zinc-400 to-white rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(
                                100,
                                (event.registered / event.capacity) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      {event.price > 0 && (
                        <div className="mt-3">
                          <span className="text-xs text-zinc-400">
                            Rp {event.price.toLocaleString('id-ID')}
                          </span>
                        </div>
                      )}
                    </Card>
                  </RouterLink>
                )
              })}
            </div>
          )}
        </section>

        {/* ===== FOOTER ===== */}
        <footer className="border-t border-white/[6%] bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 py-14">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
                    <span className="text-zinc-900 font-bold text-sm">H</span>
                  </div>
                  <span className="font-semibold text-white text-lg">
                    HIMTI
                  </span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Himpunan Mahasiswa Teknik Informatika
                  <br />
                  BINUS University
                </p>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">
                  Contact
                </h4>
                <div className="space-y-2.5 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                    himti@binus.ac.id
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                    BINUS Anggrek, Jakarta
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">
                  Quick Links
                </h4>
                <div className="space-y-2 text-xs">
                  <RouterLink
                    to="/"
                    className="block text-zinc-500 hover:text-white transition-colors"
                  >
                    Events
                  </RouterLink>
                  <RouterLink
                    to="/login"
                    className="block text-zinc-500 hover:text-white transition-colors"
                  >
                    Login
                  </RouterLink>
                  <RouterLink
                    to="/admin"
                    className="block text-zinc-500 hover:text-white transition-colors"
                  >
                    Admin
                  </RouterLink>
                </div>
              </div>

              {/* Social */}
              <div>
                <h4 className="text-sm font-semibold text-white mb-4">
                  Follow Us
                </h4>
                <div className="flex items-center gap-3">
                  <a
                    href="#"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/[6%] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/[6%] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/[6%] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-white/[6%] text-center text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} HIMTI BINUS University. All
              rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
