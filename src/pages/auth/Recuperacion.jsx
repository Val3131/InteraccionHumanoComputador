
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Recuperacion.css";

export default function Recuperacion({ onVolverLogin }) {
  const {
    solicitarRecuperacion,
    restablecerContrasena,
  } = useAuth();

  const [paso, setPaso] = useState("solicitar");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoDemo, setCodigoDemo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [mostrarContrasena, setMostrarContrasena] =
    useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const solicitarCodigo = (e) => {
    e.preventDefault();

    const resultado = solicitarRecuperacion(correo);

    setMensaje(resultado.mensaje);
    setError(!resultado.exito);

    if (resultado.exito) {
      setCodigoDemo(resultado.codigoDemo);
      setCodigo("");
      setContrasena("");
      setConfirmar("");
      setPaso("cambiar");
    }
  };

  const guardarContrasena = (e) => {
    e.preventDefault();

    const resultado = restablecerContrasena(
      correo,
      codigo,
      contrasena,
      confirmar
    );

    setMensaje(resultado.mensaje);
    setError(!resultado.exito);

    if (resultado.exito) {
      setPaso("completado");
      setCodigoDemo("");
      setCodigo("");
      setContrasena("");
      setConfirmar("");
    }
  };

  const solicitarNuevoCodigo = () => {
    setPaso("solicitar");
    setCodigo("");
    setCodigoDemo("");
    setContrasena("");
    setConfirmar("");
    setMensaje("");
    setError(false);
  };

  const estilos = {
    pagina: {
      minHeight: "100vh",
      background: "#FAF7F5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "30px 16px",
      boxSizing: "border-box",
      fontFamily: "'Inter', sans-serif",
    },
    tarjeta: {
      background: "#FFFFFF",
      width: "100%",
      maxWidth: "460px",
      borderRadius: "18px",
      boxSizing: "border-box",
      padding: "35px",
      boxShadow: "0 12px 35px rgba(139,94,94,0.10)",
      color: "#2B2B2B",
    },
    titulo: {
      color: "#8B5E5E",
      fontFamily: "'Playfair Display', serif",
      textAlign: "center",
    },
    campo: {
      width: "100%",
      padding: "13px",
      border: "1px solid #E7DADA",
      borderRadius: "9px",
      boxSizing: "border-box",
      marginTop: "8px",
      marginBottom: "18px",
      fontSize: "14px",
      background: "#FFFFFF",
      color: "#2B2B2B",
    },
    boton: {
      width: "100%",
      background: "#8B5E5E",
      color: "#FFFFFF",
      border: "none",
      padding: "14px",
      borderRadius: "9px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      marginTop: "8px",
    },
    secundario: {
      background: "transparent",
      color: "#8B5E5E",
      border: "none",
      cursor: "pointer",
      display: "block",
      margin: "20px auto 0",
      fontSize: "14px",
    },
  };

  return (
    <main
      className="recuperacion-page"
      style={estilos.pagina}
    >
      <section
        className="recuperacion-card"
        style={estilos.tarjeta}
      >
        <h1
          style={{
            ...estilos.titulo,
            fontSize: "32px",
            margin: "0 0 10px",
          }}
        >
          BellasBotique
        </h1>

        <div
          style={{
            textAlign: "center",
            fontSize: "35px",
            color: "#D8A7A7",
          }}
          aria-hidden="true"
        >
          ♡
        </div>

        {paso === "solicitar" && (
          <>
            <h2 style={estilos.titulo}>
              Recuperar contraseña
            </h2>

            <p
              style={{
                textAlign: "center",
                color: "#777777",
                fontSize: "14px",
                lineHeight: 1.6,
                marginBottom: "25px",
              }}
            >
              Ingresá el correo con el que creaste
              tu cuenta para generar un código
              de recuperación de demostración.
            </p>

            <form onSubmit={solicitarCodigo}>
              <label htmlFor="recuperar-correo">
                Correo electrónico
              </label>

              <input
                id="recuperar-correo"
                type="email"
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  setMensaje("");
                }}
                placeholder="ejemplo@correo.com"
                autoComplete="email"
                required
                style={estilos.campo}
              />

              <button
                type="submit"
                style={estilos.boton}
              >
                Generar código
              </button>
            </form>
          </>
        )}

        {paso === "cambiar" && (
          <>
            <h2 style={estilos.titulo}>
              Nueva contraseña
            </h2>

            <p
              style={{
                color: "#777777",
                textAlign: "center",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Cuenta: <strong>{correo}</strong>
            </p>

            <div
              style={{
                background: "#F3E3E3",
                padding: "18px",
                borderRadius: "12px",
                textAlign: "center",
                margin: "22px 0",
              }}
            >
              <p
                style={{
                  color: "#8B5E5E",
                  margin: "0 0 8px",
                  fontSize: "13px",
                }}
              >
                Código de prueba (no enviado por correo)
              </p>

              <strong
                style={{
                  color: "#8B5E5E",
                  fontSize: "30px",
                  letterSpacing: "5px",
                }}
              >
                {codigoDemo}
              </strong>

              <p
                style={{
                  fontSize: "12px",
                  color: "#777777",
                  margin: "10px 0 0",
                }}
              >
                Válido durante 10 minutos.
                Máximo 3 intentos incorrectos.
              </p>
            </div>

            <form onSubmit={guardarContrasena}>
              <label htmlFor="recuperar-codigo">
                Código de verificación
              </label>

              <input
                id="recuperar-codigo"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={codigo}
                onChange={(e) =>
                  setCodigo(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="Código de 6 dígitos"
                autoComplete="one-time-code"
                required
                style={estilos.campo}
              />

              <label htmlFor="recuperar-nueva">
                Nueva contraseña
              </label>

              <input
                id="recuperar-nueva"
                type={
                  mostrarContrasena ? "text" : "password"
                }
                value={contrasena}
                onChange={(e) =>
                  setContrasena(e.target.value)
                }
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
                minLength={8}
                required
                style={estilos.campo}
              />

              <label htmlFor="recuperar-confirmar">
                Confirmar nueva contraseña
              </label>

              <input
                id="recuperar-confirmar"
                type={
                  mostrarContrasena ? "text" : "password"
                }
                value={confirmar}
                onChange={(e) =>
                  setConfirmar(e.target.value)
                }
                placeholder="Repetí la contraseña"
                autoComplete="new-password"
                required
                style={estilos.campo}
              />

              <label
                style={{
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  fontSize: "13px",
                  marginBottom: "12px",
                }}
              >
                <input
                  type="checkbox"
                  checked={mostrarContrasena}
                  onChange={(e) =>
                    setMostrarContrasena(e.target.checked)
                  }
                />
                Mostrar contraseñas
              </label>

              <button
                type="submit"
                style={estilos.boton}
              >
                Guardar nueva contraseña
              </button>
            </form>

            <button
              type="button"
              onClick={solicitarNuevoCodigo}
              style={estilos.secundario}
            >
              Solicitar otro código
            </button>
          </>
        )}

        {paso === "completado" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "40px",
                color: "#26743C",
              }}
            >
              ✓
            </div>

            <h2 style={estilos.titulo}>
              Contraseña actualizada
            </h2>

            <p
              style={{
                color: "#777777",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Ya podés ingresar con tu correo
              y la nueva contraseña.
            </p>

            <button
              type="button"
              onClick={onVolverLogin}
              style={estilos.boton}
            >
              Ir a iniciar sesión
            </button>
          </div>
        )}

        {mensaje && paso !== "completado" && (
          <p
            role={error ? "alert" : "status"}
            style={{
              fontSize: "13px",
              lineHeight: 1.5,
              padding: "12px",
              borderRadius: "8px",
              marginTop: "20px",
              background: error
                ? "#F8E5E5"
                : "#E5F4E8",
              color: error
                ? "#A23B3B"
                : "#26743C",
            }}
          >
            {mensaje}
          </p>
        )}

        {paso !== "completado" && (
          <button
            type="button"
            onClick={onVolverLogin}
            style={estilos.secundario}
          >
            Volver al Login
          </button>
        )}
      </section>
    </main>
  );
}
