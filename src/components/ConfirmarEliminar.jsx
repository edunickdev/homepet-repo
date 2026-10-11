import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmarEliminar({ titulo, mensaje, advertencia, alConfirmar, alCerrar }) {
  const [eliminando, setEliminando] = useState(false);

  async function confirmar() {
    setEliminando(true);
    try {
      await alConfirmar();
    } finally {
      setEliminando(false);
    }
  }

  return (
    <Modal titulo={titulo} alCerrar={alCerrar}>
      <p>{mensaje}</p>
      {advertencia && <p className="advertencia">{advertencia}</p>}
      <p className="texto-suave">Esta acción no se puede deshacer.</p>
      <div className="acciones acciones--derecha">
        <button className="boton boton--secundario" onClick={alCerrar} disabled={eliminando}>
          Cancelar
        </button>
        <button className="boton boton--peligro" onClick={confirmar} disabled={eliminando}>
          <Trash2 size={16} />
          {eliminando ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </Modal>
  );
}
