import { Link, Navigate, useLocation } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useSesion } from '../context/SesionContext';
import { puedeAcceder } from '../utils/permisos';
import EstadoVacio from './EstadoVacio';

export default function RutaPrivada({ modulo, children }) {
  const { usuario } = useSesion();
  const ubicacion = useLocation();

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />;
  }

  if (modulo && !puedeAcceder(usuario, modulo)) {
    return (
      <div className="contenedor pagina">
        <EstadoVacio
          icono={ShieldAlert}
          titulo="Acceso restringido"
          descripcion="Tu tipo de cuenta no tiene permiso para ver este módulo."
        >
          <Link to="/" className="boton">
            Volver al inicio
          </Link>
        </EstadoVacio>
      </div>
    );
  }

  return children;
}
