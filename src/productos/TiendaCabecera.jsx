import IconoPerchero from '../components/IconoPerchero.jsx'


export default function TiendaCabecera({ onVolver, textoVolver = 'Volver al panel', children }) {
  return (
    <header className="tienda-cabecera">
      <div className="tienda-marca">
        <IconoPerchero tamano={30} />
        BellasBotique
      </div>
      <div className="tienda-cabecera__acciones">
        {children}
        <button type="button" className="btn btn-primary" onClick={onVolver}>
          {textoVolver}
        </button>
      </div>
    </header>
  )
}
