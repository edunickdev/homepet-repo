import { useState } from 'react';
import { Send } from 'lucide-react';
import { mensajesApi } from '../../api/mensajes';
import { useFormulario } from '../../hooks/useFormulario';
import { esCorreoValido, esTelefonoValido, estaVacio } from '../../utils/validaciones';
import Campo from '../../components/Campo';
import MensajeError from '../../components/MensajeError';

const ASUNTOS = ['Información general', 'Quiero ser proveedor aliado', 'Soporte con mi cuenta', 'Sugerencias', 'Otro'];

const VALORES_INICIALES = { nombre: '', correo: '', telefono: '', asunto: ASUNTOS[0], mensaje: '' };

function validar(valores) {
  const errores = {};
  if (estaVacio(valores.nombre)) errores.nombre = 'Escribe tu nombre.';
  if (!esCorreoValido(valores.correo)) errores.correo = 'Ingresa un correo válido.';
  if (!estaVacio(valores.telefono) && !esTelefonoValido(valores.telefono)) errores.telefono = 'Ingresa un teléfono válido.';
  if (valores.mensaje.trim().length < 10) errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
  return errores;
}

export default function FormularioContacto({ alEnviar }) {
  const { valores, errores, cambiar, esValido } = useFormulario(VALORES_INICIALES, validar);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    if (!esValido()) return;

    setEnviando(true);
    setError('');
    try {
      await mensajesApi.crear({
        nombre: valores.nombre.trim(),
        correo: valores.correo.trim().toLowerCase(),
        telefono: valores.telefono.trim(),
        asunto: valores.asunto,
        mensaje: valores.mensaje.trim(),
        fecha: new Date().toISOString(),
      });
      alEnviar();
    } catch (err) {
      setError(err.message);
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <MensajeError mensaje={error} />

      <div className="fila">
        <Campo etiqueta="Nombre" nombre="nombre" autoComplete="name" value={valores.nombre} onChange={cambiar} error={errores.nombre} />
        <Campo etiqueta="Correo electrónico" nombre="correo" type="email" autoComplete="email" value={valores.correo} onChange={cambiar} error={errores.correo} />
      </div>

      <div className="fila">
        <Campo etiqueta="Teléfono (opcional)" nombre="telefono" type="tel" autoComplete="tel" value={valores.telefono} onChange={cambiar} error={errores.telefono} />
        <Campo etiqueta="Asunto" nombre="asunto">
          <select id="asunto" name="asunto" value={valores.asunto} onChange={cambiar}>
            {ASUNTOS.map((asunto) => (
              <option key={asunto}>{asunto}</option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo etiqueta="Mensaje" nombre="mensaje" error={errores.mensaje}>
        <textarea id="mensaje" name="mensaje" rows="5" value={valores.mensaje} onChange={cambiar} />
      </Campo>

      <div>
        <button type="submit" className="boton" disabled={enviando}>
          <Send size={16} />
          {enviando ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </div>
    </form>
  );
}
