export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(date))
}