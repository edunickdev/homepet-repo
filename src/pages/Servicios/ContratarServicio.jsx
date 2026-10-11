import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, PawPrint } from 'lucide-react';
import { mascotasApi } from '../../api/mascotas';
import { reservasApi } from '../../api/reservas';
import { useColeccion } from '../../hooks/useColeccion';
import { useFormulario } from '../../hooks/useFormulario';
import { pesos } from '../../utils/formato';
import { estaVacio } from '../../utils/validaciones';
import Campo from '../../components/Campo';
import Cargando from '../../components/Cargando';
import EstadoVacio from '../../components/EstadoVacio';
import MensajeError from '../../components/MensajeError';

function fechaDeHoy() {
  const hoy = new Date();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${hoy.getFullYear()}-${mes}-${dia}`;
}

function validar(valores) {
  const errores = {};
  if (estaVacio(valores.mascotaId)) errores.mascotaId = 'Selecciona la mascota.';
  if (estaVacio(valores.fecha) || valores.fecha < fechaDeHoy()) errores.fecha = 'Selecciona una fecha desde hoy en adelante.';
  if (estaVacio(valores.hora)) errores.hora = 'Selecciona la hora.';
  if (estaVacio(valores.direccion)) errores.direccion = 'Escribe la dirección donde se prestará el servicio.';
  return errores;
}

export default function ContratarServicio({ servicio, proveedor, usuario, alContratar, alCancelar }) {
  const { items: mascotas, cargando } = useColeccion(mascotasApi, { usuarioId: usuario.id });
  const { valores, errores, cambiar, esValido } = useFormulario(
    { mascotaId: '', fecha: '', hora: '', direccion: usuario.direccion ?? '', notas: '' },
    validar
  );
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    if (!esValido()) return;

    setEnviando(true);
    setError('');
    try {
      await reservasApi.crear({
        usuarioId: usuario.id,
        mascotaId: Number(valores.mascotaId),
        servicioId: servicio.id,
        fecha: valores.fecha,
        hora: valores.hora,
        direccion: valores.direccion.trim(),
        notas: valores.notas.trim(),
        estado: 'pendiente',
        creadoEn: new Date().toISOString(),
      });
      alContratar();
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  if (cargando) return <Cargando texto="Cargando tus mascotas..." />;

  if (mascotas.length === 0) {
    return (
      <EstadoVacio icono={PawPrint} titulo="Primero registra una mascota" descripcion="Necesitas al menos una mascota para contratar un servicio.">
        <Link to="/mascotas" className="boton">
          Registrar mascota
        </Link>
      </EstadoVacio>
    );
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <div className="resumen-servicio">
        <div>
          <strong>{servicio.nombre}</strong>
          <small>{proveedor}</small>
        </div>
        <span className="precio">{pesos(servicio.precio)}</span>
      </div>

      <MensajeError mensaje={error} />

      <Campo etiqueta="Mascota" nombre="mascotaId" error={errores.mascotaId}>
        <select id="mascotaId" name="mascotaId" value={valores.mascotaId} onChange={cambiar}>
          <option value="">Selecciona una mascota</option>
          {mascotas.map((mascota) => (
            <option key={mascota.id} value={mascota.id}>
              {mascota.nombre} ({mascota.especie})
            </option>
          ))}
        </select>
      </Campo>

      <div className="fila">
        <Campo etiqueta="Fecha" nombre="fecha" type="date" min={fechaDeHoy()} value={valores.fecha} onChange={cambiar} error={errores.fecha} />
        <Campo etiqueta="Hora" nombre="hora" type="time" min="07:00" max="20:00" step="1800" value={valores.hora} onChange={cambiar} error={errores.hora} />
      </div>

      <Campo etiqueta="Dirección del servicio" nombre="direccion" value={valores.direccion} onChange={cambiar} error={errores.direccion} />

      <Campo etiqueta="Notas para el proveedor (opcional)" nombre="notas">
        <textarea id="notas" name="notas" rows="3" value={valores.notas} onChange={cambiar} />
      </Campo>

      <p className="texto-suave">No se realiza ningún cobro hasta que el proveedor confirme la solicitud.</p>

      <div className="acciones acciones--derecha">
        <button type="button" className="boton boton--secundario" onClick={alCancelar}>
          Cancelar
        </button>
        <button type="submit" className="boton boton--acento" disabled={enviando}>
          <CalendarCheck size={16} />
          {enviando ? 'Enviando...' : 'Solicitar servicio'}
        </button>
      </div>
    </form>
  );
}
