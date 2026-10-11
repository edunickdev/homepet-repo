import { createContext, useContext, useState } from 'react';
import { CircleAlert, CircleCheck } from 'lucide-react';

const AvisoContext = createContext(null);

export function AvisoProvider({ children }) {
  const [avisos, setAvisos] = useState([]);

  function mostrarAviso(mensaje, tipo = 'exito') {
    const id = Date.now() + Math.random();
    setAvisos((actuales) => [...actuales, { id, mensaje, tipo }]);
    setTimeout(() => {
      setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id));
    }, 3500);
  }

  return (
    <AvisoContext.Provider value={mostrarAviso}>
      {children}
      <div className="avisos" role="status" aria-live="polite">
        {avisos.map((aviso) => (
          <div key={aviso.id} className={`aviso aviso--${aviso.tipo}`}>
            {aviso.tipo === 'error' ? <CircleAlert size={18} /> : <CircleCheck size={18} />}
            <span>{aviso.mensaje}</span>
          </div>
        ))}
      </div>
    </AvisoContext.Provider>
  );
}

export function useAviso() {
  return useContext(AvisoContext);
}
