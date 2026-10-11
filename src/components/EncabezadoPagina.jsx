export default function EncabezadoPagina({ titulo, descripcion, children }) {
  return (
    <div className="encabezado">
      <div>
        <h1>{titulo}</h1>
        {descripcion && <p>{descripcion}</p>}
      </div>
      {children && <div className="acciones">{children}</div>}
    </div>
  );
}
