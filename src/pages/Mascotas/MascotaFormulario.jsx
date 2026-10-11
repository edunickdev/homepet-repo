import { useState } from 'react';
import { Save } from 'lucide-react';
import { useFormulario } from '../../hooks/useFormulario';
import { ESPECIES } from '../../utils/constantes';
import { estaVacio } from '../../utils/validaciones';
import Campo from '../../components/Campo';
import MensajeError from '../../components/MensajeError';

function validar(valores) {
  const errores = {};
  if (estaVacio(valores.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (estaVacio(valores.especie)) errores.especie = 'Selecciona la especie.';
  if (!estaVacio(valores.edad)) {
    const edad = Number(valores.edad);
    if (!Number.isInteger(edad) || edad < 0 || edad > 40) errores.edad = 'La edad debe ser un número entre 0 y 40.';
  }
  return errores;
}

export default function MascotaFormulario({ mascota, alGuardar, alCancelar }) {
  const { valores, errores, cambiar, esValido } = useFormulario(
    {
      nombre: mascota.nombre ?? '',
      especie: mascota.especie ?? ESPECIES[0],
      raza: mascota.raza ?? '',
      edad: mascota.edad ?? '',
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
        especie: valores.especie,
        raza: valores.raza.trim(),
        edad: estaVacio(valores.edad) ? null : Number(valores.edad),
      });
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <MensajeError mensaje={error} />

      <Campo etiqueta="Nombre" nombre="nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} autoFocus />

      <div className="fila">
        <Campo etiqueta="Especie" nombre="especie" error={errores.especie}>
          <select id="especie" name="especie" value={valores.especie} onChange={cambiar}>
            {ESPECIES.map((especie) => (
              <option key={especie}>{especie}</option>
            ))}
          </select>
        </Campo>
        <Campo etiqueta="Edad (años)" nombre="edad" type="number" min="0" max="40" value={valores.edad} onChange={cambiar} error={errores.edad} />
      </div>

      <Campo etiqueta="Raza (opcional)" nombre="raza" value={valores.raza} onChange={cambiar} />

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
