export const ROLES_GESTION_PRODUCTOS = ['administrador', 'vendedor']
export const ROL_COMPRADOR = 'cliente'

export function puedeGestionarProductos(usuario) {
  return Boolean(usuario) && ROLES_GESTION_PRODUCTOS.includes(usuario.rol)
}

export function puedeComprar(usuario) {
  return Boolean(usuario) && usuario.rol === ROL_COMPRADOR
}
