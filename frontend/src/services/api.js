import axios from 'axios'
import eventsMock from '../mocks/events.json'
import participantsMock from '../mocks/participants.json'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

const API_PREFIX = '/api/v1'

const client = axios.create({
  baseURL: API_PREFIX,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

function handleError(err) {
  const msg = err?.response?.data?.message || err.message || 'Request failed'
  throw new Error(msg)
}

// ── Auth ──

export async function registerAccount(data) {
  const { data: res } = await client.post('/auth/register', data)
  return res.data
}

export async function loginAccount(data) {
  const { data: res } = await client.post('/auth/login', data)
  return res.data
}

export async function getMe() {
  const { data: res } = await client.get('/auth/me')
  return res.data
}

// ── Profile ──

export async function updateProfile(data) {
  const { data: res } = await client.patch('/users/me', data)
  return res.data
}

// ── Divisions ──

export async function getDivisions() {
  const { data: res } = await client.get('/divisions')
  return res.data
}

// ── Applications ──

export async function submitApplication(data) {
  const { data: res } = await client.post('/applications', data)
  return res.data
}

export async function getMyApplication() {
  const { data: res } = await client.get('/applications/me')
  return res.data
}

export async function updateApplication(data) {
  const { data: res } = await client.patch('/applications/me', data)
  return res.data
}

// ── Admin ──

export async function getAdminStats() {
  const { data: res } = await client.get('/admin/statistics')
  return res.data
}

export async function getAdminApplications(params) {
  const { data: res } = await client.get('/admin/applications', { params })
  return res.data
}

export async function getAdminApplicationDetail(id) {
  const { data: res } = await client.get(`/admin/applications/${id}`)
  return res.data
}

export async function updateApplicationStatus(id, data) {
  const { data: res } = await client.patch(`/admin/applications/${id}/status`, data)
  return res.data
}

// ── Events (mock) ──

export async function getEvents() {
  await delay()
  return [...eventsMock]
}

export async function getEventById(id) {
  await delay()
  const event = eventsMock.find((e) => e.id === id)
  if (!event) throw new Error('Event not found')
  return event
}

// ── Stubs (to be removed after page refactors) ──

let participants = [...participantsMock]

export async function getAllParticipants() {
  await delay()
  return [...participants]
}

export async function registerParticipant(data) {
  await delay(700)
  const newEntry = { id: participants.length + 1, ...data, registered_at: new Date().toISOString(), status: 'confirmed' }
  participants.push(newEntry)
  return newEntry
}

export async function toggleCheckIn(id) {
  await delay(300)
  participants = participants.map((p) => p.id === id ? { ...p, status: p.status === 'attended' ? 'confirmed' : 'attended' } : p)
  return participants.find((p) => p.id === id)
}