export default function Aviso({ aviso, children }) {
  if (!aviso) return null
  return (
    <div
      className={`aviso aviso--${aviso.tipo}`}
      role={aviso.tipo === 'error' ? 'alert' : 'status'}
    >
      <span>{aviso.texto}</span>
      {children}
    </div>
  )
}
