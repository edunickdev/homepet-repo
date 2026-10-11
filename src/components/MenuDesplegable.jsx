import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function MenuDesplegable({ etiqueta, icono: Icono, claseBoton = 'menu__enlace', alineacion = 'izquierda', children }) {
  const [abierto, setAbierto] = useState(false);
  const referencia = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;

    function cerrarAlHacerClicFuera(evento) {
      if (!referencia.current.contains(evento.target)) setAbierto(false);
    }
    function cerrarConEscape(evento) {
      if (evento.key === 'Escape') setAbierto(false);
    }

    document.addEventListener('mousedown', cerrarAlHacerClicFuera);
    document.addEventListener('keydown', cerrarConEscape);
    return () => {
      document.removeEventListener('mousedown', cerrarAlHacerClicFuera);
      document.removeEventListener('keydown', cerrarConEscape);
    };
  }, [abierto]);

  const clases = ['desplegable', `desplegable--${alineacion}`, abierto && 'desplegable--abierto'].filter(Boolean).join(' ');

  return (
    <div ref={referencia} className={clases} data-titulo={etiqueta}>
      <button
        type="button"
        className={`${claseBoton} desplegable__boton`}
        onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto}
        aria-haspopup="true"
      >
        {Icono && <Icono size={16} />}
        <span>{etiqueta}</span>
        <ChevronDown size={16} className="desplegable__flecha" />
      </button>
      <div className="desplegable__lista" onClick={() => setAbierto(false)}>
        {children}
      </div>
    </div>
  );
}
