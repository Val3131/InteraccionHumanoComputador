import { useMemo, useSyncExternalStore } from 'react'
import { obtenerProductos, useProductos } from '../productos/productosStore.js'

const PREFIJO = 'bb_carrito_'
const MSG_ALMACENAMIENTO = 'No se pudo guardar: el almacenamiento del navegador está lleno.'
const SIN_SESION = { ok: false, mensaje: 'Iniciá sesión para usar el carrito.' }
const CARRITO_VACIO = { usuarioId: null, creadoEn: null, actualizadoEn: null, items: [] }

const oyentes = new Set()
const cache = new Map()

function notificar() {
  oyentes.forEach((fn) => fn())
}

export function suscribir(fn) {
  oyentes.add(fn)
  return () => oyentes.delete(fn)
}

function cargar(clave, usuarioId) {
  try {
    const raw = localStorage.getItem(clave)
    if (raw) {
      const carrito = JSON.parse(raw)
      if (carrito && Array.isArray(carrito.items)) return carrito
    }
  } catch {
    
  }
  return { usuarioId, creadoEn: null, actualizadoEn: null, items: [] }
}

export function obtenerCarrito(usuarioId) {
  if (!usuarioId) return CARRITO_VACIO
  const clave = PREFIJO + usuarioId
  if (!cache.has(clave)) cache.set(clave, cargar(clave, usuarioId))
  return cache.get(clave)
}


if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === null) cache.clear()
    else if (e.key.startsWith(PREFIJO)) cache.delete(e.key)
    else return
    notificar()
  })
}

function guardarItems(usuarioId, actual, items) {
  const ahora = new Date().toISOString()
  const siguiente = {
    usuarioId,
    creadoEn: items.length === 0 ? null : (actual.creadoEn ?? ahora),
    actualizadoEn: items.length === 0 ? null : ahora,
    items,
  }
  try {
    localStorage.setItem(PREFIJO + usuarioId, JSON.stringify(siguiente))
  } catch {
    return false
  }
  cache.set(PREFIJO + usuarioId, siguiente)
  notificar()
  return true
}



export function agregarAlCarrito(usuarioId, productoId, cantidad = 1) {
  if (!usuarioId) return SIN_SESION

  const pedido = Number(cantidad)
  if (!Number.isInteger(pedido) || pedido < 1) {
    return { ok: false, mensaje: 'La cantidad debe ser al menos 1.' }
  }

  const producto = obtenerProductos().find((p) => p.id === productoId)
  if (!producto || !producto.activo) {
    return { ok: false, mensaje: 'Este producto ya no está disponible.' }
  }
  if (producto.stock < 1) {
    return { ok: false, mensaje: `«${producto.nombre}» está agotado.` }
  }

  const actual = obtenerCarrito(usuarioId)
  const existente = actual.items.find((i) => i.productoId === productoId)
  const enCarrito = existente ? existente.cantidad : 0
  const disponible = producto.stock - enCarrito
  if (disponible < 1) {
    return {
      ok: false,
      mensaje: `Ya tenés en el carrito todas las unidades disponibles de «${producto.nombre}» (${producto.stock}).`,
    }
  }

  const agregar = Math.min(pedido, disponible)
  const items = existente
    ? actual.items.map((i) =>
        i.productoId === productoId ? { ...i, cantidad: i.cantidad + agregar } : i,
      )
    : [...actual.items, { productoId, cantidad: agregar }]

  if (!guardarItems(usuarioId, actual, items)) return { ok: false, mensaje: MSG_ALMACENAMIENTO }

  if (agregar < pedido) {
    return {
      ok: true,
      ajustado: true,
      mensaje: `Agregamos ${agregar} unidad(es) de «${producto.nombre}»: es todo lo que hay disponible.`,
    }
  }
  return { ok: true, mensaje: `«${producto.nombre}» se agregó al carrito.` }
}

export function cambiarCantidad(usuarioId, productoId, cantidad) {
  if (!usuarioId) return SIN_SESION

  const pedido = Number(cantidad)
  if (!Number.isInteger(pedido)) return { ok: false, mensaje: 'Cantidad no válida.' }
  if (pedido < 1) return quitarDelCarrito(usuarioId, productoId)

  const producto = obtenerProductos().find((p) => p.id === productoId)
  if (!producto || !producto.activo || producto.stock < 1) {
    return { ok: false, mensaje: 'Este producto ya no está disponible. Quitalo del carrito.' }
  }

  const actual = obtenerCarrito(usuarioId)
  if (!actual.items.some((i) => i.productoId === productoId)) {
    return { ok: false, mensaje: 'Ese producto no está en tu carrito.' }
  }

  const final = Math.min(pedido, producto.stock)
  const items = actual.items.map((i) => (i.productoId === productoId ? { ...i, cantidad: final } : i))
  if (!guardarItems(usuarioId, actual, items)) return { ok: false, mensaje: MSG_ALMACENAMIENTO }

  if (final < pedido) {
    return {
      ok: true,
      ajustado: true,
      mensaje: `Solo hay ${producto.stock} unidad(es) de «${producto.nombre}».`,
    }
  }
  return { ok: true }
}

export function quitarDelCarrito(usuarioId, productoId) {
  if (!usuarioId) return SIN_SESION

  const actual = obtenerCarrito(usuarioId)
  const items = actual.items.filter((i) => i.productoId !== productoId)
  if (!guardarItems(usuarioId, actual, items)) return { ok: false, mensaje: MSG_ALMACENAMIENTO }
  return { ok: true, mensaje: 'Producto quitado del carrito.' }
}

// Para Pagos (Persona 3): llamar cuando la compra se confirma.
export function vaciarCarrito(usuarioId) {
  if (!usuarioId) return SIN_SESION

  if (!guardarItems(usuarioId, obtenerCarrito(usuarioId), [])) {
    return { ok: false, mensaje: MSG_ALMACENAMIENTO }
  }
  return { ok: true, mensaje: 'Carrito vacío.' }
}



export function calcularResumen(carrito, productos) {
  const lineas = carrito.items.map((item) => {
    const producto = productos.find((p) => p.id === item.productoId) ?? null
    let estado = 'ok'
    if (!producto || !producto.activo) estado = 'no_disponible'
    else if (producto.stock < 1) estado = 'sin_stock'
    else if (item.cantidad > producto.stock) estado = 'stock_insuficiente'

    return {
      productoId: item.productoId,
      producto,
      cantidad: item.cantidad,
      subtotal: producto ? producto.precio * item.cantidad : 0,
      estado,
    }
  })

  const validas = lineas.filter((l) => l.estado === 'ok')
  const problemas = lineas.filter((l) => l.estado !== 'ok')

  return {
    usuarioId: carrito.usuarioId,
    creadoEn: carrito.creadoEn,
    actualizadoEn: carrito.actualizadoEn,
    lineas,
    subtotal: validas.reduce((suma, l) => suma + l.subtotal, 0),
    cantidadArticulos: validas.reduce((suma, l) => suma + l.cantidad, 0),
    problemas,
    puedePagar: lineas.length > 0 && problemas.length === 0,
  }
}


export function obtenerResumenCarrito(usuarioId) {
  return calcularResumen(obtenerCarrito(usuarioId), obtenerProductos())
}

export function useCarrito(usuarioId) {
  const carrito = useSyncExternalStore(suscribir, () => obtenerCarrito(usuarioId))
  const productos = useProductos()
  return useMemo(() => calcularResumen(carrito, productos), [carrito, productos])
}

export function useCantidadEnCarrito(usuarioId) {
  const carrito = useSyncExternalStore(suscribir, () => obtenerCarrito(usuarioId))
  return carrito.items.reduce((suma, i) => suma + i.cantidad, 0)
}
