import { Link } from 'react-router-dom';
import { CircleAlert } from 'lucide-react';
import EstadoVacio from '../components/EstadoVacio';

export default function NoEncontrada() {
  return (
    <div className="contenedor pagina">
      <EstadoVacio icono={CircleAlert} titulo="Página no encontrada" descripcion="La dirección que buscas no existe.">
        <Link to="/" className="boton">
          Ir al inicio
        </Link>
      </EstadoVacio>
    </div>
  );
}
