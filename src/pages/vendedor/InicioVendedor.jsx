
import { useAuth } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

export default function InicioVendedor({ onMiPerfil }) {
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

  <button type="button" onClick={cerrarSesion}>
    Cerrar sesión
  </button>
</div>

      </header>

      <section className="dashboard-contenido">
        <span className="dashboard-etiqueta">
          Panel de vendedor
        </span>

        <h2>Bienvenido, {usuario.nombre}</h2>
        <p>
          Administrá los productos y las operaciones
          asignadas a tu rol.
        </p>

        <div className="dashboard-grid">
          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Productos</h3>
            <p>Consultá y actualizá productos.</p>
          </article>

          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Inventario</h3>
            <p>Revisá las existencias disponibles.</p>
          </article>

          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Atención al cliente</h3>
            <p>Consultá las solicitudes recibidas.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
