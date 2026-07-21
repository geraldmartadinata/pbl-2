import { getStatusColor } from '../utils/format'

export default function Badge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(status)} ${className}`}
    >
      {status}
    </span>
  )
}
