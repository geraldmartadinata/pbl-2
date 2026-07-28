import { createContext, useContext, useState } from 'react'
import { loginAccount, getMe } from '../services/api'

const AuthContext = createContext(null)

const DEMO_USERS = [
  { email: 'admin@himti.id', password: 'admin123', name: 'Admin HIMTI', nim: '2900000000', role: 'admin', phone: '081234567890', studyProgram: 'Computer Science', intakeYear: 2022, campus: 'BINUS Anggrek' },
  { email: 'user@binus.ac.id', password: 'user123', name: 'User Binus', nim: '2902000009', role: 'user', phone: '081234567891', studyProgram: 'Informatics', intakeYear: 2024, campus: 'BINUS Anggrek' },
]

function mockLogin(email, password) {
  const found = DEMO_USERS.find((u) => u.email === email && u.password === password)
  if (!found) throw new Error('Invalid email or password')
  const { password: _, ...userData } = found
  return userData
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const login = async (email, password) => {
    try {
      const { token: jwt } = await loginAccount({ email, password })
      localStorage.setItem('token', jwt)
      const profile = await getMe()
      const userData = {
        id: profile.id, name: profile.full_name, email: profile.email, nim: profile.nim,
        role: profile.role === 'ADMIN' ? 'admin' : 'user', phone: profile.phone,
        studyProgram: profile.study_program, intakeYear: profile.intake_year, campus: profile.campus,
      }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch {
      const userData = mockLogin(email, password)
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateProfile = (data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be within AuthProvider')
  return ctx
}