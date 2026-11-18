import { useState } from 'react'
import { useCantidadEnCarrito } from '../carrito/carritoStore.js'
import { useAuth } from '../context/AuthContext'
import CatalogoPage from './CatalogoPage.jsx'
import { puedeComprar } from './permisos.js'
import ProductoDetallePage from './ProductoDetallePage.jsx'
import TiendaCabecera from './TiendaCabecera.jsx'
import '../styles/Tienda.css'
import './productos.css'

export default function CatalogoModulo({ onVolver, onVerCarrito }) {
  const { usuario } = useAuth()
  const [detalleId, setDetalleId] = useState(null)
  const comprador = puedeComprar(usuario)
  const enCarrito = useCantidadEnCarrito(usuario?.id)

  return (
    <main className="bb-tienda">
      <TiendaCabecera onVolver={onVolver}>
        {comprador && (
          <button type="button" className="btn btn-secundario" onClick={onVerCarrito}>
            Carrito
            {enCarrito > 0 && <span className="contador">{enCarrito}</span>}
          </button>
        )}
      </TiendaCabecera>

      <div className="tienda-contenido">
        <div hidden={detalleId !== null}>
          <CatalogoPage onVerDetalle={setDetalleId} onVerCarrito={onVerCarrito} />
        </div>

        {detalleId !== null && (
          <ProductoDetallePage
            id={detalleId}
            onVolver={() => setDetalleId(null)}
            onVerCarrito={onVerCarrito}
          />
        )}
      </div>
    </main>
  )
}
