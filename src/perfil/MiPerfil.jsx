
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./MiPerfil.css";

export default function MiPerfil({ onVolver }) {
  const { usuario, actualizarPerfil } = useAuth();

  const [datos, setDatos] = useState({
    nombre: usuario.nombre || "",
    apellidos: usuario.apellidos || "",
    telefono: usuario.telefono || "",
    direccion: usuario.direccion || "",
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const cambiarDato = (e) => {
    const { name, value } = e.target;

    setDatos((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setErrores((anterior) => ({
      ...anterior,
      [name]: "",
    }));

    setMensaje("");
  };

  const guardarPerfil = (e) => {
    e.preventDefault();

    const nuevosErrores = {};

    if (datos.nombre.trim().length < 2) {
      nuevosErrores.nombre =
        "Ingresá un nombre válido.";
    }

    if (datos.apellidos.trim().length < 2) {
      nuevosErrores.apellidos =
        "Ingresá tus apellidos.";
    }

    const telefono = datos.telefono.replace(
      /[\s-]/g,
      ""
    );

    if (!/^\d{8}$/.test(telefono)) {
      nuevosErrores.telefono =
        "El teléfono debe contener 8 dígitos.";
    }

    if (datos.direccion.trim().length < 10) {
      nuevosErrores.direccion =
        "Ingresá una dirección más detallada.";
    }

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje("");
      return;
    }

    const actualizado = actualizarPerfil({
      nombre: datos.nombre,
      apellidos: datos.apellidos,
      telefono,
      direccion: datos.direccion,
    });

    if (actualizado) {
      setDatos((anterior) => ({
        ...anterior,
        telefono,
      }));

      setMensaje(
        "¡Tus datos se actualizaron correctamente!"
      );
    }
  };

  return (
    <main className="perfil-page">
      <header className="perfil-header">
        <h1>BellasBotique</h1>

        <button type="button" onClick={onVolver}>
          Volver al panel
        </button>
      </header>

      <section className="perfil-contenido">
        <div className="perfil-card">
          <div className="perfil-titulo">
            <div className="perfil-avatar">♡</div>

            <h2>Mi Perfil</h2>

            <p>
              Consultá y actualizá tu información personal.
            </p>
          </div>

          <form onSubmit={guardarPerfil} noValidate>
            <div className="perfil-grid">
              <div className="perfil-campo">
                <label htmlFor="perfil-id">
                  Identificador
                </label>
                <input
                  id="perfil-id"
                  value={usuario.id}
                  disabled
                />
              </div>

              <div className="perfil-campo">
                <label htmlFor="perfil-correo">
                  Correo electrónico
                </label>
                <input
                  id="perfil-correo"
                  value={usuario.correo}
                  disabled
                />
              </div>

              <div className="perfil-campo">
                <label htmlFor="perfil-nombre">
                  Nombre
                </label>
                <input
                  id="perfil-nombre"
                  name="nombre"
                  value={datos.nombre}
                  onChange={cambiarDato}
                  aria-invalid={Boolean(errores.nombre)}
                />
                {errores.nombre && (
                  <small role="alert">
                    {errores.nombre}
                  </small>
                )}
              </div>

              <div className="perfil-campo">
                <label htmlFor="perfil-apellidos">
                  Apellidos
                </label>
                <input
                  id="perfil-apellidos"
                  name="apellidos"
                  value={datos.apellidos}
                  onChange={cambiarDato}
                  aria-invalid={Boolean(errores.apellidos)}
                />
                {errores.apellidos && (
                  <small role="alert">
                    {errores.apellidos}
                  </small>
                )}
              </div>

              <div className="perfil-campo">
                <label htmlFor="perfil-telefono">
                  Teléfono
                </label>
                <input
                  id="perfil-telefono"
                  name="telefono"
                  type="tel"
                  value={datos.telefono}
                  onChange={cambiarDato}
                  aria-invalid={Boolean(errores.telefono)}
                />
                {errores.telefono && (
                  <small role="alert">
                    {errores.telefono}
                  </small>
                )}
              </div>

              <div className="perfil-campo">
                <label htmlFor="perfil-rol">
                  Rol
                </label>
                <input
                  id="perfil-rol"
                  value={usuario.rol}
                  disabled
                />
              </div>
            </div>

            <div className="perfil-campo">
              <label htmlFor="perfil-direccion">
                Dirección
              </label>
              <textarea
                id="perfil-direccion"
                name="direccion"
                rows="3"
                value={datos.direccion}
                onChange={cambiarDato}
                aria-invalid={Boolean(errores.direccion)}
              />
              {errores.direccion && (
                <small role="alert">
                  {errores.direccion}
                </small>
              )}
            </div>

            <p className="perfil-nota">
              El identificador, el correo electrónico
              y el rol no pueden modificarse desde aquí.
            </p>

            {mensaje && (
              <p className="perfil-mensaje" role="status">
                {mensaje}
              </p>
            )}

            <button
              className="perfil-guardar"
              type="submit"
            >
              Guardar cambios
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

