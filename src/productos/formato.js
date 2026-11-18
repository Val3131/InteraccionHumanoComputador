const moneda = new Intl.NumberFormat('es-CR', {
  style: 'currency',
  currency: 'CRC',
  maximumFractionDigits: 0,
})

export function formatoMoneda(monto) {
  return moneda.format(monto)
}

export function formatoFecha(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString('es-CR', { dateStyle: 'medium', timeStyle: 'short' })
}


export function normalizarTexto(texto) {
  return String(texto).toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
}
