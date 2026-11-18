import { useMemo, useState } from 'react'
import Aviso from '../components/Aviso.jsx'
import { useAviso } from '../components/useAviso.js'
import { agregarAlCarrito } from '../carrito/carritoStore.js'
import { useAuth } from '../context/AuthContext'
import { formatoMoneda, normalizarTexto } from './formato.js'
import InsigniaStock from './InsigniaStock.jsx'
import { puedeComprar } from './permisos.js'
import ProductoImagen from './ProductoImagen.jsx'
import { CATEGORIAS, PROVEEDORES } from './productosData.js'
import { useProductos } from './productosStore.js'

const FILTROS_INICIALES = {
  texto: '',
  categoria: '',
  proveedor: '',
  precioMax: '',
  soloDisponibles: false,
  orden: 'nombre',
}

const ORDENES = {
  nombre: (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
  'precio-asc': (a, b) => a.precio - b.precio,
  'precio-desc': (a, b) => b.precio - a.precio,
}

function filtrarProductos(productos, f) {
  const texto = normalizarTexto(f.texto.trim())
  const max = f.precioMax === '' || Number.isNaN(Number(f.precioMax)) ? Infinity : Number(f.precioMax)

  return productos
    .filter(
      (p) =>
        p.activo &&
        (!texto || normalizarTexto(`${p.nombre} ${p.descripcion}`).includes(texto)) &&
        (!f.categoria || p.categoria === f.categoria) &&
        (!f.proveedor || p.proveedor === f.proveedor) &&
        p.precio <= max &&
        (!f.soloDisponibles || p.stock > 0),
    )
    .sort(ORDENES[f.orden])
}

export default function CatalogoPage({ onVerDetalle, onVerCarrito }) {
  const { usuario } = useAuth()
  const comprador = puedeComprar(usuario)
  const productos = useProductos()
  const [filtros, setFiltros] = useState(FILTROS_INICIALES)
  const [aviso, setAviso] = useAviso()

  const visibles = useMemo(() => filtrarProductos(productos, filtros), [productos, filtros])
  const hayFiltros = JSON.stringify(filtros) !== JSON.stringify(FILTROS_INICIALES)

  const cambiar = (campo) => (e) => {
    const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFiltros((f) => ({ ...f, [campo]: valor }))
  }

  function agregar(producto) {
    const r = agregarAlCarrito(usuario.id, producto.id, 1)
    setAviso({ tipo: r.ok ? (r.ajustado ? 'info' : 'exito') : 'error', texto: r.mensaje, irCarrito: r.ok })
  }

  return (
    <section>
      <header className="encabezado-pagina">
        <span className="etiqueta">Tienda</span>
        <h1>Catálogo</h1>
        <p>Descubrí las prendas y accesorios de BellasBotique.</p>
      </header>

      <form className="filtros card" role="search" aria-label="Filtrar productos" onSubmit={(e) => e.preventDefault()}>
        <div className="campo campo--ancho">
          <label htmlFor="f-texto">Buscar</label>
          <input id="f-texto" type="search" placeholder="Ej.: blusa, vestido…" value={filtros.texto} onChange={cambiar('texto')} />
        </div>

        <div className="campo">
          <label htmlFor="f-categoria">Categoría</label>
          <select id="f-categoria" value={filtros.categoria} onChange={cambiar('categoria')}>
            <option value="">Todas</option>
            {CATEGORIAS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="f-proveedor">Proveedor</label>
          <select id="f-proveedor" value={filtros.proveedor} onChange={cambiar('proveedor')}>
            <option value="">Todos</option>
            {PROVEEDORES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="f-precio">Precio máximo (₡)</label>
          <input id="f-precio" type="number" min="0" step="1000" inputMode="numeric" placeholder="Sin límite" value={filtros.precioMax} onChange={cambiar('precioMax')} />
        </div>

        <div className="campo">
          <label htmlFor="f-orden">Ordenar por</label>
          <select id="f-orden" value={filtros.orden} onChange={cambiar('orden')}>
            <option value="nombre">Nombre (A–Z)</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
          </select>
        </div>

        <div className="filtros__fila">
          <label className="check">
            <input type="checkbox" checked={filtros.soloDisponibles} onChange={cambiar('soloDisponibles')} />
            Solo con stock
          </label>
          {hayFiltros && (
            <button type="button" className="btn btn-outline btn-sm" onClick={() => setFiltros(FILTROS_INICIALES)}>
              Limpiar filtros
            </button>
          )}
        </div>
      </form>

      <Aviso aviso={aviso}>
        {aviso?.irCarrito && (
          <button type="button" className="enlace" onClick={onVerCarrito}>
            Ver carrito
          </button>
        )}
      </Aviso>

      <p className="resultados" aria-live="polite">
        {visibles.length === 1 ? '1 producto' : `${visibles.length} productos`}
      </p>

      {visibles.length === 0 ? (
        <div className="vacio card">
          <p>No encontramos productos con esos filtros.</p>
          <button type="button" className="btn btn-outline" onClick={() => setFiltros(FILTROS_INICIALES)}>
            Ver todos los productos
          </button>
        </div>
      ) : (
        <ul className="productos-grid">
          {visibles.map((p) => (
            <li key={p.id} className="producto-card">
              <button type="button" className="producto-card__imagen" tabIndex={-1} aria-hidden="true" onClick={() => onVerDetalle(p.id)}>
                <ProductoImagen producto={p} />
              </button>
              <div className="producto-card__cuerpo">
                <p className="producto-card__meta">
                  {p.categoria} · {p.proveedor}
                </p>
                <h2 className="producto-card__nombre">{p.nombre}</h2>
                <p className="producto-card__descripcion">{p.descripcion}</p>
                <div className="producto-card__pie">
                  <strong className="precio">{formatoMoneda(p.precio)}</strong>
                  <InsigniaStock stock={p.stock} />
                </div>
                <div className="producto-card__acciones">
                  <button type="button" className="btn btn-outline" onClick={() => onVerDetalle(p.id)}>
                    Ver más
                  </button>
                  {comprador && (
                    <button type="button" className="btn btn-primary" disabled={p.stock < 1} onClick={() => agregar(p)}>
                      Agregar
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
