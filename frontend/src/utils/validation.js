export const validateEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

export const validateNIM = (nim) =>
  /^\d{10}$/.test(nim)

export const validateRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== ''

export const validateMinLength = (value, min) =>
  String(value).length >= min

export const validatePhone = (phone) =>
  /^(\+62|62|0)8\d{8,12}$/.test(phone)

export const getFieldError = (name, value, rules = {}) => {
  if (rules.required && !validateRequired(value))
    return `${name} wajib diisi`
  if (rules.email && !validateEmail(value))
    return 'Format email tidak valid'
  if (rules.nim && !validateNIM(value))
    return 'NIM harus 10 digit angka'
  if (rules.phone && !validatePhone(value))
    return 'Format nomor HP tidak valid'
  if (rules.minLength && !validateMinLength(value, rules.minLength))
    return `Minimal ${rules.minLength} karakter`
  return ''
}

export const validateForm = (fields, data) => {
  const errors = {}
  for (const [name, rules] of Object.entries(fields)) {
    const err = getFieldError(name, data[name], rules)
    if (err) errors[name] = err
  }
  return errors
}
