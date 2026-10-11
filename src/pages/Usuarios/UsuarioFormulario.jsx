import { useState } from 'react';
import { Save } from 'lucide-react';
import { buscarPorCorreo } from '../../api/usuarios';
import { useFormulario } from '../../hooks/useFormulario';
import { ROLES_USUARIO } from '../../utils/constantes';
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, estaVacio } from '../../utils/validaciones';
import Campo from '../../components/Campo';
import MensajeError from '../../components/MensajeError';

function validar(valores, esNuevo) {
  const errores = {};
  if (estaVacio(valores.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (!esCorreoValido(valores.correo)) errores.correo = 'Ingresa un correo válido.';
  if (!estaVacio(valores.telefono) && !esTelefonoValido(valores.telefono)) errores.telefono = 'Ingresa un teléfono válido.';
  if ((esNuevo || !estaVacio(valores.contrasena)) && !esContrasenaSegura(valores.contrasena)) {
    errores.contrasena = 'Mínimo 8 caracteres, con letras y números.';
  }
  return errores;
}

export default function UsuarioFormulario({ usuario, esCuentaPropia, alGuardar, alCancelar }) {
  const esNuevo = !usuario.id;
  const { valores, errores, cambiar, esValido } = useFormulario(
    {
      nombre: usuario.nombre ?? '',
      correo: usuario.correo ?? '',
      telefono: usuario.telefono ?? '',
      direccion: usuario.direccion ?? '',
      rol: usuario.rol ?? 'propietario',
      contrasena: '',
    },
    (datos) => validar(datos, esNuevo)
  );
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    if (!esValido()) return;

    setGuardando(true);
    setError('');
    try {
      const correo = valores.correo.trim().toLowerCase();
      const existente = await buscarPorCorreo(correo);
      if (existente && existente.id !== usuario.id) {
        throw new Error('Ya existe una cuenta registrada con ese correo.');
      }

      const datos = {
        nombre: valores.nombre.trim(),
        correo,
        telefono: valores.telefono.trim(),
        direccion: valores.direccion.trim(),
        rol: valores.rol,
      };
      if (!estaVacio(valores.contrasena)) datos.contrasena = valores.contrasena;

      await alGuardar(datos);
    } catch (err) {
      setError(err.message);
      setGuardando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar} noValidate>
      <MensajeError mensaje={error} />

      <Campo etiqueta="Nombre completo" nombre="nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} autoFocus />

      <div className="fila">
        <Campo etiqueta="Correo" nombre="correo" type="email" value={valores.correo} onChange={cambiar} error={errores.correo} />
        <Campo etiqueta="Teléfono (opcional)" nombre="telefono" type="tel" value={valores.telefono} onChange={cambiar} error={errores.telefono} />
      </div>

      <Campo etiqueta="Dirección (opcional)" nombre="direccion" value={valores.direccion} onChange={cambiar} />

      <div className="fila">
        <Campo
          etiqueta="Rol"
          nombre="rol"
          ayuda={esCuentaPropia ? 'No puedes cambiar el rol de tu propia cuenta.' : null}
        >
          <select id="rol" name="rol" value={valores.rol} onChange={cambiar} disabled={esCuentaPropia}>
            {ROLES_USUARIO.map((opcion) => (
              <option key={opcion.id} value={opcion.id}>
                {opcion.nombre}
              </option>
            ))}
          </select>
        </Campo>
        <Campo
          etiqueta={esNuevo ? 'Contraseña' : 'Nueva contraseña (opcional)'}
          nombre="contrasena"
          type="password"
          autoComplete="new-password"
          value={valores.contrasena}
          onChange={cambiar}
          error={errores.contrasena}
          ayuda={esNuevo ? 'Mínimo 8 caracteres, con letras y números.' : 'Déjala vacía para conservar la actual.'}
        />
      </div>

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
