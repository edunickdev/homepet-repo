import { useState } from 'react';
import { CheckCircle2, CreditCard, Lock, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import Modal from './Modal';
import Campo from './Campo';
import MensajeError from './MensajeError';
import { pagosApi } from '../api/pagos';
import { reservasApi } from '../api/reservas';
import { configuracionApi } from '../api/configuracion';
import { pesos } from '../utils/formato';

const BANCOS_PSE = [
  'Bancolombia',
  'Davivienda',
  'Banco de Bogotá',
  'Nequi',
  'Daviplata',
  'Banco BBVA',
  'Banco de Occidente',
  'Scotiabank Colpatria',
];

export default function SimuladorPagoModal({
  reserva,
  servicio,
  proveedor,
  mascota,
  usuario,
  alCerrar,
  alPagoCompletado,
}) {
  const [metodo, setMetodo] = useState('tarjeta');
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '4532 8901 2345 6789',
    nombre: usuario?.nombre ?? 'Cliente Home Pet',
    expiracion: '12/28',
    cvv: '888',
    cuotas: '1',
  });
  const [datosPSE, setDatosPSE] = useState({
    banco: 'Bancolombia',
    tipoCliente: 'persona',
    correo: usuario?.correo ?? '',
  });

  const [procesando, setProcesando] = useState(false);
  const [exito, setExito] = useState(null);
  const [error, setError] = useState('');

  const valorServicio = servicio?.precio ?? 0;

  async function procesarPago(evento) {
    evento.preventDefault();
    setError('');
    setProcesando(true);

    try {
      // 1. Obtener comisión vigente
      const conf = await configuracionApi.obtenerActual();
      const pctComision = Number(conf?.porcentajeComision ?? 15);
      const valorComision = Math.round((valorServicio * pctComision) / 100);
      const netoProveedor = valorServicio - valorComision;

      // 2. Simular latencia de red bancaria
      await new Promise((resolver) => setTimeout(resolver, 1400));

      // 3. Crear registro de pago
      const referencia = `HP-PAG-${Date.now().toString().slice(-6)}`;
      const nuevoPago = await pagosApi.crear({
        reservaId: reserva.id,
        usuarioId: usuario.id,
        proveedorId: reserva.proveedorId ?? servicio?.proveedorId,
        servicioId: servicio?.id,
        valor: valorServicio,
        fecha_pago: new Date().toISOString(),
        metodo_pago: metodo === 'tarjeta' ? 'Tarjeta de crédito' : `PSE (${datosPSE.banco})`,
        referencia,
        estado: 'aprobado',
        porcentaje_comision: pctComision,
        valor_comision: valorComision,
        neto_proveedor: netoProveedor,
      });

      // 4. Actualizar estado de la reserva a 'pagada'
      await reservasApi.actualizar(reserva.id, { estado: 'pagada' });

      setExito(nuevoPago);
      if (alPagoCompletado) {
        alPagoCompletado(nuevoPago);
      }
    } catch (err) {
      setError(err.message || 'Error simulando el pago.');
    } finally {
      setProcesando(false);
    }
  }

  return (
    <Modal titulo="Pasarela de Pago (Simulación)" alCerrar={alCerrar}>
      {exito ? (
        <div className="confirmacion" style={{ padding: '16px 0' }}>
          <CheckCircle2 size={54} color="var(--exito)" />
          <h2 style={{ margin: '8px 0 4px', fontSize: '1.3rem' }}>¡Pago aprobado exitosamente!</h2>
          <p className="texto-suave">
            La transacción fue procesada y registrada en el sistema.
          </p>

          <div
            className="tarjeta"
            style={{
              width: '100%',
              maxWidth: '420px',
              padding: '16px',
              marginTop: '12px',
              textAlign: 'left',
              background: 'var(--fondo)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="texto-suave">Referencia:</span>
              <strong>{exito.referencia}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="texto-suave">Servicio:</span>
              <span>{servicio?.nombre}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="texto-suave">Proveedor:</span>
              <span>{proveedor?.nombre}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span className="texto-suave">Monto abonado:</span>
              <strong style={{ color: 'var(--primario)' }}>{pesos(exito.valor)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--borde)', paddingTop: '8px', fontSize: '0.85rem' }}>
              <span className="texto-suave">Comisión Home Pet ({exito.porcentaje_comision}%):</span>
              <span>{pesos(exito.valor_comision)}</span>
            </div>
          </div>

          <div className="acciones" style={{ marginTop: '20px' }}>
            <button className="boton" onClick={alCerrar}>
              Cerrar y continuar
            </button>
          </div>
        </div>
      ) : (
        <form className="formulario" onSubmit={procesarPago}>
          <div className="resumen-servicio" style={{ marginBottom: '14px' }}>
            <div>
              <strong>{servicio?.nombre}</strong>
              <small>Proveedor: {proveedor?.nombre}</small>
              {mascota && <small>Mascota: {mascota.nombre}</small>}
            </div>
            <span className="precio">{pesos(valorServicio)}</span>
          </div>

          <MensajeError mensaje={error} />

          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <button
              type="button"
              className={`boton boton--pequeno ${metodo === 'tarjeta' ? '' : 'boton--secundario'}`}
              style={{ flex: 1 }}
              onClick={() => setMetodo('tarjeta')}
            >
              <CreditCard size={16} />
              Tarjeta Crédito / Débito
            </button>
            <button
              type="button"
              className={`boton boton--pequeno ${metodo === 'pse' ? '' : 'boton--secundario'}`}
              style={{ flex: 1 }}
              onClick={() => setMetodo('pse')}
            >
              <Building2 size={16} />
              Transferencia PSE
            </button>
          </div>

          {metodo === 'tarjeta' ? (
            <>
              <Campo etiqueta="Número de tarjeta simulada" nombre="numTarjeta">
                <input
                  type="text"
                  value={datosTarjeta.numero}
                  onChange={(e) => setDatosTarjeta({ ...datosTarjeta, numero: e.target.value })}
                  placeholder="0000 0000 0000 0000"
                  required
                />
              </Campo>

              <Campo etiqueta="Titular de la tarjeta" nombre="nombreTitular">
                <input
                  type="text"
                  value={datosTarjeta.nombre}
                  onChange={(e) => setDatosTarjeta({ ...datosTarjeta, nombre: e.target.value })}
                  required
                />
              </Campo>

              <div className="fila">
                <Campo etiqueta="Vencimiento" nombre="exp">
                  <input
                    type="text"
                    value={datosTarjeta.expiracion}
                    onChange={(e) => setDatosTarjeta({ ...datosTarjeta, expiracion: e.target.value })}
                    placeholder="MM/AA"
                    required
                  />
                </Campo>
                <Campo etiqueta="CVV / CVC" nombre="cvv">
                  <input
                    type="password"
                    maxLength={4}
                    value={datosTarjeta.cvv}
                    onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cvv: e.target.value })}
                    placeholder="123"
                    required
                  />
                </Campo>
                <Campo etiqueta="Cuotas" nombre="cuotas">
                  <select
                    value={datosTarjeta.cuotas}
                    onChange={(e) => setDatosTarjeta({ ...datosTarjeta, cuotas: e.target.value })}
                  >
                    <option value="1">1 cuota</option>
                    <option value="3">3 cuotas</option>
                    <option value="6">6 cuotas</option>
                    <option value="12">12 cuotas</option>
                  </select>
                </Campo>
              </div>
            </>
          ) : (
            <>
              <Campo etiqueta="Entidad Bancaria" nombre="banco">
                <select
                  value={datosPSE.banco}
                  onChange={(e) => setDatosPSE({ ...datosPSE, banco: e.target.value })}
                >
                  {BANCOS_PSE.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo etiqueta="Tipo de cliente" nombre="tipoCliente">
                <select
                  value={datosPSE.tipoCliente}
                  onChange={(e) => setDatosPSE({ ...datosPSE, tipoCliente: e.target.value })}
                >
                  <option value="persona">Persona Natural</option>
                  <option value="juridica">Persona Jurídica</option>
                </select>
              </Campo>

              <Campo etiqueta="Correo registrado en PSE" nombre="correoPse">
                <input
                  type="email"
                  value={datosPSE.correo}
                  onChange={(e) => setDatosPSE({ ...datosPSE, correo: e.target.value })}
                  required
                />
              </Campo>
            </>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              background: 'var(--fondo)',
              borderRadius: 'var(--radio-pequeno)',
              fontSize: '0.85rem',
              color: 'var(--texto-suave)',
              margin: '10px 0 16px',
            }}
          >
            <ShieldCheck size={18} color="var(--exito)" />
            <span>Simulador académico seguro. No se realizarán cargos a dinero real.</span>
          </div>

          <div className="acciones acciones--derecha">
            <button type="button" className="boton boton--secundario" onClick={alCerrar} disabled={procesando}>
              Cancelar
            </button>
            <button type="submit" className="boton boton--acento" disabled={procesando}>
              <Lock size={16} />
              {procesando ? 'Conectando con la pasarela...' : `Simular Pago de ${pesos(valorServicio)}`}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
