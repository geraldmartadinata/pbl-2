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
    divisionId1: '', divisionId2: '', divisionId3: '',
    gpa: '',
    motivation: '', reasonForJoining: '', relevantSkills: '',
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

  const commissions = [...new Set(divisions.map((d) => d.commission))]

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.divisionId1) e.divisionId1 = 'Select your first choice'
    if (!form.gpa || isNaN(form.gpa) || form.gpa < 0 || form.gpa > 4) e.gpa = 'Valid GPA (0-4) required'
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
        divisionId: form.divisionId1,
        divisionId2: form.divisionId2 || null,
        divisionId3: form.divisionId3 || null,
        gpa: Number(form.gpa),
        motivation: form.motivation,
        reasonForJoining: form.reasonForJoining,
        relevantSkills: form.relevantSkills,
        organizationalExperience: form.organizationalExperience || null,
        portfolioUrl: form.portfolioUrl || null,
        linkedinUrl: form.linkedinUrl || null,
        githubUrl: form.githubUrl || null,
        additionalNotes: form.additionalNotes || null,
        timeCommitmentAgreed: form.timeCommitmentAgreed,
      })
      toast.success('Application submitted!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const DivisionSelect = ({ value, name, label, error, exclude = [] }) => (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
      <select name={name} value={value} onChange={handleChange}
        className="block w-full rounded-xl border border-zinc-700/60 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10"
      >
        <option value="">Select division</option>
        {commissions.map((comm) => (
          <optgroup key={comm} label={`Komisi ${commissions.indexOf(comm) + 1} — ${comm}`}>
            {divisions.filter((d) => d.commission === comm && !exclude.includes(d.id)).map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )

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
            {/* Division priorities */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white">Division Preferences</h3>
              <DivisionSelect name="divisionId1" label="1st Priority" value={form.divisionId1} error={errors.divisionId1} />
              <DivisionSelect name="divisionId2" label="2nd Priority (optional)" value={form.divisionId2} exclude={[form.divisionId1]} />
              <DivisionSelect name="divisionId3" label="3rd Priority (optional)" value={form.divisionId3} exclude={[form.divisionId1, form.divisionId2]} />
            </div>

            {/* GPA */}
            <Input label="GPA / IPK" name="gpa" type="number" step="0.01" min="0" max="4" placeholder="3.50" value={form.gpa} onChange={handleChange} error={errors.gpa} />

            <Input label="Motivation" name="motivation" placeholder="Why do you want to join HIMTI? (min 20 chars)" value={form.motivation} onChange={handleChange} error={errors.motivation} />
            <Input label="Reason for Joining" name="reasonForJoining" placeholder="Why HIMTI specifically? (min 20 chars)" value={form.reasonForJoining} onChange={handleChange} error={errors.reasonForJoining} />
            <Input label="Relevant Skills" name="relevantSkills" placeholder="What skills can you contribute?" value={form.relevantSkills} onChange={handleChange} error={errors.relevantSkills} />
            <Input label="Organizational Experience (optional)" name="organizationalExperience" placeholder="Previous org experience" value={form.organizationalExperience} onChange={handleChange} />

            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Portfolio URL (optional)" name="portfolioUrl" placeholder="https://" value={form.portfolioUrl} onChange={handleChange} />
              <Input label="LinkedIn URL (optional)" name="linkedinUrl" placeholder="https://" value={form.linkedinUrl} onChange={handleChange} />
              <Input label="GitHub URL (optional)" name="githubUrl" placeholder="https://" value={form.githubUrl} onChange={handleChange} />
            </div>

            <Input label="Additional Notes (optional)" name="additionalNotes" placeholder="Anything else?" value={form.additionalNotes} onChange={handleChange} />

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" name="timeCommitmentAgreed" checked={form.timeCommitmentAgreed} onChange={handleChange}
                className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 accent-white" />
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