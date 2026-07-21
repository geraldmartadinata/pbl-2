import eventsMock from '../mocks/events.json'

const USE_MOCK = true

const BASE_URL = '/api'

async function request(endpoint, options = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 400))
    if (endpoint === '/events' && !options.method)
      return { status: 'ok', data: eventsMock.data }
    if (endpoint.startsWith('/events/') && !options.method) {
      const id = parseInt(endpoint.split('/')[2])
      const event = eventsMock.data.find((e) => e.id === id)
      if (!event) throw new Error('Event not found')
      return { status: 'ok', data: event }
    }
    throw new Error('Mock not implemented: ' + endpoint)
  }

  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const json = await res.json()
  if (!res.ok) throw new Error(json.message || 'Request failed')
  return json
}

export const eventService = {
  getAll: () => request('/events'),
  getById: (id) => request(`/events/${id}`),
  register: (eventId, data) =>
    request('/registrations', {
      method: 'POST',
      body: JSON.stringify({ event_id: eventId, ...data }),
    }),
}
