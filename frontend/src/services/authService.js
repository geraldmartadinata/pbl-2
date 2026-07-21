import usersMock from '../mocks/users.json'
import registrationsMock from '../mocks/registrations.json'

const USE_MOCK = true
const BASE_URL = '/api'

let localUser = JSON.parse(localStorage.getItem('user') || 'null')
let localRegistrations = [...registrationsMock.data]

function delay(ms = 300) {
  return new Promise((r) => setTimeout(r, ms))
}

export const authService = {
  async login(email, password) {
    if (USE_MOCK) {
      await delay()
      const user = usersMock.data.find(
        (u) => u.email === email && u.password === password
      )
      if (!user) throw new Error('Email atau password salah')
      const { password: _, ...safe } = user
      const token = 'mock-token-' + user.id
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(safe))
      localUser = safe
      return { status: 'ok', data: { user: safe, token } }
    }

    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Login gagal')
    localStorage.setItem('token', json.data.token)
    localStorage.setItem('user', JSON.stringify(json.data.user))
    localUser = json.data.user
    return json
  },

  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localUser = null
  },

  getCurrentUser() {
    return localUser
  },

  isAuthenticated() {
    return !!localUser
  },

  isAdmin() {
    return localUser?.role === 'admin'
  },
}

export const registrationService = {
  async getMyRegistrations() {
    if (USE_MOCK) {
      await delay()
      const user = authService.getCurrentUser()
      if (!user) throw new Error('Unauthorized')
      const list = localRegistrations.filter(
        (r) => r.user_id === user.id
      )
      return { status: 'ok', data: list }
    }

    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Gagal memuat data')
    return json
  },

  async getAllRegistrations() {
    if (USE_MOCK) {
      await delay()
      return { status: 'ok', data: localRegistrations }
    }

    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/admin/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Gagal memuat data')
    return json
  },

  async checkIn(registrationId) {
    if (USE_MOCK) {
      await delay(200)
      const idx = localRegistrations.findIndex(
        (r) => r.id === registrationId
      )
      if (idx === -1) throw new Error('Registrasi tidak ditemukan')
      localRegistrations[idx] = {
        ...localRegistrations[idx],
        status: 'attended',
      }
      return { status: 'ok', data: localRegistrations[idx] }
    }

    const token = localStorage.getItem('token')
    const res = await fetch(
      `${BASE_URL}/admin/registrations/${registrationId}/checkin`,
      { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } }
    )
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Check-in gagal')
    return json
  },

  async register(eventId, data) {
    if (USE_MOCK) {
      await delay()
      const user = authService.getCurrentUser()
      if (!user) throw new Error('Silakan login terlebih dahulu')
      const newReg = {
        id: localRegistrations.length + 1,
        user_id: user.id,
        event_id: eventId,
        event_title: data.event_title || 'Event',
        event_date: data.event_date || new Date().toISOString(),
        registration_date: new Date().toISOString(),
        status: 'pending',
        payment_status: data.price > 0 ? 'unpaid' : 'free',
        ticket_code: data.price > 0 ? null : 'HMT-2026-' + String(Date.now()).slice(-4),
      }
      localRegistrations.push(newReg)
      return { status: 'ok', data: newReg }
    }

    const token = localStorage.getItem('token')
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ event_id: eventId, ...data }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.message || 'Registrasi gagal')
    return json
  },
}
