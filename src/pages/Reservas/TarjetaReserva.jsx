import { Calendar, CheckCircle2, Clock, CreditCard, Eye, MapPin, PawPrint, User, XCircle } from 'lucide-react';
import Etiqueta from '../../components/Etiqueta';
import { ESTADOS_RESERVA, nombreDe } from '../../utils/constantes';
import { pesos } from '../../utils/formato';

export default function TarjetaReserva({
  reserva,
  servicio,
  proveedor,
  mascota,
  cliente,
  rolUsuario,
  alCambiarEstado,
  alPagar,
  alVerDetalle,
}) {
  const nombreServicio = servicio?.nombre ?? 'Servicio no especificado';
  const precioServicio = servicio?.precio ?? 0;
  const nombreProveedor = proveedor?.nombre ?? 'Proveedor no encontrado';
  const nombreMascota = mascota ? `${mascota.nombre} (${mascota.especie})` : 'Mascota no especificada';
  const nombreCliente = cliente?.nombre ?? 'Cliente';

  return (
    <article className="tarjeta tarjeta-item tarjeta-reserva">
      <div className="tarjeta-item__cabeza">
        <span className="avatar avatar--servicio">
          <Calendar size={24} />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{nombreServicio}</h3>
            <Etiqueta estado={reserva.estado}>{nombreDe(ESTADOS_RESERVA, reserva.estado)}</Etiqueta>
          </div>
          <span className="texto-suave" style={{ display: 'block', marginTop: '2px' }}>
            {rolUsuario === 'proveedor' ? `Cliente: ${nombreCliente}` : `Proveedor: ${nombreProveedor}`}
          </span>
        </div>
      </div>

      <ul className="datos" style={{ marginTop: '12px' }}>
        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PawPrint size={16} className="texto-suave" />
          <span><strong>Mascota:</strong> {nombreMascota}</span>
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Clock size={16} className="texto-suave" />
          <span><strong>Fecha y hora:</strong> {reserva.fecha} a las {reserva.hora}</span>
        </li>
        <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <MapPin size={16} className="texto-suave" />
          <span className="texto-truncado" title={reserva.direccion}><strong>Dirección:</strong> {reserva.direccion}</span>
        </li>
        {rolUsuario !== 'proveedor' && (
          <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={16} className="texto-suave" />
            <span><strong>Tarifa:</strong> {pesos(precioServicio)}</span>
          </li>
        )}
      </ul>

      {reserva.notas && (
        <p className="texto-suave" style={{ fontSize: '0.85rem', fontStyle: 'italic', margin: '8px 0 0', background: 'var(--fondo)', padding: '6px 10px', borderRadius: 'var(--radio-pequeno)' }}>
          "{reserva.notas}"
        </p>
      )}

      <div className="acciones" style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--borde)' }}>
        {/* Acciones para Propietario */}
        {rolUsuario === 'propietario' && (
          <>
            {reserva.estado === 'confirmada' && (
              <button className="boton boton--acento boton--pequeno" onClick={() => alPagar(reserva, servicio)}>
                <CreditCard size={15} />
                Pagar {pesos(precioServicio)}
              </button>
            )}
            {reserva.estado === 'pendiente' && (
              <button
                className="boton boton--peligro boton--pequeno"
                onClick={() => alCambiarEstado(reserva.id, 'cancelada')}
              >
                <XCircle size={15} />
                Cancelar
              </button>
            )}
            {reserva.estado === 'pagada' && (
              <span className="texto-suave" style={{ fontSize: '0.85rem', color: 'var(--exito)', fontWeight: 'bold' }}>
                ✓ Pago confirmado
              </span>
            )}
          </>
        )}

        {/* Acciones para Proveedor */}
        {rolUsuario === 'proveedor' && (
          <>
            {reserva.estado === 'pendiente' && (
              <>
                <button
                  className="boton boton--acento boton--pequeno"
                  onClick={() => alCambiarEstado(reserva.id, 'confirmada')}
                >
                  <CheckCircle2 size={15} />
                  Confirmar cita
                </button>
                <button
                  className="boton boton--peligro boton--pequeno"
                  onClick={() => alCambiarEstado(reserva.id, 'cancelada')}
                >
                  <XCircle size={15} />
                  Rechazar
                </button>
              </>
            )}
            {(reserva.estado === 'confirmada' || reserva.estado === 'pagada') && (
              <button
                className="boton boton--secundario boton--pequeno"
                onClick={() => alCambiarEstado(reserva.id, 'completada')}
              >
                <CheckCircle2 size={15} />
                Marcar completada
              </button>
            )}
          </>
        )}

        {/* Acciones para Administrador */}
        {rolUsuario === 'administrador' && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', width: '100%' }}>
            {reserva.estado === 'pendiente' && (
              <button
                className="boton boton--acento boton--pequeno"
                onClick={() => alCambiarEstado(reserva.id, 'confirmada')}
              >
                Confirmar
              </button>
            )}
            {reserva.estado !== 'completada' && reserva.estado !== 'cancelada' && (
              <button
                className="boton boton--secundario boton--pequeno"
                onClick={() => alCambiarEstado(reserva.id, 'completada')}
              >
                Completar
              </button>
            )}
            {reserva.estado !== 'cancelada' && (
              <button
                className="boton boton--peligro boton--pequeno"
                onClick={() => alCambiarEstado(reserva.id, 'cancelada')}
              >
                Cancelar
              </button>
            )}
          </div>
        )}

        <button className="boton boton--secundario boton--pequeno" onClick={() => alVerDetalle(reserva)}>
          <Eye size={15} />
          Detalles
        </button>
      </div>
    </article>
  );
}
