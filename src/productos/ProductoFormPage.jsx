import { useState } from 'react'
import Aviso from '../components/Aviso.jsx'
import ProductoImagen from './ProductoImagen.jsx'
import { CATEGORIAS, PROVEEDORES } from './productosData.js'
import { actualizarProducto, crearProducto, obtenerProductoPorId } from './productosStore.js'

const MAX_IMAGEN_KB = 300

const VACIO = { nombre: '', descripcion: '', precio: '', stock: '', categoria: '', proveedor: '', imagen: '' }

function FormularioProducto({ producto, onTerminar }) {
  const [valores, setValores] = useState(
    producto
      ? {
          nombre: producto.nombre,
          descripcion: producto.descripcion,
          precio: String(producto.precio),
          stock: String(producto.stock),
          categoria: producto.categoria,
          proveedor: producto.proveedor,
          imagen: producto.imagen,
        }
      : VACIO,
  )
  const [errores, setErrores] = useState({})
  const [errorImagen, setErrorImagen] = useState('')
  const [errorGeneral, setErrorGeneral] = useState(null)

  const cambiar = (campo) => (e) => setValores((v) => ({ ...v, [campo]: e.target.value }))
  const esDataUrl = valores.imagen.startsWith('data:')

  function elegirArchivo(e) {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) {
      setErrorImagen('El archivo debe ser una imagen.')
      return
    }
    if (archivo.size > MAX_IMAGEN_KB * 1024) {
      setErrorImagen(`La imagen pesa más de ${MAX_IMAGEN_KB} KB. Usá una más pequeña o pegá una URL.`)
      return
    }
    const lector = new FileReader()
    lector.onload = () => {
      setErrorImagen('')
      setValores((v) => ({ ...v, imagen: String(lector.result) }))
    }
    lector.readAsDataURL(archivo)
  }

  function enviar(e) {
    e.preventDefault()
    const r = producto ? actualizarProducto(producto.id, valores) : crearProducto(valores)
    if (!r.ok) {
      setErrores(r.errores ?? {})
      setErrorGeneral(
        r.errores ? { tipo: 'error', texto: 'Revisá los campos marcados.' } : { tipo: 'error', texto: r.error },
      )
      return
    }
    onTerminar({
      tipo: 'exito',
      texto: producto ? `«${r.producto.nombre}» se actualizó.` : `«${r.producto.nombre}» se registró.`,
    })
  }

  const campoError = (campo) => (errores[campo] ? `${campo}-error` : undefined)

  return (
    <section className="pagina-estrecha">
      <p className="migas">
        <button type="button" className="enlace" onClick={() => onTerminar()}>
          ← Volver a la lista
        </button>
      </p>
      <h1>{producto ? 'Editar producto' : 'Nuevo producto'}</h1>

      <form className="formulario card" onSubmit={enviar} noValidate>
        <Aviso aviso={errorGeneral} />

        <div className="campo">
          <label htmlFor="nombre">Nombre *</label>
          <input id="nombre" value={valores.nombre} onChange={cambiar('nombre')} maxLength={80} aria-invalid={errores.nombre ? 'true' : undefined} aria-describedby={campoError('nombre')} />
          {errores.nombre && <span id="nombre-error" className="error">{errores.nombre}</span>}
        </div>

        <div className="campo">
          <label htmlFor="descripcion">Descripción *</label>
          <textarea id="descripcion" rows="3" value={valores.descripcion} onChange={cambiar('descripcion')} maxLength={300} aria-invalid={errores.descripcion ? 'true' : undefined} aria-describedby={campoError('descripcion')} />
          {errores.descripcion && <span id="descripcion-error" className="error">{errores.descripcion}</span>}
        </div>

        <div className="formulario__fila">
          <div className="campo">
            <label htmlFor="precio">Precio (₡) *</label>
            <input id="precio" type="number" min="1" step="1" inputMode="numeric" value={valores.precio} onChange={cambiar('precio')} aria-invalid={errores.precio ? 'true' : undefined} aria-describedby={campoError('precio')} />
            {errores.precio && <span id="precio-error" className="error">{errores.precio}</span>}
          </div>
          <div className="campo">
            <label htmlFor="stock">Stock *</label>
            <input id="stock" type="number" min="0" step="1" inputMode="numeric" value={valores.stock} onChange={cambiar('stock')} aria-invalid={errores.stock ? 'true' : undefined} aria-describedby={campoError('stock')} />
            {errores.stock && <span id="stock-error" className="error">{errores.stock}</span>}
          </div>
        </div>

        <div className="formulario__fila">
          <div className="campo">
            <label htmlFor="categoria">Categoría *</label>
            <select id="categoria" value={valores.categoria} onChange={cambiar('categoria')} aria-invalid={errores.categoria ? 'true' : undefined} aria-describedby={campoError('categoria')}>
              <option value="">Elegí una categoría</option>
              {CATEGORIAS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            {errores.categoria && <span id="categoria-error" className="error">{errores.categoria}</span>}
          </div>
          <div className="campo">
            <label htmlFor="proveedor">Proveedor *</label>
            <select id="proveedor" value={valores.proveedor} onChange={cambiar('proveedor')} aria-invalid={errores.proveedor ? 'true' : undefined} aria-describedby={campoError('proveedor')}>
              <option value="">Elegí un proveedor</option>
              {PROVEEDORES.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            {errores.proveedor && <span id="proveedor-error" className="error">{errores.proveedor}</span>}
          </div>
        </div>

        <fieldset className="imagen-campo">
          <legend>Imagen (opcional)</legend>
          <div className="imagen-campo__vista">
            <ProductoImagen producto={{ ...valores, nombre: valores.nombre || 'Vista previa' }} />
          </div>
          <div className="imagen-campo__controles">
            <div className="campo">
              <label htmlFor="imagen-url">URL de la imagen</label>
              <input id="imagen-url" type="url" placeholder="https://…" value={esDataUrl ? '' : valores.imagen} onChange={cambiar('imagen')} />
            </div>
            <div className="campo">
              <label htmlFor="imagen-archivo">…o subí un archivo (máx. {MAX_IMAGEN_KB} KB)</label>
              <input id="imagen-archivo" type="file" accept="image/*" onChange={elegirArchivo} />
            </div>
            {errorImagen && <span className="error" role="alert">{errorImagen}</span>}
            {valores.imagen && (
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setValores((v) => ({ ...v, imagen: '' }))}>
                Quitar imagen
              </button>
            )}
          </div>
        </fieldset>

        <div className="formulario__acciones">
          <button type="button" className="btn btn-outline" onClick={() => onTerminar()}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary">
            {producto ? 'Guardar cambios' : 'Registrar producto'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default function ProductoFormPage({ id, onTerminar }) {
  const producto = id ? obtenerProductoPorId(id) : null

  if (id && !producto) {
    return (
      <section className="pagina-estrecha">
        <h1>Producto no encontrado</h1>
        <button type="button" className="btn btn-primary" onClick={() => onTerminar()}>
          Volver a la lista
        </button>
      </section>
    )
  }

  return <FormularioProducto producto={producto} onTerminar={onTerminar} />
}
