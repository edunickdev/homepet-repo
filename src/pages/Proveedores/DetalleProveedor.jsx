import { Mail, MapPin, Phone } from 'lucide-react';
import { DISPONIBILIDAD_SERVICIO, ESTADOS_PROVEEDOR, buscarCategoria, nombreDe } from '../../utils/constantes';
import { iniciales, pesos } from '../../utils/formato';
import Etiqueta from '../../components/Etiqueta';

export default function DetalleProveedor({ proveedor, servicios }) {
  return (
    <div className="detalle">
      <div className="tarjeta-item__cabeza">
        <span className="avatar avatar--texto">{iniciales(proveedor.nombre)}</span>
        <div>
          <h3>{proveedor.nombre}</h3>
          <Etiqueta estado={proveedor.estado}>{nombreDe(ESTADOS_PROVEEDOR, proveedor.estado)}</Etiqueta>
        </div>
      </div>

      <ul className="datos">
        <li>
          <Mail size={15} />
          {proveedor.correo}
        </li>
        <li>
          <Phone size={15} />
          {proveedor.telefono}
        </li>
        <li>
          <MapPin size={15} />
          {proveedor.direccion || 'Zona sin registrar'}
        </li>
      </ul>

      <h4>Servicios ofrecidos</h4>
      {servicios.length === 0 ? (
        <p className="texto-suave">Este proveedor aún no tiene servicios registrados.</p>
      ) : (
        <ul className="lista-simple">
          {servicios.map((servicio) => (
            <li key={servicio.id}>
              <span className="celda-doble">
                {servicio.nombre}
                <small>{buscarCategoria(servicio.categoria).nombre}</small>
              </span>
              <span className="celda-doble celda-doble--derecha">
                {pesos(servicio.precio)}
                <small>{nombreDe(DISPONIBILIDAD_SERVICIO, servicio.disponibilidad)}</small>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
