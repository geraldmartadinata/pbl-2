import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { authService } from '../services/authService'
import Card from '../components/Card'
import Button from '../components/Button'
import Input from '../components/Input'

export default function Profile() {
  const { user, isAuth, isAdmin, logout } = useAuth()
  const { addToast } = useToast()

  if (!isAuth) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted">Silakan login terlebih dahulu.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

      <Card className="p-6">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-himti-100 rounded-full flex items-center justify-center text-xl font-bold text-himti-700">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-muted">{user?.email}</p>
            <Badge role={user?.role} />
          </div>
        </div>

        {/* Info */}
        <div className="space-y-4 border-t border-gray-100 pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted">NIM</p>
              <p className="text-sm font-medium text-gray-900">{user?.nim || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-muted">No. HP</p>
              <p className="text-sm font-medium text-gray-900">{user?.phone || '-'}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted">Role</p>
            <p className="text-sm font-medium text-gray-900 capitalize">{user?.role}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Badge({ role }) {
  const colors = {
    admin: 'bg-purple-100 text-purple-700',
    user: 'bg-himti-100 text-himti-700',
  }
  return (
    <span
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 ${
        colors[role] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {role}
    </span>
  )
}
