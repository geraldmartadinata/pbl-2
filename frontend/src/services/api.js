import axios from 'axios'
import eventsMock from '../mocks/events.json'
import participantsMock from '../mocks/participants.json'

const USE_MOCK = true

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Mock implementation ──

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms))
let participants = [...participantsMock]

async function mockGetEvents() {
  await delay()
  return [...eventsMock]
}

async function mockGetEventById(id) {
  await delay()
  const event = eventsMock.find((e) => e.id === id)
  if (!event) throw new Error('Event not found')
  return event
}

async function mockRegisterParticipant(data) {
  await delay(700)
  const newEntry = {
    id: participants.length + 1,
    ...data,
    registered_at: new Date().toISOString(),
    status: 'confirmed',
  }
  participants.push(newEntry)
  return newEntry
}

async function mockGetAllParticipants() {
  await delay()
  return [...participants]
}

async function mockToggleCheckIn(id) {
  await delay(300)
  participants = participants.map((p) =>
    p.id === id
      ? { ...p, status: p.status === 'attended' ? 'confirmed' : 'attended' }
      : p
  )
  return participants.find((p) => p.id === id)
}

// ── Live API implementation (Axios) ──

function handleError(err) {
  const msg = err?.response?.data?.message || err.message || 'Request failed'
  throw new Error(msg)
}

async function apiGetEvents() {
  const { data } = await client.get('/events')
  return data
}

async function apiGetEventById(id) {
  const { data } = await client.get(`/events/${id}`)
  return data
}

async function apiRegisterParticipant(formData) {
  const { data } = await client.post('/participants', formData)
  return data
}

async function apiGetAllParticipants() {
  const { data } = await client.get('/participants')
  return data
}

async function apiToggleCheckIn(id) {
  const { data } = await client.patch(`/participants/${id}/check-in`)
  return data
}

// ── Exports (switchable) ──

export const getEvents = USE_MOCK ? mockGetEvents : apiGetEvents
export const getEventById = USE_MOCK ? mockGetEventById : apiGetEventById
export const registerParticipant = USE_MOCK ? mockRegisterParticipant : apiRegisterParticipant
export const getAllParticipants = USE_MOCK ? mockGetAllParticipants : apiGetAllParticipants
export const toggleCheckIn = USE_MOCK ? mockToggleCheckIn : apiToggleCheckIn
