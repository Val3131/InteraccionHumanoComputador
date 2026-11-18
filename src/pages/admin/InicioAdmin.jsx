
import { useAuth } from "../../context/AuthContext";
import "../../styles/Dashboard.css";

export default function InicioAdmin({
  onGestionUsuarios,
  onMiPerfil,
  onIntentosLogin,
  onBitacora,
}) {
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
            onClick={() => cerrarSesion()}
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <section className="dashboard-contenido">
        <span className="dashboard-etiqueta">
          Panel administrativo
        </span>

        <h2>Bienvenido, {usuario.nombre}</h2>

        <p>
          Administrá las operaciones principales
          de BellasBotique.
        </p>

        <div className="dashboard-grid">
          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Gestión de usuarios</h3>
            <p>Administrá cuentas, roles y estados.</p>

            <button
              type="button"
              className="dashboard-abrir"
              onClick={onGestionUsuarios}
            >
              Administrar usuarios
            </button>
          </article>

          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Gestión de productos</h3>
            <p>Supervisá productos e inventario.</p>
          </article>

          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Reportes y ventas</h3>
            <p>Consultá los resultados de la boutique.</p>
          </article>

          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Intentos de Login</h3>
            <p>
              Revisá los intentos registrados
              durante las pruebas.
            </p>

            <button
              type="button"
              className="dashboard-abrir"
              onClick={onIntentosLogin}
            >
              Ver intentos
            </button>
          </article>

          <article className="dashboard-tarjeta">
            <span>♡</span>
            <h3>Bitácora de actividades</h3>
            <p>
              Consultá los eventos de sesión,
              cambios de perfiles y administración
              de usuarios.
            </p>

            <button
              type="button"
              className="dashboard-abrir"
              onClick={onBitacora}
            >
              Ver bitácora
            </button>
          </article>
        </div>
      </section>
    </main>
  );
}



