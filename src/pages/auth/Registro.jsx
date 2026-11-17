
import { useState } from "react";
import "./Registro.css";

const datosIniciales = {
  cedula: "",
  nombre: "",
  apellidos: "",
  correo: "",
  telefono: "",
  direccion: "",
  contrasena: "",
  confirmar: "",
};

export default function Registro({ onVolverLogin }) {
  const [datos, setDatos] = useState(datosIniciales);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

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

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!/^\d{9,12}$/.test(datos.cedula.trim())) {
      nuevosErrores.cedula = "Ingresá una cédula de 9 a 12 dígitos.";
    }

    if (datos.nombre.trim().length < 2) {
      nuevosErrores.nombre = "Ingresá un nombre válido.";
    }

    if (datos.apellidos.trim().length < 2) {
      nuevosErrores.apellidos = "Ingresá tus apellidos.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo.trim())) {
      nuevosErrores.correo = "Ingresá un correo electrónico válido.";
    }

    if (!/^\d{8}$/.test(datos.telefono.replace(/\s|-/g, ""))) {
      nuevosErrores.telefono = "El teléfono debe tener 8 dígitos.";
    }

    if (datos.direccion.trim().length < 10) {
      nuevosErrores.direccion = "Ingresá una dirección más detallada.";
    }

    const contrasenaSegura =
      datos.contrasena.length >= 8 &&
      /[A-Z]/.test(datos.contrasena) &&
      /[a-z]/.test(datos.contrasena) &&
      /\d/.test(datos.contrasena) &&
      /[^A-Za-z0-9]/.test(datos.contrasena);

    if (!contrasenaSegura) {
      nuevosErrores.contrasena =
        "Usá al menos 8 caracteres, mayúscula, minúscula, número y símbolo.";
    }

    if (datos.confirmar !== datos.contrasena) {
      nuevosErrores.confirmar = "Las contraseñas no coinciden.";
    }

    return nuevosErrores;
  };

  const registrarUsuario = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      setMensaje("");
      return;
    }

    // Por ahora no almacenamos contraseñas en el navegador.
    // El registro definitivo necesitará un servicio de autenticación.
    setMensaje(
      "¡Formulario válido! El registro está listo para conectarse al sistema de usuarios."
    );
  };

  return (
    <main className="registro-page">
      <section className="registro-card">
        <div className="registro-encabezado">
          <div className="registro-corazon">♡</div>
          <h1>BellasBotique</h1>
          <p>Creá tu cuenta y descubrí nuestra colección</p>
          <h2>Crear una cuenta</h2>
          <span>Completá tus datos para registrarte</span>
        </div>

        <form onSubmit={registrarUsuario} noValidate>
          <div className="registro-grid">
            <Campo
              label="Cédula"
              name="cedula"
              value={datos.cedula}
              onChange={cambiarDato}
              error={errores.cedula}
              placeholder="Ej. 101230456"
            />

            <Campo
              label="Nombre"
              name="nombre"
              value={datos.nombre}
              onChange={cambiarDato}
              error={errores.nombre}
              placeholder="Tu nombre"
            />

            <Campo
              label="Apellidos"
              name="apellidos"
              value={datos.apellidos}
              onChange={cambiarDato}
              error={errores.apellidos}
              placeholder="Tus apellidos"
            />

            <Campo
              label="Teléfono"
              name="telefono"
              value={datos.telefono}
              onChange={cambiarDato}
              error={errores.telefono}
              placeholder="88888888"
            />
          </div>

          <Campo
            label="Correo electrónico"
            name="correo"
            type="email"
            value={datos.correo}
            onChange={cambiarDato}
            error={errores.correo}
            placeholder="ejemplo@correo.com"
          />

          <Campo
            label="Dirección"
            name="direccion"
            value={datos.direccion}
            onChange={cambiarDato}
            error={errores.direccion}
            placeholder="Provincia, cantón, distrito y señas"
          />

          <div className="registro-campo">
            <label htmlFor="registro-contrasena">Contraseña</label>
            <div className="registro-password">
              <input
                id="registro-contrasena"
                name="contrasena"
                type={mostrarContrasena ? "text" : "password"}
                value={datos.contrasena}
                onChange={cambiarDato}
                placeholder="Creá una contraseña segura"
                autoComplete="new-password"
                aria-invalid={Boolean(errores.contrasena)}
              />
              <button
                type="button"
                onClick={() => setMostrarContrasena(!mostrarContrasena)}
              >
                {mostrarContrasena ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <small>
              Mínimo 8 caracteres, mayúscula, minúscula, número y símbolo.
            </small>
            {errores.contrasena && (
              <p className="registro-error" role="alert">
                {errores.contrasena}
              </p>
            )}
          </div>

          <Campo
            label="Confirmar contraseña"
            name="confirmar"
            type="password"
            value={datos.confirmar}
            onChange={cambiarDato}
            error={errores.confirmar}
            placeholder="Repetí tu contraseña"
          />

          <button className="registro-boton" type="submit">
            Crear cuenta
          </button>

          {mensaje && (
            <p className="registro-exito" role="status">
              {mensaje}
            </p>
          )}
        </form>

        <p className="registro-login">
          ¿Ya tenés una cuenta?{" "}
          <button type="button" onClick={onVolverLogin}>
            Iniciá sesión
          </button>
        </p>
      </section>
    </main>
  );
}

function Campo({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
}) {
  return (
    <div className="registro-campo">
      <label htmlFor={`registro-${name}`}>{label}</label>
      <input
        id={`registro-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${name}` : undefined}
        autoComplete="off"
      />
      {error && (
        <p id={`error-${name}`} className="registro-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
