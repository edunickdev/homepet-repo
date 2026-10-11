import { startTransition, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  ChartColumn,
  ClipboardList,
  CreditCard,
  House,
  LogIn,
  LogOut,
  Mail,
  Menu,
  PawPrint,
  Settings,
  Store,
  UserPlus,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useSesion } from '../context/SesionContext';
import { ROLES } from '../utils/constantes';
import { puedeAcceder } from '../utils/permisos';
import MenuDesplegable from './MenuDesplegable';

const ENLACES_PUBLICOS = [
  { ruta: '/', texto: 'Inicio', icono: House },
  { ruta: '/servicios', texto: 'Servicios', icono: ClipboardList },
  { ruta: '/contacto', texto: 'Contacto', icono: Mail },
];

const ENLACES_PRIVADOS = [
  { ruta: '/mascotas', modulo: 'mascotas', texto: 'Mascotas', icono: PawPrint },
  { ruta: '/usuarios', modulo: 'usuarios', texto: 'Usuarios', icono: Users },
  { ruta: '/proveedores', modulo: 'proveedores', texto: 'Proveedores', icono: Store },
  { ruta: '/servicios', modulo: 'servicios', texto: 'Servicios', icono: ClipboardList },
  { ruta: '/reservas', modulo: 'reservas', texto: 'Reservas', icono: CalendarCheck },
  { ruta: '/pagos', modulo: 'pagos', texto: 'Pagos', icono: CreditCard },
  { ruta: '/reportes', modulo: 'reportes', texto: 'Reportes', icono: ChartColumn },
  { ruta: '/configuracion', modulo: 'configuracion', texto: 'Configuración', icono: Settings },
];

const ENLACE_INICIO = { ruta: '/', texto: 'Inicio', icono: House };

const OPCIONES_INGRESO = [
  { ruta: '/login?tipo=usuario', texto: 'Como usuario', icono: UserRound },
  { ruta: '/login?tipo=proveedor', texto: 'Como proveedor', icono: Store },
];

function Enlace({ ruta, texto, icono: Icono, alNavegar }) {
  return (
    <NavLink to={ruta} end={ruta === '/'} className="menu__enlace" onClick={alNavegar}>
      <Icono size={18} />
      <span>{texto}</span>
    </NavLink>
  );
}

export default function Navbar() {
  const { usuario, cerrarSesion } = useSesion();
  const [abierto, setAbierto] = useState(false);
  const navegar = useNavigate();
  const permitidos = (lista) => lista.filter((enlace) => puedeAcceder(usuario, enlace.modulo));
  const enlaces = usuario ? [ENLACE_INICIO, ...permitidos(ENLACES_PRIVADOS)] : ENLACES_PUBLICOS;
  const menuExtenso = enlaces.length > 6;

  function cerrarMenu() {
    setAbierto(false);
  }

  function salir() {
    cerrarMenu();
    navegar('/');
    startTransition(cerrarSesion);
  }

  return (
    <header className="cabecera">
      <div className={`contenedor cabecera__fila ${menuExtenso ? 'cabecera__fila--extensa' : ''}`}>
        <Link to="/" className="marca" onClick={cerrarMenu}>
          <img src="/logo.svg" alt="" width="34" height="34" />
          <span>
            Home<b>Pet</b>
          </span>
        </Link>

        <button
          className="menu-boton"
          onClick={() => setAbierto(!abierto)}
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={abierto}
        >
          {abierto ? <X /> : <Menu />}
        </button>

        <nav className={`menu ${abierto ? 'menu--abierto' : ''}`}>
          <div className="menu__grupo">
            {enlaces.map((enlace) => (
              <Enlace key={enlace.ruta} {...enlace} alNavegar={cerrarMenu} />
            ))}
          </div>

          <div className="menu__grupo menu__grupo--sesion">
            {usuario ? (
              <>
                <span className="menu__usuario">
                  <strong>{usuario.nombre}</strong>
                  <small>{ROLES[usuario.rol]}</small>
                </span>
                <button className="boton boton--secundario boton--pequeno" onClick={salir}>
                  <LogOut size={16} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <MenuDesplegable
                  etiqueta="Ingresar"
                  icono={LogIn}
                  claseBoton="boton boton--secundario boton--pequeno"
                  alineacion="derecha"
                >
                  {OPCIONES_INGRESO.map(({ ruta, texto, icono: Icono }) => (
                    <Link key={ruta} to={ruta} className="menu__enlace" onClick={cerrarMenu}>
                      <Icono size={18} />
                      <span>{texto}</span>
                    </Link>
                  ))}
                </MenuDesplegable>
                <Link to="/registro" className="boton boton--pequeno" onClick={cerrarMenu}>
                  <UserPlus size={16} />
                  Crear cuenta
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
