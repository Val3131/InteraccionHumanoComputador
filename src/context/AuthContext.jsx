
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

const AuthContext = createContext(null);

const CLAVE_BITACORA = "bellasbotique_bitacora_demo";
const DURACION_CODIGO = 10 * 60 * 1000;
const MAX_INTENTOS_CODIGO = 3;

const ROLES_VALIDOS = [
  "cliente",
  "vendedor",
  "administrador",
];

const usuariosDemo = {
  cliente: {
    id: "demo-cliente",
    nombre: "María",
    apellidos: "González",
    correo: "cliente@demo.bellasbotique.test",
    telefono: "88888888",
    direccion: "San José, Costa Rica",
    rol: "cliente",
    estado: "activo",
  },
  vendedor: {
    id: "demo-vendedor",
    nombre: "Andrea",
    apellidos: "López",
    correo: "vendedor@demo.bellasbotique.test",
    telefono: "87777777",
    direccion: "Alajuela, Costa Rica",
    rol: "vendedor",
    estado: "activo",
  },
  administrador: {
    id: "demo-admin",
    nombre: "Sofía",
    apellidos: "Rodríguez",
    correo: "admin@demo.bellasbotique.test",
    telefono: "86666666",
    direccion: "Heredia, Costa Rica",
    rol: "administrador",
    estado: "activo",
  },
};

const usuariosIniciales = [
  {
    id: 1,
    nombre: "María González",
    apellidos: "",
    correo: "maria@ejemplo.com",
    rol: "cliente",
    estado: "activo",
    origen: "ejemplo",
  },
  {
    id: 2,
    nombre: "Andrea López",
    apellidos: "",
    correo: "andrea@ejemplo.com",
    rol: "vendedor",
    estado: "activo",
    origen: "ejemplo",
  },
  {
    id: 3,
    nombre: "Carlos Méndez",
    apellidos: "",
    correo: "carlos@ejemplo.com",
    rol: "cliente",
    estado: "inactivo",
    origen: "ejemplo",
  },
  {
    id: 4,
    nombre: "Sofía Rodríguez",
    apellidos: "",
    correo: "sofia@ejemplo.com",
    rol: "administrador",
    estado: "activo",
    origen: "ejemplo",
  },
];

// Regla única para Registro y Recuperación.
export function evaluarContrasena(valor = "") {
  const contrasena = String(valor);

  const reglas = [
    {
      id: "longitud",
      texto: "Mínimo 8 caracteres",
      cumple: contrasena.length >= 8,
    },
    {
      id: "mayuscula",
      texto: "Al menos una mayúscula",
      cumple: /[A-Z]/.test(contrasena),
    },
    {
      id: "minuscula",
      texto: "Al menos una minúscula",
      cumple: /[a-z]/.test(contrasena),
    },
    {
      id: "numero",
      texto: "Al menos un número",
      cumple: /\d/.test(contrasena),
    },
    {
      id: "especial",
      texto: "Al menos un carácter especial",
      cumple: /[^A-Za-z0-9\s]/.test(contrasena),
    },
  ];

  return {
    valida: reglas.every((regla) => regla.cumple),
    reglas,
  };
}

function generarId() {
  return crypto.randomUUID();
}

function generarCodigo() {
  const valores = new Uint32Array(1);
  crypto.getRandomValues(valores);

  return String(valores[0] % 1000000).padStart(6, "0");
}

function normalizarCorreo(valor) {
  return String(valor || "").trim().toLowerCase();
}

function leerBitacora() {
  try {
    const datos = JSON.parse(
      sessionStorage.getItem(CLAVE_BITACORA) || "[]"
    );

    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [motivoCierre, setMotivoCierre] = useState(null);
  const [intentosLogin, setIntentosLogin] = useState([]);
  const [actividades, setActividades] = useState(leerBitacora);

  const [usuarios, setUsuarios] = useState(() =>
    usuariosIniciales.map((cuenta) => ({ ...cuenta }))
  );

  // Credenciales de prueba solo en memoria de React.
  const [cuentasRegistradas, setCuentasRegistradas] =
    useState([]);

  const [recuperaciones, setRecuperaciones] = useState({});

  useEffect(() => {
    try {
      sessionStorage.setItem(
        CLAVE_BITACORA,
        JSON.stringify(actividades)
      );
    } catch (error) {
      console.error("Error guardando bitácora:", error);
    }
  }, [actividades]);

  const registrarActividad = useCallback(
    ({ actor, tipo, accion, detalle }) => {
      const actividad = {
        id: generarId(),
        fecha: new Date().toISOString(),
        usuario: actor?.correo || "Sistema",
        rol: actor?.rol || "sistema",
        tipo,
        accion,
        detalle,
      };

      setActividades((anteriores) => [
        actividad,
        ...anteriores,
      ]);

      return actividad;
    },
    []
  );

  const registrarIntento = useCallback(
    ({ correo, resultado, motivo }) => {
      const intento = {
        id: generarId(),
        correo: normalizarCorreo(correo),
        resultado,
        motivo,
        fecha: new Date().toISOString(),
      };

      setIntentosLogin((anteriores) => [
        intento,
        ...anteriores,
      ]);

      return intento;
    },
    []
  );

  const registrarUsuario = useCallback(
    (datos) => {
      const cedula = String(datos?.cedula || "")
        .replace(/\s/g, "")
        .trim();

      const nombre = String(datos?.nombre || "").trim();
      const apellidos = String(datos?.apellidos || "").trim();
      const correo = normalizarCorreo(datos?.correo);

      const telefono = String(datos?.telefono || "")
        .replace(/[\s-]/g, "");

      const direccion = String(
        datos?.direccion || ""
      ).trim();

      const contrasena = String(
        datos?.contrasena || ""
      );

      const confirmar = String(
        datos?.confirmar || ""
      );

      if (
        !cedula ||
        !nombre ||
        !apellidos ||
        !correo ||
        !telefono ||
        !direccion ||
        !contrasena ||
        !confirmar
      ) {
        return {
          exito: false,
          mensaje: "Completá todos los campos.",
        };
      }

      if (!/^\d{9,12}$/.test(cedula)) {
        return {
          exito: false,
          mensaje:
            "La cédula debe contener entre 9 y 12 dígitos.",
        };
      }

      if (
        nombre.length < 2 ||
        apellidos.length < 2 ||
        direccion.length < 10
      ) {
        return {
          exito: false,
          mensaje:
            "Revisá el nombre, los apellidos y la dirección.",
        };
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return {
          exito: false,
          mensaje: "Ingresá un correo válido.",
        };
      }

      if (!/^\d{8}$/.test(telefono)) {
        return {
          exito: false,
          mensaje: "El teléfono debe tener 8 dígitos.",
        };
      }

      if (!evaluarContrasena(contrasena).valida) {
        return {
          exito: false,
          mensaje:
            "La contraseña debe tener mínimo 8 caracteres, " +
            "mayúscula, minúscula, número y carácter especial.",
        };
      }

      if (contrasena !== confirmar) {
        return {
          exito: false,
          mensaje: "Las contraseñas no coinciden.",
        };
      }

      const correoDuplicado =
        usuarios.some(
          (cuenta) => cuenta.correo === correo
        ) ||
        Object.values(usuariosDemo).some(
          (cuenta) => cuenta.correo === correo
        );

      if (correoDuplicado) {
        return {
          exito: false,
          mensaje: "Ese correo ya está registrado.",
        };
      }

      if (
        usuarios.some(
          (cuenta) => cuenta.cedula === cedula
        )
      ) {
        return {
          exito: false,
          mensaje: "Esa cédula ya está registrada.",
        };
      }

      const id = generarId();

      const nuevaCuenta = {
        id,
        cedula,
        nombre,
        apellidos,
        correo,
        telefono,
        direccion,
        rol: "cliente",
        estado: "activo",
        origen: "registro",
      };

      setUsuarios((anteriores) => [
        ...anteriores,
        nuevaCuenta,
      ]);

      setCuentasRegistradas((anteriores) => [
        ...anteriores,
        { id, contrasena },
      ]);

      registrarActividad({
        actor: nuevaCuenta,
        tipo: "usuarios",
        accion: "Registro de usuario",
        detalle: `Se registró la cuenta ${correo}`,
      });

      return {
        exito: true,
        mensaje:
          "¡Cuenta creada correctamente! Ya podés iniciar sesión.",
      };
    },
    [usuarios, registrarActividad]
  );

  const intentarLogin = useCallback(
    (correoIngresado, contrasena) => {
      const correo = normalizarCorreo(correoIngresado);

      if (!correo || !contrasena) {
        return {
          exito: false,
          mensaje: "Completá todos los campos.",
        };
      }

      const cuenta = usuarios.find(
        (u) =>
          u.correo === correo &&
          u.origen === "registro"
      );

      const credencial = cuentasRegistradas.find(
        (c) => c.id === cuenta?.id
      );

      if (
        !cuenta ||
        !credencial ||
        credencial.contrasena !== contrasena
      ) {
        registrarIntento({
          correo,
          resultado: "fallido",
          motivo: "Credenciales incorrectas",
        });

        return {
          exito: false,
          mensaje: "Correo o contraseña incorrectos.",
        };
      }

      if (cuenta.estado !== "activo") {
        registrarIntento({
          correo,
          resultado: "fallido",
          motivo: "Cuenta desactivada",
        });

        return {
          exito: false,
          mensaje:
            "Tu cuenta está desactivada. Contactá al administrador.",
        };
      }

      registrarIntento({
        correo,
        resultado: "exitoso",
        motivo:
          "Acceso de cuenta registrada (demostración)",
      });

      registrarActividad({
        actor: cuenta,
        tipo: "sesion",
        accion: "Inicio de sesión",
        detalle:
          `Ingreso de usuario registrado con rol ${cuenta.rol}`,
      });

      setUsuario({ ...cuenta });
      setMotivoCierre(null);

      return {
        exito: true,
        mensaje: "Inicio de sesión correcto.",
      };
    },
    [
      usuarios,
      cuentasRegistradas,
      registrarIntento,
      registrarActividad,
    ]
  );

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

      setUsuario(seleccionado);
      setMotivoCierre(null);

      return true;
    },
    [registrarIntento, registrarActividad]
  );

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

  const actualizarPerfil = useCallback(
    (datos) => {
      if (
        !usuario ||
        !datos ||
        typeof datos !== "object"
      ) {
        return false;
      }

      const permitidos = [
        "nombre",
        "apellidos",
        "telefono",
        "direccion",
      ];

      const actualizados = {};
      const modificados = [];

      for (const campo of permitidos) {
        if (typeof datos[campo] === "string") {
          const valor = datos[campo].trim();
          actualizados[campo] = valor;

          if (valor !== usuario[campo]) {
            modificados.push(campo);
          }
        }
      }

      if (modificados.length === 0) {
        return true;
      }

      setUsuario((anterior) =>
        anterior
          ? { ...anterior, ...actualizados }
          : anterior
      );

      setUsuarios((anteriores) =>
        anteriores.map((cuenta) =>
          cuenta.id === usuario.id
            ? { ...cuenta, ...actualizados }
            : cuenta
        )
      );

      registrarActividad({
        actor: usuario,
        tipo: "perfil",
        accion: "Actualización de perfil",
        detalle:
          "Campos modificados: " +
          modificados.join(", "),
      });

      return true;
    },
    [usuario, registrarActividad]
  );

  const actualizarRolUsuario = useCallback(
    (id, nuevoRol) => {
      if (usuario?.rol !== "administrador") {
        return {
          exito: false,
          mensaje: "No tenés permisos para esta acción.",
        };
      }

      if (!ROLES_VALIDOS.includes(nuevoRol)) {
        return {
          exito: false,
          mensaje: "Seleccioná un rol válido.",
        };
      }

      const cuenta = usuarios.find((u) => u.id === id);

      if (!cuenta) {
        return {
          exito: false,
          mensaje: "No se encontró la cuenta.",
        };
      }

      if (cuenta.rol === nuevoRol) {
        return {
          exito: false,
          mensaje: "No se realizaron cambios.",
        };
      }

      const rolAnterior = cuenta.rol;

      setUsuarios((anteriores) =>
        anteriores.map((u) =>
          u.id === id ? { ...u, rol: nuevoRol } : u
        )
      );

      if (usuario.id === id) {
        setUsuario((anterior) =>
          anterior
            ? { ...anterior, rol: nuevoRol }
            : anterior
        );
      }

      registrarActividad({
        actor: usuario,
        tipo: "usuarios",
        accion: "Cambio de rol",
        detalle:
          `${cuenta.nombre} ${cuenta.apellidos || ""} ` +
          `(${cuenta.correo}): ${rolAnterior} → ${nuevoRol}`,
      });

      return {
        exito: true,
        mensaje:
          `Rol actualizado de ${rolAnterior} a ${nuevoRol}. ` +
          "Registrado en la bitácora.",
      };
    },
    [usuario, usuarios, registrarActividad]
  );

  const actualizarEstadoUsuario = useCallback(
    (id) => {
      if (usuario?.rol !== "administrador") {
        return {
          exito: false,
          mensaje: "No tenés permisos para esta acción.",
        };
      }

      const cuenta = usuarios.find((u) => u.id === id);

      if (!cuenta) {
        return {
          exito: false,
          mensaje: "No se encontró la cuenta.",
        };
      }

      const nuevoEstado =
        cuenta.estado === "activo"
          ? "inactivo"
          : "activo";

      setUsuarios((anteriores) =>
        anteriores.map((u) =>
          u.id === id
            ? { ...u, estado: nuevoEstado }
            : u
        )
      );

      registrarActividad({
        actor: usuario,
        tipo: "usuarios",
        accion: "Cambio de estado",
        detalle:
          `${cuenta.nombre} ${cuenta.apellidos || ""} ` +
          `(${cuenta.correo}): ${cuenta.estado} → ${nuevoEstado}`,
      });

      return {
        exito: true,
        mensaje:
          `La cuenta ahora está ${nuevoEstado}. ` +
          "Registrado en la bitácora.",
      };
    },
    [usuario, usuarios, registrarActividad]
  );

  const solicitarRecuperacion = useCallback(
    (correoIngresado) => {
      const correo = normalizarCorreo(correoIngresado);

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return {
          exito: false,
          mensaje: "Ingresá un correo válido.",
        };
      }

      const cuenta = usuarios.find(
        (u) =>
          u.correo === correo &&
          u.origen === "registro"
      );

      const existeCredencial = cuentasRegistradas.some(
        (c) => c.id === cuenta?.id
      );

      if (!cuenta || !existeCredencial) {
        return {
          exito: false,
          mensaje:
            "No encontramos una cuenta registrada " +
            "con ese correo en esta demostración.",
        };
      }

      const codigo = generarCodigo();

      setRecuperaciones((anteriores) => ({
        ...anteriores,
        [correo]: {
          codigo,
          venceEn: Date.now() + DURACION_CODIGO,
          intentos: 0,
          cuentaId: cuenta.id,
        },
      }));

      registrarActividad({
        actor: cuenta,
        tipo: "usuarios",
        accion: "Solicitud de recuperación",
        detalle:
          "Se generó un código de recuperación de demostración",
      });

      return {
        exito: true,
        mensaje:
          "Código de demostración generado. " +
          "Tiene una validez de 10 minutos.",
        codigoDemo: codigo,
      };
    },
    [usuarios, cuentasRegistradas, registrarActividad]
  );

  const restablecerContrasena = useCallback(
    (correoIngresado, codigoIngresado, nueva, confirmar) => {
      const correo = normalizarCorreo(correoIngresado);
      const codigo = String(codigoIngresado).trim();

      if (!/^\d{6}$/.test(codigo)) {
        return {
          exito: false,
          mensaje: "Ingresá el código de seis dígitos.",
        };
      }

      // Nueva validación obligatoria.
      if (!evaluarContrasena(nueva).valida) {
        return {
          exito: false,
          mensaje:
            "La nueva contraseña debe tener mínimo " +
            "8 caracteres, mayúscula, minúscula, " +
            "número y carácter especial.",
        };
      }

      if (nueva !== confirmar) {
        return {
          exito: false,
          mensaje: "Las contraseñas no coinciden.",
        };
      }

      const solicitud = recuperaciones[correo];

      if (!solicitud) {
        return {
          exito: false,
          mensaje:
            "No existe una solicitud activa. " +
            "Solicitá un código nuevo.",
        };
      }

      if (Date.now() > solicitud.venceEn) {
        setRecuperaciones((anteriores) => {
          const copia = { ...anteriores };
          delete copia[correo];
          return copia;
        });

        return {
          exito: false,
          mensaje:
            "El código venció. Solicitá uno nuevo.",
        };
      }

      if (solicitud.intentos >= MAX_INTENTOS_CODIGO) {
        return {
          exito: false,
          mensaje:
            "Se agotaron los intentos. " +
            "Solicitá un código nuevo.",
        };
      }

      if (codigo !== solicitud.codigo) {
        const nuevosIntentos = solicitud.intentos + 1;

        setRecuperaciones((anteriores) => {
          const copia = { ...anteriores };

          if (nuevosIntentos >= MAX_INTENTOS_CODIGO) {
            delete copia[correo];
          } else {
            copia[correo] = {
              ...solicitud,
              intentos: nuevosIntentos,
            };
          }

          return copia;
        });

        return {
          exito: false,
          mensaje:
            nuevosIntentos >= MAX_INTENTOS_CODIGO
              ? "Código incorrecto. Se agotaron los intentos."
              : "Código incorrecto. Revisalo e intentá de nuevo.",
        };
      }

      const cuenta = usuarios.find(
        (u) =>
          u.id === solicitud.cuentaId &&
          u.correo === correo &&
          u.origen === "registro"
      );

      const credencialExiste = cuentasRegistradas.some(
        (c) => c.id === cuenta?.id
      );

      if (!cuenta || !credencialExiste) {
        return {
          exito: false,
          mensaje:
            "No se encontró la cuenta. " +
            "Solicitá una recuperación nueva.",
        };
      }

      setCuentasRegistradas((anteriores) =>
        anteriores.map((c) =>
          c.id === cuenta.id
            ? { ...c, contrasena: String(nueva) }
            : c
        )
      );

      setRecuperaciones((anteriores) => {
        const copia = { ...anteriores };
        delete copia[correo];
        return copia;
      });

      registrarActividad({
        actor: cuenta,
        tipo: "usuarios",
        accion: "Restablecimiento de contraseña",
        detalle:
          "Contraseña modificada mediante recuperación de demostración",
      });

      return {
        exito: true,
        mensaje:
          "¡Contraseña actualizada! " +
          "Ya podés iniciar sesión con la nueva.",
      };
    },
    [
      recuperaciones,
      usuarios,
      cuentasRegistradas,
      registrarActividad,
    ]
  );

  return (
    <AuthContext.Provider
      value={{
        usuario,
        autenticado: Boolean(usuario),
        motivoCierre,
        iniciarDemo,
        intentarLogin,
        registrarUsuario,
        cerrarSesion,
        actualizarPerfil,
        intentosLogin,
        actividades,
        registrarActividad,
        usuarios,
        actualizarRolUsuario,
        actualizarEstadoUsuario,
        solicitarRecuperacion,
        restablecerContrasena,
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
