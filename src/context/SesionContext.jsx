import { createContext, useContext, useState } from 'react';
import { buscarPorCorreo, usuariosApi } from '../api/usuarios';
import { buscarProveedorPorCorreo, proveedoresApi } from '../api/proveedores';

const SesionContext = createContext(null);
const CLAVE_ALMACENAMIENTO = 'homepet.usuario';

const TIPOS_CUENTA = {
  usuario: { buscar: buscarPorCorreo, api: usuariosApi },
  proveedor: { buscar: buscarProveedorPorCorreo, api: proveedoresApi },
};

function leerUsuarioGuardado() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO));
  } catch {
    return null;
  }
}

function sinContrasena(cuenta) {
  const { contrasena, ...datosPublicos } = cuenta;
  return datosPublicos;
}

export function SesionProvider({ children }) {
  const [usuario, setUsuario] = useState(leerUsuarioGuardado);

  function guardarSesion(cuenta, tipo) {
    const publico = { ...sinContrasena(cuenta), tipo, rol: tipo === 'proveedor' ? 'proveedor' : cuenta.rol };
    localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(publico));
    setUsuario(publico);
    return publico;
  }

  async function iniciarSesion(correo, contrasena, tipo) {
    const cuenta = await TIPOS_CUENTA[tipo].buscar(correo);
    if (!cuenta || cuenta.contrasena !== contrasena) {
      throw new Error('Correo o contraseña incorrectos.');
    }
    if (tipo === 'proveedor' && cuenta.estado === 'suspendido') {
      throw new Error('Tu cuenta de proveedor está suspendida.');
    }
    return guardarSesion(cuenta, tipo);
  }

  async function registrar(datos, tipo) {
    const { buscar, api } = TIPOS_CUENTA[tipo];
    const correo = datos.correo.trim().toLowerCase();
    if (await buscar(correo)) {
      throw new Error('Ya existe una cuenta registrada con ese correo.');
    }
    const nueva = await api.crear({ ...datos, correo });
    return guardarSesion(nueva, tipo);
  }

  function cerrarSesion() {
    localStorage.removeItem(CLAVE_ALMACENAMIENTO);
    setUsuario(null);
  }

  return (
    <SesionContext.Provider value={{ usuario, iniciarSesion, registrar, cerrarSesion }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  return useContext(SesionContext);
}
