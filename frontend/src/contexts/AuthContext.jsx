import { createContext, useContext, useState } from 'react'
import { loginAccount, getMe } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = async (email, password) => {
    const { token: jwt } = await loginAccount({ email, password })
    localStorage.setItem('token', jwt)
    setToken(jwt)

    const profile = await getMe()
    const userData = {
      id: profile.id,
      name: profile.full_name,
      email: profile.email,
      nim: profile.nim,
      role: profile.role === 'ADMIN' ? 'admin' : 'user',
      phone: profile.phone,
      studyProgram: profile.study_program,
      intakeYear: profile.intake_year,
      campus: profile.campus,
    }
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const updateProfile = (data) => {
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user && !!token, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be within AuthProvider')
  return ctx
}