import { useState } from 'react';
import { CalendarCheck, CalendarDays, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { reservasApi } from '../../api/reservas';
import { serviciosApi } from '../../api/servicios';
import { proveedoresApi } from '../../api/proveedores';
import { mascotasApi } from '../../api/mascotas';
import { usuariosApi } from '../../api/usuarios';
import { useColeccion } from '../../hooks/useColeccion';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { ESTADOS_RESERVA } from '../../utils/constantes';
import { coincide } from '../../utils/formato';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import Buscador from '../../components/Buscador';
import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import EstadoVacio from '../../components/EstadoVacio';
import TarjetaReserva from './TarjetaReserva';
import DetalleReservaModal from './DetalleReservaModal';
import SimuladorPagoModal from '../../components/SimuladorPagoModal';

export default function Reservas() {
  const { usuario } = useSesion();
  const mostrarAviso = useAviso();

  const filtrosColeccion =
    usuario?.rol === 'propietario'
      ? { usuarioId: usuario.id }
      : usuario?.rol === 'proveedor'
      ? { proveedorId: usuario.id }
      : {};

  const { items: reservas, cargando, error, actualizar, recargar } = useColeccion(reservasApi, filtrosColeccion);
  const { items: servicios } = useColeccion(serviciosApi);
  const { items: proveedores } = useColeccion(proveedoresApi);
  const { items: mascotas } = useColeccion(mascotasApi);
  const { items: usuarios } = useColeccion(usuariosApi);

  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('');
  const [reservaDetalle, setReservaDetalle] = useState(null);
  const [reservaParaPagar, setReservaParaPagar] = useState(null);

  function resolverServicio(servicioId) {
    return servicios.find((s) => s.id === servicioId);
  }

  function resolverProveedor(proveedorId, servicio) {
    const id = proveedorId || servicio?.proveedorId;
    return proveedores.find((p) => p.id === id);
  }

  function resolverMascota(mascotaId) {
    return mascotas.find((m) => m.id === mascotaId);
  }

  function resolverCliente(usuarioId) {
    return usuarios.find((u) => u.id === usuarioId);
  }

  const reservasFiltradas = reservas.filter((reserva) => {
    const s = resolverServicio(reserva.servicioId);
    const p = resolverProveedor(reserva.proveedorId, s);
    const m = resolverMascota(reserva.mascotaId);
    const c = resolverCliente(reserva.usuarioId);

    const coincideTexto =
      coincide(s?.nombre, busqueda) ||
      coincide(p?.nombre, busqueda) ||
      coincide(m?.nombre, busqueda) ||
      coincide(c?.nombre, busqueda);

    const coincideEstado = estadoFiltro === '' || reserva.estado === estadoFiltro;

    return coincideTexto && coincideEstado;
  });

  async function cambiarEstado(id, nuevoEstado) {
    try {
      await actualizar(id, { estado: nuevoEstado });
      mostrarAviso(`Reserva #${id} actualizada a estado "${nuevoEstado}".`);
    } catch (err) {
      mostrarAviso(err.message, 'error');
    }
  }

  function iniciarPago(reserva, servicio) {
    setReservaParaPagar({ reserva, servicio });
  }

  function pagoCompletado() {
    recargar();
    mostrarAviso('Pago registrado correctamente. Tu reserva está asegurada.');
  }

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina
        titulo={usuario?.rol === 'proveedor' ? 'Agenda de servicios' : 'Reservas'}
        descripcion={
          usuario?.rol === 'propietario'
            ? 'Historial y estado de tus citas agendadas para el cuidado de tus mascotas.'
            : usuario?.rol === 'proveedor'
            ? 'Solicitudes y servicios asignados a tu cuenta para atender a domicilio.'
            : 'Control y supervisión global de reservas agendadas en Home Pet.'
        }
      >
        {usuario?.rol === 'propietario' && (
          <Link to="/servicios" className="boton">
            <Plus size={18} />
            Agendar nuevo servicio
          </Link>
        )}
      </EncabezadoPagina>

      <div className="filtros">
        <Buscador valor={busqueda} alCambiar={setBusqueda} placeholder="Buscar por servicio, mascota o proveedor" />
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          aria-label="Filtrar por estado de reserva"
        >
          <option value="">Todos los estados</option>
          {ESTADOS_RESERVA.map((est) => (
            <option key={est.id} value={est.id}>
              {est.nombre}
            </option>
          ))}
        </select>
      </div>

      <MensajeError mensaje={error} alReintentar={recargar} />

      {cargando ? (
        <Cargando />
      ) : reservasFiltradas.length === 0 ? (
        <EstadoVacio
          icono={CalendarDays}
          titulo={reservas.length === 0 ? 'No hay reservas registradas' : 'No se encontraron reservas'}
          descripcion={
            reservas.length === 0
              ? usuario?.rol === 'propietario'
                ? 'Explora el catálogo de servicios y agenda tu primera cita.'
                : 'Aún no has recibido solicitudes de reserva para tus servicios.'
              : 'Prueba ajustando el texto de búsqueda o el filtro de estado.'
          }
        >
          {usuario?.rol === 'propietario' && (
            <Link to="/servicios" className="boton">
              Ver catálogo de servicios
            </Link>
          )}
        </EstadoVacio>
      ) : (
        <div className="rejilla">
          {reservasFiltradas.map((reserva) => {
            const servicio = resolverServicio(reserva.servicioId);
            const proveedor = resolverProveedor(reserva.proveedorId, servicio);
            const mascota = resolverMascota(reserva.mascotaId);
            const cliente = resolverCliente(reserva.usuarioId);

            return (
              <TarjetaReserva
                key={reserva.id}
                reserva={reserva}
                servicio={servicio}
                proveedor={proveedor}
                mascota={mascota}
                cliente={cliente}
                rolUsuario={usuario?.rol}
                alCambiarEstado={cambiarEstado}
                alPagar={iniciarPago}
                alVerDetalle={() => setReservaDetalle({ reserva, servicio, proveedor, mascota, cliente })}
              />
            );
          })}
        </div>
      )}

      {/* Modal de Detalle */}
      {reservaDetalle && (
        <DetalleReservaModal
          reserva={reservaDetalle.reserva}
          servicio={reservaDetalle.servicio}
          proveedor={reservaDetalle.proveedor}
          mascota={reservaDetalle.mascota}
          cliente={reservaDetalle.cliente}
          alCerrar={() => setReservaDetalle(null)}
        />
      )}

      {/* Modal de Simulación de Pago */}
      {reservaParaPagar && (
        <SimuladorPagoModal
          reserva={reservaParaPagar.reserva}
          servicio={reservaParaPagar.servicio}
          proveedor={resolverProveedor(reservaParaPagar.reserva.proveedorId, reservaParaPagar.servicio)}
          mascota={resolverMascota(reservaParaPagar.reserva.mascotaId)}
          usuario={usuario}
          alCerrar={() => setReservaParaPagar(null)}
          alPagoCompletado={pagoCompletado}
        />
      )}
    </div>
  );
}
