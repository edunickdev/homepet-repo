import { useState } from 'react';
import { Save } from 'lucide-react';
import { useFormulario } from '../../hooks/useFormulario';
import { ESTADOS_PROVEEDOR } from '../../utils/constantes';
import { esCorreoValido, esTelefonoValido, estaVacio } from '../../utils/validaciones';
import Campo from '../../components/Campo';
import MensajeError from '../../components/MensajeError';

function validar(valores) {
  const errores = {};
  if (estaVacio(valores.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (!esTelefonoValido(valores.telefono)) errores.telefono = 'Ingresa un teléfono válido.';
  if (!esCorreoValido(valores.correo)) errores.correo = 'Ingresa un correo válido.';
  return errores;
}

export default function ProveedorFormulario({ proveedor, alGuardar, alCancelar }) {
  const { valores, errores, cambiar, esValido } = useFormulario(
    {
      nombre: proveedor.nombre ?? '',
      telefono: proveedor.telefono ?? '',
      correo: proveedor.correo ?? '',
      direccion: proveedor.direccion ?? '',
      estado: proveedor.estado ?? 'pendiente',
    },
    validar
  );
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    if (!esValido()) return;

    setGuardando(true);
    setError('');
    try {
      await alGuardar({
        nombre: valores.nombre.trim(),
        telefono: valores.telefono.trim(),
        correo: valores.correo.trim().toLowerCase(),
        direccion: valores.direccion.trim(),
        estado: valores.estado,
      });
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <MensajeError mensaje={error} />

      <Campo etiqueta="Nombre del proveedor" nombre="nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} autoFocus />

      <div className="fila">
        <Campo etiqueta="Teléfono" nombre="telefono" type="tel" value={valores.telefono} onChange={cambiar} error={errores.telefono} />
        <Campo etiqueta="Correo" nombre="correo" type="email" value={valores.correo} onChange={cambiar} error={errores.correo} />
      </div>

      <Campo etiqueta="Dirección o zona de cobertura" nombre="direccion" value={valores.direccion} onChange={cambiar} />

      <Campo etiqueta="Estado" nombre="estado">
        <select id="estado" name="estado" value={valores.estado} onChange={cambiar}>
          {ESTADOS_PROVEEDOR.map((opcion) => (
            <option key={opcion.id} value={opcion.id}>
              {opcion.nombre}
            </option>
          ))}
        </select>
      </Campo>

      <div className="acciones acciones--derecha">
        <button type="button" className="boton boton--secundario" onClick={alCancelar}>
          Cancelar
        </button>
        <button type="submit" className="boton" disabled={guardando}>
          <Save size={16} />
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
