import { useState } from 'react';
import { Save } from 'lucide-react';
import { useFormulario } from '../../hooks/useFormulario';
import { CATEGORIAS, DISPONIBILIDAD_SERVICIO } from '../../utils/constantes';
import { estaVacio } from '../../utils/validaciones';
import Campo from '../../components/Campo';
import MensajeError from '../../components/MensajeError';

function validar(valores) {
  const errores = {};
  if (estaVacio(valores.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (estaVacio(valores.proveedorId)) errores.proveedorId = 'Selecciona el proveedor.';
  if (estaVacio(valores.descripcion)) errores.descripcion = 'La descripción es obligatoria.';
  if (!(Number(valores.precio) > 0)) errores.precio = 'El precio debe ser mayor que cero.';
  return errores;
}

export default function ServicioFormulario({ servicio, proveedores, proveedorFijo, alGuardar, alCancelar }) {
  const { valores, errores, cambiar, esValido } = useFormulario(
    {
      nombre: servicio.nombre ?? '',
      proveedorId: proveedorFijo?.id ?? servicio.proveedorId ?? '',
      categoria: servicio.categoria ?? CATEGORIAS[0].id,
      precio: servicio.precio ?? '',
      disponibilidad: servicio.disponibilidad ?? 'disponible',
      descripcion: servicio.descripcion ?? '',
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
        proveedorId: Number(valores.proveedorId),
        categoria: valores.categoria,
        precio: Math.round(Number(valores.precio)),
        disponibilidad: valores.disponibilidad,
        descripcion: valores.descripcion.trim(),
      });
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <MensajeError mensaje={error} />

      <Campo etiqueta="Nombre del servicio" nombre="nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} autoFocus />

      {!proveedorFijo && (
        <Campo etiqueta="Proveedor" nombre="proveedorId" error={errores.proveedorId}>
          <select id="proveedorId" name="proveedorId" value={valores.proveedorId} onChange={cambiar}>
            <option value="">Selecciona un proveedor</option>
            {proveedores.map((proveedor) => (
              <option key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre}
              </option>
            ))}
          </select>
        </Campo>
      )}

      <div className="fila">
        <Campo etiqueta="Categoría" nombre="categoria">
          <select id="categoria" name="categoria" value={valores.categoria} onChange={cambiar}>
            {CATEGORIAS.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Disponibilidad" nombre="disponibilidad">
          <select id="disponibilidad" name="disponibilidad" value={valores.disponibilidad} onChange={cambiar}>
            {DISPONIBILIDAD_SERVICIO.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.nombre}
              </option>
            ))}
          </select>
        </Campo>
      </div>

      <Campo
        etiqueta="Precio (COP)"
        nombre="precio"
        type="number"
        min="1000"
        step="500"
        value={valores.precio}
        onChange={cambiar}
        error={errores.precio}
      />

      <Campo etiqueta="Descripción" nombre="descripcion" error={errores.descripcion}>
        <textarea id="descripcion" name="descripcion" rows="4" value={valores.descripcion} onChange={cambiar} />
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
