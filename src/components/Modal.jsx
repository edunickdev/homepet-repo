import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ titulo, alCerrar, children }) {
  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === 'Escape') alCerrar();
    }
    document.addEventListener('keydown', cerrarConEscape);
    document.body.classList.add('sin-scroll');
    return () => {
      document.removeEventListener('keydown', cerrarConEscape);
      document.body.classList.remove('sin-scroll');
    };
  }, [alCerrar]);

  function cerrarAlTocarFondo(evento) {
    if (evento.target === evento.currentTarget) alCerrar();
  }

  return (
    <div className="modal-fondo" onMouseDown={cerrarAlTocarFondo}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-titulo">
        <div className="modal__cabeza">
          <h2 id="modal-titulo">{titulo}</h2>
          <button className="boton-icono" onClick={alCerrar} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </div>
  );
}
