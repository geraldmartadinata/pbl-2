export const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export const formatTime = (dateStr) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit',
  })
}

export const formatDateTime = (dateStr) =>
  `${formatDate(dateStr)} ${formatTime(dateStr)}`

export const getStatusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    attended: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    upcoming: 'bg-blue-100 text-blue-800',
    ended: 'bg-gray-100 text-gray-600',
  }
  return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-600'
}
