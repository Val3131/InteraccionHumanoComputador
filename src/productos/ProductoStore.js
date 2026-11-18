import { useSyncExternalStore } from 'react'
import {
  CATEGORIAS,
  PRODUCTOS_INICIALES,
  PROVEEDORES,
  STOCK_BAJO,
} from './productosData.js'

const CLAVE = 'bb_productos'
const MSG_ALMACENAMIENTO = 'No se pudo guardar: el almacenamiento del navegador está lleno.'

const oyentes = new Set()
let cache = null

function cargar() {
  try {
    const raw = localStorage.getItem(CLAVE)
    if (raw) {
      const lista = JSON.parse(raw)
      if (Array.isArray(lista)) return lista
    }
  } catch {
    
  }
  return PRODUCTOS_INICIALES
}

export function obtenerProductos() {
  if (cache === null) cache = cargar()
  return cache
}

function guardar(lista) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(lista))
  } catch {
    return false
  }
  cache = lista
  oyentes.forEach((fn) => fn())
  return true
}

export function suscribir(fn) {
  oyentes.add(fn)
  return () => oyentes.delete(fn)
}


if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === CLAVE || e.key === null) {
      cache = null
      oyentes.forEach((fn) => fn())
    }
  })
}

export function useProductos() {
  return useSyncExternalStore(suscribir, obtenerProductos)
}

// ── Consultas ────────────────────────────────────────────────────────────────

export function obtenerProductoPorId(id) {
  return obtenerProductos().find((p) => p.id === id) ?? null
}


export function obtenerProductosStockBajo() {
  return obtenerProductos().filter((p) => p.activo && p.stock <= STOCK_BAJO)
}

// ── Validación ───────────────────────────────────────────────────────────────

export function validarProducto(datos) {
  const errores = {}
  const nombre = String(datos.nombre ?? '').trim()
  const descripcion = String(datos.descripcion ?? '').trim()

  if (!nombre) errores.nombre = 'Escribí el nombre del producto.'
  else if (nombre.length > 80) errores.nombre = 'El nombre no puede superar 80 caracteres.'

  if (!descripcion) errores.descripcion = 'Escribí una descripción.'
  else if (descripcion.length > 300) errores.descripcion = 'La descripción no puede superar 300 caracteres.'

  const precio = Number(datos.precio)
  if (String(datos.precio ?? '') === '' || !Number.isInteger(precio) || precio <= 0) {
    errores.precio = 'El precio debe ser un número entero mayor que 0 (en colones).'
  }

  const stock = Number(datos.stock)
  if (String(datos.stock ?? '') === '' || !Number.isInteger(stock) || stock < 0) {
    errores.stock = 'El stock debe ser un número entero de 0 o más.'
  }

  if (!CATEGORIAS.includes(datos.categoria)) errores.categoria = 'Elegí una categoría.'
  if (!PROVEEDORES.includes(datos.proveedor)) errores.proveedor = 'Elegí un proveedor.'

  return errores
}

function normalizar(datos) {
  return {
    nombre: String(datos.nombre).trim(),
    descripcion: String(datos.descripcion).trim(),
    precio: Number(datos.precio),
    categoria: datos.categoria,
    proveedor: datos.proveedor,
    stock: Number(datos.stock),
    imagen: String(datos.imagen ?? '').trim(),
  }
}

function nuevoId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `p-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
}



export function crearProducto(datos) {
  const errores = validarProducto(datos)
  if (Object.keys(errores).length > 0) return { ok: false, errores }

  const ahora = new Date().toISOString()
  const producto = {
    id: nuevoId(),
    ...normalizar(datos),
    activo: true,
    creadoEn: ahora,
    actualizadoEn: ahora,
  }
  if (!guardar([...obtenerProductos(), producto])) return { ok: false, error: MSG_ALMACENAMIENTO }
  return { ok: true, producto }
}

export function actualizarProducto(id, datos) {
  const actual = obtenerProductoPorId(id)
  if (!actual) return { ok: false, error: 'El producto no existe.' }

  const errores = validarProducto(datos)
  if (Object.keys(errores).length > 0) return { ok: false, errores }

  const producto = { ...actual, ...normalizar(datos), actualizadoEn: new Date().toISOString() }
  const lista = obtenerProductos().map((p) => (p.id === id ? producto : p))
  if (!guardar(lista)) return { ok: false, error: MSG_ALMACENAMIENTO }
  return { ok: true, producto }
}


export function establecerActivo(id, activo) {
  const actual = obtenerProductoPorId(id)
  if (!actual) return { ok: false, error: 'El producto no existe.' }

  const producto = { ...actual, activo, actualizadoEn: new Date().toISOString() }
  const lista = obtenerProductos().map((p) => (p.id === id ? producto : p))
  if (!guardar(lista)) return { ok: false, error: MSG_ALMACENAMIENTO }
  return { ok: true, producto }
}

export function actualizarStock(id, valor) {
  const actual = obtenerProductoPorId(id)
  if (!actual) return { ok: false, error: 'El producto no existe.' }

  const stock = Number(valor)
  if (String(valor) === '' || !Number.isInteger(stock) || stock < 0) {
    return { ok: false, error: 'Escribí un número entero de 0 o más.' }
  }

  const producto = { ...actual, stock, actualizadoEn: new Date().toISOString() }
  const lista = obtenerProductos().map((p) => (p.id === id ? producto : p))
  if (!guardar(lista)) return { ok: false, error: MSG_ALMACENAMIENTO }
  return { ok: true, producto }
}


export function descontarStock(lineas) {
  const productos = obtenerProductos()
  const faltantes = lineas.filter((l) => {
    const p = productos.find((x) => x.id === l.productoId)
    return !p || !p.activo || p.stock < l.cantidad
  })
  if (faltantes.length > 0) return { ok: false, faltantes }

  const ahora = new Date().toISOString()
  const lista = productos.map((p) => {
    const linea = lineas.find((l) => l.productoId === p.id)
    return linea ? { ...p, stock: p.stock - linea.cantidad, actualizadoEn: ahora } : p
  })
  if (!guardar(lista)) return { ok: false, error: MSG_ALMACENAMIENTO }
  return { ok: true }
}
