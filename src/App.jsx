import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import PiePagina from './components/PiePagina';
import RutaPrivada from './components/RutaPrivada';
import Landing from './pages/Landing/Landing';
import Login from './pages/Usuarios/Login';
import Registro from './pages/Usuarios/Registro';
import Usuarios from './pages/Usuarios/Usuarios';
import Mascotas from './pages/Mascotas/Mascotas';
import Proveedores from './pages/Proveedores/Proveedores';
import Servicios from './pages/Servicios/Servicios';
import Contacto from './pages/Contacto/Contacto';
import ModuloPendiente from './pages/Pendiente/ModuloPendiente';
import NoEncontrada from './pages/NoEncontrada';

const MODULOS_PENDIENTES = [
  { ruta: '/reservas', modulo: 'reservas', nombre: 'reservas' },
  { ruta: '/pagos', modulo: 'pagos', nombre: 'pagos' },
  { ruta: '/reportes', modulo: 'reportes', nombre: 'reportes' },
  { ruta: '/configuracion', modulo: 'configuracion', nombre: 'configuración' },
];

export default function App() {
  return (
    <>
      <Navbar />
      <main className="principal">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/mascotas"
            element={
              <RutaPrivada modulo="mascotas">
                <Mascotas />
              </RutaPrivada>
            }
          />
          <Route
            path="/usuarios"
            element={
              <RutaPrivada modulo="usuarios">
                <Usuarios />
              </RutaPrivada>
            }
          />
          <Route
            path="/proveedores"
            element={
              <RutaPrivada modulo="proveedores">
                <Proveedores />
              </RutaPrivada>
            }
          />
          {MODULOS_PENDIENTES.map(({ ruta, modulo, nombre }) => (
            <Route
              key={ruta}
              path={ruta}
              element={
                <RutaPrivada modulo={modulo}>
                  <ModuloPendiente nombre={nombre} />
                </RutaPrivada>
              }
            />
          ))}
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  );
}
