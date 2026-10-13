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
import Reservas from './pages/Reservas/Reservas';
import Pagos from './pages/Pagos/Pagos';
import Reportes from './pages/Reportes/Reportes';
import Configuracion from './pages/Configuracion/Configuracion';
import NoEncontrada from './pages/NoEncontrada';

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
          <Route
            path="/reservas"
            element={
              <RutaPrivada modulo="reservas">
                <Reservas />
              </RutaPrivada>
            }
          />
          <Route
            path="/pagos"
            element={
              <RutaPrivada modulo="pagos">
                <Pagos />
              </RutaPrivada>
            }
          />
          <Route
            path="/reportes"
            element={
              <RutaPrivada modulo="reportes">
                <Reportes />
              </RutaPrivada>
            }
          />
          <Route
            path="/configuracion"
            element={
              <RutaPrivada modulo="configuracion">
                <Configuracion />
              </RutaPrivada>
            }
          />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  );
}
