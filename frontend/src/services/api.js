import eventsMock from '../mocks/events.json'
import participantsMock from '../mocks/participants.json'

const delay = (ms = 500) => new Promise((r) => setTimeout(r, ms))

let participants = [...participantsMock]

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

export async function registerParticipant(data) {
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

export async function getAllParticipants() {
  await delay()
  return [...participants]
}

export async function toggleCheckIn(id) {
  await delay(300)
  participants = participants.map((p) =>
    p.id === id
      ? { ...p, status: p.status === 'attended' ? 'confirmed' : 'attended' }
      : p
  )
  return participants.find((p) => p.id === id)
}
