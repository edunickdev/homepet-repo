import { CheckCircle2, CreditCard, Download, Printer, ShieldCheck } from 'lucide-react';
import Modal from '../../components/Modal';
import Etiqueta from '../../components/Etiqueta';
import { pesos } from '../../utils/formato';

export default function ComprobantePagoModal({ pago, servicio, proveedor, cliente, rolUsuario, alCerrar }) {
  function imprimir() {
    window.print();
  }

  return (
    <Modal titulo="Comprobante de Pago Digital" alCerrar={alCerrar}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ textAlign: 'center', borderBottom: '1px solid var(--borde)', paddingBottom: '16px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', background: 'var(--exito-claro)', color: 'var(--exito)', marginBottom: '8px' }}>
            <CheckCircle2 size={30} />
          </div>
          <h2 style={{ margin: '4px 0', fontSize: '1.25rem' }}>Transacción Exitosa</h2>
          <span className="texto-suave" style={{ fontSize: '0.85rem' }}>
            Comprobante oficial #{pago.referencia}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.9rem' }}>
          <div>
            <span className="texto-suave" style={{ display: 'block' }}>Fecha de pago:</span>
            <strong>{new Date(pago.fecha_pago).toLocaleString('es-CO')}</strong>
          </div>
          <div>
            <span className="texto-suave" style={{ display: 'block' }}>Método de pago:</span>
            <strong>{pago.metodo_pago}</strong>
          </div>
          <div>
            <span className="texto-suave" style={{ display: 'block' }}>Cliente:</span>
            <strong>{cliente?.nombre ?? 'Cliente Home Pet'}</strong>
          </div>
          <div>
            <span className="texto-suave" style={{ display: 'block' }}>Proveedor:</span>
            <strong>{proveedor?.nombre ?? 'Proveedor Aliado'}</strong>
          </div>
        </div>

        <div className="tarjeta" style={{ padding: '14px', background: 'var(--fondo)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
            <strong>{servicio?.nombre ?? 'Servicio de bienestar'}</strong>
            <span>{pesos(pago.valor)}</span>
          </div>

          {(rolUsuario === 'administrador' || rolUsuario === 'proveedor') && (
            <div style={{ borderTop: '1px dashed var(--borde)', paddingTop: '8px', marginTop: '8px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--texto-suave)', marginBottom: '4px' }}>
                <span>Comisión de plataforma ({pago.porcentaje_comision}%):</span>
                <span>- {pesos(pago.valor_comision)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--primario)' }}>
                <span>Neto liquidado a proveedor:</span>
                <span>{pesos(pago.neto_proveedor)}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid var(--borde)', paddingTop: '10px', marginTop: '10px', fontSize: '1.1rem', fontWeight: 800 }}>
            <span>Total Pagado:</span>
            <span style={{ color: 'var(--primario)' }}>{pesos(pago.valor)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--texto-suave)', background: 'var(--superficie)', padding: '8px 12px', borderRadius: 'var(--radio-pequeno)' }}>
          <ShieldCheck size={16} color="var(--exito)" />
          <span>Transacción autorizada y respaldada por Home Pet Gateway.</span>
        </div>

        <div className="acciones acciones--derecha">
          <button className="boton boton--secundario" onClick={imprimir}>
            <Printer size={16} />
            Imprimir
          </button>
          <button className="boton" onClick={alCerrar}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
