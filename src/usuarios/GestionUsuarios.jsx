
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./GestionUsuarios.css";

const CLAVE_USUARIOS = "bellasbotique_usuarios_demo";

const usuariosIniciales = [
  {
    id: 1,
    nombre: "María González",
    correo: "maria@ejemplo.com",
    rol: "cliente",
    estado: "activo",
  },
  {
    id: 2,
    nombre: "Andrea López",
    correo: "andrea@ejemplo.com",
    rol: "vendedor",
    estado: "activo",
  },
  {
    id: 3,
    nombre: "Carlos Méndez",
    correo: "carlos@ejemplo.com",
    rol: "cliente",
    estado: "inactivo",
  },
  {
    id: 4,
    nombre: "Sofía Rodríguez",
    correo: "sofia@ejemplo.com",
    rol: "administrador",
    estado: "activo",
  },
];

const rolesPermitidos = [
  "cliente",
  "vendedor",
  "administrador",
];

function cargarUsuarios() {
  try {
    const guardados = sessionStorage.getItem(CLAVE_USUARIOS);

    if (guardados) {
      const datos = JSON.parse(guardados);

      if (
        Array.isArray(datos) &&
        datos.every(
          (u) =>
            u.id != null &&
            typeof u.nombre === "string" &&
            typeof u.correo === "string" &&
            rolesPermitidos.includes(u.rol) &&
            ["activo", "inactivo"].includes(u.estado)
        )
      ) {
        return datos;
      }
    }
  } catch (error) {
    console.error("Error leyendo usuarios:", error);
  }

  return usuariosIniciales.map((u) => ({ ...u }));
}

export default function GestionUsuarios({ onVolver }) {
  const { usuario, registrarActividad } = useAuth();

  const [usuarios, setUsuarios] = useState(cargarUsuarios);
  const [busqueda, setBusqueda] = useState("");
  const [filtroRol, setFiltroRol] = useState("todos");

  // Datos del usuario que se está editando.
  const [edicion, setEdicion] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const guardarUsuarios = (nuevosUsuarios) => {
    setUsuarios(nuevosUsuarios);

    try {
      sessionStorage.setItem(
        CLAVE_USUARIOS,
        JSON.stringify(nuevosUsuarios)
      );
    } catch (error) {
      console.error("Error guardando usuarios:", error);
    }
  };

  const comenzarEdicion = (cuenta) => {
    setEdicion({
      id: cuenta.id,
      rolOriginal: cuenta.rol,
      rolNuevo: cuenta.rol,
    });

    setMensaje("");
  };

  const cambiarRolSeleccionado = (nuevoRol) => {
    setEdicion((anterior) => {
      if (!anterior) return null;

      return {
        ...anterior,
        rolNuevo: nuevoRol,
      };
    });
  };

  const cancelarEdicion = () => {
    setEdicion(null);
    setMensaje("");
  };

  const guardarRol = () => {
    if (usuario?.rol !== "administrador") return;
    if (!edicion) return;

    const cuenta = usuarios.find(
      (u) => u.id === edicion.id
    );

    if (!cuenta) {
      setMensaje("No se encontró el usuario.");
      return;
    }

    const nuevoRol = edicion.rolNuevo;

    if (!rolesPermitidos.includes(nuevoRol)) {
      setMensaje("Seleccioná un rol válido.");
      return;
    }

    if (cuenta.rol === nuevoRol) {
      setMensaje("No se realizaron cambios en el rol.");
      setEdicion(null);
      return;
    }

    const rolAnterior = cuenta.rol;

    // Crear una lista nueva con el rol actualizado.
    const usuariosActualizados = usuarios.map((u) => {
      if (u.id === cuenta.id) {
        return {
          ...u,
          rol: nuevoRol,
        };
      }

      return u;
    });

    // Guardar el resultado en React y sessionStorage.
    guardarUsuarios(usuariosActualizados);

    // Registrar el cambio en la bitácora.
    registrarActividad({
      actor: usuario,
      tipo: "usuarios",
      accion: "Cambio de rol",
      detalle:
        `${cuenta.nombre} (${cuenta.correo}): ` +
        `${rolAnterior} → ${nuevoRol}`,
    });

    // Mostrar todos los roles para no ocultar
    // al usuario que acabamos de modificar.
    setFiltroRol("todos");
    setBusqueda("");

    setEdicion(null);

    setMensaje(
      `¡Rol actualizado! ${cuenta.nombre} cambió ` +
      `de ${rolAnterior} a ${nuevoRol}. ` +
      "El cambio fue registrado en la bitácora."
    );
  };

  const cambiarEstado = (cuenta) => {
    if (usuario?.rol !== "administrador") return;

    const nuevoEstado =
      cuenta.estado === "activo" ? "inactivo" : "activo";

    const usuariosActualizados = usuarios.map((u) =>
      u.id === cuenta.id
        ? { ...u, estado: nuevoEstado }
        : u
    );

    guardarUsuarios(usuariosActualizados);

    registrarActividad({
      actor: usuario,
      tipo: "usuarios",
      accion: "Cambio de estado",
      detalle:
        `${cuenta.nombre} (${cuenta.correo}): ` +
        `${cuenta.estado} → ${nuevoEstado}`,
    });

    setMensaje(
      `La cuenta de ${cuenta.nombre} ahora está ${nuevoEstado}.`
    );
  };

  const usuariosFiltrados = usuarios.filter((cuenta) => {
    const texto = busqueda.trim().toLowerCase();

    const coincideBusqueda =
      cuenta.nombre.toLowerCase().includes(texto) ||
      cuenta.correo.toLowerCase().includes(texto);

    const coincideRol =
      filtroRol === "todos" || cuenta.rol === filtroRol;

    return coincideBusqueda && coincideRol;
  });

  const activos = usuarios.filter(
    (u) => u.estado === "activo"
  ).length;

  if (usuario?.rol !== "administrador") {
    return (
      <main className="gestion-usuarios">
        <section className="gestion-contenido">
          <h2>Acceso no permitido</h2>
          <button type="button" onClick={onVolver}>
            Volver al panel
          </button>
        </section>
      </main>
    );
  }

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
          <span className="gestion-etiqueta">
            Administración
          </span>

          <h2>Gestión de usuarios</h2>

          <p>
            Consultá y administrá las cuentas
            de BellasBotique.
          </p>
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
            <p className="gestion-mensaje" role="status">
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

                  return (
                    <tr key={cuenta.id}>
                      <td>{cuenta.nombre}</td>
                      <td>{cuenta.correo}</td>

                      <td>
                        {estaEditando ? (
                          <select
                            aria-label={`Rol de ${cuenta.nombre}`}
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
                                onClick={() =>
                                  comenzarEdicion(cuenta)
                                }
                                disabled={edicion !== null}
                              >
                                Editar
                              </button>

                              <button
                                type="button"
                                className="gestion-estado-boton"
                                onClick={() =>
                                  cambiarEstado(cuenta)
                                }
                                disabled={edicion !== null}
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
        </div>
      </section>
    </main>
  );
}
