
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login({
  onIrRegistro,
  onIrRecuperacion,
  onIniciarDemo,
}) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mostrar, setMostrar] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const { motivoCierre, intentarLogin } = useAuth();

  const iniciarSesion = (e) => {
    e.preventDefault();

    if (!correo.trim() || !contrasena) {
      setMensaje("Por favor, completá todos los campos.");
      return;
    }

    const resultado = intentarLogin(correo, contrasena);
    setMensaje(resultado.mensaje);
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-logo">♡</div>

        <h1>BellasBotique</h1>

        <p className="login-subtitle">
          Bienvenida a tu tienda favorita
        </p>

        <h2>Iniciar sesión</h2>

        {motivoCierre === "inactividad" && (
          <p
            className="login-sesion-expirada"
            role="alert"
          >
            Tu sesión se cerró automáticamente
            después de 5 minutos de inactividad.
            Iniciá sesión nuevamente para continuar.
          </p>
        )}

        <p className="login-description">
          Ingresá tus datos para continuar
        </p>

        <form onSubmit={iniciarSesion}>
          <label htmlFor="correo">
            Correo electrónico
          </label>

          <input
            id="correo"
            type="email"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              setMensaje("");
            }}
            required
            autoComplete="email"
          />

          <label htmlFor="contrasena">
            Contraseña
          </label>

          <div className="password-container">
            <input
              id="contrasena"
              type={mostrar ? "text" : "password"}
              placeholder="Ingresá tu contraseña"
              value={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                setMensaje("");
              }}
              required
              autoComplete="current-password"
            />

            <button
              type="button"
              className="show-password"
              onClick={() => setMostrar(!mostrar)}
            >
              {mostrar ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          <button
            type="button"
            className="forgot-password"
            onClick={onIrRecuperacion}
          >
            ¿Olvidaste tu contraseña?
          </button>

          <button
            type="submit"
            className="login-button"
          >
            Iniciar sesión
          </button>

          {mensaje && (
            <p className="login-message" role="status">
              {mensaje}
            </p>
          )}
        </form>

        <p className="register-text">
          ¿No tenés cuenta?{" "}
          <button
            type="button"
            className="login-link-button"
            onClick={onIrRegistro}
          >
            Registrate aquí
          </button>
        </p>

        <div className="login-demo">
          <p className="login-demo-titulo">
            Acceso de demostración
          </p>

          <p className="login-demo-descripcion">
            Elegí un rol para probar las diferentes
            interfaces. No requiere contraseña.
          </p>

          <div className="login-demo-opciones">
            <button
              type="button"
              onClick={() => onIniciarDemo("cliente")}
            >
              Entrar como Cliente
            </button>

            <button
              type="button"
              onClick={() => onIniciarDemo("vendedor")}
            >
              Entrar como Vendedor
            </button>

            <button
              type="button"
              onClick={() => onIniciarDemo("administrador")}
            >
              Entrar como Administrador
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

