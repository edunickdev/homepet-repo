export default function Cargando({ texto = 'Cargando información...' }) {
  return (
    <div className="cargando" role="status">
      <span className="cargando__circulo" />
      <span>{texto}</span>
    </div>
  );
}
