import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { eventService } from '../services/eventService'
import { registrationService } from '../services/authService'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import { PageSpinner } from '../components/Spinner'
import { formatDate, formatDateTime } from '../utils/format'
import { validateForm } from '../utils/validation'

const validationRules = {
  full_name: { required: true },
  email: { required: true, email: true },
  nim: { required: true, nim: true },
  phone: { required: true, phone: true },
  major: { required: true },
  semester: { required: true },
}

const initialForm = {
  full_name: '',
  email: '',
  nim: '',
  phone: '',
  major: 'Teknik Informatika',
  semester: '',
}

export default function RegistrationForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToast } = useToast()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    eventService
      .getById(parseInt(id))
      .then((res) => {
        setEvent(res.data)
        if (user) {
          setForm((prev) => ({
            ...prev,
            full_name: user.name || '',
            email: user.email || '',
            nim: user.nim || '',
          }))
        }
      })
      .catch(() => {
        addToast('Acara tidak ditemukan', 'error')
        navigate('/')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name])
      setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validateForm(validationRules, form)
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    try {
      await registrationService.register(parseInt(id), {
        ...form,
        event_title: event.title,
        event_date: event.date,
        price: event.price,
      })
      setDone(true)
      addToast('Pendaftaran berhasil!', 'success')
    } catch (err) {
      addToast(err.message || 'Gagal mendaftar', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSpinner />

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Pendaftaran Berhasil!</h2>
          <p className="text-sm text-muted mb-6">
            Kamu telah terdaftar di acara <strong>{event.title}</strong>. Cek dashboard untuk status pendaftaran.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="secondary" onClick={() => navigate('/')}>
              Kembali
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const isFull = event.registered >= event.capacity && event.capacity !== 9999

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Event Summary */}
      <Card className="p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
        <div className="mt-3 text-sm text-muted space-y-1">
          <p>📅 {formatDateTime(event.date)}</p>
          <p>📍 {event.location}</p>
          <p>
            💰{' '}
            {event.price === 0
              ? 'Gratis'
              : `Rp ${event.price.toLocaleString('id-ID')}`}
          </p>
        </div>
      </Card>

      {isFull ? (
        <Card className="p-6 text-center">
          <p className="text-coral-500 font-medium">Maaf, acara ini sudah penuh.</p>
        </Card>
      ) : (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Form Pendaftaran
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                name="full_name"
                placeholder="Nama sesuai KTM"
                value={form.full_name}
                onChange={handleChange}
                error={errors.full_name}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="nama@binus.ac.id"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

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
                label="No. HP"
                name="phone"
                placeholder="081234567890"
                value={form.phone}
                onChange={handleChange}
                error={errors.phone}
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Jurusan
                </label>
                <select
                  name="major"
                  value={form.major}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-himti-500 focus:ring-himti-500 focus:outline-none focus:ring-1"
                >
                  <option>Teknik Informatika</option>
                  <option>Sistem Informasi</option>
                  <option>Ilmu Komputer</option>
                  <option>Teknik Komputer</option>
                  <option>Lainnya</option>
                </select>
                {errors.major && (
                  <p className="text-xs text-coral-500">{errors.major}</p>
                )}
              </div>
              <Input
                label="Semester"
                name="semester"
                placeholder="Contoh: 5"
                value={form.semester}
                onChange={handleChange}
                error={errors.semester}
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <Button
                type="submit"
                className="w-full sm:w-auto"
                loading={submitting}
              >
                Daftar Sekarang
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  )
}
