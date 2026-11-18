export const CATEGORIAS = ['Vestidos', 'Blusas', 'Pantalones', 'Calzado', 'Accesorios']
export const PROVEEDORES = ['Moda Tica', 'Estilo Latino', 'Boutique Importados']


export const STOCK_BAJO = 5

export function estadoStock(stock) {
  if (stock <= 0) return 'agotado'
  if (stock <= STOCK_BAJO) return 'bajo'
  return 'disponible'
}

const FECHA_INICIAL = '2026-11-01T08:00:00.000Z'

const base = [
  ['p-001', 'Vestido floral', 'Vestido de tela ligera con estampado floral, ideal para el día.', 28500, 'Vestidos', 'Moda Tica', 12],
  ['p-002', 'Vestido negro de cóctel', 'Corte entallado con tela elástica y cierre oculto. Perfecto para eventos.', 36900, 'Vestidos', 'Estilo Latino', 4],
  ['p-003', 'Blusa de lino blanca', 'Blusa fresca de lino con mangas amplias y botones de nácar.', 15900, 'Blusas', 'Moda Tica', 20],
  ['p-004', 'Blusa satinada rosa', 'Blusa satinada de caída suave, cuello en V y mangas largas.', 17500, 'Blusas', 'Boutique Importados', 9],
  ['p-005', 'Pantalón palazzo', 'Pantalón de pierna ancha y cintura alta, cómodo y elegante.', 22000, 'Pantalones', 'Estilo Latino', 7],
  ['p-006', 'Jeans de tiro alto', 'Jeans rectos de mezclilla con elastano y tiro alto.', 25900, 'Pantalones', 'Moda Tica', 15],
  ['p-007', 'Sandalias de tacón bajo', 'Sandalias con correa al tobillo y tacón de 4 cm.', 19900, 'Calzado', 'Boutique Importados', 0],
  ['p-008', 'Bolso de mano beige', 'Bolso estructurado con cierre dorado y asa desmontable.', 21500, 'Accesorios', 'Boutique Importados', 6],
  ['p-009', 'Collar de perlas', 'Collar de perlas cultivadas con broche plateado.', 9500, 'Accesorios', 'Estilo Latino', 3],
]

export const PRODUCTOS_INICIALES = base.map(
  ([id, nombre, descripcion, precio, categoria, proveedor, stock]) => ({
    id,
    nombre,
    descripcion,
    precio,
    categoria,
    proveedor,
    stock,
    imagen: '',
    activo: true,
    creadoEn: FECHA_INICIAL,
    actualizadoEn: FECHA_INICIAL,
  }),
)
