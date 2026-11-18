
import { useAuth } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

export default function InicioCliente({ onMiPerfil }) {
  const { usuario, cerrarSesion } = useAuth();

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1>BellasBotique</h1>

        <div className="dashboard-header-acciones">
          <button
            type="button"
            className="dashboard-perfil-boton"
            onClick={onMiPerfil}
          >
            Mi perfil
          </button>

          <button
            type="button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-contenido">
        <span className="dashboard-etiqueta">
          Área de clientes
        </span>

        <h2>¡Bienvenida a BellasBotique!</h2>

        <p>
          Hola, {usuario.nombre}. Descubrí nuestras
          colecciones y encontrá tu estilo favorito.
        </p>

        <div className="dashboard-grid">
          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Catálogo</h3>
            <p>
              Explorá nuestra colección de productos.
            </p>
          </article>

          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Carrito</h3>
            <p>
              Revisá los productos seleccionados.
            </p>
          </article>

          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Mis compras</h3>
            <p>
              Consultá tus compras y facturas.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

