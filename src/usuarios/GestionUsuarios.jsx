
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./GestionUsuarios.css";

const rolesPermitidos = [
  "cliente",
  "vendedor",
  "administrador",
];

export default function GestionUsuarios({ onVolver }) {
  const {
    usuario,
    usuarios,
    actualizarRolUsuario,
    actualizarEstadoUsuario,
  } = useAuth();

  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

  const [edicion, setEdicion] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");

  const comenzarEdicion = (cuenta) => {
    setEdicion({
      id: cuenta.id,
      rolNuevo: cuenta.rol,
    });

    setMensaje("");
  };

  const cambiarRolSeleccionado = (nuevoRol) => {
    setEdicion((anterior) =>
      anterior
        ? { ...anterior, rolNuevo: nuevoRol }
        : anterior
    );
  };

  const cancelarEdicion = () => {
    setEdicion(null);
    setMensaje("");
  };

  const guardarRol = () => {
    if (!edicion) return;

    if (!rolesPermitidos.includes(edicion.rolNuevo)) {
      setTipoMensaje("error");
      setMensaje("Seleccioná un rol válido.");
      return;
    }

    const resultado = actualizarRolUsuario(
      edicion.id,
      edicion.rolNuevo
    );

    setMensaje(resultado.mensaje);
    setTipoMensaje(resultado.exito ? "exito" : "error");

    if (resultado.exito) {
      setEdicion(null);

      // Evita que el filtro oculte la cuenta
      // después de cambiar su rol.
      setFiltroRol("todos");
      setBusqueda("");
    } else if (
      resultado.mensaje === "No se realizaron cambios."
    ) {
      setEdicion(null);
    }
  };

  const cambiarEstado = (cuenta) => {
    const resultado = actualizarEstadoUsuario(cuenta.id);

    setMensaje(resultado.mensaje);
    setTipoMensaje(resultado.exito ? "exito" : "error");
  };

  if (usuario?.rol !== "administrador") {
    return (
      <main className="gestion-usuarios">
        <section className="gestion-contenido">
          <h2>Acceso no permitido</h2>
          <p>
            Esta sección es exclusiva del administrador.
          </p>

          <button type="button" onClick={onVolver}>
            Volver al panel
          </button>
        </section>
      </main>
    );
  }

  const usuariosFiltrados = usuarios.filter((cuenta) => {
    const texto = busqueda.trim().toLowerCase();

    const nombreCompleto = [
      cuenta.nombre,
      cuenta.apellidos,
    ]
      .filter(Boolean)
      .join(" ");

    const coincideBusqueda =
      nombreCompleto.toLowerCase().includes(texto) ||
      cuenta.correo.toLowerCase().includes(texto);

    const coincideRol =
      filtroRol === "todos" ||
      cuenta.rol === filtroRol;

    return coincideBusqueda && coincideRol;
  });

  const activos = usuarios.filter(
    (cuenta) => cuenta.estado === "activo"
  ).length;

  const registrados = usuarios.filter(
    (cuenta) => cuenta.origen === "registro"
  ).length;

  return (
    <main className="gestion-usuarios">
      <header className="gestion-header">
        <h1>BellasBotique</h1>

        <button type="button" onClick={onVolver}>
          Volver al panel
        </button>
      </header>

      <section className="gestion-contenido">
        <div className="gestion-encabezado">
          <div>
            <span className="gestion-etiqueta">
              Administración
            </span>

            <h2>Gestión de usuarios</h2>

            <p>
              Consultá y administrá las cuentas
              registradas en BellasBotique.
            </p>
          </div>
        </div>

        <div className="gestion-estadisticas">
          <div className="gestion-estadistica">
            <span>Total de usuarios</span>
            <strong>{usuarios.length}</strong>
          </div>

          <div className="gestion-estadistica">
            <span>Usuarios activos</span>
            <strong>{activos}</strong>
          </div>

          <div className="gestion-estadistica">
            <span>Usuarios inactivos</span>
            <strong>{usuarios.length - activos}</strong>
          </div>
        </div>

        <div className="gestion-panel">
          <p
            style={{
              fontSize: "13px",
              color: "#8B5E5E",
              marginBottom: "20px",
            }}
          >
            Clientes nuevos registrados en esta sesión:{" "}
            <strong>{registrados}</strong>
          </p>

          <div className="gestion-filtros">
            <input
              type="search"
              placeholder="Buscar por nombre o correo..."
              aria-label="Buscar usuarios"
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />

            <select
              aria-label="Filtrar por rol"
              value={filtroRol}
              onChange={(e) =>
                setFiltroRol(e.target.value)
              }
            >
              <option value="todos">
                Todos los roles
              </option>
              <option value="cliente">
                Clientes
              </option>
              <option value="vendedor">
                Vendedores
              </option>
              <option value="administrador">
                Administradores
              </option>
            </select>
          </div>

          {mensaje && (
            <p
              className="gestion-mensaje"
              role="status"
              style={{
                color:
                  tipoMensaje === "error"
                    ? "#A23B3B"
                    : "#26743C",
              }}
            >
              {mensaje}
            </p>
          )}

          <div className="gestion-tabla-contenedor">
            <table className="gestion-tabla">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuariosFiltrados.map((cuenta) => {
                  const estaEditando =
                    edicion?.id === cuenta.id;

                  const nombreCompleto = [
                    cuenta.nombre,
                    cuenta.apellidos,
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <tr key={cuenta.id}>
                      <td>
                        {nombreCompleto}

                        {cuenta.origen === "registro" && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "11px",
                              color: "#8B5E5E",
                              marginTop: "5px",
                            }}
                          >
                            Nuevo registro
                          </span>
                        )}
                      </td>

                      <td>{cuenta.correo}</td>

                      <td>
                        {estaEditando ? (
                          <select
                            aria-label={`Rol de ${nombreCompleto}`}
                            value={edicion.rolNuevo}
                            onChange={(e) =>
                              cambiarRolSeleccionado(
                                e.target.value
                              )
                            }
                          >
                            <option value="cliente">
                              Cliente
                            </option>
                            <option value="vendedor">
                              Vendedor
                            </option>
                            <option value="administrador">
                              Administrador
                            </option>
                          </select>
                        ) : (
                          <span className="gestion-rol">
                            {cuenta.rol}
                          </span>
                        )}
                      </td>

                      <td>
                        <span
                          className={
                            cuenta.estado === "activo"
                              ? "gestion-estado activo"
                              : "gestion-estado inactivo"
                          }
                        >
                          {cuenta.estado}
                        </span>
                      </td>

                      <td>
                        <div className="gestion-acciones">
                          {estaEditando ? (
                            <>
                              <button
                                type="button"
                                className="gestion-editar"
                                onClick={guardarRol}
                              >
                                Guardar
                              </button>

                              <button
                                type="button"
                                className="gestion-estado-boton"
                                onClick={cancelarEdicion}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="gestion-editar"
                                disabled={edicion !== null}
                                onClick={() =>
                                  comenzarEdicion(cuenta)
                                }
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                className="gestion-estado-boton"
                                disabled={edicion !== null}
                                onClick={() =>
                                  cambiarEstado(cuenta)
                                }
                              >
                                {cuenta.estado === "activo"
                                  ? "Desactivar"
                                  : "Activar"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {usuariosFiltrados.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="gestion-sin-datos"
                    >
                      No se encontraron usuarios.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p
            style={{
              color: "#777777",
              fontSize: "12px",
              marginTop: "20px",
            }}
          >
            Los usuarios de ejemplo no tienen
            credenciales para iniciar sesión.
            Las cuentas nuevas se conservan
            únicamente en memoria durante
            esta demostración.
          </p>
        </div>
      </section>
    </main>
  );
}
