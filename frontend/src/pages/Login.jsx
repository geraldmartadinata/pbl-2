import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { LogIn, Sparkles } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    // Simulate network
    await new Promise((r) => setTimeout(r, 600))
    const user = login(email, password)
    setLoading(false)
    navigate(user.role === 'admin' ? '/admin' : '/')
  }

  const fillDemo = (type) => {
    if (type === 'admin') {
      setEmail('admin@himti.id')
      setPassword('admin123')
    } else {
      setEmail('user@binus.ac.id')
      setPassword('user123')
    }
    setError('')
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-white/[2%] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-zinc-700/[3%] rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-white/10">
            <span className="text-zinc-900 font-bold text-lg">H</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-sm text-zinc-400 mt-1">
            Sign in to your HIMTI account
          </p>
        </div>

        <Card className="p-7 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="text"
              placeholder="you@binus.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              <LogIn className="h-4 w-4" />
              Sign in
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[6%]">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500">Demo accounts</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => fillDemo('admin')}
                className="text-xs text-left p-2.5 rounded-xl bg-white/[4%] border border-white/[6%] text-zinc-300 hover:bg-white/[8%] transition-colors"
              >
                <span className="font-medium">Admin</span>
                <br />
                <span className="text-zinc-500">admin@himti.id</span>
              </button>
              <button
                onClick={() => fillDemo('user')}
                className="text-xs text-left p-2.5 rounded-xl bg-white/[4%] border border-white/[6%] text-zinc-300 hover:bg-white/[8%] transition-colors"
              >
                <span className="font-medium">User</span>
                <br />
                <span className="text-zinc-500">user@binus.ac.id</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
