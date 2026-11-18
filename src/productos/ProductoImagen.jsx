import { useState } from 'react'
import IconoPerchero from '../components/IconoPerchero.jsx'


export default function ProductoImagen({ producto, className = '' }) {
  const [fallo, setFallo] = useState(null)

  if (producto.imagen && fallo !== producto.imagen) {
    return (
      <img
        className={`producto-imagen ${className}`}
        src={producto.imagen}
        alt={producto.nombre}
        loading="lazy"
        onError={() => setFallo(producto.imagen)}
      />
    )
  }

  return (
    <div
      className={`producto-imagen producto-imagen--vacia ${className}`}
      role="img"
      aria-label={`Sin imagen: ${producto.nombre}`}
    >
      <IconoPerchero tamano={56} />
    </div>
  )
}
