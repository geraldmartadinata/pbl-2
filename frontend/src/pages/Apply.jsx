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
import { Send, ChevronLeft, ChevronRight, Upload, CheckCircle } from 'lucide-react'

const CAMPUSES = ['BINUS Kemanggisan', 'BINUS Alam Sutra', 'BINUS Bekasi', 'BINUS Bandung', 'BINUS Semarang', 'BINUS Malang']

const COMMISSIONS = [
  { name: 'Education', id: 1, divisions: [{ id: 'div-1', name: 'Responsi' }, { id: 'div-2', name: 'Academic Event' }] },
  { name: 'Relation Expansion', id: 2, divisions: [{ id: 'div-3', name: 'Publication & Marketing' }, { id: 'div-4', name: 'HIMTI Care' }] },
  { name: 'Research & Development', id: 3, divisions: [{ id: 'div-5', name: 'Web Development' }, { id: 'div-6', name: 'Creative & Design' }] },
  { name: 'Resource & Development', id: 4, divisions: [{ id: 'div-7', name: 'Supervisor' }, { id: 'div-8', name: 'Human Resource Development' }] },
]

function DivSelect({ value, name, label, error, form, handleChange, exclude = [] }) {
  const selected = [form.divisionId1, form.divisionId2, form.divisionId3]
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
      <select name={name} value={value} onChange={handleChange}
        className="block w-full rounded-xl border border-zinc-700/60 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10">
        <option value="">Select division</option>
        {COMMISSIONS.map((comm) => (
          <optgroup key={comm.id} label={`Komisi ${comm.id} — ${comm.name}`}>
            {comm.divisions.filter((d) => !exclude.includes(d.id)).map((d) => (
              <option key={d.id} value={d.id} disabled={selected.includes(d.id)}>{d.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function TextArea({ label, name, value, error, placeholder, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
      <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3}
        className="block w-full rounded-xl border border-zinc-700/60 bg-zinc-900/60 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/10 resize-none" />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  )
}

function findDivName(id) {
  for (const c of COMMISSIONS) {
    const d = c.divisions.find((d) => d.id === id)
    if (d) return d.name
  }
  return id
}

export default function Apply() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [existing, setExisting] = useState(null)
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({
    fullName: user?.name || '', nim: user?.nim || '', gpa: '', phone: user?.phone || '',
    lineId: '', campus: '', motivation: '', relevantSkills: '', organizationalExperience: '', additionalNotes: '',
    divisionId1: '', reason1: '', divisionId2: '', reason2: '', divisionId3: '', reason3: '',
    portfolioUrl: '', cvUrl: '', linkedinUrl: '', githubUrl: '', commitmentAgreed: false,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    Promise.all([getDivisions(), getMyApplication().catch(() => null)])
      .then(([, app]) => { if (app) setExisting(app) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [e.target.name]: value }))
    if (errors[e.target.name]) setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  const handleFile = (e) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const validateStep = () => {
    const e = {}
    if (step === 1) {
      if (!form.fullName.trim()) e.fullName = 'Required'
      if (!form.nim.trim()) e.nim = 'Required'
      if (!form.gpa || isNaN(form.gpa) || form.gpa < 0 || form.gpa > 4) e.gpa = 'Valid GPA (0-4)'
      if (!form.phone.trim()) e.phone = 'Required'
      if (!form.lineId.trim()) e.lineId = 'Required'
      if (!form.campus) e.campus = 'Select campus'
      if (form.motivation.length < 10) e.motivation = 'At least 10 characters'
      if (!form.relevantSkills.trim()) e.relevantSkills = 'Required'
    } else if (step === 2) {
      if (!form.divisionId1) e.divisionId1 = 'Select division'
      if (form.reason1.length < 10) e.reason1 = 'At least 10 characters'
    } else if (step === 3) {
      if (!form.divisionId2) e.divisionId2 = 'Select division'
      if (form.divisionId2 === form.divisionId1) e.divisionId2 = 'Cannot be same as 1st priority'
      if (form.reason2.length < 10) e.reason2 = 'At least 10 characters'
    } else if (step === 4) {
      if (!form.divisionId3) e.divisionId3 = 'Select division'
      if (form.divisionId3 === form.divisionId1 || form.divisionId3 === form.divisionId2) e.divisionId3 = 'Must differ from other priorities'
      if (form.reason3.length < 10) e.reason3 = 'At least 10 characters'
    } else if (step === 5) {
      if (!form.commitmentAgreed) e.commitmentAgreed = 'You must agree'
    }
    return e
  }

  const handleNext = () => {
    const v = validateStep()
    setErrors(v)
    if (Object.keys(v).length) return
    setStep((s) => s + 1)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitApplication({
        divisionId: form.divisionId1, motivation: form.motivation,
        reasonForJoining: `1st: ${form.reason1}${form.divisionId2 ? `\n2nd: ${form.reason2}` : ''}${form.divisionId3 ? `\n3rd: ${form.reason3}` : ''}`,
        relevantSkills: form.relevantSkills, organizationalExperience: form.organizationalExperience || null,
        timeCommitmentAgreed: form.commitmentAgreed,
        portfolioUrl: form.portfolioUrl || null, linkedinUrl: form.linkedinUrl || null, githubUrl: form.githubUrl || null,
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
          <Card className="p-10"><p className="text-white">Application already submitted. Wait for admin review.</p>
            <Button className="mt-4" onClick={() => navigate('/dashboard')}>View Status</Button></Card>
        </div>
      </div>
    )
  }

  const STEPS = ['Data Diri', 'Prioritas 1', 'Prioritas 2', 'Prioritas 3', 'Finalisasi']
  const totalSteps = STEPS.length

  return (
    <div className="min-h-screen relative py-12">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-white/[2%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4">
        <BackButton to="/dashboard" label="Back to Dashboard" />

        <h1 className="text-2xl font-bold text-white mb-2">Apply to Join HIMTI</h1>
        <p className="text-sm text-zinc-500 mb-6">Step {step} of {totalSteps}: {STEPS[step - 1]}</p>

        <div className="flex gap-1 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i < step ? 'bg-white' : 'bg-zinc-800'}`} />
          ))}
        </div>

        <Card className="p-7 animate-fade-in" key={step}>
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white mb-3">Personal Data</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} />
                <Input label="NIM" name="nim" value={form.nim} onChange={handleChange} error={errors.nim} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="GPA / IPK" name="gpa" type="number" step="0.01" min="0" max="4" placeholder="3.50" value={form.gpa} onChange={handleChange} error={errors.gpa} />
                <Input label="Phone Number" name="phone" type="tel" placeholder="08123456789" value={form.phone} onChange={handleChange} error={errors.phone} />
              </div>
              <Input label="Line ID" name="lineId" placeholder="your_line_id" value={form.lineId} onChange={handleChange} error={errors.lineId} />
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-1.5">Campus Region</label>
                <select name="campus" value={form.campus} onChange={handleChange}
                  className="block w-full rounded-xl border border-zinc-700/60 bg-zinc-900/60 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/10">
                  <option value="">Select campus</option>
                  {CAMPUSES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.campus && <p className="text-xs text-red-400 mt-1">{errors.campus}</p>}
              </div>
              <div className="pt-3 border-t border-white/[6%] space-y-4">
                <Input label="Motivation for Joining HIMTI" name="motivation" placeholder="Why do you want to join HIMTI? (min 10 chars)" value={form.motivation} onChange={handleChange} error={errors.motivation} />
                <Input label="Relevant Skills" name="relevantSkills" placeholder="What skills can you contribute?" value={form.relevantSkills} onChange={handleChange} error={errors.relevantSkills} />
                <Input label="Organizational Experience (optional)" name="organizationalExperience" placeholder="Previous experience" value={form.organizationalExperience} onChange={handleChange} />
                <Input label="Additional Notes (optional)" name="additionalNotes" placeholder="Anything else?" value={form.additionalNotes} onChange={handleChange} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white mb-3">1st Priority Division</h3>
              <DivSelect label="Choose your top priority" name="divisionId1" value={form.divisionId1} error={errors.divisionId1} form={form} handleChange={handleChange} />
              <TextArea label="Why this division?" name="reason1" value={form.reason1} error={errors.reason1} placeholder="Explain your interest (min 10 chars)" onChange={handleChange} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white mb-3">2nd Priority Division</h3>
              <DivSelect label="Choose your second priority" name="divisionId2" value={form.divisionId2} error={errors.divisionId2} form={form} handleChange={handleChange} exclude={[form.divisionId1]} />
              <TextArea label="Why this division?" name="reason2" value={form.reason2} error={errors.reason2} placeholder="Explain your interest (min 10 chars)" onChange={handleChange} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white mb-3">3rd Priority Division</h3>
              <DivSelect label="Choose your third priority" name="divisionId3" value={form.divisionId3} error={errors.divisionId3} form={form} handleChange={handleChange} exclude={[form.divisionId1, form.divisionId2]} />
              <TextArea label="Why this division?" name="reason3" value={form.reason3} error={errors.reason3} placeholder="Explain your interest (min 10 chars)" onChange={handleChange} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-white mb-3">Links, Documents & Confirmation</h3>

              <Input label="Portfolio URL (optional)" name="portfolioUrl" placeholder="https://" value={form.portfolioUrl} onChange={handleChange} />
              <Input label="CV URL (Google Drive / Dropbox)" name="cvUrl" placeholder="https://" value={form.cvUrl} onChange={handleChange} />
              <Input label="LinkedIn URL (optional)" name="linkedinUrl" placeholder="https://" value={form.linkedinUrl} onChange={handleChange} />
              <Input label="GitHub URL (optional)" name="githubUrl" placeholder="https://" value={form.githubUrl} onChange={handleChange} />

              <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/[6%]">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Upload Commitment Letter</label>
                <p className="text-xs text-zinc-500 mb-3">
                  Print the commitment letter template, affix a Rp5,000 stamp, sign, then upload the photo/scan here.
                </p>
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-zinc-600 hover:border-white/30 cursor-pointer transition-colors">
                  <Upload className="h-5 w-5 text-zinc-400" />
                  <span className="text-sm text-zinc-400">{file ? file.name : 'Click to upload (PDF/JPG/PNG)'}</span>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFile} className="hidden" />
                </label>
              </div>

              {/* Division Summary */}
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-white/[6%]">
                <h4 className="text-sm font-semibold text-white mb-3">Your Division Choices</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-zinc-300">1st Priority: <strong className="text-white">{findDivName(form.divisionId1)}</strong></p>
                  {form.divisionId2 && <p className="text-zinc-300">2nd Priority: <strong className="text-white">{findDivName(form.divisionId2)}</strong></p>}
                  {form.divisionId3 && <p className="text-zinc-300">3rd Priority: <strong className="text-white">{findDivName(form.divisionId3)}</strong></p>}
                </div>
              </div>

              {/* Commitment checkboxes */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="commitmentAgreed" checked={form.commitmentAgreed} onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-zinc-600 bg-zinc-800 accent-white" />
                <div>
                  <span className="text-sm text-zinc-300">I confirm my division choices above and <strong className="text-white">commit to contribute wholeheartedly</strong> if selected as a HIMTI activist.</span>
                  {errors.commitmentAgreed && <p className="text-xs text-red-400">{errors.commitmentAgreed}</p>}
                </div>
              </label>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/[6%]">
            {step > 1 ? (
              <Button variant="secondary" onClick={() => setStep((s) => s - 1)}>
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
            ) : <div />}
            {step < totalSteps ? (
              <Button onClick={handleNext}>Next <ChevronRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={handleSubmit} loading={submitting}>
                <Send className="h-4 w-4" /> Submit Application
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}