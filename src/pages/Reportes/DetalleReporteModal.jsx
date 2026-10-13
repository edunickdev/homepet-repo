import { Calendar, DollarSign, FileText, Printer, TrendingUp, Users } from 'lucide-react';
import Modal from '../../components/Modal';
import Etiqueta from '../../components/Etiqueta';
import { TIPOS_REPORTE, nombreDe } from '../../utils/constantes';
import { pesos } from '../../utils/formato';

export default function DetalleReporteModal({ reporte, alCerrar }) {
  function imprimir() {
    window.print();
  }

  return (
    <Modal titulo="Detalle del Reporte" alCerrar={alCerrar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ borderBottom: '1px solid var(--borde)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{reporte.titulo}</h3>
            <Etiqueta estado={reporte.tipo_reporte}>{nombreDe(TIPOS_REPORTE, reporte.tipo_reporte)}</Etiqueta>
          </div>
          <span className="texto-suave" style={{ fontSize: '0.88rem', display: 'block', marginTop: '6px' }}>
            Periodo analizado: <strong>{reporte.fecha_inicio}</strong> al <strong>{reporte.fecha_fin}</strong> · Generado el{' '}
            {new Date(reporte.creadoEn || Date.now()).toLocaleDateString('es-CO')}
          </span>
        </div>

        {reporte.resumen && (
          <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--texto)', background: 'var(--fondo)', padding: '12px', borderRadius: 'var(--radio-pequeno)' }}>
            <strong>Resumen ejecutivo:</strong> {reporte.resumen}
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div className="tarjeta" style={{ padding: '14px' }}>
            <span className="texto-suave" style={{ fontSize: '0.82rem' }}>Total transacciones</span>
            <strong style={{ display: 'block', fontSize: '1.2rem', marginTop: '4px' }}>
              {reporte.total_transacciones ?? 0}
            </strong>
          </div>

          <div className="tarjeta" style={{ padding: '14px' }}>
            <span className="texto-suave" style={{ fontSize: '0.82rem' }}>Ingresos brutos</span>
            <strong style={{ display: 'block', fontSize: '1.2rem', marginTop: '4px', color: 'var(--texto)' }}>
              {pesos(reporte.ingresos_totales ?? 0)}
            </strong>
          </div>

          <div className="tarjeta" style={{ padding: '14px' }}>
            <span className="texto-suave" style={{ fontSize: '0.82rem' }}>Comisiones Home Pet</span>
            <strong style={{ display: 'block', fontSize: '1.2rem', marginTop: '4px', color: 'var(--primario)' }}>
              {pesos(reporte.comisiones_totales ?? 0)}
            </strong>
          </div>
        </div>

        {reporte.datos_extra && (
          <div className="tarjeta" style={{ padding: '14px', background: 'var(--fondo)' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem' }}>Métricas adicionales consolidadas</h4>
            <div style={{ display: 'grid', gap: '8px', fontSize: '0.88rem' }}>
              {Object.entries(reporte.datos_extra).map(([clave, valor]) => (
                <div key={clave} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--borde)', paddingBottom: '4px' }}>
                  <span className="texto-suave">{clave}:</span>
                  <strong>{typeof valor === 'number' && valor > 1000 ? pesos(valor) : String(valor)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="acciones acciones--derecha">
          <button className="boton boton--secundario" onClick={imprimir}>
            <Printer size={16} />
            Imprimir reporte
          </button>
          <button className="boton" onClick={alCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
