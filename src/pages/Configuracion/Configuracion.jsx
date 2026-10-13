import { useEffect, useState } from 'react';
import { Percent, Save, Settings, ShieldCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { configuracionApi } from '../../api/configuracion';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { pesos } from '../../utils/formato';
import EncabezadoPagina from '../../components/EncabezadoPagina';
import Cargando from '../../components/Cargando';
import MensajeError from '../../components/MensajeError';
import Campo from '../../components/Campo';

export default function Configuracion() {
  const { usuario } = useSesion();
  const mostrarAviso = useAviso();

  const [configuracion, setConfiguracion] = useState(null);
  const [comisionInput, setComisionInput] = useState(15);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  // Valor de ejemplo para la calculadora de previsualización
  const [ejemploValor, setEjemploValor] = useState(85000);

  async function cargarConfiguracion() {
    setCargando(true);
    setError('');
    try {
      const datos = await configuracionApi.obtenerActual();
      setConfiguracion(datos);
      setComisionInput(datos?.porcentajeComision ?? 15);
    } catch (err) {
      setError(err.message || 'Error cargando la configuración.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  async function guardarComision(evento) {
    evento.preventDefault();
    const porcentaje = Number(comisionInput);

    if (isNaN(porcentaje) || porcentaje < 1 || porcentaje > 50) {
      setError('El porcentaje de comisión debe ser un número válido entre 1% y 50%.');
      return;
    }

    setGuardando(true);
    setError('');
    try {
      const actualizada = await configuracionApi.actualizarComision(porcentaje, usuario.nombre);
      setConfiguracion(actualizada);
      mostrarAviso(`Porcentaje de comisión actualizado al ${porcentaje}%.`);
    } catch (err) {
      setError(err.message || 'No fue posible actualizar la comisión.');
    } finally {
      setGuardando(false);
    }
  }

  const comisionCalculada = Math.round((ejemploValor * Number(comisionInput || 0)) / 100);
  const netoProveedorCalculado = ejemploValor - comisionCalculada;

  return (
    <div className="contenedor pagina">
      <EncabezadoPagina
        titulo="Configuración de la Plataforma"
        descripcion="Administra las reglas de negocio, modelo de intermediación y tarifas de Home Pet."
      />

      <MensajeError mensaje={error} alReintentar={cargarConfiguracion} />

      {cargando ? (
        <Cargando texto="Cargando configuración de comisión..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Tarjeta de Modificación de Comisión */}
          <div className="tarjeta" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radio-pequeno)',
                  background: 'var(--primario-claro)',
                  color: 'var(--primario)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Percent size={24} />
              </span>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem' }}>Porcentaje de Comisión</h3>
                <span className="texto-suave" style={{ fontSize: '0.85rem' }}>
                  Tasa que retiene Home Pet sobre cada servicio intermediado (RF-13)
                </span>
              </div>
            </div>

            <form onSubmit={guardarComision} className="formulario">
              <Campo
                etiqueta="Tasa de comisión actual (%)"
                nombre="comision"
                ayuda="Se aplica automáticamente al procesar cualquier nuevo pago de servicio."
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    step="0.5"
                    value={comisionInput}
                    onChange={(e) => setComisionInput(e.target.value)}
                    required
                    style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
                  />
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--texto-suave)' }}>%</span>
                </div>
              </Campo>

              <div
                style={{
                  padding: '12px',
                  background: 'var(--fondo)',
                  borderRadius: 'var(--radio-pequeno)',
                  fontSize: '0.85rem',
                  color: 'var(--texto-suave)',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <strong>Última actualización:</strong>{' '}
                  {configuracion?.actualizadoEn
                    ? new Date(configuracion.actualizadoEn).toLocaleString('es-CO')
                    : 'Configuración inicial'}
                </div>
                <div style={{ marginTop: '4px' }}>
                  <strong>Modificado por:</strong> {configuracion?.actualizadoPor || 'Sistema'}
                </div>
              </div>

              <div className="acciones acciones--derecha">
                <button
                  type="button"
                  className="boton boton--secundario"
                  onClick={cargarConfiguracion}
                  disabled={guardando}
                >
                  <RefreshCw size={16} />
                  Descartar
                </button>
                <button type="submit" className="boton boton--acento" disabled={guardando}>
                  <Save size={16} />
                  {guardando ? 'Guardando...' : 'Guardar nueva comisión'}
                </button>
              </div>
            </form>
          </div>

          {/* Tarjeta de Previsualización y Calculadora */}
          <div className="tarjeta" style={{ padding: '24px', background: 'var(--superficie)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Sparkles size={20} color="var(--acento)" />
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Simulador de Distribución de Ingresos</h3>
            </div>
            <p className="texto-suave" style={{ fontSize: '0.88rem', margin: '0 0 16px' }}>
              Comprueba cómo impacta la tasa de comisión del <strong>{comisionInput}%</strong> en los ingresos de un servicio:
            </p>

            <Campo etiqueta="Valor del servicio de prueba" nombre="ejemploValor">
              <input
                type="number"
                step="5000"
                min="10000"
                value={ejemploValor}
                onChange={(e) => setEjemploValor(Number(e.target.value))}
              />
            </Campo>

            <div
              className="tarjeta"
              style={{
                marginTop: '16px',
                padding: '16px',
                background: 'var(--fondo)',
                display: 'grid',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
                <span className="texto-suave">Precio cobrado al cliente:</span>
                <strong>{pesos(ejemploValor)}</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.95rem',
                  color: 'var(--primario)',
                  borderTop: '1px dashed var(--borde)',
                  paddingTop: '8px',
                }}
              >
                <span>Comisión Home Pet ({comisionInput}%):</span>
                <strong>+ {pesos(comisionCalculada)}</strong>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.95rem',
                  color: 'var(--exito)',
                  borderTop: '1px dashed var(--borde)',
                  paddingTop: '8px',
                }}
              >
                <span>Neto desembolsado a proveedor aliado:</span>
                <strong>{pesos(netoProveedorCalculado)}</strong>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                fontSize: '0.82rem',
                color: 'var(--texto-suave)',
              }}
            >
              <ShieldCheck size={16} color="var(--exito)" />
              <span>Conforme con el modelo financiero de flujo neto a 18 meses (Sec. 10 del proyecto).</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
