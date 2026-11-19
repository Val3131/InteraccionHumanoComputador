import TiendaCabecera from '../productos/TiendaCabecera.jsx'
import Aviso from '../components/Aviso.jsx'
import { useAviso } from '../components/useAviso.js'
import { useAuth } from '../context/AuthContext'
import { formatoFecha, formatoMoneda } from '../productos/formato.js'
import { puedeComprar } from '../productos/permisos.js'
import ProductoImagen from '../productos/ProductoImagen.jsx'
import { cambiarCantidad, quitarDelCarrito, useCarrito, vaciarCarrito } from './carritoStore.js'
import '../styles/Tienda.css'
import '../productos/productos.css'
import './carrito.css'

function mensajeLinea(linea) {
  if (linea.estado === 'no_disponible') return 'Este producto ya no está disponible. Quitalo para continuar.'
  if (linea.estado === 'sin_stock') return 'Se agotó. Quitalo para continuar.'
  if (linea.estado === 'stock_insuficiente') {
    return `Solo quedan ${linea.producto.stock} unidad(es), pero tenés ${linea.cantidad} en el carrito.`
  }
  return ''
}


export default function CarritoPage({ onVolver, onSeguirComprando, onContinuarPago }) {
  const { usuario } = useAuth()
  const resumen = useCarrito(usuario?.id)
  const [aviso, setAviso] = useAviso()

  function mostrar(r) {
    if (r.mensaje) setAviso({ tipo: r.ok ? (r.ajustado ? 'info' : 'exito') : 'error', texto: r.mensaje })
  }

  function vaciar() {
    if (window.confirm('¿Vaciar el carrito? Se quitarán todos los productos.')) mostrar(vaciarCarrito(usuario.id))
  }

  if (!puedeComprar(usuario)) {
    return (
      <main className="bb-tienda">
        <TiendaCabecera onVolver={onVolver} />
        <section className="tienda-contenido pagina-estrecha">
          <h1>Carrito</h1>
          <p>El carrito está disponible solo para cuentas de clientes.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="bb-tienda">
      <TiendaCabecera onVolver={onVolver}>
        <button type="button" className="btn btn-secundario" onClick={onSeguirComprando}>
          Seguir comprando
        </button>
      </TiendaCabecera>

      <div className="tienda-contenido">
        <header className="encabezado-pagina">
          <span className="etiqueta">Mi compra</span>
          <h1>Tu carrito</h1>
          <p>Carrito de {usuario.nombre}</p>
        </header>

        <Aviso aviso={aviso} />

        {resumen.lineas.length === 0 ? (
          <div className="vacio card">
            <p>Tu carrito está vacío.</p>
            <button type="button" className="btn btn-primary" onClick={onSeguirComprando}>
              Ir al catálogo
            </button>
          </div>
        ) : (
          <div className="carrito">
            <ul className="carrito__lineas">
              {resumen.lineas.map((l) => {
                const p = l.producto
                const problema = l.estado !== 'ok'
                return (
                  <li key={l.productoId} className={`linea card ${problema ? 'linea--problema' : ''}`}>
                    <div className="linea__imagen">
                      {p ? <ProductoImagen producto={p} /> : <div className="producto-imagen producto-imagen--vacia" />}
                    </div>

                    <div className="linea__info">
                      <h2 className="linea__nombre">{p ? p.nombre : 'Producto eliminado'}</h2>
                      {p && (
                        <p className="linea__meta">
                          {p.categoria} · {formatoMoneda(p.precio)} c/u
                        </p>
                      )}
                      {problema && (
                        <p className="linea__alerta" role="alert">
                          {mensajeLinea(l)}{' '}
                          {l.estado === 'stock_insuficiente' && (
                            <button type="button" className="enlace" onClick={() => mostrar(cambiarCantidad(usuario.id, l.productoId, p.stock))}>
                              Ajustar a {p.stock}
                            </button>
                          )}
                        </p>
                      )}
                    </div>

                    <div className="cantidad" role="group" aria-label={`Cantidad de ${p ? p.nombre : 'producto'}`}>
                      <button type="button" className="btn btn-outline btn-icono" aria-label="Quitar una unidad" disabled={l.cantidad <= 1} onClick={() => mostrar(cambiarCantidad(usuario.id, l.productoId, l.cantidad - 1))}>
                        −
                      </button>
                      <output aria-live="polite">{l.cantidad}</output>
                      <button type="button" className="btn btn-outline btn-icono" aria-label="Agregar una unidad" disabled={!p || l.estado !== 'ok' || l.cantidad >= p.stock} onClick={() => mostrar(cambiarCantidad(usuario.id, l.productoId, l.cantidad + 1))}>
                        +
                      </button>
                    </div>

                    <div className="linea__total">
                      <strong>{problema ? '—' : formatoMoneda(l.subtotal)}</strong>
                      <button type="button" className="enlace" onClick={() => mostrar(quitarDelCarrito(usuario.id, l.productoId))}>
                        Quitar
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <aside className="resumen card" aria-label="Resumen del carrito">
              <h2>Resumen</h2>
              <dl className="resumen__datos">
                <div>
                  <dt>Cliente</dt>
                  <dd>{usuario.nombre}</dd>
                </div>
                <div>
                  <dt>Carrito creado</dt>
                  <dd>{formatoFecha(resumen.creadoEn)}</dd>
                </div>
                <div>
                  <dt>Última actualización</dt>
                  <dd>{formatoFecha(resumen.actualizadoEn)}</dd>
                </div>
                <div>
                  <dt>Artículos</dt>
                  <dd>{resumen.cantidadArticulos}</dd>
                </div>
                <div className="resumen__subtotal">
                  <dt>Subtotal</dt>
                  <dd>{formatoMoneda(resumen.subtotal)}</dd>
                </div>
              </dl>
              <p className="ayuda">El impuesto y el total se calculan al facturar.</p>

              {resumen.problemas.length > 0 && (
                <p className="ayuda ayuda--alerta">
                  Resolvé los avisos de los productos para continuar. Esas líneas no se incluyen en el subtotal.
                </p>
              )}

              <button type="button" className="btn btn-primary btn-ancho" disabled={!resumen.puedePagar || !onContinuarPago} onClick={onContinuarPago}>
                Continuar con el pago
              </button>
              {!onContinuarPago && (
                <p className="ayuda">El pago se habilitará cuando el módulo de Pagos esté integrado.</p>
              )}
              <button type="button" className="enlace enlace--centro" onClick={vaciar}>
                Vaciar carrito
              </button>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}
