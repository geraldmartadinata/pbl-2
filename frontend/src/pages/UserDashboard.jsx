import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyApplication } from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import { formatDate } from '../utils/format'
import Card from '../components/Card'
import Badge from '../components/Badge'
import Button from '../components/Button'
import { PageSpinner } from '../components/Spinner'
import BackButton from '../components/BackButton'
import { Building2, Clock, CheckCircle, XCircle, ArrowRight, Send } from 'lucide-react'

const statusConfig = {
  PENDING: { label: 'Pending', variant: 'warning', icon: Clock, desc: 'Your application is being reviewed by admin.' },
  ACCEPTED: { label: 'Accepted', variant: 'success', icon: CheckCircle, desc: 'Congratulations! You are now a HIMTI member.' },
  REJECTED: { label: 'Rejected', variant: 'danger', icon: XCircle, desc: 'Your application was not accepted this time.' },
}

export default function UserDashboard() {
  const { user } = useAuth()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyApplication()
      .then(setApp)
      .catch(() => setApp(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-white/[2%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-12">
        <BackButton to="/" label="Back to Home" />

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Application</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {app ? `Applied to ${app.division_name}` : 'You have not applied yet'}
          </p>
        </div>

        {!app ? (
          <Card className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/[6%] flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-zinc-500" />
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">No Application Yet</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Ready to join HIMTI? Submit your application now.
            </p>
            <Link to="/apply">
              <Button><Send className="h-4 w-4" /> Apply Now</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Status card */}
            <Card className="p-6">
              {(() => {
                const cfg = statusConfig[app.status]
                const StatusIcon = cfg?.icon
                return (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/[6%] flex items-center justify-center">
                      {StatusIcon && <StatusIcon className={`h-6 w-6 ${
                        app.status === 'PENDING' ? 'text-amber-300' :
                        app.status === 'ACCEPTED' ? 'text-emerald-300' :
                        'text-red-300'
                      }`} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{cfg?.label || app.status}</h3>
                        <Badge variant={cfg?.variant}>{app.status}</Badge>
                      </div>
                      <p className="text-sm text-zinc-400 mt-1">{cfg?.desc}</p>
                    </div>
                  </div>
                )
              })()}
            </Card>

            {/* Detail cards */}
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Application Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-zinc-500">Division</span><span className="text-zinc-300">{app.division_name}</span></div>
                <div className="flex justify-between"><span className="text-zinc-500">Submitted</span><span className="text-zinc-300">{formatDate(app.submitted_at)}</span></div>
                {app.reviewed_at && <div className="flex justify-between"><span className="text-zinc-500">Reviewed</span><span className="text-zinc-300">{formatDate(app.reviewed_at)}</span></div>}
                {app.admin_note && <div className="flex justify-between"><span className="text-zinc-500">Admin Note</span><span className="text-zinc-300">{app.admin_note}</span></div>}
              </div>
            </Card>

            {app.status === 'PENDING' && (
              <div className="text-center">
                <Link to="/apply" className="text-sm text-zinc-400 hover:text-white transition-colors">Update Application</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}