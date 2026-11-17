
import { useState } from "react";
import "./Recuperacion.css";

export default function Recuperacion({ onVolverLogin }) {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const recuperar = (e) => {
    e.preventDefault();

    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!correoValido.test(correo.trim())) {
      setError("Ingresá un correo electrónico válido.");
      setMensaje("");
      return;
    }

    setError("");
    setMensaje(
      "Solicitud simulada correctamente. " +
      "En una versión conectada, recibirías instrucciones " +
      "de recuperación si existe una cuenta asociada."
    );
  };

  return (
    <main className="recuperacion-page">
      <section className="recuperacion-card">
        <div className="recuperacion-icono">♡</div>

        <h1>BellasBotique</h1>
        <p className="recuperacion-subtitulo">
          Estamos aquí para ayudarte
        </p>

        <h2>Recuperar contraseña</h2>
        <p className="recuperacion-descripcion">
          Ingresá tu correo electrónico para solicitar
          la recuperación de tu cuenta.
        </p>

        <form onSubmit={recuperar} noValidate>
          <label htmlFor="correo-recuperacion">
            Correo electrónico
          </label>

          <input
            id="correo-recuperacion"
            type="email"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              setError("");
              setMensaje("");
            }}
            placeholder="ejemplo@correo.com"
            autoComplete="email"
          />

          {error && (
            <p className="recuperacion-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit">
            Enviar solicitud
          </button>

          {mensaje && (
            <p className="recuperacion-exito" role="status">
              {mensaje}
            </p>
          )}
        </form>

        <button
          type="button"
          className="recuperacion-volver"
          onClick={onVolverLogin}
        >
          Volver a iniciar sesión
        </button>
      </section>
    </main>
  );
}
