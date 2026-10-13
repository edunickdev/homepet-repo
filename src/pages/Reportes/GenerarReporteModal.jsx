import { useState } from 'react';
import { ChartColumn, FileSpreadsheet, Plus } from 'lucide-react';
import Modal from '../../components/Modal';
import Campo from '../../components/Campo';
import MensajeError from '../../components/MensajeError';
import { TIPOS_REPORTE } from '../../utils/constantes';

function fechaPrimerDiaMes() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-01`;
}

function fechaHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

export default function GenerarReporteModal({
  pagos,
  reservas,
  servicios,
  proveedores,
  alGuardar,
  alCerrar,
}) {
  const [tipoReporte, setTipoReporte] = useState('ingresos_comisiones');
  const [titulo, setTitulo] = useState('Informe de Operación y Comisiones');
  const [fechaInicio, setFechaInicio] = useState(fechaPrimerDiaMes());
  const [fechaFin, setFechaFin] = useState(fechaHoy());
  const [resumen, setResumen] = useState('');
  const [error, setError] = useState('');
  const [generando, setGenerando] = useState(false);

  function cambiarTipo(nuevoTipo) {
    setTipoReporte(nuevoTipo);
    if (nuevoTipo === 'ingresos_comisiones') {
      setTitulo('Informe de Ingresos y Comisiones');
    } else if (nuevoTipo === 'servicios_demandados') {
      setTitulo('Informe de Servicios Más Demandados');
    } else if (nuevoTipo === 'rendimiento_proveedores') {
      setTitulo('Informe de Rendimiento de Proveedores');
    } else if (nuevoTipo === 'estado_reservas') {
      setTitulo('Informe de Estado de Citas y Reservas');
    }
  }

  async function procesarGeneracion(evento) {
    evento.preventDefault();
    if (!titulo.trim()) {
      setError('Por favor ingresa un título para el reporte.');
      return;
    }
    if (fechaInicio > fechaFin) {
      setError('La fecha inicial no puede ser posterior a la fecha final.');
      return;
    }

    setGenerando(true);
    setError('');

    try {
      // Filtrar pagos dentro del periodo
      const pagosEnPeriodo = pagos.filter((p) => {
        const f = p.fecha_pago ? p.fecha_pago.slice(0, 10) : '';
        return (!fechaInicio || f >= fechaInicio) && (!fechaFin || f <= fechaFin);
      });

      // Filtrar reservas dentro del periodo
      const reservasEnPeriodo = reservas.filter((r) => {
        return (!fechaInicio || r.fecha >= fechaInicio) && (!fechaFin || r.fecha <= fechaFin);
      });

      const totalTransacciones = pagosEnPeriodo.length;
      const ingresosTotales = pagosEnPeriodo.reduce((acc, p) => acc + (Number(p.valor) || 0), 0);
      const comisionesTotales = pagosEnPeriodo.reduce((acc, p) => acc + (Number(p.valor_comision) || 0), 0);

      // Métricas extra según tipo de reporte
      const datosExtra = {};
      if (tipoReporte === 'ingresos_comisiones') {
        datosExtra['Tasa efectiva de comisión'] = totalTransacciones > 0 ? `${pagosEnPeriodo[0]?.porcentaje_comision || 15}%` : '15%';
        datosExtra['Liquidado a aliados'] = ingresosTotales - comisionesTotales;
      } else if (tipoReporte === 'servicios_demandados') {
        datosExtra['Total citas agendadas'] = reservasEnPeriodo.length;
        datosExtra['Servicios activos en catálogo'] = servicios.length;
      } else if (tipoReporte === 'rendimiento_proveedores') {
        datosExtra['Proveedores con actividad'] = proveedores.length;
        datosExtra['Citas completadas'] = reservasEnPeriodo.filter((r) => r.estado === 'completada').length;
      } else if (tipoReporte === 'estado_reservas') {
        datosExtra['Citas pendientes'] = reservasEnPeriodo.filter((r) => r.estado === 'pendiente').length;
        datosExtra['Citas confirmadas'] = reservasEnPeriodo.filter((r) => r.estado === 'confirmada').length;
        datosExtra['Citas pagadas'] = reservasEnPeriodo.filter((r) => r.estado === 'pagada').length;
        datosExtra['Citas canceladas'] = reservasEnPeriodo.filter((r) => r.estado === 'cancelada').length;
      }

      const reporteNuevo = {
        tipo_reporte: tipoReporte,
        titulo: titulo.trim(),
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        resumen: resumen.trim() || `Reporte consolidado correspondiente al periodo ${fechaInicio} - ${fechaFin}.`,
        total_transacciones: totalTransacciones,
        ingresos_totales: ingresosTotales,
        comisiones_totales: comisionesTotales,
        datos_extra: datosExtra,
        creadoEn: new Date().toISOString(),
      };

      await alGuardar(reporteNuevo);
    } catch (err) {
      setError(err.message || 'Error al generar el reporte.');
      setGenerando(false);
    }
  }

  return (
    <Modal titulo="Registrar y Generar Nuevo Reporte" alCerrar={alCerrar}>
      <form className="formulario" onSubmit={procesarGeneracion}>
        <MensajeError mensaje={error} />

        <Campo etiqueta="Tipo de reporte" nombre="tipoReporte">
          <select value={tipoReporte} onChange={(e) => cambiarTipo(e.target.value)}>
            {TIPOS_REPORTE.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </Campo>

        <Campo etiqueta="Título descriptivo del reporte" nombre="titulo">
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Reporte Financiero Mensual"
            required
          />
        </Campo>

        <div className="fila">
          <Campo etiqueta="Fecha de inicio" nombre="fechaInicio">
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
            />
          </Campo>
          <Campo etiqueta="Fecha de fin" nombre="fechaFin">
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              required
            />
          </Campo>
        </div>

        <Campo etiqueta="Resumen o notas adicionales (opcional)" nombre="resumen">
          <textarea
            rows={3}
            value={resumen}
            onChange={(e) => setResumen(e.target.value)}
            placeholder="Comentarios u observaciones para este informe..."
          />
        </Campo>

        <div className="acciones acciones--derecha">
          <button type="button" className="boton boton--secundario" onClick={alCerrar} disabled={generando}>
            Cancelar
          </button>
          <button type="submit" className="boton boton--acento" disabled={generando}>
            <ChartColumn size={16} />
            {generando ? 'Generando métricas...' : 'Generar y Registrar Reporte'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
