import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import { validateEmail, validateRequired } from '../utils/validation'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name])
      setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const errs = {}
    if (!validateRequired(form.email)) errs.email = 'Email wajib diisi'
    else if (!validateEmail(form.email)) errs.email = 'Format email tidak valid'
    if (!validateRequired(form.password)) errs.password = 'Password wajib diisi'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return

    setLoading(true)
    try {
      const res = await login(form.email, form.password)
      addToast(`Selamat datang, ${res.data.user.name}!`, 'success')
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      addToast(err.message || 'Login gagal', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-himti-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
            H
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Masuk</h1>
          <p className="text-sm text-muted mt-1">
            Masuk ke portal registrasi HIMTI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="nama@binus.ac.id"
            value={form.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
          />

          <Button
            type="submit"
            className="w-full"
            loading={loading}
          >
            Masuk
          </Button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Belum punya akun?{' '}
          <span className="text-himti-600 font-medium">
            Hubungi admin HIMTI
          </span>
        </p>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-muted text-center mb-3">Akun Demo</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                setForm({ email: 'admin@himti.id', password: 'admin123' })
                setErrors({})
              }}
              className="p-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 text-left"
            >
              <span className="font-medium">Admin</span>
              <br />
              admin@himti.id
            </button>
            <button
              onClick={() => {
                setForm({
                  email: 'mahasiswa@binus.ac.id',
                  password: 'user123',
                })
                setErrors({})
              }}
              className="p-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 text-left"
            >
              <span className="font-medium">User</span>
              <br />
              mahasiswa@binus.ac.id
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
