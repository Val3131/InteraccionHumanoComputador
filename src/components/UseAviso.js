import { useEffect, useState } from 'react'


export function useAviso(inicial = null, milisegundos = 5000) {
  const [aviso, setAviso] = useState(inicial)

  useEffect(() => {
    if (!aviso) return undefined
    const temporizador = setTimeout(() => setAviso(null), milisegundos)
    return () => clearTimeout(temporizador)
  }, [aviso, milisegundos])

  return [aviso, setAviso]
}
