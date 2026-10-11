import { Link } from 'react-router-dom';
import { Construction } from 'lucide-react';
import EstadoVacio from '../../components/EstadoVacio';

export default function ModuloPendiente({ nombre }) {
  return (
    <div className="contenedor pagina">
      <EstadoVacio
        icono={Construction}
        titulo={`Módulo de ${nombre} en desarrollo`}
        descripcion="Este módulo está a cargo de otro integrante del equipo y se integrará en una próxima entrega."
      >
        <Link to="/" className="boton">
          Volver al inicio
        </Link>
      </EstadoVacio>
    </div>
  );
}
