import { useState } from 'react';
import { ChartColumn, Eye, FileText, Plus, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { reportesApi } from '../../api/reportes';
import { pagosApi } from '../../api/pagos';
import { reservasApi } from '../../api/reservas';
import { serviciosApi } from '../../api/servicios';
import { proveedoresApi } from '../../api/proveedores';
import { useColeccion } from '../../hooks/useColeccion';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { TIPOS_REPORTE, nombreDe } from '../../utils/constantes';
import { coincide, pesos } from '../../utils/formato';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import Buscador from '../../components/Buscador';
import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import EstadoVacio from '../../components/EstadoVacio';
import Etiqueta from '../../components/Etiqueta';
import ConfirmarEliminar from '../../components/ConfirmarEliminar';
import GenerarReporteModal from './GenerarReporteModal';
import DetalleReporteModal from './DetalleReporteModal';

export default function Reportes() {
  const { usuario } = useSesion();
  const mostrarAviso = useAviso();

  const { items: reportes, cargando, error, crear, eliminar, recargar } = useColeccion(reportesApi);
  const { items: pagos } = useColeccion(pagosApi);
  const { items: reservas } = useColeccion(reservasApi);
  const { items: servicios } = useColeccion(serviciosApi);
  const { items: proveedores } = useColeccion(proveedoresApi);

  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [enGeneracion, setEnGeneracion] = useState(false);
  const [reporteDetalle, setReporteDetalle] = useState(null);
  const [porEliminar, setPorEliminar] = useState(null);

  const reportesFiltrados = reportes.filter((rep) => {
    const coincideTexto = coincide(rep.titulo, busqueda) || coincide(rep.resumen, busqueda);
    const coincideTipo = tipoFiltro === '' || rep.tipo_reporte === tipoFiltro;
    return coincideTexto && coincideTipo;
  });

  async function guardarNuevoReporte(datos) {
    try {
      await crear(datos);
      mostrarAviso(`El reporte "${datos.titulo}" fue generado y registrado exitosamente.`);
      setEnGeneracion(false);
    } catch (err) {
      mostrarAviso(err.message, 'error');
    }
  }

  async function confirmarEliminacion() {
    try {
      await eliminar(porEliminar.id);
      mostrarAviso(`El reporte "${porEliminar.titulo}" fue eliminado.`);
    } catch (err) {
      mostrarAviso(err.message, 'error');
    }
    setPorEliminar(null);
  }

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina
        titulo="Módulo de Reportes y Analítica"
        descripcion="Generación, consulta y control de informes operativos y financieros de Home Pet."
      >
        <button className="boton" onClick={() => setEnGeneracion(true)}>
          <Plus size={18} />
          Nuevo reporte
        </button>
      </EncabezadoPagina>

      {/* Filtros */}
      <div className="filtros">
        <Buscador valor={busqueda} alCambiar={setBusqueda} placeholder="Buscar por título o contenido del reporte" />
        <select
          value={tipoFiltro}
          onChange={(e) => setTipoFiltro(e.target.value)}
          aria-label="Filtrar por tipo de reporte"
        >
          <option value="">Todos los tipos de reporte</option>
          {TIPOS_REPORTE.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nombre}
            </option>
          ))}
        </select>
      </div>

      <MensajeError mensaje={error} alReintentar={recargar} />

      {cargando ? (
        <Cargando />
      ) : reportesFiltrados.length === 0 ? (
        <EstadoVacio
          icono={ChartColumn}
          titulo={reportes.length === 0 ? 'Aún no se han generado reportes' : 'No se encontraron reportes'}
          descripcion={
            reportes.length === 0
              ? 'Pulsa en "Nuevo reporte" para consolidar métricas de ingresos, reservas y proveedores.'
              : 'Prueba cambiando los criterios de búsqueda o tipo.'
          }
        >
          {reportes.length === 0 && (
            <button className="boton" onClick={() => setEnGeneracion(true)}>
              <Plus size={16} />
              Generar primer reporte
            </button>
          )}
        </EstadoVacio>
      ) : (
        <div className="tarjeta tabla-contenedor">
          <table className="tabla">
            <thead>
              <tr>
                <th>Reporte</th>
                <th>Tipo</th>
                <th>Periodo analizado</th>
                <th className="numero">Transacciones</th>
                <th className="numero">Ingresos</th>
                <th className="numero">Comisiones</th>
                <th>
                  <span className="solo-lector">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.map((rep) => (
                <tr key={rep.id}>
                  <td data-titulo="Reporte">
                    <span className="celda-doble">
                      <strong>{rep.titulo}</strong>
                      <small>Generado: {new Date(rep.creadoEn || Date.now()).toLocaleDateString('es-CO')}</small>
                    </span>
                  </td>
                  <td data-titulo="Tipo">
                    <Etiqueta estado={rep.tipo_reporte}>{nombreDe(TIPOS_REPORTE, rep.tipo_reporte)}</Etiqueta>
                  </td>
                  <td data-titulo="Periodo">
                    <span style={{ fontSize: '0.85rem' }}>
                      {rep.fecha_inicio} a {rep.fecha_fin}
                    </span>
                  </td>
                  <td data-titulo="Transacciones" className="numero">
                    {rep.total_transacciones ?? 0}
                  </td>
                  <td data-titulo="Ingresos" className="numero">
                    <strong>{pesos(rep.ingresos_totales ?? 0)}</strong>
                  </td>
                  <td data-titulo="Comisiones" className="numero" style={{ color: 'var(--primario)' }}>
                    <strong>{pesos(rep.comisiones_totales ?? 0)}</strong>
                  </td>
                  <td data-titulo="Acciones">
                    <div className="acciones acciones--tabla">
                      <button
                        className="boton-icono"
                        onClick={() => setReporteDetalle(rep)}
                        aria-label={`Ver detalle de ${rep.titulo}`}
                        title="Ver detalle del reporte"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="boton-icono boton-icono--peligro"
                        onClick={() => setPorEliminar(rep)}
                        aria-label={`Eliminar ${rep.titulo}`}
                        title="Eliminar reporte"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para Generar / Registrar Reporte */}
      {enGeneracion && (
        <GenerarReporteModal
          pagos={pagos}
          reservas={reservas}
          servicios={servicios}
          proveedores={proveedores}
          alGuardar={guardarNuevoReporte}
          alCerrar={() => setEnGeneracion(false)}
        />
      )}

      {/* Modal de Detalle de Reporte */}
      {reporteDetalle && (
        <DetalleReporteModal reporte={reporteDetalle} alCerrar={() => setReporteDetalle(null)} />
      )}

      {/* Modal para Confirmar Eliminación */}
      {porEliminar && (
        <ConfirmarEliminar
          titulo="Eliminar reporte"
          mensaje={`¿Seguro que deseas eliminar el informe "${porEliminar.titulo}"?`}
          alConfirmar={confirmarEliminacion}
          alCerrar={() => setPorEliminar(null)}
        />
      )}
    </div>
  );
}
