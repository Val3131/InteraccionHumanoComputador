import { useMemo, useState } from 'react'
import Aviso from '../components/Aviso.jsx'
import { formatoMoneda, normalizarTexto } from './formato.js'
import InsigniaStock from './InsigniaStock.jsx'
import ProductoImagen from './ProductoImagen.jsx'
import { STOCK_BAJO } from './productosData.js'
import { actualizarStock, establecerActivo, useProductos } from './productosStore.js'

function EditorStock({ producto, onResultado }) {
  const [valor, setValor] = useState(String(producto.stock))
  const [error, setError] = useState('')

  function guardar(e) {
    e.preventDefault()
    const r = actualizarStock(producto.id, valor)
    if (!r.ok) {
      setError(r.error)
      return
    }
    setError('')
    onResultado({ tipo: 'exito', texto: `Stock de «${producto.nombre}» actualizado a ${r.producto.stock}.` })
  }

  return (
    <form className="editor-stock" onSubmit={guardar} noValidate>
      <input
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        aria-label={`Stock de ${producto.nombre}`}
        aria-invalid={error ? 'true' : undefined}
      />
      <button type="submit" className="btn btn-secundario btn-sm" disabled={valor === String(producto.stock)}>
        Actualizar
      </button>
      {error && <span className="error" role="alert">{error}</span>}
    </form>
  )
}

export default function AdminProductosPage({ aviso, setAviso, onNuevo, onEditar }) {
  const productos = useProductos()
  const [texto, setTexto] = useState('')
  const [estado, setEstado] = useState('todos')

  const visibles = useMemo(() => {
    const t = normalizarTexto(texto.trim())
    return productos.filter(
      (p) =>
        (estado === 'todos' || (estado === 'activos' ? p.activo : !p.activo)) &&
        (!t || normalizarTexto(`${p.nombre} ${p.categoria} ${p.proveedor}`).includes(t)),
    )
  }, [productos, texto, estado])

  const activos = productos.filter((p) => p.activo)
  const stockBajo = activos.filter((p) => p.stock <= STOCK_BAJO).length

  function cambiarEstado(p) {
    if (p.activo && !window.confirm(`¿Dar de baja «${p.nombre}»? Dejará de mostrarse en el catálogo, pero podés reactivarlo cuando quieras.`)) {
      return
    }
    const r = establecerActivo(p.id, !p.activo)
    setAviso(
      r.ok
        ? { tipo: 'exito', texto: p.activo ? `«${p.nombre}» se dio de baja.` : `«${p.nombre}» se reactivó y vuelve a mostrarse en el catálogo.` }
        : { tipo: 'error', texto: r.error },
    )
  }

  return (
    <section>
      <header className="encabezado-pagina encabezado-pagina--fila">
        <div>
          <span className="etiqueta">Gestión</span>
          <h1>Administración de productos</h1>
          <p>
            {productos.length} productos · {activos.length} activos · {stockBajo} con stock bajo o agotado
          </p>
        </div>
        <button type="button" className="btn btn-primary" onClick={onNuevo}>
          + Nuevo producto
        </button>
      </header>

      <div className="filtros card" role="search" aria-label="Filtrar productos">
        <div className="campo campo--ancho">
          <label htmlFor="a-texto">Buscar</label>
          <input id="a-texto" type="search" placeholder="Nombre, categoría o proveedor" value={texto} onChange={(e) => setTexto(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="a-estado">Estado</label>
          <select id="a-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
            <option value="todos">Todos</option>
            <option value="activos">Activos</option>
            <option value="baja">Dados de baja</option>
          </select>
        </div>
      </div>

      <Aviso aviso={aviso} />

      {visibles.length === 0 ? (
        <div className="vacio card">
          <p>No hay productos que coincidan con la búsqueda.</p>
        </div>
      ) : (
        <div className="tabla-contenedor card">
          <table className="tabla">
            <caption className="solo-lectores">Lista de productos</caption>
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Categoría</th>
                <th scope="col">Proveedor</th>
                <th scope="col">Precio</th>
                <th scope="col">Stock</th>
                <th scope="col">Estado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((p) => (
                <tr key={p.id} className={p.activo ? '' : 'fila--baja'}>
                  <td>
                    <div className="celda-producto">
                      <ProductoImagen producto={p} className="producto-imagen--mini" />
                      <span>{p.nombre}</span>
                    </div>
                  </td>
                  <td>{p.categoria}</td>
                  <td>{p.proveedor}</td>
                  <td>{formatoMoneda(p.precio)}</td>
                  <td>
                    <InsigniaStock stock={p.stock} />
                    <EditorStock key={p.stock} producto={p} onResultado={setAviso} />
                  </td>
                  <td>
                    <span className={p.activo ? 'badge badge--stock' : 'badge badge--agotado'}>{p.activo ? 'Activo' : 'De baja'}</span>
                  </td>
                  <td>
                    <div className="acciones-fila">
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => onEditar(p.id)}>
                        Editar
                      </button>
                      <button type="button" className="btn btn-outline btn-sm" onClick={() => cambiarEstado(p)}>
                        {p.activo ? 'Dar de baja' : 'Reactivar'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
