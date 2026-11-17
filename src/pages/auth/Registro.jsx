
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
  const { registrarUsuario } = useAuth();

  const [datos, setDatos] = useState(datosIniciales);
  const [mensaje, setMensaje] = useState("");
  const [exito, setExito] = useState(false);
  const [mostrarContrasena, setMostrarContrasena] =
    useState(false);

  const cambiarDato = (e) => {
    const { name, value } = e.target;

    setDatos((anterior) => ({
      ...anterior,
      [name]: value,
    }));

    setMensaje("");
    setExito(false);
  };

  const registrar = (e) => {
    e.preventDefault();

    const resultado = registrarUsuario(datos);

    setMensaje(resultado.mensaje);
    setExito(resultado.exito);

    if (resultado.exito) {
      setDatos(datosIniciales);
    }
  };

  const estiloCampo = {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    marginBottom: "15px",
    textAlign: "left",
  };

  const estiloInput = {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #E7DADA",
    background: "#FFFFFF",
    color: "#2B2B2B",
  };

  return (
    <main
      className="registro-page"
      style={{
        minHeight: "100vh",
        background: "#FAF7F5",
        display: "flex",
        justifyContent: "center",
        padding: "35px 16px",
        boxSizing: "border-box",
      }}
    >
      <section
        className="registro-card"
        style={{
          width: "100%",
          maxWidth: "560px",
          background: "#FFFFFF",
          borderRadius: "18px",
          padding: "32px",
          boxSizing: "border-box",
          boxShadow: "0 12px 35px rgba(139,94,94,0.10)",
          height: "fit-content",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              color: "#8B5E5E",
              fontFamily: "'Playfair Display', serif",
              marginBottom: "8px",
            }}
          >
            BellasBotique
          </h1>

          <h2 style={{ color: "#8B5E5E" }}>
            Crear cuenta
          </h2>

          <p style={{ color: "#777777", fontSize: "14px" }}>
            Registrate para comenzar a comprar.
          </p>
        </div>

        <form onSubmit={registrar}>
          <div style={estiloCampo}>
            <label htmlFor="registro-cedula">
              Número de cédula
            </label>
            <input
              id="registro-cedula"
              name="cedula"
              value={datos.cedula}
              onChange={cambiarDato}
              placeholder="Ejemplo: 123456789"
              style={estiloInput}
              required
            />
          </div>

          <div style={estiloCampo}>
            <label htmlFor="registro-nombre">
              Nombre
            </label>
            <input
              id="registro-nombre"
              name="nombre"
              value={datos.nombre}
              onChange={cambiarDato}
              style={estiloInput}
              required
            />
          </div>

          <div style={estiloCampo}>
            <label htmlFor="registro-apellidos">
              Apellidos
            </label>
            <input
              id="registro-apellidos"
              name="apellidos"
              value={datos.apellidos}
              onChange={cambiarDato}
              style={estiloInput}
              required
            />
          </div>

          <div style={estiloCampo}>
            <label htmlFor="registro-correo">
              Correo electrónico
            </label>
            <input
              id="registro-correo"
              name="correo"
              type="email"
              value={datos.correo}
              onChange={cambiarDato}
              placeholder="ejemplo@correo.com"
              style={estiloInput}
              required
              autoComplete="email"
            />
          </div>

          <div style={estiloCampo}>
            <label htmlFor="registro-telefono">
              Teléfono
            </label>
            <input
              id="registro-telefono"
              name="telefono"
              type="tel"
              value={datos.telefono}
              onChange={cambiarDato}
              placeholder="88888888"
              style={estiloInput}
              required
            />
          </div>

          <div style={estiloCampo}>
            <label htmlFor="registro-direccion">
              Dirección
            </label>
            <textarea
              id="registro-direccion"
              name="direccion"
              value={datos.direccion}
              onChange={cambiarDato}
              rows="3"
              style={estiloInput}
              required
            />
          </div>

          <div style={estiloCampo}>
            <label htmlFor="registro-contrasena">
              Contraseña
            </label>
            <input
              id="registro-contrasena"
              name="contrasena"
              type={
                mostrarContrasena ? "text" : "password"
              }
              value={datos.contrasena}
              onChange={cambiarDato}
              placeholder="Mínimo 8 caracteres"
              style={estiloInput}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          <div style={estiloCampo}>
            <label htmlFor="registro-confirmar">
              Confirmar contraseña
            </label>
            <input
              id="registro-confirmar"
              name="confirmar"
              type={
                mostrarContrasena ? "text" : "password"
              }
              value={datos.confirmar}
              onChange={cambiarDato}
              style={estiloInput}
              required
              autoComplete="new-password"
            />
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              marginBottom: "18px",
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

          {mensaje && (
            <p
              role={exito ? "status" : "alert"}
              style={{
                padding: "12px",
                borderRadius: "8px",
                background: exito
                  ? "#E5F4E8"
                  : "#F8E5E5",
                color: exito
                  ? "#26743C"
                  : "#A23B3B",
                fontSize: "13px",
              }}
            >
              {mensaje}
            </p>
          )}

          {!exito ? (
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                background: "#8B5E5E",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "9px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Crear cuenta
            </button>
          ) : (
            <button
              type="button"
              onClick={onVolverLogin}
              style={{
                width: "100%",
                padding: "13px",
                background: "#8B5E5E",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "9px",
                cursor: "pointer",
              }}
            >
              Ir a iniciar sesión
            </button>
          )}

          <button
            type="button"
            onClick={onVolverLogin}
            style={{
              display: "block",
              margin: "20px auto 0",
              color: "#8B5E5E",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            Volver al Login
          </button>
        </form>
      </section>
    </main>
  );
}
