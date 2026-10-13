import { Calendar, Clock, MapPin, PawPrint, Phone, Mail, User, Store } from 'lucide-react';
import Modal from '../../components/Modal';
import Etiqueta from '../../components/Etiqueta';
import { ESTADOS_RESERVA, nombreDe } from '../../utils/constantes';
import { pesos } from '../../utils/formato';

export default function DetalleReservaModal({
  reserva,
  servicio,
  proveedor,
  mascota,
  cliente,
  alCerrar,
}) {
  return (
    <Modal titulo="Detalles de la Reserva" alCerrar={alCerrar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>{servicio?.nombre}</h3>
            <span className="texto-suave">Reserva #{reserva.id}</span>
          </div>
          <Etiqueta estado={reserva.estado}>{nombreDe(ESTADOS_RESERVA, reserva.estado)}</Etiqueta>
        </div>

        <div className="tarjeta" style={{ padding: '14px', background: 'var(--fondo)' }}>
          <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem' }}>Información de la cita</h4>
          <div style={{ display: 'grid', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={16} className="texto-suave" />
              <span><strong>Fecha:</strong> {reserva.fecha}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} className="texto-suave" />
              <span><strong>Hora:</strong> {reserva.hora}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={16} className="texto-suave" />
              <span><strong>Dirección a domicilio:</strong> {reserva.direccion}</span>
            </div>
            {reserva.notas && (
              <div style={{ marginTop: '4px' }}>
                <strong>Notas adicionales:</strong>
                <p style={{ margin: '4px 0 0', fontStyle: 'italic', color: 'var(--texto-suave)' }}>
                  {reserva.notas}
                </p>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div className="tarjeta" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <PawPrint size={18} color="var(--primario)" />
              <strong style={{ fontSize: '0.9rem' }}>Mascota</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>
              <strong>Nombre:</strong> {mascota?.nombre ?? 'No disponible'}<br />
              <strong>Especie:</strong> {mascota?.especie ?? 'No disponible'}<br />
              {mascota?.raza && <><strong>Raza:</strong> {mascota.raza}<br /></>}
              {mascota?.edad !== undefined && <><strong>Edad:</strong> {mascota.edad} años</>}
            </p>
          </div>

          <div className="tarjeta" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Store size={18} color="var(--acento)" />
              <strong style={{ fontSize: '0.9rem' }}>Proveedor</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem' }}>
              <strong>Nombre:</strong> {proveedor?.nombre ?? 'No disponible'}<br />
              <strong>Teléfono:</strong> {proveedor?.telefono ?? 'No disponible'}<br />
              <strong>Correo:</strong> {proveedor?.correo ?? 'No disponible'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--primario-claro)', borderRadius: 'var(--radio-pequeno)' }}>
          <span style={{ fontWeight: 600 }}>Tarifa total del servicio:</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primario)' }}>
            {pesos(servicio?.precio ?? 0)}
          </span>
        </div>

        <div className="acciones acciones--derecha">
          <button className="boton boton--secundario" onClick={alCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
