import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDivisions, submitApplication, getMyApplication } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import Spinner from '../components/Spinner'
import BackButton from '../components/BackButton'
import { Send, Building2 } from 'lucide-react'

export default function Apply() {
  const navigate = useNavigate()
  const toast = useToast()
  const [divisions, setDivisions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [existing, setExisting] = useState(null)
  const [form, setForm] = useState({
    divisionId: '', motivation: '', reasonForJoining: '', relevantSkills: '',
    organizationalExperience: '', portfolioUrl: '', linkedinUrl: '', githubUrl: '',
    additionalNotes: '', timeCommitmentAgreed: false,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    Promise.all([getDivisions(), getMyApplication().catch(() => null)])
      .then(([divs, app]) => {
        setDivisions(divs)
        if (app) setExisting(app)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.divisionId) e.divisionId = 'Select a division'
    if (form.motivation.length < 20) e.motivation = 'At least 20 characters'
    if (form.reasonForJoining.length < 20) e.reasonForJoining = 'At least 20 characters'
    if (!form.relevantSkills.trim()) e.relevantSkills = 'Required'
    if (!form.timeCommitmentAgreed) e.timeCommitmentAgreed = 'You must agree'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const v = validate()
    setErrors(v)
    if (Object.keys(v).length) return
    setSubmitting(true)
    try {
      await submitApplication({
        ...form,
        organizationalExperience: form.organizationalExperience || null,
        portfolioUrl: form.portfolioUrl || null,
        linkedinUrl: form.linkedinUrl || null,
        githubUrl: form.githubUrl || null,
        additionalNotes: form.additionalNotes || null,
      })
      toast.success('Application submitted!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>

  if (existing && existing.status === 'PENDING') {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="relative z-10 max-w-md mx-auto px-4 text-center">
          <Card className="p-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-7 w-7 text-amber-300" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Application Already Submitted</h2>
            <p className="text-sm text-zinc-400 mb-6">
              You already have a pending application for <strong className="text-zinc-200">{existing.division_name}</strong>.
              Wait for admin review.
            </p>
            <Button onClick={() => navigate('/dashboard')}>View Status</Button>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-white/[2%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <BackButton to="/dashboard" label="Back to Dashboard" />

        <h1 className="text-2xl font-bold text-white mb-6">Apply to Join HIMTI</h1>

        <Card className="p-7">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1.5">Division</label>
              <select
                name="divisionId"
                value={form.divisionId}
                onChange={handleChange}
                className="block w-full rounded-xl border border-zinc-700/60 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10 focus:border-white/20"
              >
                <option value="">Select a division</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} — {d.description}</option>
                ))}
              </select>
              {errors.divisionId && <p className="text-xs text-red-400 mt-1">{errors.divisionId}</p>}
            </div>

            <Input label="Motivation" name="motivation" placeholder="Why do you want to join this division? (min 20 chars)" value={form.motivation} onChange={handleChange} error={errors.motivation} />
            <Input label="Reason for Joining HIMTI" name="reasonForJoining" placeholder="Why HIMTI? (min 20 chars)" value={form.reasonForJoining} onChange={handleChange} error={errors.reasonForJoining} />
            <Input label="Relevant Skills" name="relevantSkills" placeholder="What skills can you contribute?" value={form.relevantSkills} onChange={handleChange} error={errors.relevantSkills} />
            <Input label="Organizational Experience (optional)" name="organizationalExperience" placeholder="Any previous org experience" value={form.organizationalExperience} onChange={handleChange} />

            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Portfolio URL (optional)" name="portfolioUrl" placeholder="https://" value={form.portfolioUrl} onChange={handleChange} />
              <Input label="LinkedIn URL (optional)" name="linkedinUrl" placeholder="https://" value={form.linkedinUrl} onChange={handleChange} />
              <Input label="GitHub URL (optional)" name="githubUrl" placeholder="https://" value={form.githubUrl} onChange={handleChange} />
            </div>

            <Input label="Additional Notes (optional)" name="additionalNotes" placeholder="Anything else?" value={form.additionalNotes} onChange={handleChange} />

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="timeCommitmentAgreed"
                checked={form.timeCommitmentAgreed}
                onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 accent-white"
              />
              <div>
                <span className="text-sm text-zinc-300">I confirm I can commit time to HIMTI activities</span>
                {errors.timeCommitmentAgreed && <p className="text-xs text-red-400">{errors.timeCommitmentAgreed}</p>}
              </div>
            </label>

            <div className="pt-4 border-t border-white/[6%]">
              <Button type="submit" className="w-full" loading={submitting}>
                <Send className="h-4 w-4" /> Submit Application
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}