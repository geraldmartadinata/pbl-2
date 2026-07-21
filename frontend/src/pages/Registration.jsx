import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getEventById, registerParticipant } from '../services/api'
import { formatDate, formatTime } from '../utils/format'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import { CalendarDays, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react'

const initialForm = {
  full_name: '',
  nim: '',
  email: '',
  line_id: '',
}

export default function Registration() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    getEventById(Number(id))
      .then(setEvent)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name])
      setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.full_name.trim()) e.full_name = 'Full name is required'
    if (!/^\d{10}$/.test(form.nim)) e.nim = 'NIM must be 10 digits'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Invalid email format'
    if (!form.line_id.trim()) e.line_id = 'Line ID is required'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return

    setSubmitting(true)
    try {
      await registerParticipant({
        ...form,
        event_id: event.id,
        event_title: event.title,
      })
      setSuccess(true)
    } catch {
      // noop
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  const isFull = event.registered >= event.capacity && event.capacity !== 9999

  return (
    <div className="min-h-screen relative">
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to events
        </button>

        {/* Success state */}
        {success ? (
          <Card className="p-10 text-center animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Registration Successful!
            </h2>
            <p className="text-slate-400 text-sm mb-6">
              You're registered for <strong className="text-white">{event.title}</strong>.
              Check your email for further instructions.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="secondary" onClick={() => navigate('/')}>
                Back to Events
              </Button>
              <Button onClick={() => navigate('/admin')}>
                Admin Dashboard
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Event Summary */}
            <Card className="p-5 mb-6">
              <h1 className="text-xl font-bold text-white mb-3">
                {event.title}
              </h1>
              <div className="grid sm:grid-cols-2 gap-2 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-slate-500 shrink-0" />
                  {formatDate(event.date)} • {formatTime(event.date)}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                  {event.location}
                </div>
              </div>
              {event.price > 0 && (
                <p className="text-sm text-blue-400 mt-2">
                  Registration fee: Rp {event.price.toLocaleString('id-ID')}
                </p>
              )}
            </Card>

            {isFull ? (
              <Card className="p-8 text-center">
                <p className="text-red-400 font-medium">
                  This event is full. Please check other available events.
                </p>
              </Card>
            ) : (
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-white mb-6">
                  Registration Form
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Full Name"
                    name="full_name"
                    placeholder="Your full name"
                    value={form.full_name}
                    onChange={handleChange}
                    error={errors.full_name}
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="NIM"
                      name="nim"
                      placeholder="2502000001"
                      value={form.nim}
                      onChange={handleChange}
                      error={errors.nim}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="you@binus.ac.id"
                      value={form.email}
                      onChange={handleChange}
                      error={errors.email}
                    />
                  </div>
                  <Input
                    label="Line ID"
                    name="line_id"
                    placeholder="Your Line ID"
                    value={form.line_id}
                    onChange={handleChange}
                    error={errors.line_id}
                  />

                  <div className="pt-4 border-t border-slate-800/60">
                    <Button
                      type="submit"
                      className="w-full sm:w-auto"
                      loading={submitting}
                    >
                      Register Now
                    </Button>
                  </div>
                </form>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  )
}
