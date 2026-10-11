import { CircleAlert } from 'lucide-react';

export default function MensajeError({ mensaje, alReintentar }) {
  if (!mensaje) return null;

  return (
    <div className="mensaje-error" role="alert">
      <CircleAlert size={20} />
      <span>{mensaje}</span>
      {alReintentar && (
        <button className="boton boton--secundario boton--pequeno" onClick={alReintentar}>
          Reintentar
        </button>
      )}
    </div>
  );
}
