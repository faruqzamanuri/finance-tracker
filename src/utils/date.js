export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))

export const getMonthKey = (date = new Date()) => {
  const value = date instanceof Date ? date : new Date(`${date}T00:00:00`)
  const month = String(value.getMonth() + 1).padStart(2, '0')
  return `${value.getFullYear()}-${month}`
}

export const getCurrentMonthKey = () => getMonthKey(new Date())

export const addMonths = (monthKey, offset) => {
  const [year, month] = monthKey.split('-').map(Number)
  const value = new Date(year, month - 1 + offset, 1)
  return getMonthKey(value)
}

export const formatMonthLabel = (monthKey) => {
  const [year, month] = monthKey.split('-').map(Number)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1))
}

export const isSameMonth = (date, monthKey) => getMonthKey(date) === monthKey

export const isCurrentMonth = (date) => isSameMonth(date, getCurrentMonthKey())
