import { estadoStock } from './productosData.js'

export default function InsigniaStock({ stock }) {
  const estado = estadoStock(stock)

  if (estado === 'agotado') return <span className="badge badge--agotado">Agotado</span>
  if (estado === 'bajo') {
    return (
      <span className="badge badge--bajo">
        {stock === 1 ? 'Queda 1 unidad' : `Quedan ${stock} unidades`}
      </span>
    )
  }
  return (
    <span className="badge badge--stock">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12.5 2.8 2.8L16 9.5" />
      </svg>
      En stock
    </span>
  )
}
