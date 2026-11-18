
import { useState } from "react";
import {
  useAuth,
  evaluarContrasena,
} from "../../context/AuthContext";
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

const estiloCampo = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #E7DADA",
  background: "#FFFFFF",
  color: "#2B2B2B",
  fontSize: "14px",
  marginTop: "6px",
};

const estiloGrupo = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "17px",
  gap: "3px",
};

function ReglasContrasena({ valor }) {
  const evaluacion = evaluarContrasena(valor);

  return (
    <div
      style={{
        background: "#FAF7F5",
        padding: "14px",
        borderRadius: "10px",
        margin: "8px 0 18px",
      }}
    >
      <p
        style={{
          fontWeight: 600,
          color: "#8B5E5E",
          fontSize: "13px",
          margin: "0 0 10px",
        }}
      >
        Requisitos de seguridad
      </p>

      {evaluacion.reglas.map((regla) => (
        <p
          key={regla.id}
          style={{
            color: regla.cumple ? "#26743C" : "#777777",
            fontSize: "12px",
            margin: "7px 0",
          }}
        >
          <span aria-hidden="true">
            {regla.cumple ? "✓ " : "○ "}
          </span>
          {regla.texto}
        </p>
      ))}

      <p
        role="status"
        style={{
          fontSize: "12px",
          margin: "12px 0 0",
          color: evaluacion.valida
            ? "#26743C"
            : "#8B5E5E",
          fontWeight: 600,
        }}
      >
        {evaluacion.valida
          ? "Contraseña válida"
          : "Completá todos los requisitos"}
      </p>
    </div>
  );
}

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

  const campos = [
    {
      nombre: "cedula",
      etiqueta: "Número de cédula",
      placeholder: "123456789",
    },
    {
      nombre: "nombre",
      etiqueta: "Nombre",
    },
    {
      nombre: "apellidos",
      etiqueta: "Apellidos",
    },
    {
      nombre: "correo",
      etiqueta: "Correo electrónico",
      tipo: "email",
    },
    {
      nombre: "telefono",
      etiqueta: "Teléfono",
      tipo: "tel",
      placeholder: "88888888",
    },
  ];

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
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <section
        className="registro-card"
        style={{
          background: "#FFFFFF",
          width: "100%",
          maxWidth: "560px",
          borderRadius: "18px",
          padding: "32px",
          boxSizing: "border-box",
          height: "fit-content",
          boxShadow:
            "0 12px 35px rgba(139,94,94,0.10)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              color: "#8B5E5E",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            BellasBotique
          </h1>

          <h2 style={{ color: "#8B5E5E" }}>
            Crear cuenta
          </h2>

          <p
            style={{
              color: "#777777",
              fontSize: "14px",
              marginBottom: "25px",
            }}
          >
            Registrate para comenzar a comprar.
          </p>
        </div>

        <form onSubmit={registrar}>
          {campos.map((campo) => (
            <div
              key={campo.nombre}
              style={estiloGrupo}
            >
              <label htmlFor={`registro-${campo.nombre}`}>
                {campo.etiqueta}
              </label>

              <input
                id={`registro-${campo.nombre}`}
                name={campo.nombre}
                type={campo.tipo || "text"}
                value={datos[campo.nombre]}
                onChange={cambiarDato}
                placeholder={campo.placeholder || ""}
                style={estiloCampo}
                required
              />
            </div>
          ))}

          <div style={estiloGrupo}>
            <label htmlFor="registro-direccion">
              Dirección
            </label>

            <textarea
              id="registro-direccion"
              name="direccion"
              value={datos.direccion}
              onChange={cambiarDato}
              rows={3}
              style={estiloCampo}
              required
            />
          </div>

          <div style={estiloGrupo}>
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
              style={estiloCampo}
              autoComplete="new-password"
              required
            />
          </div>

          <ReglasContrasena
            valor={datos.contrasena}
          />

          <div style={estiloGrupo}>
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
              style={estiloCampo}
              autoComplete="new-password"
              required
            />

            {datos.confirmar && (
              <small
                style={{
                  color:
                    datos.confirmar === datos.contrasena
                      ? "#26743C"
                      : "#A23B3B",
                  marginTop: "5px",
                }}
              >
                {datos.confirmar === datos.contrasena
                  ? "✓ Las contraseñas coinciden"
                  : "Las contraseñas no coinciden"}
              </small>
            )}
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              marginBottom: "20px",
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

          <button
            type={exito ? "button" : "submit"}
            onClick={
              exito ? onVolverLogin : undefined
            }
            style={{
              width: "100%",
              padding: "13px",
              background: "#8B5E5E",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "9px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {exito
              ? "Ir a iniciar sesión"
              : "Crear cuenta"}
          </button>

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
