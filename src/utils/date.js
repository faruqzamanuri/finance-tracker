export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))

export const isCurrentMonth = (date) => {
  const candidate = new Date(`${date}T00:00:00`)
  const now = new Date()
  return candidate.getMonth() === now.getMonth() && candidate.getFullYear() === now.getFullYear()
}
