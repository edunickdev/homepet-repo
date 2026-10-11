export default function EstadoVacio({ icono: Icono, titulo, descripcion, children }) {
  return (
    <div className="vacio">
      {Icono && <Icono size={40} strokeWidth={1.5} />}
      <h3>{titulo}</h3>
      {descripcion && <p>{descripcion}</p>}
      {children}
    </div>
  );
}
