import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import { User, Mail, Shield, Save } from 'lucide-react'

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(user?.name || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Name cannot be empty')
      return
    }
    setSaving(true)
    await new Promise((r) => setTimeout(r, 300))
    updateProfile({ name: name.trim() })
    setSaving(false)
    toast.success('Profile updated')
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-white/[2%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        <BackButton to="/dashboard" label="Back to My Registrations" />
        <h1 className="text-2xl font-bold text-white mb-8">Profile</h1>

        <div className="space-y-4">
          {/* Avatar card */}
          <Card className="p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <User className="h-7 w-7 text-zinc-300" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{user?.name}</p>
              <p className="text-sm text-zinc-500 capitalize">{user?.role}</p>
            </div>
          </Card>

          {/* Edit form */}
          <Card className="p-7">
            <h2 className="text-sm font-semibold text-white mb-5">Account Information</h2>
            <div className="space-y-4">
              <Input
                label="Display Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-white/[6%]">
                <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
                <div>
                  <p className="text-sm text-zinc-300">{user?.email}</p>
                  <p className="text-xs text-zinc-500">Email</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-white/[6%]">
                <Shield className="h-4 w-4 text-zinc-500 shrink-0" />
                <div>
                  <p className="text-sm text-zinc-300 capitalize">{user?.role}</p>
                  <p className="text-xs text-zinc-500">Role</p>
                </div>
              </div>
              <div className="pt-3">
                <Button onClick={handleSave} loading={saving}>
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
