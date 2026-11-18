import { useState } from 'react'
import { useAviso } from '../components/useAviso.js'
import { useAuth } from '../context/AuthContext'
import AdminProductosPage from './AdminProductosPage.jsx'
import { puedeGestionarProductos } from './permisos.js'
import ProductoFormPage from './ProductoFormPage.jsx'
import TiendaCabecera from './TiendaCabecera.jsx'
import '../styles/Tienda.css'
import './productos.css'


export default function GestionProductos({ onVolver }) {
  const { usuario } = useAuth()
  const [vista, setVista] = useState({ tipo: 'lista' })
  const [aviso, setAviso] = useAviso()

  if (!puedeGestionarProductos(usuario)) {
    return (
      <main className="bb-tienda">
        <TiendaCabecera onVolver={onVolver} />
        <section className="tienda-contenido pagina-estrecha">
          <h1>Acceso restringido</h1>
          <p>Esta sección es exclusiva del personal administrador y de ventas.</p>
        </section>
      </main>
    )
  }

  return (
    <main className="bb-tienda">
      <TiendaCabecera onVolver={onVolver} />

      <div className="tienda-contenido">
        {vista.tipo === 'lista' ? (
          <AdminProductosPage
            aviso={aviso}
            setAviso={setAviso}
            onNuevo={() => setVista({ tipo: 'nuevo' })}
            onEditar={(id) => setVista({ tipo: 'editar', id })}
          />
        ) : (
          <ProductoFormPage
            key={vista.id ?? 'nuevo'}
            id={vista.id}
            onTerminar={(resultado) => {
              if (resultado) setAviso(resultado)
              setVista({ tipo: 'lista' })
            }}
          />
        )}
      </div>
    </main>
  )
}
