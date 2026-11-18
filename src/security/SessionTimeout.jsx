
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const TIEMPO_INACTIVIDAD = 15 * 1000;

export default function SessionTimeout() {
  const { autenticado, cerrarSesion } = useAuth();

  useEffect(() => {
    if (!autenticado) return;

    let ultimoMovimiento = Date.now();
    let temporizador;

    const comprobarInactividad = () => {
      const tiempoTranscurrido =
        Date.now() - ultimoMovimiento;

      if (tiempoTranscurrido >= TIEMPO_INACTIVIDAD) {
        cerrarSesion("inactividad");
        return;
      }

      clearTimeout(temporizador);

      temporizador = setTimeout(
        comprobarInactividad,
        TIEMPO_INACTIVIDAD - tiempoTranscurrido
      );
    };

    const registrarActividad = () => {
      // Primero comprobamos si la sesión ya expiró.
      if (
        Date.now() - ultimoMovimiento >=
        TIEMPO_INACTIVIDAD
      ) {
        comprobarInactividad();
        return;
      }

      ultimoMovimiento = Date.now();
      clearTimeout(temporizador);

      temporizador = setTimeout(
        comprobarInactividad,
        TIEMPO_INACTIVIDAD
      );
    };

    const revisarAlRegresar = () => {
      if (document.visibilityState === "visible") {
        comprobarInactividad();
      }
    };

    const eventos = [
      "pointerdown",
      "pointermove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    eventos.forEach((evento) => {
      window.addEventListener(
        evento,
        registrarActividad,
        { passive: true }
      );
    });

    document.addEventListener(
      "visibilitychange",
      revisarAlRegresar
    );

    window.addEventListener(
      "focus",
      comprobarInactividad
    );

    temporizador = setTimeout(
      comprobarInactividad,
      TIEMPO_INACTIVIDAD
    );

    return () => {
      clearTimeout(temporizador);

      eventos.forEach((evento) => {
        window.removeEventListener(
          evento,
          registrarActividad
        );
      });

      document.removeEventListener(
        "visibilitychange",
        revisarAlRegresar
      );

      window.removeEventListener(
        "focus",
        comprobarInactividad
      );
    };
  }, [autenticado, cerrarSesion]);

  return null;
}
