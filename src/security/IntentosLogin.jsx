
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./IntentosLogin.css";

export default function IntentosLogin({ onVolver }) {
  const { usuario, intentosLogin } = useAuth();
  const [filtro, setFiltro] = useState("todos");
  const [busqueda, setBusqueda] = useState("");

  // Restricción de navegación para la demostración.
  if (usuario?.rol !== "administrador") {
    return (
      <main className="intentos-page">
        <div className="intentos-contenido">
          <h2>Acceso no permitido</h2>
          <button onClick={onVolver}>
            Volver
          </button>
        </div>
      </main>
    );
  }

  const registrosFiltrados = intentosLogin.filter(
    (intento) => {
      const coincideFiltro =
        filtro === "todos" ||
        intento.resultado === filtro;

      const coincideBusqueda = intento.correo
        .toLowerCase()
        .includes(busqueda.trim().toLowerCase());

      return coincideFiltro && coincideBusqueda;
    }
  );

  const exitosos = intentosLogin.filter(
    (i) => i.resultado === "exitoso"
  ).length;

  const fallidos = intentosLogin.filter(
    (i) => i.resultado === "fallido"
  ).length;

  return (
    <main className="intentos-page">
      <header className="intentos-header">
        <h1>BellasBotique</h1>

        <button type="button" onClick={onVolver}>
          Volver al panel
        </button>
      </header>

      <section className="intentos-contenido">
        <span className="intentos-etiqueta">
          Seguridad del sistema
        </span>

        <h2>Intentos de inicio de sesión</h2>

        <p className="intentos-descripcion">
          Consultá los accesos de demostración
          y los intentos registrados durante esta sesión.
        </p>

        <div className="intentos-estadisticas">
          <article>
            <span>Total de intentos</span>
            <strong>{intentosLogin.length}</strong>
          </article>

          <article>
            <span>Accesos de demostración exitosos</span>
            <strong>{exitosos}</strong>
          </article>

          <article>
            <span>Intentos no autenticados</span>
            <strong>{fallidos}</strong>
          </article>
        </div>

        <section className="intentos-panel">
          <div className="intentos-filtros">
            <input
              type="search"
              placeholder="Buscar por correo..."
              aria-label="Buscar por correo"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />

            <select
              value={filtro}
              onChange={(e) =>
                setFiltro(e.target.value)
              }
              aria-label="Filtrar resultados"
            >
              <option value="todos">
                Todos los resultados
              </option>
              <option value="exitoso">
                Exitosos
              </option>
              <option value="fallido">
                Fallidos
              </option>
            </select>
          </div>

          <div className="intentos-tabla-contenedor">
            <table className="intentos-tabla">
              <thead>
                <tr>
                  <th>Fecha y hora</th>
                  <th>Correo</th>
                  <th>Resultado</th>
                  <th>Motivo</th>
                </tr>
              </thead>

              <tbody>
                {registrosFiltrados.map((intento) => (
                  <tr key={intento.id}>
                    <td>
                      {new Date(
                        intento.fecha
                      ).toLocaleString("es-CR")}
                    </td>

                    <td>{intento.correo}</td>

                    <td>
                      <span
                        className={
                          intento.resultado === "exitoso"
                            ? "intentos-estado exitoso"
                            : "intentos-estado fallido"
                        }
                      >
                        {intento.resultado}
                      </span>
                    </td>

                    <td>{intento.motivo}</td>
                  </tr>
                ))}

                {registrosFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="intentos-vacio"
                    >
                      No hay intentos que coincidan
                      con los filtros seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="intentos-nota">
            Registros temporales de demostración.
            Se perderán al recargar la aplicación.
          </p>
        </section>
      </section>
    </main>
  );
}
