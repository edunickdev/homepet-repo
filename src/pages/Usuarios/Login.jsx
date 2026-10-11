import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useSesion } from '../../context/SesionContext';
import { useAviso } from '../../context/AvisoContext';
import { useFormulario } from '../../hooks/useFormulario';
import { esCorreoValido, estaVacio } from '../../utils/validaciones';
import { paginaInicial } from '../../utils/permisos';
import Campo from '../../components/Campo';
import MensajeError from '../../components/MensajeError';

function validar({ correo, contrasena }) {
  const errores = {};
  if (!esCorreoValido(correo)) errores.correo = 'Ingresa un correo válido.';
  if (estaVacio(contrasena)) errores.contrasena = 'Ingresa tu contraseña.';
  return errores;
}

export default function Login() {
  const { iniciarSesion } = useSesion();
  const mostrarAviso = useAviso();
  const navegar = useNavigate();
  const ubicacion = useLocation();
  const [parametros] = useSearchParams();
  const tipo = parametros.get('tipo') === 'proveedor' ? 'proveedor' : 'usuario';
  const { valores, errores, cambiar, esValido } = useFormulario({ correo: '', contrasena: '' }, validar);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    if (!esValido()) return;

    setEnviando(true);
    setError('');
    try {
      const cuenta = await iniciarSesion(valores.correo, valores.contrasena, tipo);
      mostrarAviso(`Bienvenido, ${cuenta.nombre.split(' ')[0]}.`);
      navegar(ubicacion.state?.desde ?? paginaInicial(cuenta), { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="contenedor pagina-auth">
      <form className="tarjeta formulario-auth" onSubmit={enviar} noValidate>
        <h1>Iniciar sesión</h1>
        <p className="texto-suave">Ingresa con tu cuenta de {tipo === 'proveedor' ? 'proveedor' : 'usuario'}.</p>

        <MensajeError mensaje={error} />

        <Campo
          etiqueta="Correo electrónico"
          nombre="correo"
          type="email"
          autoComplete="email"
          value={valores.correo}
          onChange={cambiar}
          error={errores.correo}
        />
        <Campo
          etiqueta="Contraseña"
          nombre="contrasena"
          type="password"
          autoComplete="current-password"
          value={valores.contrasena}
          onChange={cambiar}
          error={errores.contrasena}
        />

        <button type="submit" className="boton boton--bloque" disabled={enviando}>
          <LogIn size={18} />
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="texto-centro">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </form>
    </div>
  );
}
