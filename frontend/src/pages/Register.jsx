import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerAccount } from '../services/api'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { useToast } from '../contexts/ToastContext'
import { UserPlus, ArrowLeft } from 'lucide-react'

const CAMPUSES = ['BINUS Kemanggisan', 'BINUS Alam Sutra', 'BINUS Bekasi', 'BINUS Bandung', 'BINUS Semarang', 'BINUS Malang']

export default function Register() {
  const navigate = useNavigate()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    fullName: '', nim: '', email: '', phone: '', studyProgram: '',
    intakeYear: '', campus: '', lineId: '', password: '', confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.nim.trim()) e.nim = 'NIM is required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!/^\d{10,15}$/.test(form.phone)) e.phone = 'Phone must be 10-15 digits'
    if (!form.studyProgram.trim()) e.studyProgram = 'Study program is required'
    if (!form.intakeYear || isNaN(form.intakeYear)) e.intakeYear = 'Valid intake year required'
    if (!form.campus.trim()) e.campus = 'Campus is required'
    if (!form.lineId.trim()) e.lineId = 'Line ID is required'
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    setLoading(true)
    try {
      await registerAccount({
        ...form,
        intakeYear: Number(form.intakeYear),
        instagramUsername: null,
      })
      toast.success('Account registered! Please sign in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-white/[2%] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-xl px-4">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to sign in
        </Link>

        <Card className="p-7 animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-3">
              <UserPlus className="h-5 w-5 text-zinc-300" />
            </div>
            <h1 className="text-xl font-bold text-white">Create Account</h1>
            <p className="text-sm text-zinc-400 mt-1">Join HIMTI as a member</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" name="fullName" placeholder="Your full name" value={form.fullName} onChange={handleChange} error={errors.fullName} />
              <Input label="NIM" name="nim" placeholder="2901234567" value={form.nim} onChange={handleChange} error={errors.nim} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Email" name="email" type="email" placeholder="you@binus.ac.id" value={form.email} onChange={handleChange} error={errors.email} />
              <Input label="Phone" name="phone" type="tel" placeholder="08123456789" value={form.phone} onChange={handleChange} error={errors.phone} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Study Program" name="studyProgram" placeholder="Computer Science" value={form.studyProgram} onChange={handleChange} error={errors.studyProgram} />
              <Input label="Intake Year" name="intakeYear" type="number" placeholder="2026" value={form.intakeYear} onChange={handleChange} error={errors.intakeYear} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Campus</label>
                <select name="campus" value={form.campus} onChange={handleChange}
                  className="block w-full rounded-xl border border-zinc-700/60 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10">
                  <option value="">Select campus</option>
                  {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.campus && <p className="text-xs text-red-400 mt-1">{errors.campus}</p>}
              </div>
              <Input label="Line ID" name="lineId" placeholder="your_line_id" value={form.lineId} onChange={handleChange} error={errors.lineId} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Password" name="password" type="password" placeholder="Min 8 characters" value={form.password} onChange={handleChange} error={errors.password} />
              <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
            </div>

            <div className="pt-4 border-t border-white/[6%]">
              <Button type="submit" className="w-full" loading={loading}>
                <UserPlus className="h-4 w-4" /> Create Account
              </Button>
            </div>

            <p className="text-xs text-zinc-500 text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-zinc-300 hover:text-white transition-colors">Sign in</Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}