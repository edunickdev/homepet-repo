import { useState } from 'react';
import { CreditCard, DollarSign, Eye, FileText, Receipt, ShieldCheck, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { pagosApi } from '../../api/pagos';
import { reservasApi } from '../../api/reservas';
import { serviciosApi } from '../../api/servicios';
import { proveedoresApi } from '../../api/proveedores';
import { usuariosApi } from '../../api/usuarios';
import { useColeccion } from '../../hooks/useColeccion';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { pesos, coincide } from '../../utils/formato';
import { METODOS_PAGO } from '../../utils/constantes';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import Buscador from '../../components/Buscador';
import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import EstadoVacio from '../../components/EstadoVacio';
import Etiqueta from '../../components/Etiqueta';
import ComprobantePagoModal from './ComprobantePagoModal';
import SimuladorPagoModal from '../../components/SimuladorPagoModal';

export default function Pagos() {
  const { usuario } = useSesion();
  const mostrarAviso = useAviso();

  const filtrosPagos =
    usuario?.rol === 'propietario'
      ? { usuarioId: usuario.id }
      : usuario?.rol === 'proveedor'
      ? { proveedorId: usuario.id }
      : {};

  const { items: pagos, cargando, error, recargar } = useColeccion(pagosApi, filtrosPagos);
  const { items: reservas, recargar: recargarReservas } = useColeccion(
    reservasApi,
    usuario?.rol === 'propietario' ? { usuarioId: usuario.id } : {}
  );
  const { items: servicios } = useColeccion(serviciosApi);
  const { items: proveedores } = useColeccion(proveedoresApi);
  const { items: usuarios } = useColeccion(usuariosApi);

  const [busqueda, setBusqueda] = useState('');
  const [metodoFiltro, setMetodoFiltro] = useState('');
  const [pagoSeleccionado, setPagoSeleccionado] = useState(null);
  const [reservaParaPagar, setReservaParaPagar] = useState(null);

  // Reservas del cliente pendientes de pago
  const reservasPendientesPago =
    usuario?.rol === 'propietario'
      ? reservas.filter((r) => r.estado === 'confirmada' || r.estado === 'pendiente')
      : [];

  function resolverServicio(servicioId) {
    return servicios.find((s) => s.id === servicioId);
  }

  function resolverProveedor(proveedorId) {
    return proveedores.find((p) => p.id === proveedorId);
  }

  function resolverUsuario(usuarioId) {
    return usuarios.find((u) => u.id === usuarioId);
  }

  const pagosFiltrados = pagos.filter((pago) => {
    const s = resolverServicio(pago.servicioId);
    const prov = resolverProveedor(pago.proveedorId);
    const cli = resolverUsuario(pago.usuarioId);

    const coincideTexto =
      coincide(pago.referencia, busqueda) ||
      coincide(s?.nombre, busqueda) ||
      coincide(prov?.nombre, busqueda) ||
      coincide(cli?.nombre, busqueda);

    const coincideMetodo = metodoFiltro === '' || pago.metodo_pago.includes(metodoFiltro);

    return coincideTexto && coincideMetodo;
  });

  // Métricas financieras
  const totalVolumen = pagos.reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
  const totalComisiones = pagos.reduce((acc, p) => acc + (Number(p.valor_comision) || 0), 0);
  const totalNetoProveedor = pagos.reduce((acc, p) => acc + (Number(p.neto_proveedor) || 0), 0);

  function abrirSimulador(reserva) {
    const servicio = resolverServicio(reserva.servicioId);
    setReservaParaPagar({ reserva, servicio });
  }

  function alPagoExitoso() {
    recargar();
    recargarReservas();
    mostrarAviso('Pago registrado satisfactoriamente.');
  }

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina
        titulo="Módulo de Pagos y Facturación"
        descripcion={
          usuario?.rol === 'propietario'
            ? 'Consulta tus recibos, comprobantes y realiza pagos simulados de tus servicios.'
            : usuario?.rol === 'proveedor'
            ? 'Consulta los ingresos recibidos por tus servicios y el desglose de comisiones.'
            : 'Auditoría financiera global de transacciones, recaudos y comisiones de Home Pet.'
        }
      />

      {/* Tarjetas de Métricas para Administrador y Proveedor */}
      {(usuario?.rol === 'administrador' || usuario?.rol === 'proveedor') && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div className="tarjeta" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radio-pequeno)',
                background: 'var(--primario-claro)',
                color: 'var(--primario)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DollarSign size={24} />
            </span>
            <div>
              <span className="texto-suave" style={{ fontSize: '0.85rem' }}>
                {usuario?.rol === 'proveedor' ? 'Ventas brutas' : 'Volumen total intermediado'}
              </span>
              <strong style={{ display: 'block', fontSize: '1.25rem' }}>{pesos(totalVolumen)}</strong>
            </div>
          </div>

          <div className="tarjeta" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radio-pequeno)',
                background: 'var(--acento-claro)',
                color: 'var(--acento-oscuro)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TrendingUp size={24} />
            </span>
            <div>
              <span className="texto-suave" style={{ fontSize: '0.85rem' }}>
                {usuario?.rol === 'proveedor' ? 'Comisión retenida' : 'Comisiones de plataforma'}
              </span>
              <strong style={{ display: 'block', fontSize: '1.25rem', color: 'var(--primario)' }}>
                {pesos(totalComisiones)}
              </strong>
            </div>
          </div>

          <div className="tarjeta" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radio-pequeno)',
                background: 'var(--exito-claro)',
                color: 'var(--exito)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Wallet size={24} />
            </span>
            <div>
              <span className="texto-suave" style={{ fontSize: '0.85rem' }}>
                {usuario?.rol === 'proveedor' ? 'Ingreso neto liquidado' : 'Transacciones aprobadas'}
              </span>
              <strong style={{ display: 'block', fontSize: '1.25rem' }}>
                {usuario?.rol === 'proveedor' ? pesos(totalNetoProveedor) : `${pagos.length} pagos`}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Sección especial de reservas por pagar para Propietarios */}
      {usuario?.rol === 'propietario' && reservasPendientesPago.length > 0 && (
        <div className="tarjeta" style={{ padding: '18px', marginBottom: '24px', background: 'var(--superficie)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Receipt size={20} color="var(--primario)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Citas pendientes de pago</h3>
          </div>
          <p className="texto-suave" style={{ margin: '0 0 14px', fontSize: '0.9rem' }}>
            Tienes reservas confirmadas o en espera. Puedes simular el pago de forma inmediata para asegurar la cita.
          </p>

          <div style={{ display: 'grid', gap: '10px' }}>
            {reservasPendientesPago.map((res) => {
              const serv = resolverServicio(res.servicioId);
              const prov = resolverProveedor(res.proveedorId || serv?.proveedorId);

              return (
                <div
                  key={res.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: 'var(--radio-pequeno)',
                    background: 'var(--fondo)',
                    border: '1px solid var(--borde)',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <strong>{serv?.nombre}</strong>
                    <span className="texto-suave" style={{ display: 'block', fontSize: '0.85rem' }}>
                      {res.fecha} a las {res.hora} · {prov?.nombre}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontWeight: 800, color: 'var(--primario)', fontSize: '1.05rem' }}>
                      {pesos(serv?.precio ?? 0)}
                    </span>
                    <button
                      className="boton boton--acento boton--pequeno"
                      onClick={() => abrirSimulador(res)}
                    >
                      <CreditCard size={15} />
                      Simular pago
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="filtros">
        <Buscador valor={busqueda} alCambiar={setBusqueda} placeholder="Buscar por referencia, servicio o participante" />
        <select
          value={metodoFiltro}
          onChange={(e) => setMetodoFiltro(e.target.value)}
          aria-label="Filtrar por método de pago"
        >
          <option value="">Todos los métodos</option>
          {METODOS_PAGO.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <MensajeError mensaje={error} alReintentar={recargar} />

      {cargando ? (
        <Cargando />
      ) : pagosFiltrados.length === 0 ? (
        <EstadoVacio
          icono={CreditCard}
          titulo={pagos.length === 0 ? 'No hay pagos registrados' : 'No se encontraron pagos'}
          descripcion={
            pagos.length === 0
              ? 'Cuando se procese el pago de una reserva, aparecerá en este registro con su comprobante digital.'
              : 'Prueba cambiando los filtros de búsqueda o método.'
          }
        />
      ) : (
        <div className="tarjeta tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Referencia</th>
                <th>Fecha</th>
                <th>Servicio</th>
                {usuario?.rol !== 'propietario' && <th>Cliente</th>}
                {usuario?.rol !== 'proveedor' && <th>Proveedor</th>}
                <th className="numero">Valor</th>
                {usuario?.rol !== 'propietario' && <th className="numero">Comisión ({pagos[0]?.porcentaje_comision || 15}%)</th>}
                {usuario?.rol === 'proveedor' && <th className="numero">Ganancia neta</th>}
                <th>Estado</th>
                <th>
                  <span className="solo-lector">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((pago) => {
                const s = resolverServicio(pago.servicioId);
                const prov = resolverProveedor(pago.proveedorId);
                const cli = resolverUsuario(pago.usuarioId);

                return (
                  <tr key={pago.id}>
                    <td data-titulo="Referencia">
                      <span className="celda-doble">
                        <strong>{pago.referencia}</strong>
                        <small>{pago.metodo_pago}</small>
                      </span>
                    </td>
                    <td data-titulo="Fecha">
                      <span style={{ fontSize: '0.85rem' }}>
                        {new Date(pago.fecha_pago).toLocaleDateString('es-CO')}
                      </span>
                    </td>
                    <td data-titulo="Servicio">
                      <strong>{s?.nombre ?? 'Servicio'}</strong>
                    </td>
                    {usuario?.rol !== 'propietario' && (
                      <td data-titulo="Cliente">
                        <span>{cli?.nombre ?? 'Cliente'}</span>
                      </td>
                    )}
                    {usuario?.rol !== 'proveedor' && (
                      <td data-titulo="Proveedor">
                        <span>{prov?.nombre ?? 'Proveedor'}</span>
                      </td>
                    )}
                    <td data-titulo="Valor" className="numero">
                      <strong>{pesos(pago.valor)}</strong>
                    </td>
                    {usuario?.rol !== 'propietario' && (
                      <td data-titulo="Comisión" className="numero" style={{ color: 'var(--texto-suave)' }}>
                        {pesos(pago.valor_comision)}
                      </td>
                    )}
                    {usuario?.rol === 'proveedor' && (
                      <td data-titulo="Ganancia neta" className="numero" style={{ color: 'var(--primario)' }}>
                        <strong>{pesos(pago.neto_proveedor)}</strong>
                      </td>
                    )}
                    <td data-titulo="Estado">
                      <Etiqueta estado={pago.estado}>{pago.estado}</Etiqueta>
                    </td>
                    <td data-titulo="Acciones">
                      <div className="acciones acciones--tabla">
                        <button
                          className="boton-icono"
                          onClick={() => setPagoSeleccionado({ pago, servicio: s, proveedor: prov, cliente: cli })}
                          aria-label={`Ver comprobante de ${pago.referencia}`}
                          title="Ver comprobante"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Comprobante */}
      {pagoSeleccionado && (
        <ComprobantePagoModal
          pago={pagoSeleccionado.pago}
          servicio={pagoSeleccionado.servicio}
          proveedor={pagoSeleccionado.proveedor}
          cliente={pagoSeleccionado.cliente}
          rolUsuario={usuario?.rol}
          alCerrar={() => setPagoSeleccionado(null)}
        />
      )}

      {/* Modal de Simulación de Pago (para cuando un propietario paga desde la vista Pagos) */}
      {reservaParaPagar && (
        <SimuladorPagoModal
          reserva={reservaParaPagar.reserva}
          servicio={reservaParaPagar.servicio}
          proveedor={resolverProveedor(reservaParaPagar.reserva.proveedorId || reservaParaPagar.servicio?.proveedorId)}
          usuario={usuario}
          alCerrar={() => setReservaParaPagar(null)}
          alPagoCompletado={alPagoExitoso}
        />
      )}
    </div>
  );
}
