
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./BitacoraActividades.css";

export default function BitacoraActividades({ onVolver }) {
  const { usuario, actividades } = useAuth();

  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  if (usuario?.rol !== "administrador") {
    return (
      <main className="bitacora-page">
        <section className="bitacora-contenido">
          <h2>Acceso no permitido</h2>
          <p>Esta sección es exclusiva del administrador.</p>
          <button onClick={onVolver}>
            Volver al panel
          </button>
        </section>
      </main>
    );
  }

  const registros = actividades.filter((actividad) => {
    const texto = busqueda.trim().toLowerCase();

    const coincideBusqueda = [
      actividad.usuario,
      actividad.accion,
      actividad.detalle,
      actividad.rol,
    ].some((valor) =>
      String(valor).toLowerCase().includes(texto)
    );

    const coincideFiltro =
      filtro === "todos" || actividad.tipo === filtro;

    return coincideBusqueda && coincideFiltro;
  });

  const sesiones = actividades.filter(
    (actividad) => actividad.tipo === "sesion"
  ).length;

  const modificaciones = actividades.filter(
    (actividad) =>
      actividad.tipo === "perfil" ||
      actividad.tipo === "usuarios"
  ).length;

  return (
    <main className="bitacora-page">
      <header className="bitacora-header">
        <h1>BellasBotique</h1>
        <button type="button" onClick={onVolver}>
          Volver al panel
        </button>
      </header>

      <section className="bitacora-contenido">
        <span className="bitacora-etiqueta">
          Auditoría del sistema
        </span>

        <h2>Bitácora de actividades</h2>

        <p className="bitacora-descripcion">
          Consultá las acciones realizadas durante
          las pruebas de BellasBotique.
        </p>

        <div className="bitacora-estadisticas">
          <article>
            <span>Total de actividades</span>
            <strong>{actividades.length}</strong>
          </article>

          <article>
            <span>Eventos de sesión</span>
            <strong>{sesiones}</strong>
          </article>

          <article>
            <span>Modificaciones</span>
            <strong>{modificaciones}</strong>
          </article>
        </div>

        <div className="bitacora-panel">
          <div className="bitacora-filtros">
            <input
              type="search"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
              placeholder="Buscar actividad o usuario..."
              aria-label="Buscar actividades"
            />

            <select
              value={filtro}
              onChange={(e) =>
                setFiltro(e.target.value)
              }
              aria-label="Filtrar actividades"
            >
              <option value="todos">
                Todas las actividades
              </option>
              <option value="sesion">
                Sesiones
              </option>
              <option value="perfil">
                Perfiles
              </option>
              <option value="usuarios">
                Gestión de usuarios
              </option>
            </select>
          </div>

          <div className="bitacora-tabla-contenedor">
            <table className="bitacora-tabla">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Usuario</th>
                  <th>Tipo</th>
                  <th>Acción</th>
                  <th>Detalle</th>
                </tr>
              </thead>

              <tbody>
                {registros.map((actividad) => (
                  <tr key={actividad.id}>
                    <td>
                      {new Date(
                        actividad.fecha
                      ).toLocaleString("es-CR")}
                    </td>

                    <td>{actividad.usuario}</td>

                    <td>
                      <span
                        className={
                          "bitacora-tipo " + actividad.tipo
                        }
                      >
                        {actividad.tipo === "sesion"
                          ? "Sesión"
                          : actividad.tipo === "perfil"
                            ? "Perfil"
                            : "Usuarios"}
                      </span>
                    </td>

                    <td>{actividad.accion}</td>
                    <td>{actividad.detalle}</td>
                  </tr>
                ))}

                {registros.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="bitacora-sin-datos"
                    >
                      No hay actividades que coincidan
                      con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="bitacora-nota">
            Bitácora temporal de demostración.
            Los registros se pierden al recargar la página.
            No se almacenan contraseñas.
          </p>
        </div>
      </section>
    </main>
  );
}
