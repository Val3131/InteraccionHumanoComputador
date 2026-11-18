
import { useState } from "react";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Registro from "./pages/auth/Registro";
import Recuperacion from "./pages/auth/Recuperacion";

import InicioCliente from "./pages/cliente/InicioCliente";
import InicioVendedor from "./pages/vendedor/InicioVendedor";
import InicioAdmin from "./pages/admin/InicioAdmin";

import GestionUsuarios from "./usuarios/GestionUsuarios";
import MiPerfil from "./perfil/MiPerfil";

import SessionTimeout from "./security/SessionTimeout";
import IntentosLogin from "./security/IntentosLogin";
import BitacoraActividades from "./security/BitacoraActividades";

function ContenidoApp() {
  const [pantalla, setPantalla] = useState("login");
  const [vistaPrivada, setVistaPrivada] = useState("inicio");

  const { usuario, iniciarDemo } = useAuth();

  if (usuario) {
    if (vistaPrivada === "perfil") {
      return (
        <MiPerfil
          onVolver={() => setVistaPrivada("inicio")}
        />
      );
    }

    if (usuario.rol === "administrador") {
      if (vistaPrivada === "usuarios") {
        return (
          <GestionUsuarios
            onVolver={() => setVistaPrivada("inicio")}
          />
        );
      }

      if (vistaPrivada === "intentos") {
        return (
          <IntentosLogin
            onVolver={() => setVistaPrivada("inicio")}
          />
        );
      }

      if (vistaPrivada === "bitacora") {
        return (
          <BitacoraActividades
            onVolver={() => setVistaPrivada("inicio")}
          />
        );
      }

      return (
        <InicioAdmin
          onGestionUsuarios={() =>
            setVistaPrivada("usuarios")
          }
          onMiPerfil={() =>
            setVistaPrivada("perfil")
          }
          onIntentosLogin={() =>
            setVistaPrivada("intentos")
          }
          onBitacora={() =>
            setVistaPrivada("bitacora")
          }
        />
      );
    }

    if (usuario.rol === "vendedor") {
      return (
        <InicioVendedor
          onMiPerfil={() =>
            setVistaPrivada("perfil")
          }
        />
      );
    }

    if (usuario.rol === "cliente") {
      return (
        <InicioCliente
          onMiPerfil={() =>
            setVistaPrivada("perfil")
          }
        />
      );
    }

    return <p>Rol no reconocido.</p>;
  }

  if (pantalla === "registro") {
    return (
      <Registro
        onVolverLogin={() =>
          setPantalla("login")
        }
      />
    );
  }

  if (pantalla === "recuperacion") {
    return (
      <Recuperacion
        onVolverLogin={() =>
          setPantalla("login")
        }
      />
    );
  }

  return (
    <Login
      onIrRegistro={() =>
        setPantalla("registro")
      }
      onIrRecuperacion={() =>
        setPantalla("recuperacion")
      }
      onIniciarDemo={(rol) => {
        const correcto = iniciarDemo(rol);

        if (correcto) {
          setVistaPrivada("inicio");
          setPantalla("login");
        }
      }}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SessionTimeout />
      <ContenidoApp />
    </AuthProvider>
  );
}









