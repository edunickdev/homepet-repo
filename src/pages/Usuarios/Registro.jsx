import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { useFormulario } from '../../hooks/useFormulario';
import { esContrasenaSegura, esCorreoValido, esTelefonoValido, estaVacio } from '../../utils/validaciones';
import Campo from '../../components/Campo';
import MensajeError from '../../components/MensajeError';

const VALORES_INICIALES = {
  nombre: '',
  correo: '',
  contrasena: '',
  confirmacion: '',
  telefono: '',
  direccion: '',
  rol: 'propietario',
};

function validar(valores) {
  const errores = {};
  if (estaVacio(valores.nombre)) errores.nombre = 'El nombre es obligatorio.';
  if (!esCorreoValido(valores.correo)) errores.correo = 'Ingresa un correo válido.';
  if (!esContrasenaSegura(valores.contrasena)) {
    errores.contrasena = 'Mínimo 8 caracteres, con letras y números.';
  }
  if (valores.confirmacion !== valores.contrasena) errores.confirmacion = 'Las contraseñas no coinciden.';
  if (valores.rol === 'proveedor' && estaVacio(valores.telefono)) {
    errores.telefono = 'El teléfono es obligatorio para proveedores.';
  } else if (!estaVacio(valores.telefono) && !esTelefonoValido(valores.telefono)) {
    errores.telefono = 'Ingresa un teléfono válido.';
  }
  return errores;
}

function prepararCuenta({ confirmacion, rol, ...datos }) {
  const cuenta = { ...datos, nombre: datos.nombre.trim() };
  return rol === 'proveedor' ? { ...cuenta, estado: 'pendiente' } : { ...cuenta, rol };
}

export default function Registro() {
  const { registrar } = useSesion();
  const mostrarAviso = useAviso();
  const navegar = useNavigate();
  const { valores, errores, cambiar, esValido } = useFormulario(VALORES_INICIALES, validar);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    if (!esValido()) return;

    const esProveedor = valores.rol === 'proveedor';
    setEnviando(true);
    setError('');
    try {
      await registrar(prepararCuenta(valores), esProveedor ? 'proveedor' : 'usuario');
      mostrarAviso(esProveedor ? 'Tu cuenta de proveedor quedó pendiente de aprobación.' : 'Tu cuenta fue creada con éxito.');
      navegar(esProveedor ? '/servicios' : '/mascotas');
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="contenedor pagina-auth">
      <form className="tarjeta formulario-auth" onSubmit={enviar} noValidate>
        <h1>Crear cuenta</h1>
        <p className="texto-suave">Es gratis y toma menos de un minuto.</p>

        <MensajeError mensaje={error} />

        <fieldset className="opciones-rol">
          <legend>Quiero</legend>
          <label className={`opcion-rol ${valores.rol === 'propietario' ? 'opcion-rol--activa' : ''}`}>
            <input type="radio" name="rol" value="propietario" checked={valores.rol === 'propietario'} onChange={cambiar} />
            <strong>Contratar servicios</strong>
            <small>Propietario de mascota</small>
          </label>
          <label className={`opcion-rol ${valores.rol === 'proveedor' ? 'opcion-rol--activa' : ''}`}>
            <input type="radio" name="rol" value="proveedor" checked={valores.rol === 'proveedor'} onChange={cambiar} />
            <strong>Ofrecer servicios</strong>
            <small>Proveedor aliado</small>
          </label>
        </fieldset>

        <Campo etiqueta="Nombre completo" nombre="nombre" autoComplete="name" value={valores.nombre} onChange={cambiar} error={errores.nombre} />
        <Campo etiqueta="Correo electrónico" nombre="correo" type="email" autoComplete="email" value={valores.correo} onChange={cambiar} error={errores.correo} />

        <div className="fila">
          <Campo
            etiqueta="Contraseña"
            nombre="contrasena"
            type="password"
            autoComplete="new-password"
            value={valores.contrasena}
            onChange={cambiar}
            error={errores.contrasena}
            ayuda="Mínimo 8 caracteres, con letras y números."
          />
          <Campo
            etiqueta="Confirmar contraseña"
            nombre="confirmacion"
            type="password"
            autoComplete="new-password"
            value={valores.confirmacion}
            onChange={cambiar}
            error={errores.confirmacion}
          />
        </div>

        <div className="fila">
          <Campo
            etiqueta={valores.rol === 'proveedor' ? 'Teléfono' : 'Teléfono (opcional)'}
            nombre="telefono" type="tel" value={valores.telefono} onChange={cambiar} error={errores.telefono} />
          <Campo etiqueta="Dirección (opcional)" nombre="direccion" value={valores.direccion} onChange={cambiar} />
        </div>

        <button type="submit" className="boton boton--bloque" disabled={enviando}>
          <UserPlus size={18} />
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className="texto-centro">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}
