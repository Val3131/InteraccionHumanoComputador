import { useState } from 'react'
import Aviso from '../components/Aviso.jsx'
import { useAviso } from '../components/useAviso.js'
import { agregarAlCarrito } from '../carrito/carritoStore.js'
import { useAuth } from '../context/AuthContext'
import { formatoMoneda } from './formato.js'
import InsigniaStock from './InsigniaStock.jsx'
import { puedeComprar } from './permisos.js'
import ProductoImagen from './ProductoImagen.jsx'
import { useProductos } from './productosStore.js'

export default function ProductoDetallePage({ id, onVolver, onVerCarrito }) {
  const { usuario } = useAuth()
  const productos = useProductos()
  const [cantidad, setCantidad] = useState(1)
  const [aviso, setAviso] = useAviso()

  const producto = productos.find((p) => p.id === id && p.activo)

  if (!producto) {
    return (
      <section className="pagina-estrecha">
        <h1>Producto no disponible</h1>
        <p>Este producto no existe o ya no está a la venta.</p>
        <button type="button" className="btn btn-primary" onClick={onVolver}>
          Volver al catálogo
        </button>
      </section>
    )
  }

  const maximo = Math.max(producto.stock, 1)
  const cantidadValida = Math.min(Math.max(cantidad, 1), maximo)

  function agregar() {
    const r = agregarAlCarrito(usuario.id, producto.id, cantidadValida)
    setAviso({ tipo: r.ok ? (r.ajustado ? 'info' : 'exito') : 'error', texto: r.mensaje, irCarrito: r.ok })
  }

  return (
    <section>
      <p className="migas">
        <button type="button" className="enlace" onClick={onVolver}>
          ← Volver al catálogo
        </button>
      </p>

      <div className="detalle">
        <div className="detalle__imagen">
          <ProductoImagen producto={producto} />
        </div>

        <div className="detalle__info">
          <p className="producto-card__meta">{producto.categoria}</p>
          <h1>{producto.nombre}</h1>
          <p className="precio precio--grande">{formatoMoneda(producto.precio)}</p>
          <p>{producto.descripcion}</p>

          <dl className="datos">
            <div>
              <dt>Proveedor</dt>
              <dd>{producto.proveedor}</dd>
            </div>
            <div>
              <dt>Disponibilidad</dt>
              <dd>
                <InsigniaStock stock={producto.stock} />
              </dd>
            </div>
          </dl>

          {puedeComprar(usuario) && producto.stock > 0 && (
            <div className="detalle__compra">
              <div className="cantidad" role="group" aria-label="Cantidad">
                <button type="button" className="btn btn-outline btn-icono" aria-label="Quitar una unidad" disabled={cantidadValida <= 1} onClick={() => setCantidad(cantidadValida - 1)}>
                  −
                </button>
                <output aria-live="polite">{cantidadValida}</output>
                <button type="button" className="btn btn-outline btn-icono" aria-label="Agregar una unidad" disabled={cantidadValida >= maximo} onClick={() => setCantidad(cantidadValida + 1)}>
                  +
                </button>
              </div>
              <button type="button" className="btn btn-primary" onClick={agregar}>
                Agregar al carrito
              </button>
            </div>
          )}

          <Aviso aviso={aviso}>
            {aviso?.irCarrito && (
              <button type="button" className="enlace" onClick={onVerCarrito}>
                Ver carrito
              </button>
            )}
          </Aviso>
        </div>
      </div>
    </section>
  )
}
