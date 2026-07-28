import axios from 'axios'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

const API_PREFIX = '/api/v1'

const client = axios.create({
  baseURL: API_PREFIX,
  headers: { 'Content-Type': 'application/json' },
  timeout: 3000,
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Mock fallback data ──

const MOCK_DIVISIONS = [
  { id: 'div-1', name: 'Responsi', commission: 'Education', commissionId: 1 },
  { id: 'div-2', name: 'Academic Event', commission: 'Education', commissionId: 1 },
  { id: 'div-3', name: 'Publication & Marketing', commission: 'Relation Expansion', commissionId: 2 },
  { id: 'div-4', name: 'HIMTI Care', commission: 'Relation Expansion', commissionId: 2 },
  { id: 'div-5', name: 'Web Development', commission: 'Research & Development', commissionId: 3 },
  { id: 'div-6', name: 'Creative & Design', commission: 'Research & Development', commissionId: 3 },
  { id: 'div-7', name: 'Supervisor', commission: 'Resource & Development', commissionId: 4 },
  { id: 'div-8', name: 'Human Resource Development', commission: 'Resource & Development', commissionId: 4 },
]

const MOCK_STATS = { totalApplications: 12, pendingApplications: 5, acceptedApplications: 5, rejectedApplications: 2 }

const MOCK_APPLICATIONS = [
  { application_id: 'app-1', full_name: 'Budi Santoso', nim: '2902000001', email: 'budi@binus.ac.id', division_name: 'Web Development', status: 'PENDING', submitted_at: '2026-07-20T10:00:00Z' },
  { application_id: 'app-2', full_name: 'Siti Rahmawati', nim: '2902000002', email: 'siti@binus.ac.id', division_name: 'UI/UX Design', status: 'PENDING', submitted_at: '2026-07-21T14:30:00Z' },
  { application_id: 'app-3', full_name: 'Ahmad Fauzi', nim: '2802000003', email: 'ahmad@binus.ac.id', division_name: 'Mobile Development', status: 'ACCEPTED', submitted_at: '2026-07-15T09:00:00Z' },
  { application_id: 'app-4', full_name: 'Dewi Lestari', nim: '2802000004', email: 'dewi@binus.ac.id', division_name: 'Data Science', status: 'REJECTED', submitted_at: '2026-07-10T11:00:00Z' },
  { application_id: 'app-5', full_name: 'Rizky Pratama', nim: '2902000005', email: 'rizky@binus.ac.id', division_name: 'Cybersecurity', status: 'PENDING', submitted_at: '2026-07-22T16:00:00Z' },
  { application_id: 'app-6', full_name: 'Nina Kartika', nim: '2802000006', email: 'nina@binus.ac.id', division_name: 'Web Development', status: 'ACCEPTED', submitted_at: '2026-07-14T08:00:00Z' },
  { application_id: 'app-7', full_name: 'Hendra Wijaya', nim: '2902000007', email: 'hendra@binus.ac.id', division_name: 'UI/UX Design', status: 'PENDING', submitted_at: '2026-07-23T13:00:00Z' },
  { application_id: 'app-8', full_name: 'Sarah Putri', nim: '2802000008', email: 'sarah@binus.ac.id', division_name: 'Mobile Development', status: 'PENDING', submitted_at: '2026-07-24T15:00:00Z' },
]

function mockPaginate(items, page = 1, limit = 10) {
  const start = (page - 1) * limit
  return { items: items.slice(start, start + limit), pagination: { page, limit, totalItems: items.length, totalPages: Math.ceil(items.length / limit) } }
}

async function orMock(fn, mock) {
  try { return await fn() } catch (e) {
    if (e.code === 'ERR_NETWORK' || e.message?.includes('timeout') || e.message?.includes('Network Error')) {
      await delay()
      return typeof mock === 'function' ? mock() : mock
    }
    throw e
  }
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
  return orMock(
    async () => { const { data: res } = await client.patch('/users/me', data); return res.data },
    { id: 'mock-id', full_name: data.fullName || 'User', nim: '2900000000', email: 'user@binus.ac.id', phone: data.phone || '', study_program: data.studyProgram || '', intake_year: data.intakeYear || 2024, campus: data.campus || '', updated_at: new Date().toISOString() }
  )
}

// ── Divisions ──

export async function getDivisions() {
  return orMock(
    async () => { const { data: res } = await client.get('/divisions'); return res.data },
    MOCK_DIVISIONS
  )
}

// ── Applications ──

export async function submitApplication(data) {
  return orMock(
    async () => { const { data: res } = await client.post('/applications', data); return res.data },
    { applicationId: 'mock-app-id', status: 'PENDING' }
  )
}

export async function getMyApplication() {
  return orMock(
    async () => { const { data: res } = await client.get('/applications/me'); return res.data },
    () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      const found = MOCK_APPLICATIONS.find((a) => a.email === user.email)
      if (!found) throw new Error('No application found')
      return {
        id: found.application_id, status: found.status, division_name: found.division_name,
        submitted_at: found.submitted_at, reviewed_at: found.status !== 'PENDING' ? '2026-07-25T10:00:00Z' : null,
        admin_note: found.status === 'REJECTED' ? 'Please try again next semester' : null,
        motivation: 'I want to learn and contribute', reason_for_joining: 'HIMTI is the best place to grow',
        relevant_skills: 'JavaScript, React', organizational_experience: null,
        portfolio_url: null, linkedin_url: null, github_url: null, additional_notes: null,
        division_id: 'div-1',
      }
    }
  )
}

export async function updateApplication(data) {
  return orMock(
    async () => { const { data: res } = await client.patch('/applications/me', data); return res.data },
    { applicationId: 'mock-app-id', status: 'PENDING' }
  )
}

// ── Admin ──

export async function getAdminStats() {
  return orMock(
    async () => { const { data: res } = await client.get('/admin/statistics'); return res.data },
    MOCK_STATS
  )
}

export async function getAdminApplications(params = {}) {
  return orMock(
    async () => { const { data: res } = await client.get('/admin/applications', { params }); return res.data },
    () => {
      let items = [...MOCK_APPLICATIONS]
      if (params.status) items = items.filter((a) => a.status === params.status)
      if (params.search) {
        const q = params.search.toLowerCase()
        items = items.filter((a) => a.full_name.toLowerCase().includes(q) || a.nim.includes(q) || a.email.includes(q))
      }
      return mockPaginate(items, params.page || 1, params.limit || 10)
    }
  )
}

export async function getAdminApplicationDetail(id) {
  return orMock(
    async () => { const { data: res } = await client.get(`/admin/applications/${id}`); return res.data },
    () => {
      const base = MOCK_APPLICATIONS.find((a) => a.application_id === id) || MOCK_APPLICATIONS[0]
      return {
        application_id: base.application_id, status: base.status, submitted_at: base.submitted_at, reviewed_at: base.status !== 'PENDING' ? '2026-07-25T10:00:00Z' : null,
        full_name: base.full_name, nim: base.nim, email: base.email, phone: '08123456789', study_program: 'Computer Science', intake_year: 2024,
        campus: 'BINUS Anggrek', instagram_username: '@' + base.full_name.toLowerCase().replace(/\s/g, '_'),
        division_name: base.division_name, admin_note: base.status === 'REJECTED' ? 'Please try again next semester' : null,
        motivation: 'I am passionate about technology and want to contribute to HIMTI\'s mission of bridging academic knowledge with industry practice.', reason_for_joining: 'HIMTI offers the best platform to develop both technical and leadership skills while building a strong network.',
        relevant_skills: 'JavaScript, React, Node.js, UI/UX Design, Team Collaboration', organizational_experience: 'Former treasurer of high school programming club',
        portfolio_url: 'https://github.com/' + base.full_name.toLowerCase().replace(/\s/g, ''), linkedin_url: 'https://linkedin.com/in/' + base.full_name.toLowerCase().replace(/\s/g, ''),
        github_url: 'https://github.com/' + base.full_name.toLowerCase().replace(/\s/g, ''), additional_notes: null, user_id: 'mock-user-id', reviewer_name: null,
      }
    }
  )
}

export async function updateApplicationStatus(id, data) {
  return orMock(
    async () => { const { data: res } = await client.patch(`/admin/applications/${id}/status`, data); return res.data },
    { id, status: data.status, admin_note: data.adminNote || null, reviewed_at: new Date().toISOString() }
  )
}

// ── Events (mock only, legacy) ──

import eventsMock from '../mocks/events.json'

export async function getEvents() { await delay(); return [...eventsMock] }

export async function getEventById(id) {
  await delay()
  const event = eventsMock.find((e) => e.id === id)
  if (!event) throw new Error('Event not found')
  return event
}

// ── Stubs ──

import participantsMock from '../mocks/participants.json'
let participants = [...participantsMock]

export async function getAllParticipants() { await delay(); return [...participants] }

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