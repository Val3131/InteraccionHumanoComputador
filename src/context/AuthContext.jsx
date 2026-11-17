
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const AuthContext = createContext(null);

const CLAVE_BITACORA = "bellasbotique_bitacora_demo";

const usuariosDemo = {
  cliente: {
    id: "demo-cliente",
    nombre: "María",
    apellidos: "González",
    correo: "cliente@demo.bellasbotique.test",
    telefono: "88888888",
    direccion: "San José, Costa Rica",
    rol: "cliente",
  },
  vendedor: {
    id: "demo-vendedor",
    nombre: "Andrea",
    apellidos: "López",
    correo: "vendedor@demo.bellasbotique.test",
    telefono: "87777777",
    direccion: "Alajuela, Costa Rica",
    rol: "vendedor",
  },
  administrador: {
    id: "demo-admin",
    nombre: "Sofía",
    apellidos: "Rodríguez",
    correo: "admin@demo.bellasbotique.test",
    telefono: "86666666",
    direccion: "Heredia, Costa Rica",
    rol: "administrador",
  },
};

function leerBitacora() {
  try {
    const guardado = sessionStorage.getItem(CLAVE_BITACORA);

    if (!guardado) return [];

    const datos = JSON.parse(guardado);

    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

function generarId() {
  return crypto.randomUUID();
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [motivoCierre, setMotivoCierre] = useState(null);
  const [intentosLogin, setIntentosLogin] = useState([]);
  const [actividades, setActividades] = useState(leerBitacora);

  // Conservar la bitácora durante la sesión del navegador.
  useEffect(() => {
    try {
      sessionStorage.setItem(
        CLAVE_BITACORA,
        JSON.stringify(actividades)
      );
    } catch (error) {
      console.error(
        "No fue posible guardar la bitácora:",
        error
      );
    }
  }, [actividades]);

  // Registrar una actividad del sistema.
  const registrarActividad = useCallback(
    ({ actor, tipo, accion, detalle }) => {
      const nuevaActividad = {
        id: generarId(),
        fecha: new Date().toISOString(),
        usuario: actor?.correo || "Sistema",
        rol: actor?.rol || "sistema",
        tipo,
        accion,
        detalle,
      };

      setActividades((anteriores) => [
        nuevaActividad,
        ...anteriores,
      ]);

      return nuevaActividad;
    },
    []
  );

  // Registrar intentos de inicio de sesión.
  const registrarIntento = useCallback(
    ({ correo, resultado, motivo }) => {
      const nuevoIntento = {
        id: generarId(),
        correo: correo.trim().toLowerCase(),
        resultado,
        motivo,
        fecha: new Date().toISOString(),
      };

      setIntentosLogin((anteriores) => [
        nuevoIntento,
        ...anteriores,
      ]);

      return nuevoIntento;
    },
    []
  );

  // Acceso ficticio por rol.
  const iniciarDemo = useCallback(
    (rol) => {
      if (!Object.hasOwn(usuariosDemo, rol)) {
        return false;
      }

      const seleccionado = { ...usuariosDemo[rol] };

      registrarIntento({
        correo: seleccionado.correo,
        resultado: "exitoso",
        motivo: `Acceso de demostración: ${rol}`,
      });

      registrarActividad({
        actor: seleccionado,
        tipo: "sesion",
        accion: "Inicio de sesión",
        detalle: `Ingreso de demostración como ${rol}`,
      });

      setMotivoCierre(null);
      setUsuario(seleccionado);

      return true;
    },
    [registrarIntento, registrarActividad]
  );

  // Login normal: pendiente de autenticación real.
  const intentarLogin = useCallback(
    (correo, contrasena) => {
      if (!correo.trim() || !contrasena) {
        return {
          exito: false,
          mensaje: "Completá todos los campos.",
        };
      }

      registrarIntento({
        correo,
        resultado: "fallido",
        motivo: "Autenticación real no configurada",
      });

      return {
        exito: false,
        mensaje:
          "El acceso con credenciales todavía no está " +
          "disponible. Utilizá los botones de demostración.",
      };
    },
    [registrarIntento]
  );

  // Cerrar sesión manualmente o por inactividad.
  const cerrarSesion = useCallback(
    (motivo = "manual") => {
      if (usuario) {
        registrarActividad({
          actor: usuario,
          tipo: "sesion",
          accion: "Cierre de sesión",
          detalle:
            motivo === "inactividad"
              ? "Sesión cerrada por inactividad"
              : "Cierre manual de sesión",
        });
      }

      setUsuario(null);
      setMotivoCierre(
        motivo === "inactividad" ? "inactividad" : null
      );
    },
    [usuario, registrarActividad]
  );

  // Editar únicamente datos autorizados del perfil.
  const actualizarPerfil = useCallback(
    (datos) => {
      if (!usuario || !datos || typeof datos !== "object") {
        return false;
      }

      const camposPermitidos = [
        "nombre",
        "apellidos",
        "telefono",
        "direccion",
      ];

      const nuevosDatos = {};
      const camposModificados = [];

      for (const campo of camposPermitidos) {
        if (typeof datos[campo] === "string") {
          const nuevoValor = datos[campo].trim();

          nuevosDatos[campo] = nuevoValor;

          if (nuevoValor !== usuario[campo]) {
            camposModificados.push(campo);
          }
        }
      }

      if (camposModificados.length > 0) {
        registrarActividad({
          actor: usuario,
          tipo: "perfil",
          accion: "Actualización de perfil",
          detalle:
            "Campos modificados: " +
            camposModificados.join(", "),
        });
      }

      setUsuario((anterior) =>
        anterior
          ? { ...anterior, ...nuevosDatos }
          : anterior
      );

      return true;
    },
    [usuario, registrarActividad]
  );

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: Boolean(usuario),
        motivoCierre,
        iniciarDemo,
        intentarLogin,
        cerrarSesion,
        actualizarPerfil,
        intentosLogin,
        actividades,
        registrarActividad,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider"
    );
  }

  return contexto;
}
