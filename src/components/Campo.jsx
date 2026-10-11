export default function Campo({ etiqueta, nombre, error, ayuda, children, ...propiedades }) {
  const control = children ?? <input id={nombre} name={nombre} {...propiedades} />;

  return (
    <div className={`campo ${error ? 'campo--error' : ''}`}>
      <label htmlFor={nombre}>{etiqueta}</label>
      {control}
      {error ? <small className="campo__error">{error}</small> : ayuda && <small>{ayuda}</small>}
    </div>
  );
}
